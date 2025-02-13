import { Metadata } from 'next'
import { GameIntro } from './components/GameIntro'
import { GamePreview } from './components/GamePreview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Memory Blocks | Brain Training Games',
  description: 'Enhance your working memory and focus with Memory Blocks, a cognitive training game designed to improve spatial memory and concentration.',
  keywords: 'memory training, brain games, cognitive training, spatial memory, concentration games, memory improvement',
}

export default function MemoryBlocksPage() {
  return (
    <div className="">
      {/* Header Section */}
      <header className="text-center mb-16">
        <div className="flex gap-2 justify-center mb-4">
          <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1 rounded-full">
            Brain Training
          </span>
          <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1 rounded-full">
            Cognitive Skills
          </span>
          <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1 rounded-full">
            Working Memory
          </span>
        </div>
        <h1 className="text-4xl font-bold">Memory Blocks</h1>
      </header>

      {/* Preview and Introduction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <GamePreview />
        <GameIntro />
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link href="/games/memory-blocks/play">
          <Button size="lg" className="gap-2">
            <PlayCircle className="w-5 h-5" />
            Play Game
          </Button>
        </Link>
      </div>
    </div>
  )
} 