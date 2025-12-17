'use client';

import React, { useState, useCallback } from 'react';
import { Check, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StroopTestProps {
  onComplete: (stroopScore: number, avgReactionTime: number) => void;
}

export default function StroopTest({ onComplete }: StroopTestProps) {
  const t = useTranslations('getStarted.stroopTest');

  // 颜色配置
  const COLORS = React.useMemo(() => [
    { name: 'red', text: t('colors.red'), color: '#ef4444', key: '1' },
    { name: 'blue', text: t('colors.blue'), color: '#3b82f6', key: '2' },
    { name: 'green', text: t('colors.green'), color: '#10b981', key: '3' },
    { name: 'yellow', text: t('colors.yellow'), color: '#f59e0b', key: '4' }
  ], [t]);
  const [testState, setTestState] = useState<'instruction' | 'playing' | 'completed'>('instruction');
  const [currentRound, setCurrentRound] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<{
    word: string;
    color: string;
    correctAnswer: string;
    isCongruent: boolean;
  } | null>(null);
  const [trialStartTime, setTrialStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<{
    reactionTime: number;
    correct: boolean;
    isCongruent: boolean;
  }[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [avgReactionTime, setAvgReactionTime] = useState(0);
  const [lastTrial, setLastTrial] = useState<{
    word: string;
    color: string;
  } | null>(null);

  const generateTrial = useCallback(() => {
    let trial;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      // 80%几率生成不一致试验（增加挑战性）
      const isCongruent = Math.random() < 0.2;
      const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      let displayColor;
      if (isCongruent) {
        displayColor = wordColor;
      } else {
        // 不一致试验：文字和颜色不匹配
        do {
          displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (displayColor.name === wordColor.name);
      }

      trial = {
        word: wordColor.text,
        color: displayColor.color,
        correctAnswer: displayColor.name,
        isCongruent
      };

      attempts++;
    } while (
      lastTrial &&
      trial.word === lastTrial.word &&
      trial.color === lastTrial.color &&
      attempts < maxAttempts
    );

    // 更新上一题记录
    setLastTrial({
      word: trial.word,
      color: trial.color
    });

    return trial;
  }, [lastTrial, COLORS]);

  const startRound = useCallback(() => {
    const trial = generateTrial();
    setCurrentTrial(trial);
    setTrialStartTime(Date.now());
  }, [generateTrial]);

  const startTest = useCallback(() => {
    setTestState('playing');
    setCurrentRound(0);
    setResults([]);
    setLastTrial(null); // 重置上一题记录
    startRound();
  }, [startRound]);

  const handleColorSelect = useCallback((colorName: string) => {
    if (!currentTrial || !trialStartTime) return;

    const reactionTime = Date.now() - trialStartTime;
    const isCorrect = colorName === currentTrial.correctAnswer;

    const result = {
      reactionTime,
      correct: isCorrect,
      isCongruent: currentTrial.isCongruent
    };

    setResults(prev => [...prev, result]);

    if (currentRound < 7) { // 8轮测试
      setCurrentRound(prev => prev + 1);
      setTimeout(() => startRound(), 800);
    } else {
      // 测试完成，计算结果
      const allResults = [...results, result];
      const correctResults = allResults.filter(r => r.correct);
      const accuracy = (correctResults.length / allResults.length) * 100;
      const avgTime = correctResults.reduce((sum, r) => sum + r.reactionTime, 0) / correctResults.length;

      setFinalScore(Math.round(accuracy));
      setAvgReactionTime(Math.round(avgTime));
      setTestState('completed');
    }
  }, [currentTrial, trialStartTime, currentRound, results, startRound]);

  const handleComplete = useCallback(() => {
    onComplete(finalScore, avgReactionTime);
  }, [finalScore, avgReactionTime, onComplete]);

  if (testState === 'instruction') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Brain className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-xl font-semibold">{t('title')}</h3>
        <p className="text-muted-foreground">{t('subtitle')}</p>
        <div className="text-sm space-y-2">
          <p>{t('instructions')}</p>
          <p>{t('example')}</p>
        </div>
        <button
          onClick={startTest}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          {t('startButton')}
        </button>
      </div>
    );
  }

  if (testState === 'playing' && currentTrial) {
    return (
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold">{t('title')} ({currentRound + 1}/8)</h3>

        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border">
          <p className="text-lg mb-6">{t('whatColor')}</p>
          <div
            className="text-5xl font-bold mb-8"
            style={{ color: currentTrial.color }}
          >
            {currentTrial.word}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
              >
                <span className="font-medium">{color.key}. {color.text}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('useKeys')}
        </p>
      </div>
    );
  }

  if (testState === 'completed') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center text-green-500">
          <Check size={48} />
        </div>
        <h3 className="text-xl font-semibold">{t('testComplete')}</h3>
        <div className="space-y-2">
          <p>{t('accuracy')}: {finalScore}%</p>
          <p>{t('averageReactionTime')}: {avgReactionTime}ms</p>
        </div>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          {t('nextTest')}
        </button>
      </div>
    );
  }

  return null;
} 