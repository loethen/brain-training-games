'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react'
import { XLogo } from '@/components/ui/XLogo'
import { GAME_CONFIG } from '../config'

interface Cell {
  number: number
  isSelected: boolean
  isHighlighted: boolean
  isError: boolean
}

export function SchulteGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle')
  const [level, setLevel] = useState(1)
  const [grid, setGrid] = useState<Cell[]>([])
  const [currentNumber, setCurrentNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isPerfect, setIsPerfect] = useState(true)
  const [mistakes, setMistakes] = useState(0)
  const [currentLevelName, setCurrentLevelName] = useState('')

  // 加载最高分
  useEffect(() => {
    const savedBestScore = localStorage.getItem('schulteGridBestScore')
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore))
    }
  }, [])

  // 更新最高分
  const updateBestScore = (newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore)
      localStorage.setItem('schulteGridBestScore', newScore.toString())
    }
  }

  const startGame = useCallback(() => {
    setIsLoading(true)
    setGameState('idle')
    setLevel(1)
    setScore(0)
    setStreak(0)
    setShowResults(false)
    
    // 延迟一秒后开始游戏
    setTimeout(() => {
      setIsLoading(false)
      setStartTime(Date.now())
      setGameState('playing')
      initializeGrid(GAME_CONFIG.difficulty.levels[0].size)
    }, 1000)
  }, [])

  const initializeGrid = (size: number) => {
    const numbers = Array.from({ length: size * size }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    setGrid(shuffled.map(number => ({
      number,
      isSelected: false,
      isHighlighted: false,
      isError: false
    })))
    setCurrentNumber(1)
  }

  const handleCellClick = useCallback((cell: Cell) => {
    if (gameState !== 'playing') return

    if (cell.number === currentNumber) {
      // 正确选择的处理逻辑
      const isLastNumber = currentNumber === grid.length
      
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isSelected: true, isHighlighted: true }
          : { ...c, isHighlighted: false }
      ))
      
      if (isLastNumber) {
        const endTime = Date.now()
        const timeElapsed = (endTime - startTime) / 1000
        setGameTime(timeElapsed)
        
        let levelScore = calculateScore(timeElapsed)
        
        // 完美通关奖励
        if (isPerfect) {
          levelScore += GAME_CONFIG.scoring.perfectBonus
        }
        
        setScore(prev => prev + levelScore)
        handleSuccess()
      } else {
        setCurrentNumber(prev => prev + 1)
      }
    } else {
      // 错误选择的处理逻辑
      setIsPerfect(false)
      setMistakes(prev => prev + 1)
      
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isError: true }
          : c
      ))
      
      // 错误提示动画
      setTimeout(() => {
        setGrid(grid => grid.map(c => 
          c.number === cell.number 
            ? { ...c, isError: false }
            : c
        ))
      }, 500)
    }
  }, [gameState, currentNumber, grid.length, startTime, isPerfect])

  function calculateScore(timeElapsed: number) {
    const { base, timeMultiplier, streakBonus } = GAME_CONFIG.scoring
    const currentLevel = GAME_CONFIG.difficulty.levels[level - 1]
    
    // 基础分数
    let score = base
    
    // 时间奖励
    if (timeElapsed * 1000 < currentLevel.targetTime) {
      const secondsUnderTarget = (currentLevel.targetTime / 1000) - timeElapsed
      score += Math.floor(secondsUnderTarget * timeMultiplier)
    }
    
    // 连击奖励
    score += streak * streakBonus
    
    return score
  }

  function handleError() {
    setGameState('complete')
    const endTime = Date.now()
    setGameTime((endTime - startTime) / 1000)
    updateBestScore(score)
    setShowResults(true)
    setStreak(0)
  }

  function handleSuccess() {
    setGameState('complete')
    setShowResults(true)
    
    // 检查是否还有下一关
    if (level < GAME_CONFIG.difficulty.levels.length) {
      setTimeout(() => {
        setLevel(prev => prev + 1)
        setStartTime(Date.now())
        setGameState('playing')
        initializeGrid(GAME_CONFIG.difficulty.levels[level].size)
        setShowResults(false)
      }, 2000)
    }
  }

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  const startNewLevel = () => {
    setIsPerfect(true)
    setMistakes(0)
    setCurrentLevelName(GAME_CONFIG.difficulty.levels[level - 1].name)
    // ... 其他初始化逻辑
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
              Find number: {currentNumber}
            </div>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="relative">
        <div 
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${Math.sqrt(grid.length)}, 1fr)`,
            gap: GAME_CONFIG.grid.gap,
            maxWidth: GAME_CONFIG.grid.cellSize * Math.sqrt(grid.length) + 
                     GAME_CONFIG.grid.gap * (Math.sqrt(grid.length) - 1)
          }}
        >
          {grid.map((cell, i) => (
            <div
              key={i}
              onClick={() => handleCellClick(cell)}
              className={cn(
                "aspect-square rounded-lg transition-all duration-300",
                "flex items-center justify-center text-2xl font-bold",
                GAME_CONFIG.grid.colors.cell.bg,
                GAME_CONFIG.grid.colors.cell.hover,
                cell.isSelected && GAME_CONFIG.grid.colors.cell.correct,
                cell.isError && GAME_CONFIG.grid.colors.cell.wrong,
                cell.isHighlighted && GAME_CONFIG.grid.colors.cell.active
              )}
              style={{
                width: GAME_CONFIG.grid.cellSize
              }}
            >
              {cell.number}
            </div>
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
              <h3 className="text-2xl font-bold text-center mb-4">
                {isPerfect && "🌟 Perfect Clear!"}
                {!isPerfect && level < GAME_CONFIG.difficulty.levels.length 
                  ? 'Level Complete!'
                  : 'Game Complete!'}
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between gap-4">
                  <span>Level:</span>
                  <span className="font-bold">{currentLevelName}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Score:</span>
                  <span className="font-bold">{score}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Time:</span>
                  <span className="font-bold">{gameTime.toFixed(1)}s</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Mistakes:</span>
                  <span className="font-bold">{mistakes}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Streak:</span>
                  <span className="font-bold">{streak}x</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={startGame}>
                  Play Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleShareClick}
                >
                  Share Score
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Share your score</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  name: 'X',
                  icon: <XLogo className="w-4 h-4" />,
                  onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${score} points in Schulte Grid! Can you beat my score? 🧠\n\nPlay now: ${window.location.href}`)}`, '_blank')
                },
                {
                  name: 'Facebook',
                  icon: <Facebook className="w-4 h-4" />,
                  onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                },
                {
                  name: 'LinkedIn',
                  icon: <Linkedin className="w-4 h-4" />,
                  onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
                },
                {
                  name: 'Copy Link',
                  icon: <LinkIcon className="w-4 h-4" />,
                  onClick: () => {
                    navigator.clipboard.writeText(`I scored ${score} points in Schulte Grid! Can you beat my score? 🧠\n\nPlay now: ${window.location.href}`)
                    alert('Copied to clipboard!')
                  }
                }
              ].map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className="gap-2"
                  onClick={option.onClick}
                >
                  {option.icon}
                  {option.name}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 