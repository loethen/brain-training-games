import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getCloudflareContext } from '@opennextjs/cloudflare';

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

// D1 row type
interface D1BlogPost {
  id: number;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  keywords: string | null;
  author_name: string;
  author_picture: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Transform D1 row to BlogPost interface
function transformD1ToBlogPost(row: D1BlogPost): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at || row.created_at,
    excerpt: row.excerpt || '',
    coverImage: row.cover_image_url || undefined,
    keywords: row.keywords || '',
    author: {
      name: row.author_name,
      picture: row.author_picture || undefined,
    },
    content: row.content,
  };
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

// Main functions - try D1 first, fallback to file system
export async function getBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
  try {
    const { env } = await getCloudflareContext();

    if (env?.DB) {
      const result = await env.DB.prepare(
        `SELECT * FROM blog_posts WHERE locale = ? ORDER BY published_at DESC`
      ).bind(locale).all<D1BlogPost>();

      if (result.results && result.results.length > 0) {
        return result.results.map(transformD1ToBlogPost);
      }

      // If no results for this locale, try English
      if (locale !== 'en') {
        const enResult = await env.DB.prepare(
          `SELECT * FROM blog_posts WHERE locale = 'en' ORDER BY published_at DESC`
        ).all<D1BlogPost>();

        if (enResult.results) {
          return enResult.results.map(transformD1ToBlogPost);
        }
      }
    }
  } catch (error) {
    console.log('D1 not available, falling back to file system:', error);
  }

  // Fallback to file system
  return getBlogPostsFromFileSystem(locale);
}

export async function getBlogPost(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
  try {
    const { env } = await getCloudflareContext();

    if (env?.DB) {
      const result = await env.DB.prepare(
        `SELECT * FROM blog_posts WHERE slug = ? AND locale = ?`
      ).bind(slug, locale).first<D1BlogPost>();

      if (result) {
        return transformD1ToBlogPost(result);
      }

      // If no result for this locale, try English
      if (locale !== 'en') {
        const enResult = await env.DB.prepare(
          `SELECT * FROM blog_posts WHERE slug = ? AND locale = 'en'`
        ).bind(slug).first<D1BlogPost>();

        if (enResult) {
          return transformD1ToBlogPost(enResult);
        }
      }
    }
  } catch (error) {
    console.log('D1 not available, falling back to file system:', error);
  }

  // Fallback to file system
  return getBlogPostFromFileSystem(slug, locale);
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