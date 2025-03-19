'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2, Clock, StopCircle, RefreshCw } from 'lucide-react'
import { ShareModal } from '@/components/ui/ShareModal'
import { GAME_CONFIG } from '../config'
import { useTranslations } from 'next-intl'
import { useTimeout } from '@/hooks/useTimeout'
import { useInterval } from '@/hooks/useInterval'

interface Cell {
  number: number
  isError: boolean
  isCorrect: boolean
}

export function SchulteGame() {
  const t = useTranslations('games.schulteTable.gameUI')
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete' | 'stopped'>('idle')
  const [grid, setGrid] = useState<Cell[]>([])
  const [currentNumber, setCurrentNumber] = useState(1)
  const [bestTime, setBestTime] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // 状态控制标志
  const [startInitiated, setStartInitiated] = useState(false)
  const [cellToAnimate, setCellToAnimate] = useState<number | null>(null)
  const [animateError, setAnimateError] = useState<number | null>(null)
  
  // 游戏区域的引用，用于滚动
  const gameGridRef = useRef<HTMLDivElement>(null)

  // 加载最高分和初始化网格
  useEffect(() => {
    const savedBestTime = localStorage.getItem('schulteGridBestTime')
    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime))
    }
    initializeGrid() // 页面加载时就初始化网格
  }, [])

  // 游戏进行中的计时器（使用useInterval替代setInterval）
  useInterval(() => {
    if (gameState === 'playing') {
      const elapsed = (Date.now() - startTime) / 1000
      setCurrentTime(elapsed)
    }
  }, gameState === 'playing' ? 100 : null)
  
  // 游戏开始倒计时 
  useTimeout(() => {
    if (startInitiated) {
      setIsLoading(false)
      setStartTime(Date.now())
      setGameState('playing')
      initializeGrid()
      setStartInitiated(false)
    }
  }, startInitiated ? 1000 : null)
  
  // 单元格正确点击动画
  useTimeout(() => {
    if (cellToAnimate !== null) {
      setGrid(grid => grid.map(c => ({ ...c, isCorrect: false })))
      
      if (currentNumber >= 25) {
        handleSuccess()
      } else {
        setCurrentNumber(prev => prev + 1)
      }
      
      setCellToAnimate(null)
    }
  }, cellToAnimate !== null ? 150 : null)
  
  // 单元格错误点击动画
  useTimeout(() => {
    if (animateError !== null) {
      setGrid(grid => grid.map(c => ({ ...c, isError: false })))
      setAnimateError(null)
    }
  }, animateError !== null ? 300 : null)

  const updateBestTime = useCallback((newTime: number) => {
    if (newTime < bestTime || bestTime === 0) {
      setBestTime(newTime)
      localStorage.setItem('schulteGridBestTime', newTime.toString())
    }
  }, [bestTime])

  // 简化后的开始游戏函数，只在这里处理滚动
  const startGame = useCallback(() => {
    // 直接滚动到游戏区域，但为了确保DOM已更新，使用setTimeout
    if (gameGridRef.current) {
      setTimeout(() => {
        gameGridRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 50);  // 短延迟确保DOM更新但不影响用户体验
    }
    
    setIsLoading(true)
    setGameState('idle')
    setShowResults(false)
    setMistakes(0)
    setCurrentTime(0)
    setStartInitiated(true)
  }, [])
  
  // 恢复游戏功能，与开始游戏不同，不需要滚动
  const resumeGame = useCallback(() => {
    // 调整开始时间以保持游戏时间的连续性
    const now = Date.now()
    const adjustedStartTime = now - gameTime * 1000
    setStartTime(adjustedStartTime)
    setGameState('playing')
  }, [gameTime])

  const stopGame = useCallback(() => {
    setGameState('stopped')
    
    // 记录停止时的游戏时间
    const endTime = Date.now()
    const timeElapsed = (endTime - startTime) / 1000
    setGameTime(timeElapsed)
  }, [startTime])

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

  const handleSuccess = useCallback(() => {
    const endTime = Date.now()
    const timeElapsed = (endTime - startTime) / 1000
    setGameTime(timeElapsed)
    
    updateBestTime(timeElapsed)
    
    setGameState('complete')
    setShowResults(true)
  }, [startTime, updateBestTime])

  const handleCellClick = useCallback((cell: Cell) => {
    if (gameState !== 'playing') return

    if (cell.number === currentNumber) {
      // 正确点击
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isCorrect: true }
          : c
      ))

      // 设置要动画的单元格
      setCellToAnimate(cell.number)
    } else {
      // 错误点击
      setMistakes(prev => prev + 1)
      setGrid(grid => grid.map(c => 
        c.number === cell.number 
          ? { ...c, isError: true }
          : c
      ))

      // 设置错误动画
      setAnimateError(cell.number)
    }
  }, [gameState, currentNumber])

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      {/* Game Status */}
      {gameState !== 'idle' && (
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span>{t('best')}: {bestTime.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toFixed(1)}s</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="text-sm">
              {t('findNumber')}: {currentNumber}
            </div>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="relative" ref={gameGridRef}>
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
                "bg-muted",
                cell.isError && "bg-destructive/30",
                cell.isCorrect && "bg-success/30"
              )}
            >
              {cell.number}
            </div>
          ))}
        </div>

        {/* Start Button Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/90 backdrop-blur-sm">
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
              {isLoading ? t('starting') : t('startGame')}
            </Button>
          </div>
        )}

        {/* Results Overlay */}
        {showResults && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="bg-background p-6 rounded-xl shadow-lg space-y-4">
              <h3 className="text-2xl font-bold text-center mb-4">
                {t('gameComplete')}
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between gap-4">
                  <span>{t('time')}:</span>
                  <span className="font-bold">{gameTime.toFixed(1)}s</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>{t('bestTime')}:</span>
                  <span className="font-bold">{bestTime.toFixed(1)}s</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>{t('mistakes')}:</span>
                  <span className="font-bold">{mistakes}</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={startGame}>
                  {t('playAgain')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleShareClick}
                >
                  {t('share')}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* 停止游戏覆盖层 */}
        {gameState === 'stopped' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/90 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">{t('gameStopped')}</h3>
              <p className="text-sm text-muted-foreground">{t('timeElapsed')}: {gameTime.toFixed(1)}s</p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <Button 
                  onClick={resumeGame}
                  className="gap-2"
                  variant="default"
                >
                  <PlayCircle className="w-5 h-5" />
                  {t('resumeGame')}
                </Button>
                
                <Button 
                  onClick={startGame}
                  className="gap-2"
                  variant="outline"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t('restart')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Control Buttons - 只在游戏进行中显示 */}
      {gameState === 'playing' && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={startGame}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('restart')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={stopGame}
            className="gap-2"
          >
            <StopCircle className="w-4 h-4" />
            {t('stop')}
          </Button>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
} 