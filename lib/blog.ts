// Blog data access layer
// Uses pre-generated JSON data for Cloudflare edge runtime compatibility

import { blogData, BlogPost } from '@/data/generated';

export type { BlogPost } from '@/data/generated';

export interface BlogAuthor {
  name: string;
  picture?: string;
}

export interface PostNavigation {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

// Get all blog posts for a locale
export async function getBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
  // Try requested locale, fall back to English
  const posts = blogData[locale] || blogData['en'] || [];
  return posts;
}

// Get a single blog post by slug
export async function getBlogPost(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
  const posts = await getBlogPosts(locale);
  let post = posts.find(p => p.slug === slug) || null;

  // Fall back to English if not found in requested locale
  if (!post && locale !== 'en') {
    const enPosts = blogData['en'] || [];
    post = enPosts.find(p => p.slug === slug) || null;
  }

  return post;
}

// Get navigation (previous/next) for a blog post
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