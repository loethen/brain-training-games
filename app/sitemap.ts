import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

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
  // 基本路由
  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    }
  ]

  // 添加所有游戏路由
  const gameDirectories = getGameDirectories()
  
  const gameRoutes = gameDirectories.map(gameDir => ({
    url: `${BASE_URL}/games/${gameDir}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...gameRoutes]
} 