'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Cell {
  number: number
  isError: boolean
  isCorrect: boolean
}

export function GamePreview() {
  const t = useTranslations('games.schulteTable.gameUI')
  const [grid, setGrid] = useState<Cell[]>([])
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    // 创建3x3的演示网格
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    const initialGrid = shuffled.map(number => ({
      number,
      isError: false,
      isCorrect: false
    }))
    setGrid(initialGrid)

    let timeoutId: NodeJS.Timeout
    let isAnimating = true

    const animate = async () => {
      while (isAnimating) {
        // 重置状态
        setStatus(t('findNumbersInSequence'))
        await wait(1500)

        // 演示正确顺序
        for (let i = 1; i <= 9; i++) {
          setGrid(grid => grid.map(cell => ({
            ...cell,
            isCorrect: cell.number === i
          })))
          await wait(600)
          setGrid(grid => grid.map(cell => ({
            ...cell,
            isCorrect: false
          })))
        }

        setStatus(t('likeThis'))
        await wait(1500)

        // 重新洗牌
        const newNumbers = numbers.sort(() => Math.random() - 0.5)
        setGrid(newNumbers.map(number => ({
          number,
          isError: false,
          isCorrect: false
        })))
        await wait(2000)
      }
    }

    const wait = (ms: number) => new Promise(resolve => {
      timeoutId = setTimeout(resolve, ms)
    })

    animate()

    return () => {
      isAnimating = false
      clearTimeout(timeoutId)
    }
  }, [t])

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="aspect-square relative rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        {status && (
          <div className="absolute top-4 left-0 right-0 text-center">
            <span className="bg-background/80 text-sm px-3 py-1 rounded-full">
              {status}
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            {grid.map((cell, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 cursor-pointer select-none",
                  "bg-background hover:bg-accent hover:shadow-lg",
                  cell.isError && "bg-destructive/30",
                  cell.isCorrect && "bg-success/30"
                )}
              >
                {cell.number}
              </div>
            ))}
          </div>
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
      </div>
    </div>
  )
} 