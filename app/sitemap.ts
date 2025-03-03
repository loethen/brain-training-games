import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { games } from '../data/games'
import { categories } from '../data/categories'

// 获取环境变量
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  // 基本页面
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // },
    // {
    //   url: `${BASE_URL}/privacy`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.5,
    // },
    // {
    //   url: `${BASE_URL}/terms`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.5,
    // },
  ]

  // 游戏页面 - 从 data/games.ts 获取数据
  const gameRoutes = games.map((game) => ({
    url: `${BASE_URL}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 类别页面 - 从 data/categories.ts 获取数据
  const categoryRoutes = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 博客文章页面（如果有的话）
  let blogRoutes: MetadataRoute.Sitemap = []
  const blogDir = path.join(process.cwd(), 'app/blog/posts')
  
  try {
    if (fs.existsSync(blogDir)) {
      const blogFiles = fs.readdirSync(blogDir)
      blogRoutes = blogFiles
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
        .map(file => {
          const slug = file.replace(/\.(mdx|md)$/, '')
          return {
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }
        })
    }
  } catch (error) {
    console.error('Error reading blog directory:', error)
  }

  // 合并所有路由
  return [...staticRoutes, ...gameRoutes, ...categoryRoutes, ...blogRoutes]
} 