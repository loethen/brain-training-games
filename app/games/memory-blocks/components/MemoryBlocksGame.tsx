'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2 } from 'lucide-react'

interface Block {
  id: number
  isHighlighted: boolean
  isSelected: boolean
  isError: boolean
}

export function MemoryBlocksGame() {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'guessing' | 'complete' | 'failed'>('idle')
  const [level, setLevel] = useState(1)
  const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks())
  const [pattern, setPattern] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 加载最高分
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memoryBlocksBestScore')
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore))
    }
  }, [])

  // 更新最高分
  const updateBestScore = (newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore)
      localStorage.setItem('memoryBlocksBestScore', newScore.toString())
    }
  }

  const startGame = useCallback(() => {
    // 先重置状态
    setIsLoading(true)
    setGameState('idle')
    setLevel(1)
    setScore(0)
    setShowResults(false)
    resetBlocks()
    
    // 延迟一秒后开始游戏
    setTimeout(() => {
      setIsLoading(false)
      setStartTime(Date.now())
      setGameState('showing')
      const newPattern = generatePattern(2)
      setPattern(newPattern)
      void showPattern(newPattern)
    }, 1000)
  }, [])

  const handleBlockClick = useCallback((blockId: number) => {
    if (gameState !== 'guessing') return

    const newUserPattern = [...userPattern, blockId]
    setUserPattern(newUserPattern)
    setBlocks(blocks => blocks.map(block => 
      block.id === blockId ? { ...block, isSelected: true } : block
    ))

    // 检查是否正确
    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      handleError(blockId)
      return
    }

    // 检查是否完成当前级别
    if (newUserPattern.length === pattern.length) {
      const levelScore = calculateLevelScore(level)
      setScore(prevScore => prevScore + levelScore)
      handleSuccess()
    }
  }, [gameState, userPattern, pattern, level])

  function calculateLevelScore(level: number) {
    // 基础分数：每个方块10分
    // 连续完成奖励：(当前关卡 - 1) × 5
    // 速度奖励：如果在3秒内完成，额外加10分
    const blockCount = level + 1 // 每关的方块数
    const baseScore = blockCount * 10 // 基础分数
    const streakBonus = Math.max(0, (level - 1) * 5) // 连续完成奖励
    
    // 计算本次猜测用时
    const guessTime = (Date.now() - startTime) / 1000
    const speedBonus = guessTime <= 3 ? 10 : 0 // 速度奖励
    
    return baseScore + streakBonus + speedBonus
  }

  function handleError(blockId: number) {
    setGameState('failed')
    setBlocks(blocks => blocks.map(block => 
      block.id === blockId ? { ...block, isError: true } : block
    ))
    const endTime = Date.now()
    setGameTime((endTime - startTime) / 1000) // 转换为秒
    updateBestScore(score)
    setShowResults(true)
  }

  async function showPattern(newPattern: number[]) {
    // 按顺序显示每个方块
    for (const blockId of newPattern) {
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
    // 更新开始时间用于下一轮计时
    setStartTime(Date.now())
    
    setTimeout(() => {
      setLevel(level => level + 1)
      const newPattern = generatePattern(Math.min(level + 2, 9))
      setPattern(newPattern)
      resetBlocks()
      void showPattern(newPattern)
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
          <div className="flex gap-4 items-center">
            <div className="text-lg font-medium">Level: {level}</div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>{score}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="text-sm">
              {gameState === 'showing' ? 'Watch the sequence...' : 
               gameState === 'guessing' ? 'Repeat the sequence' :
               gameState === 'complete' ? 'Well done!' : ''}
            </div>
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
                block.isHighlighted && "bg-black scale-95",
                block.isSelected && "bg-green-500 scale-95",
                block.isError && "bg-red-500 scale-95",
                !block.isHighlighted && !block.isSelected && !block.isError && "bg-black/5 hover:bg-black/10"
              )}
            />
          ))}
        </div>

        {/* Start Button Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm">
            {bestScore > 0 && (
              <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">Personal Best</div>
                <div className="text-2xl font-bold">{bestScore}</div>
              </div>
            )}
            <Button 
              size="lg" 
              onClick={startGame}
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <PlayCircle className="w-5 h-5" />
              )}
              {isLoading ? 'Starting...' : 'Start Game'}
            </Button>
          </div>
        )}

        {/* Results Overlay */}
        {showResults && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="bg-background p-6 rounded-xl shadow-lg space-y-4">
              <h3 className="text-2xl font-bold text-center mb-4">Game Over!</h3>
              <div className="space-y-2">
                <p className="flex justify-between gap-4">
                  <span>Final Score:</span>
                  <span className="font-bold">{score}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Best Score:</span>
                  <span className="font-bold">{bestScore}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Time:</span>
                  <span className="font-bold">{gameTime.toFixed(1)}s</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Levels Completed:</span>
                  <span className="font-bold">{level - 1}</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={startGame}>
                  Play Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.share({
                      title: 'Memory Blocks Game',
                      text: `I scored ${score} points in Memory Blocks! Can you beat my score?`,
                      url: window.location.href
                    })
                  }}
                >
                  Share Score
                </Button>
              </div>
            </div>
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