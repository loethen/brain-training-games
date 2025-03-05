'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GAME_CONFIG } from '../config';
import { cn } from '@/lib/utils';
import { PlayCircle, Clock, Share2} from 'lucide-react';

type GameState = 'idle' | 'playing' | 'complete';
type NumberOption = { value: number; position: 'left' | 'right' };
type ChallengeResult = {
  success: boolean;
  message: string;
};

export default function GameComponent() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.gameTime);
    const [options, setOptions] = useState<[NumberOption, NumberOption]>([
        { value: 0, position: 'left' },
        { value: 0, position: 'right' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);
    
    // Stats tracking
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // End the game
    const endGame = useCallback(() => {
        setGameState('complete');
        setChallengeResult(evaluateChallenge(totalAttempts, correctAnswers));
    }, [totalAttempts, correctAnswers]);

    // Timer for the game
    useEffect(() => {
        let timerId: number;
        
        if (gameState === 'playing') {
            timerId = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(timerId);
                        endGame();
                        return 0;
                    }
                    return prev - 10;
                });
            }, 10);
        }
        
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [gameState, endGame]);

    // Generate new numbers for the round
    const generateNumbers = useCallback(() => {
        const { minNumber, maxNumber, minDifference } = GAME_CONFIG.difficulty;
        let num1, num2;
        
        do {
            num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
            num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        } while (Math.abs(num1 - num2) < minDifference);

        const newOptions = [
            { value: num1, position: 'left' },
            { value: num2, position: 'right' }
        ].sort(() => Math.random() - 0.5) as [NumberOption, NumberOption];

        setOptions(newOptions);
    }, []);

    // Start a new game
    const startGame = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setGameState('playing');
            setTimeLeft(GAME_CONFIG.gameTime); // Reset the timer
            setCorrectAnswers(0);
            setTotalAttempts(0);
            setChallengeResult(null);
            generateNumbers();
            setIsLoading(false);
        }, 1000);
    }, [generateNumbers]);

    // Handle player selection
    const handleSelection = useCallback((option: NumberOption) => {
        if (gameState !== 'playing') return;
        
        setTotalAttempts(prev => prev + 1);
        
        // Check if the user has selected the larger number
        const otherOption = options.find(opt => opt.position !== option.position)!;
        const isCorrect = option.value > otherOption.value;
        
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }
        
        generateNumbers();
    }, [gameState, options, generateNumbers]);

    // Evaluate challenge completion
    const evaluateChallenge = (attempts: number, correctAnswers: number) => {
        const accuracy = attempts > 0 ? (correctAnswers / attempts) * 100 : 0;
        const success = attempts >= GAME_CONFIG.attempts && accuracy >= GAME_CONFIG.accuracy;
        return {
            success,
            message: success 
                ? `🎉 Congratulations! You've completed the challenge brilliantly!`
                : `💪 Keep going! You're just one step away from success, try again!`
        };
    };

    // Share score
    const shareScore = () => {
        const currentAccuracy = totalAttempts === 0 ? '--' : Math.round((correctAnswers / totalAttempts) * 100);
        const accuracyText = currentAccuracy === '--' ? '0%' : `${currentAccuracy}%`;
        
        const text = `I completed ${totalAttempts} number comparisons in 30 seconds with an accuracy of ${accuracyText}! You should try it too?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Larger Number Challenge',
                text: text,
                url: window.location.href,
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(text + ' ' + window.location.href)
                .then(() => alert('Score copied to clipboard!'))
                .catch(err => console.error('Error copying text:', err));
        }
    };

    // Calculate accuracy
    const calculateAccuracy = () => {
        if (totalAttempts === 0) return 0;
        return Math.round((correctAnswers / totalAttempts) * 100);
    };

    return (
        <div className="flex flex-col p-8 min-h-[500px]">
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
                        className="h-2"
                    />
                </div>
            )}

            {/* Game content */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                {gameState === "idle" ? (
                    <div className="text-center">
                        <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                            <h3>Complete {GAME_CONFIG.attempts} comparisons in 30s with ≥{GAME_CONFIG.accuracy}% accuracy</h3>
                        </div>
                        
                        <Button
                            size="lg"
                            onClick={startGame}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <PlayCircle className="w-5 h-5" />
                            {isLoading ? "Starting..." : "Start Challenge"}
                        </Button>
                    </div>
                ) : gameState === "playing" ? (
                    <>
                        {/* Stats display */}
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                            <div className="text-xs sm:text-sm bg-background/50 px-2 sm:px-3 py-1 rounded-full">
                                Correct: {correctAnswers} | Total:{" "}
                                {totalAttempts}
                            </div>
                        </div>

                        {/* Game options */}
                        <div className="text-center mb-8 mt-10">
                            <div className="text-lg font-medium mb-2">
                                Which number is larger?
                            </div>
                        </div>

                        <div className="flex gap-4 sm:gap-8 w-full max-w-md">
                            {options.map((option, index) => (
                                <button
                                    key={index}
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
                            Time&apos;s Up!
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
                                    <div>Total Attempts: {totalAttempts}</div>
                                    <div>Correct: {correctAnswers}</div>
                                    <div>Accuracy: {calculateAccuracy()}%</div>
                                    <div className="text-sm text-muted-foreground mt-6">
                                        Target: {GAME_CONFIG.attempts} attempts with ≥{GAME_CONFIG.accuracy}% accuracy
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
                                {isLoading ? "Starting..." : "Play Again"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={shareScore}
                                className="gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 