'use client';

import React, { useState, useCallback } from 'react';
import { Check, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReactionTimeTestProps {
  onComplete: (avgReactionTime: number) => void;
}

export default function ReactionTimeTest({ onComplete }: ReactionTimeTestProps) {
  const t = useTranslations('getStarted.reactionTimeTest');
  const [testState, setTestState] = useState<'instruction' | 'playing' | 'completed'>('instruction');
  const [reactionState, setReactionState] = useState<'waiting' | 'ready' | 'clicked'>('waiting');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [reactionRound, setReactionRound] = useState(0);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [avgTime, setAvgTime] = useState<number>(0);

  /* Moved startReactionTest below startReactionRound */

  const startReactionRound = useCallback(() => {
    setReactionState('waiting');
    const waitTime = 1000 + Math.random() * 2000; // 1-3秒随机等待

    setTimeout(() => {
      setReactionState('ready');
      setReactionStartTime(Date.now());
    }, waitTime);
  }, []);

  const startReactionTest = useCallback(() => {
    setTestState('playing');
    setReactionRound(0);
    setReactionTimes([]);
    startReactionRound();
  }, [startReactionRound]);

  const handleReactionClick = useCallback(() => {
    if (reactionState === 'ready' && reactionStartTime) {
      const reactionTime = Date.now() - reactionStartTime;
      setReactionTimes(prev => [...prev, reactionTime]);
      setReactionState('clicked');

      if (reactionRound < 2) { // 3轮测试
        setReactionRound(prev => prev + 1);
        setTimeout(() => startReactionRound(), 1000);
      } else {
        // 完成反应时间测试
        const finalAvgTime = [...reactionTimes, reactionTime].reduce((a, b) => a + b, 0) / 3;
        const roundedAvgTime = Math.round(finalAvgTime);
        setAvgTime(roundedAvgTime);
        setTestState('completed');
      }
    }
  }, [reactionState, reactionStartTime, reactionRound, reactionTimes, startReactionRound]);

  const handleComplete = useCallback(() => {
    onComplete(avgTime);
  }, [avgTime, onComplete]);

  if (testState === 'instruction') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-xl font-semibold">{t('title')}</h3>
        <p className="text-muted-foreground">{t('subtitle')}</p>
        <p className="text-sm">{t('instructions')}</p>
        <button
          onClick={startReactionTest}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          {t('startButton')}
        </button>
      </div>
    );
  }

  if (testState === 'playing') {
    return (
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold">{t('title')} ({reactionRound + 1}/3)</h3>
        <div
          className={`w-48 h-48 mx-auto rounded-full cursor-pointer transition-all ${reactionState === 'waiting'
              ? 'bg-red-500'
              : reactionState === 'ready'
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          onClick={handleReactionClick}
        >
          <div className="flex items-center justify-center h-full text-white font-bold text-lg">
            {reactionState === 'waiting' && (
              <span className="animate-pulse">{t('wait')}</span>
            )}
            {reactionState === 'ready' && t('clickNow')}
            {reactionState === 'clicked' && t('complete')}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {reactionState === 'waiting' ? (
            <span className="animate-pulse opacity-70">{t('clickWhenGreen')}</span>
          ) : reactionState === 'ready' ? (
            t('clickNow2')
          ) : (
            `${t('reactionTime')}: ${reactionTimes[reactionTimes.length - 1]} ${t('milliseconds')}`
          )}
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
        <p>{t('averageReactionTime')}: {avgTime} {t('milliseconds')}</p>
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