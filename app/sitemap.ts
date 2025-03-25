import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { games } from '../data/games'
import { categories } from '../data/categories'

// 获取环境变量
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000'
const LOCALES = ['en', 'zh', 'de', 'ja', 'es', 'ko', 'fr'] // 支持的语言列表

// 获取博客文章的最后修改时间
function getFileLastModified(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch (error) {
    return new Date()
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []
  
  // 为每种语言生成路由
  LOCALES.forEach(locale => {
    const localePrefix = locale === 'en' ? '' : `/${locale}`
    
    // 基本页面
    routes.push(
      {
        url: `${BASE_URL}${localePrefix}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}${localePrefix}/games`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}${localePrefix}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}${localePrefix}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }
    )

    // 游戏页面 - 从 data/games.ts 获取数据
    games.forEach(game => {
      routes.push({
        url: `${BASE_URL}${localePrefix}/games/${game.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    })

    // 类别页面 - 从 data/categories.ts 获取数据
    categories.forEach(category => {
      routes.push({
        url: `${BASE_URL}${localePrefix}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    })

    // 博客文章页面
    const blogDir = path.join(process.cwd(), locale === 'en' ? 'data/blog' : `data/blog-translations/${locale}`)
    
    try {
      if (fs.existsSync(blogDir)) {
        const blogFiles = fs.readdirSync(blogDir)
        blogFiles
          .filter(file => file.endsWith('.md'))
          .forEach(file => {
            const filePath = path.join(blogDir, file)
            const content = fs.readFileSync(filePath, 'utf8')
            const { data: frontmatter } = matter(content)
            const slug = file.replace(/\.md$/, '')
            
            routes.push({
              url: `${BASE_URL}${localePrefix}/blog/${slug}`,
              lastModified: frontmatter.date ? new Date(frontmatter.date) : getFileLastModified(filePath),
              changeFrequency: 'monthly' as const,
              priority: 0.6,
            })
          })
      }
    } catch (error) {
      console.error(`Error reading blog directory for ${locale}:`, error)
    }
  })

  return routes
} 