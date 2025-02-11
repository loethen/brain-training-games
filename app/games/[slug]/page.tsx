import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: Promise<string> | string
  }
}

// 游戏数据获取函数
async function getGameData(slug: string) {
  // 模拟从数据库获取游戏数据
  const games = {
    'memory-blocks': {
      title: 'Memory Blocks',
      description: 'Test your spatial memory',
      difficulty: 'Easy',
      duration: '5 min'
    },
    'pattern-match': {
      title: 'Pattern Match',
      description: 'Train your attention to detail',
      difficulty: 'Medium',
      duration: '10 min'
    },
    'speed-focus': {
      title: 'Speed Focus',
      description: 'Enhance your reaction time',
      difficulty: 'Hard',
      duration: '15 min'
    }
  }
  return games[slug as keyof typeof games]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await params.slug
  const game = await getGameData(slug)
  
  if (!game) {
    return {
      title: 'Game Not Found'
    }
  }

  return {
    title: `${game.title} | Focus Games`,
    description: game.description
  }
}

export default async function GamePage({ params }: Props) {
  const slug = await params.slug
  const game = await getGameData(slug)

  if (!game) {
    notFound()
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6">{game.title}</h1>
      <p className="text-muted-foreground mb-8">{game.description}</p>
      <div className="flex gap-4 text-sm">
        <div className="bg-secondary px-3 py-1 rounded-full">
          {game.difficulty}
        </div>
        <div className="bg-secondary px-3 py-1 rounded-full">
          {game.duration}
        </div>
      </div>
      {/* 游戏内容将在这里 */}
    </div>
  )
} 