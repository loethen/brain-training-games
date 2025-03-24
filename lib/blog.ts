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

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog');
const TRANSLATED_BLOG_DIR = path.join(process.cwd(), 'data', 'blog-translations');

// 获取特定语言的博客目录
function getBlogDirForLocale(locale: string): string {
  if (locale === 'en') {
    return BLOG_DIR;
  }
  
  const translatedDir = path.join(TRANSLATED_BLOG_DIR, locale);
  
  // 如果翻译目录不存在，回退到英文目录
  if (!fs.existsSync(translatedDir)) {
    return BLOG_DIR;
  }
  
  return translatedDir;
}

export async function getBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
  const blogDir = getBlogDirForLocale(locale);
  
  // 确保博客目录存在
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

export async function getBlogPost(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
  const blogDir = getBlogDirForLocale(locale);
  
  // 确保博客目录存在
  if (!fs.existsSync(blogDir)) {
    return null;
  }
  
  const filePath = path.join(blogDir, `${slug}.md`);
  
  // 如果翻译的文件不存在，尝试使用英文文件
  if (!fs.existsSync(filePath) && locale !== 'en') {
    return getBlogPost(slug, 'en');
  }
  
  // 如果文件仍然不存在，返回 null
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

export async function getPostNavigation(slug: string, locale: string = 'en'): Promise<PostNavigation> {
  const posts = await getBlogPosts(locale);
  const currentIndex = posts.findIndex(post => post.slug === slug);
  
  // 如果找不到当前文章，或者只有一篇文章
  if (currentIndex === -1 || posts.length <= 1) {
    return {
      previousPost: null,
      nextPost: null
    };
  }
  
  // 注意排序是按日期降序的，所以下一篇（较新的）在数组中的索引更小
  const previousPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  
  return {
    previousPost,
    nextPost
  };
} 