'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlayCircle, Trophy, Loader2 } from 'lucide-react'
import { ShareModal } from '@/components/ui/ShareModal'
import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Slider } from "@/components/ui/slider"
import { useTimeout } from '@/hooks/useTimeout'
import { submitScoreToLeaderboard } from '@/lib/leaderboard'
import { RANKED_LEADERBOARD_MODE } from '@/lib/leaderboard-config'

interface Block {
    id: number
    isHighlighted: boolean
    isError: boolean
    isCorrect: boolean
}

type PlayMode = 'ranked' | 'practice'

const RANKED_START_LEVEL = 3
const MIN_START_LEVEL = 3
const MAX_START_LEVEL = 20
const RANKED_BEST_KEY = "memoryBlocksBestRankedLevel"
const PRACTICE_BEST_KEY = "memoryBlocksBestPracticeScore"

export function PatternRecallGame() {
    const t = useTranslations("games.blockMemoryChallenge.gameUI")
    const [gameState, setGameState] = useState<"idle" | "showing" | "guessing" | "complete" | "failed">("idle")
    const [playMode, setPlayMode] = useState<PlayMode>("ranked")
    const [level, setLevel] = useState(RANKED_START_LEVEL)
    const [startLevel, setStartLevel] = useState(MIN_START_LEVEL)
    const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks())
    const [pattern, setPattern] = useState<number[]>([])
    const [userPattern, setUserPattern] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [bestRankedLevel, setBestRankedLevel] = useState(0)
    const [bestPracticeScore, setBestPracticeScore] = useState(0)
    const [lastCompletedLevel, setLastCompletedLevel] = useState(0)
    const [roundStartTime, setRoundStartTime] = useState(0)
    const [sessionStartTime, setSessionStartTime] = useState(0)
    const [gameTime, setGameTime] = useState(0)
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
            const levelScore = calculateLevelScore(
                level,
                roundStartTime,
                playMode === "ranked" ? RANKED_START_LEVEL : startLevel
            )
            const newTotalScore = score + levelScore

            setScore(newTotalScore)
            setLastCompletedLevel(level)

            if (playMode === "ranked") {
                updateBestRankedLevel(level)
            } else {
                updateBestPracticeScore(newTotalScore)
            }

            setGameState("complete")

            setTimeout(() => {
                const nextLevel = level + 1
                const newPattern = generatePattern(nextLevel)

                setLevel(nextLevel)
                setPattern(newPattern)
                resetBlocks()
                void showPattern(newPattern)
            }, 500)
        }

        setBlockToAnimate(null)
    }, blockToAnimate !== null ? 300 : null)

    useTimeout(() => {
        if (animateError === null) {
            return
        }

        setBlocks((currentBlocks) => currentBlocks.map((block) => ({ ...block, isError: false })))
        setAnimateError(null)
    }, animateError !== null ? 300 : null)

    useEffect(() => {
        const savedBestRankedLevel = localStorage.getItem(RANKED_BEST_KEY)
        const savedBestPracticeScore = localStorage.getItem(PRACTICE_BEST_KEY)

        if (savedBestRankedLevel) {
            setBestRankedLevel(parseInt(savedBestRankedLevel, 10))
        }

        if (savedBestPracticeScore) {
            setBestPracticeScore(parseInt(savedBestPracticeScore, 10))
        }
    }, [])

    const updateBestRankedLevel = useCallback((newLevel: number) => {
        if (newLevel > bestRankedLevel) {
            setBestRankedLevel(newLevel)
            localStorage.setItem(RANKED_BEST_KEY, newLevel.toString())
        }
    }, [bestRankedLevel])

    const updateBestPracticeScore = useCallback((newScore: number) => {
        if (newScore > bestPracticeScore) {
            setBestPracticeScore(newScore)
            localStorage.setItem(PRACTICE_BEST_KEY, newScore.toString())
        }
    }, [bestPracticeScore])

    const showPattern = useCallback(async (newPattern: number[]) => {
        setGameState("showing")

        for (const blockId of newPattern) {
            setBlocks((currentBlocks) =>
                currentBlocks.map((block) => ({
                    ...block,
                    isHighlighted: block.id === blockId,
                    isCorrect: false,
                }))
            )

            await new Promise((resolve) => setTimeout(resolve, 800))

            setBlocks((currentBlocks) =>
                currentBlocks.map((block) => ({
                    ...block,
                    isHighlighted: false,
                }))
            )

            await new Promise((resolve) => setTimeout(resolve, 200))
        }

        resetBlocks()
        setGameState("guessing")
        setUserPattern([])
        setRoundStartTime(Date.now())
    }, [])

    const startGame = useCallback(() => {
        const resolvedStartLevel = playMode === "ranked" ? RANKED_START_LEVEL : startLevel

        setIsLoading(true)
        setGameState("idle")
        setLevel(resolvedStartLevel)
        setPattern([])
        setUserPattern([])
        setScore(0)
        setLastCompletedLevel(0)
        setGameTime(0)
        setShowResults(false)
        resetBlocks()

        setTimeout(() => {
            const now = Date.now()
            const newPattern = generatePattern(resolvedStartLevel)

            setSessionStartTime(now)
            setIsLoading(false)
            setPattern(newPattern)
            void showPattern(newPattern)
        }, 1000)
    }, [playMode, showPattern, startLevel])

    const handleFailure = useCallback(() => {
        const endTime = Date.now()
        const totalElapsed = sessionStartTime ? (endTime - sessionStartTime) / 1000 : 0

        setGameState("failed")
        setGameTime(totalElapsed)
        setShowResults(true)

        if (playMode === "ranked" && lastCompletedLevel > 0) {
            void submitScoreToLeaderboard("block-memory-challenge", lastCompletedLevel, {
                mode: RANKED_LEADERBOARD_MODE,
            })
        }
    }, [lastCompletedLevel, playMode, score, sessionStartTime])

    const handleBlockClick = useCallback((blockId: number) => {
        if (gameState !== "guessing") {
            return
        }

        const alreadySelected = userPattern.includes(blockId)
        if (alreadySelected) {
            return
        }

        const newUserPattern = [...userPattern, blockId]
        const currentIndex = userPattern.length
        const isCorrect = pattern[currentIndex] === blockId

        setUserPattern(newUserPattern)

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
                block.id === blockId ? { ...block, isError: true } : block
            )
        )
        setAnimateError(blockId)
        handleFailure()
    }, [gameState, handleFailure, pattern, userPattern])

    function resetBlocks() {
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
    }

    const currentPersonalBest = playMode === "ranked" ? bestRankedLevel : bestPracticeScore

    return (
        <div className="space-y-8 max-w-md mx-auto py-4">
            {gameState !== "idle" && !showResults && (
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="text-lg font-medium">
                            {t("level")}: {level}
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>{score}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="text-sm">
                            {gameState === "showing"
                                ? t("watchSequence")
                                : gameState === "guessing"
                                    ? t("repeatSequence")
                                    : gameState === "complete"
                                        ? t("wellDone")
                                        : ""}
                        </div>
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
                                "aspect-square rounded-lg transition-all duration-150",
                                "flex items-center justify-center",
                                gameState === "guessing" ? "cursor-pointer bg-foreground/5" : "cursor-not-allowed bg-foreground/5",
                                block.isHighlighted && "bg-primary scale-95 cursor-default",
                                block.isCorrect && "bg-success scale-95 cursor-default",
                                block.isError && "bg-destructive/30 scale-95 cursor-default",
                                gameState !== "guessing" && !block.isHighlighted && !block.isCorrect && !block.isError && "opacity-75",
                            )}
                        />
                    ))}
                </div>

                {gameState === "idle" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-primary/5 rounded-lg backdrop-blur-xs p-4">
                        <div className="grid w-full gap-2 sm:grid-cols-2">
                            <Button
                                type="button"
                                variant={playMode === "ranked" ? "default" : "outline"}
                                onClick={() => setPlayMode("ranked")}
                                disabled={isLoading}
                            >
                                {t("rankedMode")}
                            </Button>
                            <Button
                                type="button"
                                variant={playMode === "practice" ? "default" : "outline"}
                                onClick={() => setPlayMode("practice")}
                                disabled={isLoading}
                            >
                                {t("practiceMode")}
                            </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            {playMode === "ranked" ? t("rankedDescription") : t("practiceDescription")}
                        </p>

                        {currentPersonalBest > 0 && (
                            <div className="text-center mb-2">
                                <div className="text-sm text-muted-foreground">
                                    {playMode === "ranked" ? t("bestRankedLevel") : t("bestPracticeScore")}
                                </div>
                                <div className="text-2xl font-bold">
                                    {currentPersonalBest}
                                </div>
                            </div>
                        )}

                        {playMode === "practice" && (
                            <div className="flex flex-col items-center gap-3 mb-2 w-4/5">
                                <Label htmlFor="start-level-slider" className="mb-1">
                                    {t("startLevelLabel", { count: startLevel })}
                                </Label>
                                <Slider
                                    id="start-level-slider"
                                    min={MIN_START_LEVEL}
                                    max={MAX_START_LEVEL}
                                    step={1}
                                    value={[startLevel]}
                                    onValueChange={(value) => setStartLevel(value[0])}
                                    className="w-full"
                                />
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
                            {isLoading ? t("starting") : t("startGame")}
                        </Button>
                    </div>
                )}

                {showResults && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg overflow-y-auto">
                        <div className="bg-background p-6 rounded-xl shadow-lg space-y-4 text-center w-11/12 max-w-sm my-4">
                            <h3 className="text-2xl font-bold mb-4">
                                {t("gameOver")}
                            </h3>
                            <div className="space-y-2 text-left w-full">
                                {playMode === "ranked" ? (
                                    <>
                                        <p className="flex justify-between gap-4">
                                            <span>{t("rankedResult")}:</span>
                                            <span className="font-bold">
                                                {lastCompletedLevel > 0 ? `${t("level")} ${lastCompletedLevel}` : t("noLevelCompleted")}
                                            </span>
                                        </p>
                                        <p className="flex justify-between gap-4">
                                            <span>{t("bestRankedLevel")}:</span>
                                            <span className="font-bold">{bestRankedLevel || 0}</span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex justify-between gap-4">
                                            <span>{t("finalScore")}:</span>
                                            <span className="font-bold">{score}</span>
                                        </p>
                                        <p className="flex justify-between gap-4">
                                            <span>{t("bestPracticeScore")}:</span>
                                            <span className="font-bold">{bestPracticeScore}</span>
                                        </p>
                                    </>
                                )}
                                <p className="flex justify-between gap-4">
                                    <span>{t("highestLevelReached")}:</span>
                                    <span className="font-bold">
                                        {lastCompletedLevel > 0 ? lastCompletedLevel : t("noLevelCompleted")}
                                    </span>
                                </p>
                                <p className="flex justify-between gap-4">
                                    <span>{t("totalPoints")}:</span>
                                    <span className="font-bold">{score}</span>
                                </p>
                                <p className="flex justify-between gap-4">
                                    <span>{t("time")}:</span>
                                    <span className="font-bold">
                                        {gameTime.toFixed(1)}s
                                    </span>
                                </p>
                            </div>

                            {playMode === "practice" && (
                                <p className="text-sm text-muted-foreground">
                                    {t("practiceScoresStayLocal")}
                                </p>
                            )}

                            <div className="flex gap-2 justify-center mt-6">
                                <Button onClick={startGame}>{t("playAgain")}</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowShareModal(true)}
                                >
                                    {t("share")}
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

function calculateLevelScore(currentLevel: number, roundStartTime: number, baseLevel: number) {
    const baseScore = currentLevel * 10
    const streakBonus = Math.max(0, (currentLevel - baseLevel) * 5)
    const guessTime = roundStartTime ? (Date.now() - roundStartTime) / 1000 : 0
    const speedBonus = guessTime > 0 && guessTime <= 3 ? 10 : 0

    return baseScore + streakBonus + speedBonus
}

function createInitialBlocks(): Block[] {
    return Array.from({ length: 9 }, (_, i) => ({
        id: i,
        isHighlighted: false,
        isError: false,
        isCorrect: false
    }))
}

function generatePattern(length: number): number[] {
    let lastBlockId = -1

    return Array.from({ length }, () => {
        let nextBlockId = Math.floor(Math.random() * 9)

        while (nextBlockId === lastBlockId) {
            nextBlockId = Math.floor(Math.random() * 9)
        }

        lastBlockId = nextBlockId
        return nextBlockId
    })
}
