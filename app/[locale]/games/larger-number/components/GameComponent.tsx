'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GAME_CONFIG } from '../config';
import { cn } from '@/lib/utils';
import { PlayCircle, Clock, Share2} from 'lucide-react';
import { ShareModal } from '@/components/ui/ShareModal';
import { useTranslations } from 'next-intl';
import { useInterval } from '@/hooks/useInterval';
import { useTimeout } from '@/hooks/useTimeout';
import confetti from 'canvas-confetti';

type GameState = 'idle' | 'playing' | 'complete';
type NumberOption = { value: number; position: 'left' | 'right' };
type ChallengeResult = {
  success: boolean;
  message: string;
};

export default function GameComponent() {
    const t = useTranslations("games.largerNumber.gameUI");

    const [gameState, setGameState] = useState<GameState>("idle");
    const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.gameTime);
    const [options, setOptions] = useState<[NumberOption, NumberOption]>([
        { value: 0, position: "left" },
        { value: 0, position: "right" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [challengeResult, setChallengeResult] =
        useState<ChallengeResult | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);

    // Stats tracking
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // 游戏容器引用
    const gameContainerRef = useRef<HTMLDivElement>(null);
    // 游戏开始时间
    const startTimeRef = useRef<number>(0);
    // 计时器延迟 - 当游戏不在进行中时设为null停止计时器
    const [timerDelay, setTimerDelay] = useState<number | null>(null);
    // 滚动延迟
    const [scrollDelay, setScrollDelay] = useState<number | null>(null);
    // 游戏开始延迟
    const [startGameDelay, setStartGameDelay] = useState<number | null>(null);

    // 滚动到游戏区域
    const scrollToGame = useCallback(() => {
        gameContainerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, []);

    // 初始化游戏
    const initializeGame = useCallback(() => {
        // 记录游戏开始时间
        startTimeRef.current = Date.now();

        setGameState("playing");
        setIsLoading(false);

        // 生成初始数字
        generateNumbers();

        // 启动计时器
        setTimerDelay(50); // 50毫秒更新一次，使进度条更平滑
    }, []);

    // Start the game
    const startGame = useCallback(() => {
        setIsLoading(true);

        // 延迟滚动确保布局更新完成
        setScrollDelay(50);

        // Reset game state
        setTimeLeft(GAME_CONFIG.gameTime);
        setTotalAttempts(0);
        setCorrectAnswers(0);
        setChallengeResult(null);

        // 延迟启动游戏
        setStartGameDelay(500);
    }, []);

    // 使用useTimeout进行滚动
    useTimeout(scrollToGame, scrollDelay);

    // 使用useTimeout延迟启动游戏
    useTimeout(() => {
        if (startGameDelay !== null) {
            initializeGame();
            setStartGameDelay(null);
        }
    }, startGameDelay);

    // 使用useInterval实现平滑倒计时
    useInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const remaining = Math.max(0, GAME_CONFIG.gameTime - elapsed);

        setTimeLeft(remaining);

        if (remaining <= 0) {
            setTimerDelay(null);
            endGame();
        }
    }, timerDelay);

    // Generate new number options
    const generateNumbers = useCallback(() => {
        const { minNumber, maxNumber, minDifference } = GAME_CONFIG.difficulty;

        // Generate two different numbers with minimum difference
        let num1, num2;
        do {
            num1 =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
            num2 =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
        } while (Math.abs(num1 - num2) < minDifference);

        // Randomly assign positions
        const isLeftFirst = Math.random() > 0.5;

        setOptions([
            { value: isLeftFirst ? num1 : num2, position: "left" },
            { value: isLeftFirst ? num2 : num1, position: "right" },
        ]);
    }, []);

    // Evaluate challenge completion
    const evaluateChallenge = useCallback((attempts: number, correctAnswers: number) => {
        const accuracy = attempts > 0 ? (correctAnswers / attempts) * 100 : 0;
        const success =
            attempts >= GAME_CONFIG.attempts &&
            accuracy >= GAME_CONFIG.accuracy;
        return {
            success,
            message: success ? t("congratulations") : t("keepGoing"),
        };
    }, [t]);
    
    // End the game
    const endGame = useCallback(() => {
        // 停止计时器
        setTimerDelay(null);

        setGameState("complete");
        const result = evaluateChallenge(totalAttempts, correctAnswers);
        setChallengeResult(result);

        // 如果挑战成功，触发五彩纸屑效果
        if (result.success) {
            // 延迟一点时间，确保状态更新后再触发动画
            setTimeout(() => {
                triggerConfetti();
            }, 300);
        }
    }, [totalAttempts, correctAnswers, evaluateChallenge]);

    // 触发五彩纸屑效果 - 简化版本
    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    // 游戏状态变化时处理计时器
    useEffect(() => {
        if (gameState !== "playing") {
            setTimerDelay(null);
        }
    }, [gameState]);

    // Handle player selection
    const handleSelection = useCallback(
        (option: NumberOption) => {
            if (gameState !== "playing") return;

            setTotalAttempts((prev) => prev + 1);

            // Check if the user has selected the larger number
            const otherOption = options.find(
                (opt) => opt.position !== option.position
            )!;
            const isCorrect = option.value > otherOption.value;

            if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
            }

            // 立即生成新的数字对，不依赖于计时器
            generateNumbers();
        },
        [gameState, options, generateNumbers]
    );

    // Share score
    const shareScore = () => {
        setShowShareModal(true);
    };

    // Calculate accuracy
    const calculateAccuracy = () => {
        if (totalAttempts === 0) return 0;
        return Math.round((correctAnswers / totalAttempts) * 100);
    };

    return (
        <div className="space-y-8 max-w-lg mx-auto">
            <div
                className="flex flex-col p-8"
                ref={gameContainerRef}
                style={{ scrollMarginTop: "90px" }}
            >
                {/* Timer display */}
                {gameState !== "idle" && (
                    <div className="flex justify-end items-center mb-2">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{Math.ceil(timeLeft / 1000)}s</span>
                        </div>
                    </div>
                )}

                {/* Timer progress bar */}
                {gameState === "playing" && (
                    <div className="mb-4">
                        <Progress
                            value={(timeLeft / GAME_CONFIG.gameTime) * 100}
                            className="h-2 transition-all duration-50"
                        />
                    </div>
                )}

                {/* Game content */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {gameState === "idle" ? (
                        <div className="text-center">
                            <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                                <h3>
                                    {t("challenge", {
                                        attempts: GAME_CONFIG.attempts,
                                        accuracy: GAME_CONFIG.accuracy,
                                    })}
                                </h3>
                            </div>

                            <Button
                                size="lg"
                                onClick={startGame}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                {isLoading
                                    ? t("starting")
                                    : t("startChallenge")}
                            </Button>
                        </div>
                    ) : gameState === "playing" ? (
                        <>
                            {/* Game options */}
                            <div className="text-center mb-8 mt-10">
                                <div className="text-lg font-medium mb-2">
                                    {t("whichIsLarger")}
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-8 w-full max-w-md">
                                {options.map((option, index) => (
                                    <button
                                        key={`${option.position}-${option.value}-${index}`}
                                        onClick={() => handleSelection(option)}
                                        className={cn(
                                            "flex-1 aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-4xl font-bold transition-all ",
                                            "active:scale-95",
                                            "bg-foreground/5 hover:bg-foreground/10"
                                        )}
                                    >
                                        {option.value}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">
                                {t("timeUp")}
                            </h2>

                            {/* Challenge result */}
                            {challengeResult && (
                                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                                    <div className="flex justify-center items-center gap-2 mb-3">
                                        <h3 className="font-bold text-lg">
                                            {challengeResult.message}
                                        </h3>
                                    </div>
                                    <div className="mt-4 text-lg">
                                        <div>
                                            {t("totalAttempts")}:{" "}
                                            {totalAttempts}
                                        </div>
                                        <div>
                                            {t("correctAnswers")}:{" "}
                                            {correctAnswers}
                                        </div>
                                        <div>
                                            {t("accuracy")}:{" "}
                                            {calculateAccuracy()}%
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-6">
                                            {t("target", {
                                                attempts: GAME_CONFIG.attempts,
                                                accuracy: GAME_CONFIG.accuracy,
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                                <Button
                                    onClick={startGame}
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    {isLoading ? t("starting") : t("playAgain")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={shareScore}
                                    className="gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    {t("share")}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add ShareModal at the end of the component */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={t("challenge", {
                    attempts: GAME_CONFIG.attempts,
                    accuracy: GAME_CONFIG.accuracy,
                })}
                url={window.location.href}
            />
        </div>
    );
} 