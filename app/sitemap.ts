import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { games } from '../data/games'
import { categories } from '../data/categories'

// 获取环境变量
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000'
const LOCALES = ['en', 'zh'] // 支持的语言列表

// 获取博客文章的最后修改时间
function getFileLastModified(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch {
    return new Date()
  }
}

// 生成基本页面路由
function generateBaseRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return [
    {
      url: `${BASE_URL}${localePrefix}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}${localePrefix}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}${localePrefix}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}${localePrefix}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}${localePrefix}/partnerships`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  ]
}

// 生成游戏页面路由
function generateGameRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return games.map(game => ({
    url: `${BASE_URL}${localePrefix}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}

// 生成分类页面路由
function generateCategoryRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return categories.map(category => ({
    url: `${BASE_URL}${localePrefix}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
}

// 生成博客文章路由
function generateBlogRoutes(locale: string): MetadataRoute.Sitemap {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const routes: MetadataRoute.Sitemap = []
  const blogDir = path.join(process.cwd(), locale === 'en' ? 'data/blog' : `data/blog-translations/${locale}`)

  if (!fs.existsSync(blogDir)) {
    return routes
  }

  const blogFiles = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))

  for (const file of blogFiles) {
    const filePath = path.join(blogDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter } = matter(content)
    const slug = file.replace(/\.md$/, '')
    
    routes.push({
      url: `${BASE_URL}${localePrefix}/blog/${slug}`,
      lastModified: frontmatter.date ? new Date(frontmatter.date) : getFileLastModified(filePath),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return routes
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