import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogAuthor {
  name: string;
  picture?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  keywords?: string;
  author: BlogAuthor;
  content: string;
}

export interface PostNavigation {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

// File system fallback for local development
const BLOG_DIR = path.join(process.cwd(), 'data', 'blog');
const TRANSLATED_BLOG_DIR = path.join(process.cwd(), 'data', 'blog-translations');

function getBlogDirForLocale(locale: string): string {
  if (locale === 'en') {
    return BLOG_DIR;
  }

  const translatedDir = path.join(TRANSLATED_BLOG_DIR, locale);

  if (!fs.existsSync(translatedDir)) {
    return BLOG_DIR;
  }

  return translatedDir;
}

function getBlogPostsFromFileSystem(locale: string): BlogPost[] {
  const blogDir = getBlogDirForLocale(locale);

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const slug = file.replace(/\.md$/, '');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || '',
        coverImage: data.coverImage,
        keywords: data.keywords || '',
        author: {
          name: data.author?.name || 'Anonymous',
          picture: data.author?.picture,
        },
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

function getBlogPostFromFileSystem(slug: string, locale: string): BlogPost | null {
  const blogDir = getBlogDirForLocale(locale);

  if (!fs.existsSync(blogDir)) {
    return null;
  }

  const filePath = path.join(blogDir, `${slug}.md`);

  if (!fs.existsSync(filePath) && locale !== 'en') {
    return getBlogPostFromFileSystem(slug, 'en');
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || '',
    coverImage: data.coverImage,
    keywords: data.keywords || '',
    author: {
      name: data.author?.name || 'Anonymous',
      picture: data.author?.picture,
    },
    content,
  };
}

// Main functions - file system only
export async function getBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
  try {
    return getBlogPostsFromFileSystem(locale);
  } catch (error) {
    console.error('Error reading blog posts from file system:', error);
    return [];
  }
}

export async function getBlogPost(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
  try {
    return getBlogPostFromFileSystem(slug, locale);
  } catch (error) {
    console.error('Error reading blog post from file system:', error);
    return null;
  }
}

export async function getPostNavigation(slug: string, locale: string = 'en'): Promise<PostNavigation> {
  const posts = await getBlogPosts(locale);
  const currentIndex = posts.findIndex(post => post.slug === slug);

  if (currentIndex === -1 || posts.length <= 1) {
    return {
      previousPost: null,
      nextPost: null
    };
  }

  // Sort is by date descending, so next (newer) has smaller index
  const previousPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  return {
    previousPost,
    nextPost
  };
}