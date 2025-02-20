'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2, Facebook, Linkedin, Link as LinkIcon, Clock } from 'lucide-react'
import { XLogo } from '@/components/ui/XLogo'
import { GAME_CONFIG } from '../config'

interface Cell {
  number: number
  isError: boolean
  isCorrect: boolean
}

export function SchulteGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle')
  const [grid, setGrid] = useState<Cell[]>([])
  const [currentNumber, setCurrentNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // 加载最高分和初始化网格
  useEffect(() => {
    const savedBestScore = localStorage.getItem('schulteGridBestScore')
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore))
    }
    initializeGrid() // 页面加载时就初始化网格
  }, [])

  // 游戏进行中的计时器
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    
    if (gameState === 'playing') {
      setCurrentTime(0) // 只在开始游戏时重置计时器
      intervalId = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setCurrentTime(elapsed)
      }, 100)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [gameState, startTime])

  const updateBestScore = useCallback((newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore)
      localStorage.setItem('schulteGridBestScore', newScore.toString())
    }
  }, [bestScore])

  const startGame = useCallback(() => {
    setIsLoading(true)
    setGameState('idle')
    setScore(0)
    setShowResults(false)
    setMistakes(0)
    
    setTimeout(() => {
      setIsLoading(false)
      setStartTime(Date.now())
      setGameState('playing')
      // 不需要重新初始化网格，直接开始游戏
    }, 1000)
  }, [])

  const initializeGrid = () => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    setGrid(shuffled.map(number => ({
      number,
      isError: false,
      isCorrect: false
    })))
    setCurrentNumber(1)
  }

  const calculateScore = useCallback((timeElapsed: number) => {
    const { base, timeMultiplier } = GAME_CONFIG.scoring
    
    let score = base
    
    if (timeElapsed * 1000 < GAME_CONFIG.timing.targetTime) {
      const secondsUnderTarget = (GAME_CONFIG.timing.targetTime / 1000) - timeElapsed
      score += Math.floor(secondsUnderTarget * timeMultiplier)
    }
    
    return score
  }, [])

  const handleSuccess = useCallback(() => {
    const endTime = Date.now()
    const timeElapsed = (endTime - startTime) / 1000
    setGameTime(timeElapsed)
    
    const finalScore = calculateScore(timeElapsed)
    setScore(finalScore)
    updateBestScore(finalScore)
    
    setGameState('complete')
    setShowResults(true)
  }, [calculateScore, startTime, updateBestScore])

  const handleCellClick = useCallback((cell: Cell) => {
    if (gameState !== 'playing') return

    if (cell.number === currentNumber) {
      // 设置正确状态
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isError: false, isCorrect: true }
          : c
      ))
      
      // 快速清除正确状态
      setTimeout(() => {
        setGrid(grid => grid.map(c => 
          c.number === cell.number 
            ? { ...c, isCorrect: false }
            : c
        ))
      }, 200)
      
      const isLastNumber = currentNumber === grid.length
      
      if (isLastNumber) {
        const endTime = Date.now()
        const timeElapsed = (endTime - startTime) / 1000
        setGameTime(timeElapsed)
        
        handleSuccess()
      } else {
        setCurrentNumber(prev => prev + 1)
      }
    } else {
      setMistakes(prev => prev + 1)
      
      // 立即设置错误状态，但不需要保留
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isError: true, isCorrect: false }
          : c
      ))
      
      // 快速清除错误状态
      setTimeout(() => {
        setGrid(grid => grid.map(c => 
          c.number === cell.number 
            ? { ...c, isError: false, isCorrect: false }
            : c
        ))
      }, 200)
    }
  }, [gameState, currentNumber, grid.length, startTime, handleSuccess])

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Game Status */}
      {gameState !== 'idle' && (
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>{score}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toFixed(1)}s</span>
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
          className="grid mx-auto max-w-lg"
          style={{
            gridTemplateColumns: `repeat(${Math.sqrt(grid.length)}, 1fr)`,
            gap: GAME_CONFIG.grid.gap
          }}
        >
          {grid.map((cell, i) => (
            <div
              key={i}
              onClick={() => handleCellClick(cell)}
              className={cn(
                "aspect-square rounded-lg transition-all duration-300 cursor-pointer select-none",
                "flex items-center justify-center text-xl md:text-2xl font-bold",
                "bg-white",
                cell.isError && "bg-red-500/30",
                cell.isCorrect && "bg-green-500/30"
              )}
            >
              {cell.number}
            </div>
          ))}
        </div>

        {/* Start Button Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/90 backdrop-blur-sm">
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
                Game Complete!
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between gap-4">
                  <span>Score:</span>
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
                  <span>Mistakes:</span>
                  <span className="font-bold">{mistakes}</span>
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