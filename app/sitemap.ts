import { MetadataRoute } from 'next'
import { games } from '../data/games'
import { categories } from '../data/categories'
import { blogData } from '@/data/generated'
import { CONTENT_LAST_UPDATED_DATE, SITE_BASE_URL } from '@/lib/site-constants'

const LOCALES = ['en', 'zh'] // 支持的语言列表
export const revalidate = 86400

// 生成基本页面路由
function generateBaseRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return [
    {
      url: `${SITE_BASE_URL}${localePrefix}`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/games`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/categories`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/blog`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/about`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/tests`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/guides`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/get-started`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/working-memory-guide`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/adhd-assessment`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/partnerships`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/privacy-policy`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_BASE_URL}${localePrefix}/terms-of-service`,
      lastModified: CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'yearly',
      priority: 0.4,
    }
  ]
}

// 生成游戏页面路由
function generateGameRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return games.map(game => ({
    url: `${SITE_BASE_URL}${localePrefix}/games/${game.slug}`,
    lastModified: CONTENT_LAST_UPDATED_DATE,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}

// 生成分类页面路由
function generateCategoryRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return categories.map(category => ({
    url: `${SITE_BASE_URL}${localePrefix}/categories/${category.slug}`,
    lastModified: CONTENT_LAST_UPDATED_DATE,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
}

// 生成博客文章路由
function generateBlogRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const posts = blogData[locale] || blogData.en || []

  return posts.map((post) => ({
      url: `${SITE_BASE_URL}${localePrefix}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : CONTENT_LAST_UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
}

// 静态生成sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    routes.push(
      ...generateBaseRoutes(locale),
      ...generateGameRoutes(locale),
      ...generateCategoryRoutes(locale),
      ...generateBlogRoutes(locale)
    )
  }

  return routes
} 
