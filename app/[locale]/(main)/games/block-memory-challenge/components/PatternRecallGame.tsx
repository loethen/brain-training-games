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

interface Block {
  id: number
  isHighlighted: boolean
  isError: boolean
  isCorrect: boolean
}

const MIN_START_LEVEL = 3;
const MAX_START_LEVEL = 20;

export function PatternRecallGame() {
    const t = useTranslations("games.blockMemoryChallenge.gameUI")
    const [gameState, setGameState] = useState<
        "idle" | "showing" | "guessing" | "complete" | "failed"
    >("idle");
    const [level, setLevel] = useState(MIN_START_LEVEL);
    const [startLevel, setStartLevel] = useState(MIN_START_LEVEL);
    const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks());
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
    // 新增状态控制标志
    const [blockToAnimate, setBlockToAnimate] = useState<number | null>(null);
    const [animateError, setAnimateError] = useState<number | null>(null);

    // 使用useTimeout钩子处理动画完成
    useTimeout(() => {
        if (blockToAnimate !== null) {
            // 清除正确状态
            setBlocks(blocks => blocks.map(block => ({ ...block, isCorrect: false })));
            setBlockToAnimate(null);
            
            // 完成级别的逻辑
            if (userPattern.length === pattern.length) {
                const levelScore = calculateLevelScore(level);
                const newTotalScore = score + levelScore;
                setScore(newTotalScore);
                updateBestScore(newTotalScore);
                setGameState("complete");
                
                // 延迟后进入下一关
                setTimeout(() => {
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    const nextPatternLength = Math.min(nextLevel, 9);
                    const newPattern = generatePattern(nextPatternLength);
                    setPattern(newPattern);
                    resetBlocks();
                    void showPattern(newPattern);
                }, 500);
            }
        }
    }, blockToAnimate !== null ? 300 : null);
    
    // 处理错误动画结束
    useTimeout(() => {
        if (animateError !== null) {
            setBlocks(blocks => blocks.map(block => ({ ...block, isError: false })));
            setAnimateError(null);
        }
    }, animateError !== null ? 300 : null);

    // 加载最高分
    useEffect(() => {
        const savedBestScore = localStorage.getItem("memoryBlocksBestScore");
        if (savedBestScore) {
            setBestScore(parseInt(savedBestScore));
        }
    }, []);

    // 更新最高分
    const updateBestScore = useCallback((newScore: number) => {
        if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem("memoryBlocksBestScore", newScore.toString());
        }
    }, [bestScore]);

    const showPattern = useCallback(async (newPattern: number[]) => {
        setGameState("showing");
        for (const blockId of newPattern) {
            setBlocks((blocks) =>
                blocks.map((block) => ({
                    ...block,
                    isHighlighted: block.id === blockId,
                    isCorrect: false,
                }))
            );

            await new Promise((resolve) => setTimeout(resolve, 800));

            setBlocks((blocks) =>
                blocks.map((block) => ({
                    ...block,
                    isHighlighted: false,
                }))
            );

            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        resetBlocks();
        setGameState("guessing");
        setUserPattern([]);
        setStartTime(Date.now());
    }, []);

    const startGame = useCallback(() => {
        setIsLoading(true);
        setGameState("idle");
        setLevel(startLevel);
        setScore(0);
        setGameTime(0);
        setShowResults(false);
        resetBlocks();

        setTimeout(() => {
            setIsLoading(false);
            const initialPatternLength = Math.min(startLevel, 9);
            const newPattern = generatePattern(initialPatternLength);
            setPattern(newPattern);
            void showPattern(newPattern);
        }, 1000);
    }, [showPattern, startLevel]);

    const calculateLevelScore = useCallback((currentLevel: number) => {
        const baseScore = currentLevel * 10;
        const streakBonus = Math.max(0, (currentLevel - startLevel) * 5);

        const guessTime = (Date.now() - startTime) / 1000;
        const speedBonus = guessTime <= 3 ? 10 : 0;

        return baseScore + streakBonus + speedBonus;
    }, [startLevel, startTime]);

    // 简化后的handleBlockClick函数，使用状态标志控制动画
    const handleBlockClick = useCallback(
        (blockId: number) => {
            if (gameState !== "guessing") return;

            const alreadySelected = userPattern.includes(blockId);
            if(alreadySelected) return;

            const newUserPattern = [...userPattern, blockId];
            setUserPattern(newUserPattern);
            
            // 检查是否正确
            const currentIndex = userPattern.length;
            const isCorrect = pattern[currentIndex] === blockId;
            
            if (isCorrect) {
                // 正确点击处理 - 显示绿色
                setBlocks((blocks) =>
                    blocks.map((block) =>
                        block.id === blockId 
                            ? { ...block, isCorrect: true }
                            : block
                    )
                );
                
                // 设置要动画的方块ID
                setBlockToAnimate(blockId);
            } else {
                // 错误点击处理
                setBlocks((blocks) =>
                    blocks.map((block) =>
                        block.id === blockId ? { ...block, isError: true } : block
                    )
                );
                
                // 设置错误动画
                setAnimateError(blockId);
                
                // 游戏失败处理
                setGameState("failed");
                const endTime = Date.now();
                setGameTime((endTime - startTime) / 1000);
                updateBestScore(score);
                setShowResults(true);
            }
        },
        [gameState, userPattern, pattern, score, startTime, updateBestScore]
    );

    function resetBlocks() {
        setBlocks((blocks) =>
            blocks.map((block) => ({
                ...block,
                isHighlighted: false,
                isError: false,
                isCorrect: false,
            }))
        );
        // 确保重置动画状态
        setBlockToAnimate(null);
        setAnimateError(null);
    }

    const handleShareClick = () => {
        setShowShareModal(true);
    };

    return (
        <div className="space-y-8 max-w-md mx-auto py-4">
            {/* Game Status */}
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

            {/* Game Grid */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                            className={cn(
                                "aspect-square rounded-lg transition-all duration-150",
                                "flex items-center justify-center", // 居中内容
                                gameState === "guessing" ? "cursor-pointer bg-foreground/5" : "cursor-not-allowed bg-foreground/5",
                                block.isHighlighted && "bg-primary scale-95 cursor-default",
                                block.isCorrect && "bg-success scale-95 cursor-default", 
                                block.isError && "bg-destructive/30 scale-95 cursor-default",
                                gameState !== "guessing" && !block.isHighlighted && !block.isCorrect && !block.isError && "opacity-75",
                             )}
                        />
                    ))}
                </div>

                {/* Start Button Overlay */}
                {gameState === "idle" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-primary/5 rounded-lg backdrop-blur-xs p-4">
                        {bestScore > 0 && (
                            <div className="text-center mb-2">
                                <div className="text-sm text-muted-foreground">
                                    {t("personalBest")}
                                </div>
                                <div className="text-2xl font-bold">
                                    {bestScore}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col items-center gap-3 mb-4 w-4/5">
                            <Label htmlFor="start-level-slider" className="mb-1">{t("startLevelLabel", { count: startLevel })}</Label>
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

                {/* Results Overlay */}
                {showResults && (
                   <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg">
                        <div className="bg-background p-6 rounded-xl shadow-lg space-y-4 text-center w-11/12 max-w-xs">
                            <h3 className="text-2xl font-bold mb-4">
                                {t("gameOver")}
                            </h3>
                             <div className="space-y-2 text-left w-full">
                                <p className="flex justify-between gap-4">
                                    <span>{t("finalScore")}:</span>
                                    <span className="font-bold">{score}</span>
                                </p>
                                <p className="flex justify-between gap-4">
                                    <span>{t("bestScore")}:</span>
                                    <span className="font-bold">
                                        {bestScore}
                                    </span>
                                </p>
                                <p className="flex justify-between gap-4">
                                    <span>{t("time")}:</span>
                                    <span className="font-bold">
                                        {gameTime.toFixed(1)}s
                                    </span>
                                </p>
                                <p className="flex justify-between gap-4">
                                     <span>{t("levelsCompleted")}:</span>
                                    <span className="font-bold"> {Math.max(0, level - startLevel)}</span>
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center mt-6">
                                <Button onClick={startGame}>{t("playAgain")}</Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShareClick}
                                >
                                    {t("share")}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    );
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
  const pattern: number[] = []
  const availableIds = Array.from({ length: 9 }, (_, i) => i);
  const actualLength = Math.min(length, availableIds.length);

  while (pattern.length < actualLength) {
      const randomIndex = Math.floor(Math.random() * availableIds.length);
      const num = availableIds.splice(randomIndex, 1)[0];
      pattern.push(num);
  }
  return pattern;
} 