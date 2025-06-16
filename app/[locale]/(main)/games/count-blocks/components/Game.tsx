'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GameGrid } from './GameGrid';
import { GameState } from '../config';
import { getLevelConfig, generateRandomBlocks } from '../levelConfig';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'ready',
    level: 1,
    score: 0,
    totalBlocks: 0,
    userAnswer: null,
    isCorrect: null,
    blocks: [],
  });

  const [inputValue, setInputValue] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 开始新游戏
  const startGame = useCallback(() => {
    const levelConfig = getLevelConfig(gameState.level);
    const blocks = generateRandomBlocks(levelConfig);
    const totalBlocks = blocks.reduce((sum, block) => sum + block.height, 0);

    setGameState(prev => ({
      ...prev,
      phase: 'displaying',
      blocks,
      totalBlocks,
      userAnswer: null,
      isCorrect: null,
    }));

    setInputValue('');
    setCountdown(Math.ceil(levelConfig.displayTime / 1000));

    // 倒计时
    let timeLeft = levelConfig.displayTime;
    const countdownInterval = setInterval(() => {
      timeLeft -= 1000;
      setCountdown(Math.ceil(timeLeft / 1000));
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        setGameState(prev => ({ ...prev, phase: 'input' }));
        setCountdown(0);
      }
    }, 1000);
  }, [gameState.level]);

  // 提交答案
  const submitAnswer = useCallback(() => {
    const answer = parseInt(inputValue, 10);
    if (isNaN(answer) || answer < 0) return;

    const isCorrect = answer === gameState.totalBlocks;
    const scoreGain = isCorrect ? gameState.level * 10 : 0;

    setGameState(prev => ({
      ...prev,
      phase: 'result',
      userAnswer: answer,
      isCorrect,
      score: prev.score + scoreGain,
    }));
  }, [inputValue, gameState.totalBlocks, gameState.level]);

  // 进入下一关
  const nextLevel = useCallback(() => {
    if (gameState.isCorrect) {
      setGameState(prev => ({ ...prev, level: prev.level + 1 }));
    }
    startGame();
  }, [gameState.isCorrect, startGame]);

  // 重置游戏
  const resetGame = useCallback(() => {
    setGameState({
      phase: 'ready',
      level: 1,
      score: 0,
      totalBlocks: 0,
      userAnswer: null,
      isCorrect: null,
      blocks: [],
    });
    setInputValue('');
    setCountdown(0);
  }, []);

  // 处理输入框回车
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState.phase === 'input') {
      submitAnswer();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[600px]">
      {/* 游戏信息 */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            <span className="text-muted-foreground">Level:</span>{' '}
            <span className="font-bold text-primary">{gameState.level}</span>
          </div>
          <div className="text-lg">
            <span className="text-muted-foreground">Score:</span>{' '}
            <span className="font-bold text-primary">{gameState.score}</span>
          </div>
        </div>
      </div>

      {/* 游戏状态显示 */}
      <div className="game-status mb-6 text-center">
        {gameState.phase === 'ready' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">Ready to Start!</h2>
            <p className="text-muted-foreground mb-4">
              Count the blocks that will appear on the grid
            </p>
            <Button onClick={startGame} size="lg">
              Start Game
            </Button>
          </div>
        )}

        {gameState.phase === 'displaying' && (
          <div>
            <h2 className="text-xl font-bold text-primary">
              Remember the blocks! ({countdown}s)
            </h2>
            <p className="text-muted-foreground">
              Count all the blocks you see, including stacked ones
            </p>
          </div>
        )}

        {gameState.phase === 'input' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary">
              How many blocks did you see?
            </h2>
            <div className="flex justify-center items-center gap-4">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter number"
                className="w-32 text-center text-lg"
                min="0"
                autoFocus
              />
              <Button onClick={submitAnswer} disabled={!inputValue}>
                Submit
              </Button>
            </div>
          </div>
        )}

        {gameState.phase === 'result' && (
          <div>
            {gameState.isCorrect ? (
              <div className="text-green-600">
                <h2 className="text-xl font-bold mb-2">Correct! 🎉</h2>
                <p>You found all {gameState.totalBlocks} blocks!</p>
                <p className="text-sm text-muted-foreground mb-4">
                  +{gameState.level * 10} points
                </p>
              </div>
            ) : (
              <div className="text-red-600">
                <h2 className="text-xl font-bold mb-2">Not quite right 😔</h2>
                <p>You answered: {gameState.userAnswer}</p>
                <p>Correct answer: {gameState.totalBlocks}</p>
              </div>
            )}
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={nextLevel}>
                {gameState.isCorrect ? 'Next Level' : 'Try Again'}
              </Button>
              <Button variant="outline" onClick={resetGame}>
                Reset Game
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 游戏网格 */}
      <div className="flex justify-center">
        <GameGrid
          blocks={gameState.blocks}
          showBlocks={gameState.phase === 'displaying' || gameState.phase === 'result'}
          showResult={gameState.phase === 'result' && gameState.isCorrect === true}
        />
      </div>
    </div>
  );
} 