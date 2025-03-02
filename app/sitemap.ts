import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { games } from '../data/games'
import { categories } from '../data/categories'

// 获取环境变量
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000'

// 获取游戏目录列表
function getGameDirectories(): string[] {
  const gamesDir = path.join(process.cwd(), 'app/games')
  
  try {
    // 读取游戏目录
    return fs.readdirSync(gamesDir)
      .filter(item => {
        // 只包含目录，排除文件
        const itemPath = path.join(gamesDir, item)
        return fs.statSync(itemPath).isDirectory() && 
               // 排除以下划线开头的目录（Next.js 特殊目录）
               !item.startsWith('_')
      })
  } catch (error) {
    console.error('Error reading games directory:', error)
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourdomain.com'
  
  // Game URLs
  const gameUrls = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Category URLs
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // Static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Add other static pages here
  ]
  
  return [...staticUrls, ...gameUrls, ...categoryUrls]
} 