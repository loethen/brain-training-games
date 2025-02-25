'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GAME_CONFIG } from '../config';
import { cn } from '@/lib/utils';
import { PlayCircle, Trophy, Clock, Share2, CheckCircle, XCircle } from 'lucide-react';

type GameState = 'idle' | 'playing' | 'complete';
type NumberOption = { value: number; position: 'left' | 'right' };
type ChallengeResult = {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  completed: boolean;
  nextChallenge: string | null;
};

export default function GameComponent() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.gameTime);
    const [options, setOptions] = useState<[NumberOption, NumberOption]>([
        { value: 0, position: 'left' },
        { value: 0, position: 'right' }
    ]);
    const [correctOption, setCorrectOption] = useState<NumberOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);
    
    // Stats tracking
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    // Load high score from localStorage
    useEffect(() => {
        const savedHighScore = localStorage.getItem('largerNumberHighScore');
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore));
        }
    }, []);

    // Timer for the game
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        
        if (gameState === 'playing') {
            timerId = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(timerId);
                        endGame();
                        return 0;
                    }
                    return prev - 10; // Update every 10ms
                });
            }, 10);
        }
        
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [gameState]);

    // Generate new numbers for the round
    const generateNumbers = useCallback(() => {
        const { minNumber, maxNumber, minDifference } = GAME_CONFIG.difficulty;
        
        let num1, num2;
        do {
            num1 = Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
            num2 = Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
        } while (Math.abs(num1 - num2) < minDifference || num1 === num2);
        
        // Randomly position the numbers
        const positions = Math.random() > 0.5 ? ['left', 'right'] : ['right', 'left'];
        
        const newOptions: [NumberOption, NumberOption] = [
            { value: num1, position: positions[0] as 'left' | 'right' },
            { value: num2, position: positions[1] as 'left' | 'right' }
        ];
        
        setOptions(newOptions);
        setCorrectOption(num1 > num2 ? newOptions[0] : newOptions[1]);
    }, []);

    // Start a new game
    const startGame = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setGameState('playing');
            setScore(0);
            setTimeLeft(GAME_CONFIG.gameTime);
            setCorrectAnswers(0);
            setWrongAnswers(0);
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
        
        const isCorrect = option.value === correctOption?.value;
        
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setScore(prev => prev + GAME_CONFIG.scoring.correct);
        } else {
            setWrongAnswers(prev => prev + 1);
        }
        
        // Immediately generate new numbers without delay
        generateNumbers();
    }, [gameState, correctOption, generateNumbers]);

    // Calculate accuracy percentage
    const calculateAccuracy = useCallback(() => {
        if (totalAttempts === 0) return 0;
        return Math.round((correctAnswers / totalAttempts) * 100);
    }, [correctAnswers, totalAttempts]);

    // Evaluate challenge completion
    const evaluateChallenge = useCallback(() => {
        const accuracy = calculateAccuracy();
        const { beginner, intermediate, advanced, expert } = GAME_CONFIG.challenges;
        
        let level: ChallengeResult['level'] = null;
        let completed = false;
        let nextChallenge = null;
        
        // Check which challenge level was completed
        if (totalAttempts >= expert.attempts && accuracy >= expert.accuracy) {
            level = 'expert';
            completed = true;
        } else if (totalAttempts >= advanced.attempts && accuracy >= advanced.accuracy) {
            level = 'advanced';
            completed = true;
            nextChallenge = GAME_CONFIG.messages.nextChallenge.replace('{message}', expert.message);
        } else if (totalAttempts >= intermediate.attempts && accuracy >= intermediate.accuracy) {
            level = 'intermediate';
            completed = true;
            nextChallenge = GAME_CONFIG.messages.nextChallenge.replace('{message}', advanced.message);
        } else if (totalAttempts >= beginner.attempts && accuracy >= beginner.accuracy) {
            level = 'beginner';
            completed = true;
            nextChallenge = GAME_CONFIG.messages.nextChallenge.replace('{message}', intermediate.message);
        } else if (totalAttempts >= beginner.attempts) {
            level = 'beginner';
            completed = false;
            nextChallenge = GAME_CONFIG.messages.nextChallenge.replace('{message}', beginner.message);
        } else {
            nextChallenge = GAME_CONFIG.messages.nextChallenge.replace('{message}', beginner.message);
        }
        
        return { level, completed, nextChallenge };
    }, [calculateAccuracy, totalAttempts]);

    // End the game
    const endGame = useCallback(() => {
        setGameState('complete');
        
        // Evaluate challenge completion
        const result = evaluateChallenge();
        setChallengeResult(result);
        
        // Update high score if needed
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('largerNumberHighScore', score.toString());
        }
    }, [score, highScore, evaluateChallenge]);

    // Share score
    const shareScore = () => {
        const accuracy = calculateAccuracy();
        const text = `I scored ${score} points in the Larger Number Challenge with ${accuracy}% accuracy and ${totalAttempts} attempts in 30 seconds! Can you beat me?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Larger Number Challenge Score',
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

    return (
        <div className="w-full h-full flex flex-col p-4">
            {/* Header with score and time */}
            {gameState !== "idle" && (
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>{score}</span>
                        {highScore > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">
                                Best: {highScore}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.ceil(timeLeft / 1000)}s</span>
                    </div>
                </div>
            )}

            {/* Timer */}
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
                            <h3>{GAME_CONFIG.challenges.beginner.message}</h3>
                        </div>
                        <Button
                            size="lg"
                            onClick={startGame}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <PlayCircle className="w-5 h-5" />
                            {isLoading ? "Starting..." : "Start Game"}
                        </Button>
                    </div>
                ) : gameState === "playing" ? (
                    <>
                        {/* Stats display */}
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                            <div className="text-sm bg-background/50 px-3 py-1 rounded-full">
                                Correct: {correctAnswers} | Wrong:{" "}
                                {wrongAnswers}
                            </div>
                        </div>

                        {/* Game options */}
                        <div className="text-center mb-8">
                            <div className="text-lg font-medium mb-2">
                                Which number is larger?
                            </div>
                        </div>

                        <div className="flex gap-8 w-full max-w-md">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelection(option)}
                                    className={cn(
                                        "flex-1 aspect-square rounded-xl flex items-center justify-center text-4xl font-bold transition-all ",
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
                        <h2 className="text-2xl font-bold mb-4">
                            Time&apos;s Up!
                        </h2>
                        <div className="text-4xl font-bold mb-6">{score}</div>

                        {/* Challenge result */}
                        {challengeResult && (
                            <div className="bg-muted/30 p-4 rounded-lg mb-6">
                                <div className="flex justify-center items-center gap-2 mb-3">
                                    {challengeResult.completed ? (
                                        <>
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                            <h3 className="font-bold text-xl text-green-500">
                                                {GAME_CONFIG.messages.success}
                                            </h3>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-6 h-6 text-red-500" />
                                            <h3 className="font-bold text-xl text-red-500">
                                                {GAME_CONFIG.messages.failure}
                                            </h3>
                                        </>
                                    )}
                                </div>

                                <div className="grid gap-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span>Total Attempts:</span>
                                        <span className="font-bold">
                                            {totalAttempts}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Accuracy:</span>
                                        <span className="font-bold">
                                            {calculateAccuracy()}%
                                        </span>
                                    </div>
                                    {challengeResult.level && (
                                        <div className="flex justify-between">
                                            <span>Challenge Level:</span>
                                            <span className="font-bold capitalize">
                                                {challengeResult.level}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {challengeResult.nextChallenge && (
                                    <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                                        <p className="font-medium">
                                            {challengeResult.nextChallenge}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {score > highScore && (
                            <div className="text-primary font-bold mb-4">
                                New High Score! 🎉
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button onClick={startGame}>Play Again</Button>
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