'use client';

import React, { useState, useCallback } from 'react';
import { Check, Clock, Brain, CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WordMemoryTestProps {
  onComplete: (memoryScore: number, wordsRecalled: number) => void;
}

export default function WordMemoryTest({ onComplete }: WordMemoryTestProps) {
  const t = useTranslations('getStarted.wordMemoryTest');
  
  // 从翻译中获取词汇库
  const WORD_BANK = t.raw('wordBank') as string[];
  const [testState, setTestState] = useState<'instruction' | 'presentation' | 'recall' | 'completed'>('instruction');
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(Array(6).fill(''));
  const [finalScore, setFinalScore] = useState(0);
  const [wordsRecalled, setWordsRecalled] = useState(0);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [missedWords, setMissedWords] = useState<string[]>([]);

  // 生成随机词汇
  const generateWords = useCallback(() => {
    const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
    setCurrentWords(shuffled.slice(0, 6)); // 只显示6个词
  }, []);

  const startTest = useCallback(() => {
    generateWords();
    setTestState('presentation');
    setTimeout(() => {
      setTestState('recall');
    }, 8000); // 8秒记忆时间
  }, [generateWords]);

  const updateUserInput = useCallback((index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  }, [userInputs]);

  const submitRecall = useCallback(() => {
    const userWords = userInputs
      .map(input => input.trim())
      .filter(word => word.length > 0);

    const correctWordsFound = currentWords.filter(word => 
      userWords.some(userWord => 
        userWord === word || word.includes(userWord) || userWord.includes(word)
      )
    );

    const missedWordsFound = currentWords.filter(word => 
      !userWords.some(userWord => 
        userWord === word || word.includes(userWord) || userWord.includes(word)
      )
    );

    const score = Math.round((correctWordsFound.length / currentWords.length) * 100);
    
    setFinalScore(score);
    setWordsRecalled(correctWordsFound.length);
    setCorrectWords(correctWordsFound);
    setMissedWords(missedWordsFound);
    setTestState('completed');
  }, [userInputs, currentWords]);

  const handleComplete = useCallback(() => {
    onComplete(finalScore, wordsRecalled);
  }, [finalScore, wordsRecalled, onComplete]);

  if (testState === 'instruction') {
    return (
      <div className="text-center space-y-8">
        {/* 测试图标和标题 */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        {/* 测试说明卡片 */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">{t('testFlow')}</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">1</div>
              <span className="text-gray-700 dark:text-gray-300">{t('step1')}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">2</div>
              <span className="text-gray-700 dark:text-gray-300">
                <Clock className="inline w-4 h-4 mr-1" />
                {t('step2')}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">3</div>
              <span className="text-gray-700 dark:text-gray-300">{t('step3')}</span>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={startTest}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          {t('startButton')}
        </button>
      </div>
    );
  }

  if (testState === 'presentation') {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('rememberWords')}</h3>
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{t('memoryTime')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {currentWords.map((word, index) => (
            <div
              key={index}
              className="p-4 bg-blue-50 dark:bg-blue-950 rounded-xl text-center font-medium border border-blue-200 dark:border-blue-800 shadow-sm"
            >
              <span className="text-lg font-semibold">{word}</span>
            </div>
          ))}
        </div>
        
        <div className="text-lg font-semibold text-blue-600 animate-pulse">
          {t('rememberCarefully')}
        </div>
      </div>
    );
  }

  if (testState === 'recall') {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">{t('recallTest')}</h3>
          <p className="text-muted-foreground">{t('enterWords')}</p>
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {t('hint')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {userInputs.map((input, index) => (
            <input
              key={index}
              type="text"
              value={input}
              onChange={(e) => updateUserInput(index, e.target.value)}
              placeholder={`${t('wordPlaceholder')} ${index + 1}`}
              className="px-3 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center focus:border-blue-500 focus:outline-none transition-colors"
            />
          ))}
        </div>
        
        <button
          onClick={submitRecall}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
        >
          {t('submitAnswer')}
        </button>
      </div>
    );
  }

  if (testState === 'completed') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold">{t('testComplete')}</h3>
        
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
          <div className="text-2xl font-bold text-green-600">{finalScore}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('accuracy')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('wordsRecalled')}: {wordsRecalled}/6</p>
        </div>

        {/* 详细结果展示 */}
        <div className="space-y-4">
          {/* 正确的词汇 */}
          {correctWords.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">
                  {t('correctWords')} ({correctWords.length}{t('word')})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {correctWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 遗漏的词汇 */}
          {missedWords.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  {t('missedWords')} ({missedWords.length}{t('word')})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missedWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
        >
          {t('continueNext')}
        </button>
      </div>
    );
  }

  return null;
} 