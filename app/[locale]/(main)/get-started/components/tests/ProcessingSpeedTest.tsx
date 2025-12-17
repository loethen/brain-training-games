'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Check, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProcessingSpeedTestProps {
  onComplete: (processingSpeed: number) => void;
}

export default function ProcessingSpeedTest({ onComplete }: ProcessingSpeedTestProps) {
  const t = useTranslations('games.largerNumber.gameUI');
  const tTest = useTranslations('getStarted.processingSpeedTest');
  const [testState, setTestState] = useState<'instruction' | 'playing' | 'completed'>('instruction');
  const [numbers, setNumbers] = useState<{ left: number, right: number }>({ left: 0, right: 0 });
  const [speedRound, setSpeedRound] = useState(0);
  const [speedCorrect, setSpeedCorrect] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10秒时间限制
  const [isGameActive, setIsGameActive] = useState(false);

  const generateNumbers = useCallback(() => {
    const left = Math.floor(Math.random() * 90) + 10; // 10-99
    let right;
    do {
      right = Math.floor(Math.random() * 90) + 10;
    } while (Math.abs(left - right) < 5); // 确保差异至少为5

    setNumbers({ left, right });
  }, []);

  const startSpeedTest = useCallback(() => {
    setTestState('playing');
    setSpeedRound(0);
    setSpeedCorrect(0);
    setTimeLeft(10);
    setIsGameActive(true);
    generateNumbers();
  }, [generateNumbers]);

  // 时间倒计时
  /* Moved useEffect below endGame */

  const endGame = useCallback(() => {
    setIsGameActive(false);
    const totalQuestions = speedRound;
    const accuracy = totalQuestions > 0 ? (speedCorrect / totalQuestions) * 100 : 0;

    // 计算处理速度分数
    let processingScore = 0;

    if (totalQuestions >= 12 && accuracy >= 90) {
      // 达到基本要求：12题且90%正确率
      processingScore = Math.min(100, 70 + (totalQuestions - 12) * 2 + (accuracy - 90) * 1);
    } else if (totalQuestions >= 12) {
      // 完成12题但正确率不足
      processingScore = Math.min(69, 50 + accuracy * 0.2);
    } else if (accuracy >= 90) {
      // 正确率高但题目不足
      processingScore = Math.min(69, 40 + totalQuestions * 2);
    } else {
      // 两个条件都不满足
      processingScore = Math.min(50, 20 + totalQuestions * 1.5 + accuracy * 0.3);
    }

    setScore(Math.round(processingScore));
    setTestState('completed');
  }, [speedRound, speedCorrect]);

  // 时间倒计时
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isGameActive && timeLeft === 0) {
      // 时间到，结束游戏
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  const handleSpeedChoice = useCallback((choice: 'left' | 'right') => {
    if (!isGameActive) return;

    const isCorrect = (choice === 'left' && numbers.left > numbers.right) ||
      (choice === 'right' && numbers.right > numbers.left);

    if (isCorrect) {
      setSpeedCorrect(prev => prev + 1);
    }

    setSpeedRound(prev => prev + 1);

    // 如果时间还没到，继续下一题
    if (timeLeft > 0) {
      generateNumbers();
    } else {
      endGame();
    }
  }, [numbers, timeLeft, isGameActive, generateNumbers, endGame]);

  const handleComplete = useCallback(() => {
    onComplete(score);
  }, [score, onComplete]);

  if (testState === 'instruction') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold">{tTest('title')}</h3>
        <p className="text-muted-foreground">{tTest('subtitle')}</p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-orange-800 mb-2">{tTest('challengeGoals')}</p>
          <ul className="text-orange-700 space-y-1">
            <li>• {tTest('timeLimit')}</li>
            <li>• {tTest('minComparisons')}</li>
            <li>• {tTest('accuracyTarget')}</li>
          </ul>
        </div>
        <p className="text-sm">{tTest('instructions')}</p>
        <button
          onClick={startSpeedTest}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          {t('startChallenge')}
        </button>
      </div>
    );
  }

  if (testState === 'playing') {
    const accuracy = speedRound > 0 ? ((speedCorrect / speedRound) * 100).toFixed(1) : '0.0';

    return (
      <div className="text-center space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{tTest('title')}</h3>
          <div className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="flex justify-center gap-8">
          <button
            onClick={() => handleSpeedChoice('left')}
            className="w-24 h-24 text-3xl font-bold border-2 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50"
            disabled={!isGameActive}
          >
            {numbers.left}
          </button>
          <button
            onClick={() => handleSpeedChoice('right')}
            className="w-24 h-24 text-3xl font-bold border-2 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50"
            disabled={!isGameActive}
          >
            {numbers.right}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">{tTest('clickLarger')}</p>

        <div className="flex justify-center gap-6 text-sm">
          <span>{tTest('completed')}: {speedRound}{tTest('questionsLabel')}</span>
          <span>{t('correct')}: {speedCorrect}{tTest('questionsLabel')}</span>
          <span className={`${parseFloat(accuracy) >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
            {t('accuracy')}: {accuracy}%
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          {speedRound >= 12 && parseFloat(accuracy) >= 90 ? (
            <span className="text-green-600 font-semibold">🎯 {tTest('challengeCompleted')}</span>
          ) : (
            <span>
              {tTest('stillNeeded')}: {Math.max(0, 12 - speedRound)}{tTest('questionsLabel')} |
              {tTest('targetAccuracy')}: 90%
            </span>
          )}
        </div>
      </div>
    );
  }

  if (testState === 'completed') {
    const accuracy = speedRound > 0 ? ((speedCorrect / speedRound) * 100).toFixed(1) : '0.0';
    const challengeCompleted = speedRound >= 12 && parseFloat(accuracy) >= 90;

    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center text-green-500">
          <Check size={48} />
        </div>
        <h3 className="text-xl font-semibold">{tTest('testCompleted')}</h3>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>{tTest('questionsCompleted')}:</span>
            <span className={speedRound >= 12 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
              {speedRound}/12{tTest('questionsLabel')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('accuracy')}:</span>
            <span className={parseFloat(accuracy) >= 90 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
              {accuracy}%
            </span>
          </div>
          {challengeCompleted && (
            <div className="text-green-600 font-semibold text-sm">
              🎉 {t('congratulations')}
            </div>
          )}
        </div>

        <p>{tTest('processingSpeedScore')}: {score}{tTest('points')}</p>

        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          {tTest('viewRecommendation')}
        </button>
      </div>
    );
  }

  return null;
} 