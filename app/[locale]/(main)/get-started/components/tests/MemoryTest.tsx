'use client';

import React, { useState, useCallback } from 'react';
import { Check, Brain, Grid3X3, Eye, Hand } from 'lucide-react';

interface MemoryTestProps {
  onComplete: (memoryScore: number) => void;
}

export default function MemoryTest({ onComplete }: MemoryTestProps) {
  const [testState, setTestState] = useState<'instruction' | 'playing' | 'completed'>('instruction');
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [score, setScore] = useState<number>(0);

  const startMemoryTest = useCallback(() => {
    setTestState('playing');
    const sequence = Array.from({length: 6}, () => Math.floor(Math.random() * 9));
    setMemorySequence(sequence);
    setUserSequence([]);
    setShowingSequence(true);
    setSequenceIndex(0);
    
    // 显示序列
    const showSequence = async () => {
      for (let i = 0; i < sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setSequenceIndex(i);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      setShowingSequence(false);
    };
    
    showSequence();
  }, []);

  const handleMemoryClick = useCallback((blockId: number) => {
    if (showingSequence) return;
    
    const newSequence = [...userSequence, blockId];
    setUserSequence(newSequence);
    
    if (newSequence.length === memorySequence.length) {
      // 计算得分
      const correct = newSequence.filter((num, idx) => num === memorySequence[idx]).length;
      const finalScore = Math.round((correct / memorySequence.length) * 100);
      setScore(finalScore);
      setTestState('completed');
    }
  }, [showingSequence, userSequence, memorySequence]);

  const handleComplete = useCallback(() => {
    onComplete(score);
  }, [score, onComplete]);

  if (testState === 'instruction') {
    return (
      <div className="text-center space-y-8">
        {/* 测试图标和标题 */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">序列记忆测试</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">测试你的工作记忆</p>
        </div>

        {/* 测试说明卡片 */}
        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">测试流程</h4>
          
          <div className="space-y-3">
                         <div className="flex items-center gap-3 text-sm">
               <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">1</div>
               <span className="text-gray-700 dark:text-gray-300">
                 <Eye className="inline w-4 h-4 mr-1" />
                 观察 <span className="font-semibold text-purple-600">6个方块</span> 的亮起顺序
               </span>
             </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">2</div>
              <span className="text-gray-700 dark:text-gray-300">
                <Grid3X3 className="inline w-4 h-4 mr-1" />
                记住方块在 <span className="font-semibold text-orange-600">3×3网格</span> 中的位置
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">3</div>
              <span className="text-gray-700 dark:text-gray-300">
                <Hand className="inline w-4 h-4 mr-1" />
                按照相同顺序点击方块
              </span>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={startMemoryTest}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          开始测试
        </button>
      </div>
    );
  }

  if (testState === 'playing') {
    return (
      <div className="text-center space-y-8">
        {/* 状态指示器 */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">序列记忆测试</h3>
          <div className="flex items-center justify-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              showingSequence 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Eye className="inline w-4 h-4 mr-1" />
              观察阶段
            </div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              !showingSequence 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Hand className="inline w-4 h-4 mr-1" />
              回忆阶段
            </div>
          </div>
        </div>

        {/* 3x3 网格 */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            {Array.from({length: 9}, (_, i) => (
              <div
                key={i}
                className={`w-16 h-16 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center font-bold text-lg ${
                  showingSequence && sequenceIndex < memorySequence.length && memorySequence[sequenceIndex] === i
                    ? 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg'
                    : userSequence.includes(i)
                    ? 'bg-green-400 border-green-500 text-white scale-105'
                    : showingSequence
                    ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-400 text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => handleMemoryClick(i)}
              >
                {userSequence.includes(i) ? userSequence.indexOf(i) + 1 : ''}
              </div>
            ))}
          </div>
        </div>

        {/* 进度和提示 */}
        <div className="space-y-2">
          {showingSequence ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-blue-600 animate-pulse">记住方块亮起的顺序...</p>
                             <div className="flex justify-center gap-1">
                 {Array.from({length: 6}, (_, i) => (
                   <div
                     key={i}
                     className={`w-2 h-2 rounded-full transition-all ${
                       i <= sequenceIndex ? 'bg-blue-500' : 'bg-gray-300'
                     }`}
                   />
                 ))}
               </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-green-600">按照顺序点击方块</p>
              <p className="text-sm text-gray-500">
                进度: {userSequence.length}/{memorySequence.length}
              </p>
            </div>
          )}
        </div>
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
        
        <h3 className="text-xl font-semibold">序列记忆测试完成!</h3>
        
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
          <div className="text-2xl font-bold text-green-600">{score}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">记忆准确度</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            正确回忆: {Math.round(score / 100 * 6)}/6 个位置
          </p>
        </div>

        {/* 表现评价 */}
        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            {score >= 75 ? 
              "🎉 优秀！你的工作记忆能力很强" : 
              score >= 50 ? 
              "👍 不错！继续练习可以提升更多" : 
              "💪 继续努力！工作记忆是可以训练的"
            }
          </p>
        </div>
        
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
        >
          继续下一步
        </button>
      </div>
    );
  }

  return null;
} 