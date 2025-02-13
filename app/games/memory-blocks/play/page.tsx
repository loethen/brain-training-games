import { Metadata } from 'next'
import { MemoryBlocksGame } from '../components/MemoryBlocksGame'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Play Memory Blocks | Brain Training Games',
  description: 'Play Memory Blocks - An interactive memory game to test and improve your spatial memory and concentration. Start training your brain now!',
  keywords: 'play memory blocks, memory game online, brain training game, cognitive exercise, memory test'
}

export default function PlayPage() {
  return (
    <div className="container max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/games/memory-blocks" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Memory Blocks</h1>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative">
        <div className="bg-secondary/10 rounded-xl p-8">
          <MemoryBlocksGame />
        </div>
      </div>
    </div>
  )
} 