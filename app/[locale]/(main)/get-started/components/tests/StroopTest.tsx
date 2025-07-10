'use client';

import React, { useState, useCallback } from 'react';
import { Check, Brain } from 'lucide-react';

interface StroopTestProps {
  onComplete: (stroopScore: number, avgReactionTime: number) => void;
}

// 简化的颜色配置
const COLORS = [
  { name: 'red', text: '红色', color: '#ef4444', key: '1' },
  { name: 'blue', text: '蓝色', color: '#3b82f6', key: '2' },
  { name: 'green', text: '绿色', color: '#10b981', key: '3' },
  { name: 'yellow', text: '黄色', color: '#f59e0b', key: '4' }
];

export default function StroopTest({ onComplete }: StroopTestProps) {
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

  const generateTrial = useCallback(() => {
    // 50%几率生成一致试验（颜色和文字匹配）
    const isCongruent = Math.random() < 0.5;
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

    return {
      word: wordColor.text,
      color: displayColor.color,
      correctAnswer: displayColor.name,
      isCongruent
    };
  }, []);

  const startTest = useCallback(() => {
    setTestState('playing');
    setCurrentRound(0);
    setResults([]);
    startRound();
  }, []);

  const startRound = useCallback(() => {
    const trial = generateTrial();
    setCurrentTrial(trial);
    setTrialStartTime(Date.now());
  }, [generateTrial]);

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
        <h3 className="text-xl font-semibold">认知灵活性测试</h3>
        <p className="text-muted-foreground">测试你的注意力控制能力</p>
        <div className="text-sm space-y-2">
          <p>看到彩色文字时，<strong>点击文字的颜色</strong>，而不是文字的意思</p>
          <p>例如：看到 <span style={{color: '#ef4444'}}>蓝色</span> 时，应该点击&ldquo;红色&rdquo;</p>
        </div>
        <button
          onClick={startTest}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          开始测试
        </button>
      </div>
    );
  }

  if (testState === 'playing' && currentTrial) {
    return (
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold">认知灵活性测试 ({currentRound + 1}/8)</h3>
        
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border">
          <p className="text-lg mb-6">这个文字是什么颜色？</p>
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
                className="px-4 py-3 border-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                style={{ borderColor: color.color }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.color }}
                  />
                  <span>{color.key}. {color.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          使用数字键 1-4 或点击按钮
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
        <h3 className="text-xl font-semibold">认知灵活性测试 完成!</h3>
        <div className="space-y-2">
          <p>准确率: {finalScore}%</p>
          <p>平均反应时间: {avgReactionTime}ms</p>
        </div>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
        >
          下一个测试
        </button>
      </div>
    );
  }

  return null;
} 