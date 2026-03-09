'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2 } from 'lucide-react'
import { ShareModal } from '@/components/ui/ShareModal'
import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useTimeout } from '@/hooks/useTimeout'
import { submitScoreToLeaderboard } from '@/lib/leaderboard'

interface Block {
    id: number
    isHighlighted: boolean
    isError: boolean
    isCorrect: boolean
}

const START_LEVEL = 3
const MAX_START_LEVEL = 20
const BEST_SCORE_KEY = 'memoryBlocksBestScore'

export function PatternRecallGame() {
    const t = useTranslations('games.blockMemoryChallenge.gameUI')
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'guessing' | 'complete' | 'failed'>('idle')
    const [level, setLevel] = useState(START_LEVEL)
    const [startLevel, setStartLevel] = useState(START_LEVEL)
    const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks())
    const [pattern, setPattern] = useState<number[]>([])
    const [userPattern, setUserPattern] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [roundStartTime, setRoundStartTime] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [blockToAnimate, setBlockToAnimate] = useState<number | null>(null)
    const [animateError, setAnimateError] = useState<number | null>(null)

    useTimeout(() => {
        if (blockToAnimate === null) {
            return
        }

        setBlocks((currentBlocks) => currentBlocks.map((block) => ({ ...block, isCorrect: false })))

        if (userPattern.length === pattern.length) {
            const levelScore = calculateLevelScore(level, roundStartTime)
            const newTotalScore = score + levelScore
            const nextLevel = level + 1
            const nextPattern = generatePattern(nextLevel)

            setScore(newTotalScore)
            updateBestScore(newTotalScore)
            setGameState('complete')

            setTimeout(() => {
                setLevel(nextLevel)
                setPattern(nextPattern)
                resetBlocks()
                void showPattern(nextPattern)
            }, 500)
        }

        setBlockToAnimate(null)
    }, blockToAnimate !== null ? 300 : null)

    useTimeout(() => {
        if (animateError === null) {
            return
        }

        setBlocks((currentBlocks) =>
            currentBlocks.map((block) => ({
                ...block,
                isError: false,
                isCorrect: false,
            }))
        )
        setAnimateError(null)
        setShowResults(true)
    }, animateError !== null ? 600 : null)

    useEffect(() => {
        const savedBestScore = localStorage.getItem(BEST_SCORE_KEY)

        if (savedBestScore) {
            setBestScore(parseInt(savedBestScore, 10))
        }
    }, [])

    const updateBestScore = useCallback((newScore: number) => {
        if (newScore > bestScore) {
            setBestScore(newScore)
            localStorage.setItem(BEST_SCORE_KEY, newScore.toString())
        }
    }, [bestScore])

    const resetBlocks = useCallback(() => {
        setBlocks((currentBlocks) =>
            currentBlocks.map((block) => ({
                ...block,
                isHighlighted: false,
                isError: false,
                isCorrect: false,
            }))
        )
        setBlockToAnimate(null)
        setAnimateError(null)
    }, [])

    const showPattern = useCallback(async (nextPattern: number[]) => {
        setGameState('showing')
        setUserPattern([])

        for (const blockId of nextPattern) {
            setBlocks((currentBlocks) =>
                currentBlocks.map((block) => ({
                    ...block,
                    isHighlighted: block.id === blockId,
                    isCorrect: false,
                }))
            )

            await wait(800)

            setBlocks((currentBlocks) =>
                currentBlocks.map((block) => ({
                    ...block,
                    isHighlighted: false,
                }))
            )

            await wait(200)
        }

        resetBlocks()
        setGameState('guessing')
        setRoundStartTime(Date.now())
    }, [resetBlocks])

    const startGame = useCallback(() => {
        const initialLevel = startLevel

        setIsLoading(true)
        setGameState('idle')
        setLevel(initialLevel)
        setPattern([])
        setUserPattern([])
        setScore(0)
        setShowResults(false)
        resetBlocks()

        setTimeout(() => {
            const nextPattern = generatePattern(initialLevel)

            setIsLoading(false)
            setPattern(nextPattern)
            void showPattern(nextPattern)
        }, 1000)
    }, [resetBlocks, showPattern, startLevel])

    const handleFailure = useCallback(() => {
        setGameState('failed')

        if (score > 0) {
            void submitScoreToLeaderboard('block-memory-challenge', score)
        }
    }, [score])

    const handleBlockClick = useCallback((blockId: number) => {
        if (gameState !== 'guessing') {
            return
        }

        if (blockToAnimate !== null || animateError !== null) {
            return
        }

        const nextUserPattern = [...userPattern, blockId]
        const currentIndex = userPattern.length
        const isCorrect = pattern[currentIndex] === blockId

        setUserPattern(nextUserPattern)

        if (isCorrect) {
            setBlocks((currentBlocks) =>
                currentBlocks.map((block) =>
                    block.id === blockId ? { ...block, isCorrect: true } : block
                )
            )
            setBlockToAnimate(blockId)
            return
        }

        setBlocks((currentBlocks) =>
            currentBlocks.map((block) =>
                block.id === blockId
                    ? { ...block, isError: true, isCorrect: false }
                    : block.id === pattern[currentIndex]
                        ? { ...block, isCorrect: true, isError: false }
                        : block
            )
        )
        setAnimateError(blockId)
        handleFailure()
    }, [animateError, blockToAnimate, gameState, handleFailure, pattern, userPattern])

    return (
        <div className="space-y-8 max-w-md mx-auto py-4">
            {gameState !== 'idle' && !showResults && (
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="text-lg font-medium">
                            {t('level')}: {level}
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>{score}</span>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {gameState === 'showing'
                            ? t('watchSequence')
                            : gameState === 'guessing'
                                ? t('repeatSequence')
                                : gameState === 'complete'
                                    ? t('wellDone')
                                    : ''}
                    </div>
                </div>
            )}

            <div className="relative">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                            className={cn(
                                'aspect-square rounded-lg transition-all duration-150',
                                'flex items-center justify-center',
                                gameState === 'guessing' ? 'cursor-pointer bg-foreground/5' : 'cursor-not-allowed bg-foreground/5',
                                block.isHighlighted && 'bg-primary scale-95 cursor-default',
                                block.isCorrect && 'bg-success scale-95 cursor-default',
                                block.isError && 'bg-destructive/30 scale-95 cursor-default',
                                gameState !== 'guessing' && !block.isHighlighted && !block.isCorrect && !block.isError && 'opacity-75',
                            )}
                        />
                    ))}
                </div>

                {gameState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-primary/5 rounded-lg backdrop-blur-xs p-4">
                        {bestScore > 0 && (
                            <div className="text-center mb-2">
                                <div className="text-sm text-muted-foreground">
                                    {t('bestScore')}
                                </div>
                                <div className="text-2xl font-bold">
                                    {bestScore}
                                </div>
                            </div>
                        )}

                        <div className="flex w-4/5 flex-col items-center gap-3">
                            <Label htmlFor="start-level-slider">
                                {t('startLevelLabel', { count: startLevel })}
                            </Label>
                            <Slider
                                id="start-level-slider"
                                min={START_LEVEL}
                                max={MAX_START_LEVEL}
                                step={1}
                                value={[startLevel]}
                                onValueChange={(value) => setStartLevel(value[0] ?? START_LEVEL)}
                                className="w-full"
                                disabled={isLoading}
                            />
                        </div>

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

                {showResults && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg overflow-y-auto">
                        <div className="bg-background p-6 rounded-xl shadow-lg space-y-4 text-center w-11/12 max-w-sm my-4">
                            <h3 className="text-2xl font-bold mb-4">
                                {t('gameOver')}
                            </h3>
                            <div className="space-y-2 text-left w-full">
                                <p className="flex justify-between gap-4">
                                    <span>{t('finalScore')}:</span>
                                    <span className="font-bold">{score}</span>
                                </p>
                                <p className="flex justify-between gap-4">
                                    <span>{t('bestScore')}:</span>
                                    <span className="font-bold">{bestScore}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 justify-center mt-6">
                                <Button onClick={startGame}>{t('playAgain')}</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowShareModal(true)}
                                >
                                    {t('share')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    )
}

function calculateLevelScore(currentLevel: number, roundStartTime: number) {
    const baseScore = currentLevel * 10
    const speedBonus = roundStartTime && Date.now() - roundStartTime <= 3000 ? 10 : 0

    return baseScore + speedBonus
}

function createInitialBlocks(): Block[] {
    return Array.from({ length: 9 }, (_, i) => ({
        id: i,
        isHighlighted: false,
        isError: false,
        isCorrect: false,
    }))
}

function generatePattern(length: number): number[] {
    const pattern: number[] = []

    while (pattern.length < length) {
        pattern.push(generateNextBlockId(pattern.at(-1)))
    }

    return pattern
}

function generateNextBlockId(previousBlockId?: number) {
    let nextBlockId = Math.floor(Math.random() * 9)

    while (nextBlockId === previousBlockId) {
        nextBlockId = Math.floor(Math.random() * 9)
    }

    return nextBlockId
}

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
