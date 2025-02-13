'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle } from 'lucide-react'

interface Block {
  id: number
  isHighlighted: boolean
  isSelected: boolean
  isError: boolean
}

export function MemoryBlocksGame() {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'guessing' | 'complete'>('idle')
  const [level, setLevel] = useState(1)
  const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks())
  const [pattern, setPattern] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])

  const startGame = useCallback(() => {
    setGameState('showing')
    setLevel(1)
    const newPattern = generatePattern(2)
    setPattern(newPattern)
    void showPattern(newPattern)
  }, [])

  const handleBlockClick = useCallback((blockId: number) => {
    if (gameState !== 'guessing') return

    const newUserPattern = [...userPattern, blockId]
    setUserPattern(newUserPattern)
    setBlocks(blocks => blocks.map(block => 
      block.id === blockId ? { ...block, isSelected: true } : block
    ))

    // Check if pattern is correct so far
    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      handleError(blockId)
      return
    }

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      handleSuccess()
    }
  }, [gameState, userPattern, pattern])

  function handleError(blockId: number) {
    setGameState('complete')
    setBlocks(blocks => blocks.map(block => 
      block.id === blockId ? { ...block, isError: true } : block
    ))
    setTimeout(() => {
      setGameState('idle')
      resetBlocks()
    }, 1500)
  }

  async function showPattern(newPattern: number[]) {
    // 按顺序显示每个方块
    for (let blockId of newPattern) {
      // 高亮当前方块
      setBlocks(blocks => blocks.map(block => ({
        ...block,
        isHighlighted: block.id === blockId
      })))
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 取消高亮
      setBlocks(blocks => blocks.map(block => ({
        ...block,
        isHighlighted: false
      })))
      
      // 方块之间的间隔
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // 所有方块显示完毕，开始猜测阶段
    resetBlocks()
    setGameState('guessing')
    setUserPattern([])
  }

  function handleSuccess() {
    setGameState('complete')
    setTimeout(() => {
      setLevel(level => level + 1)
      const newPattern = generatePattern(Math.min(level + 2, 9)) // 每次增加一个方块
      setPattern(newPattern)
      resetBlocks()
      void showPattern(newPattern) // 使用 void 操作符处理 Promise
    }, 1000)
  }

  function resetBlocks() {
    setBlocks(blocks => blocks.map(block => ({
      ...block,
      isHighlighted: false,
      isSelected: false,
      isError: false
    })))
  }

  return (
    <div className="space-y-8">
      {/* Game Status */}
      {gameState !== 'idle' && (
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Level: {level}</div>
          <div className="text-sm text-muted-foreground">
            {gameState === 'showing' ? 'Watch the sequence...' : 
             gameState === 'guessing' ? 'Repeat the sequence' : ''}
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {blocks.map(block => (
            <div
              key={block.id}
              onClick={() => handleBlockClick(block.id)}
              className={cn(
                "aspect-square rounded-lg transition-all duration-300",
                "disabled:cursor-not-allowed",
                block.isHighlighted && "bg-black/10 scale-95",
                block.isSelected && "bg-green-500 scale-95",
                block.isError && "bg-red-500 scale-95",
                !block.isHighlighted && !block.isSelected && !block.isError && "bg-secondary/50 hover:bg-secondary/70"
              )}
            />
          ))}
        </div>

        {/* Start Button Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Button 
              size="lg" 
              onClick={startGame}
              className="gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Start Game
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function createInitialBlocks(): Block[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i,
    isHighlighted: false,
    isSelected: false,
    isError: false
  }))
}

function generatePattern(length: number): number[] {
  const pattern: number[] = []
  while (pattern.length < length) {
    const num = Math.floor(Math.random() * 9)
    if (!pattern.includes(num)) {
      pattern.push(num)
    }
  }
  return pattern
} 