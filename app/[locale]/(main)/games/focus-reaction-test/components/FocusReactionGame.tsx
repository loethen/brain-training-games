'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { RotateCcw, Play, ChevronLeft, ChevronRight, Minus, Brain, Share2 } from "lucide-react";
import { useTranslations } from 'next-intl';
import { ShareModal } from '@/components/ui/ShareModal';
import { motion, AnimatePresence } from "framer-motion";
import { 
  GameState,
  Trial,
  GameResult,
  generateTrials,
  calculateStats,
  GAME_CONFIG
} from '../config';

// Arrow component using consistent styling
const ArrowIcon = ({ direction }: { direction: 'left' | 'right' | 'neutral' }) => {
  // All arrows use same color - no highlighting for target
  const iconClass = `w-8 h-8 text-foreground`;
  
  if (direction === 'left') {
    return <ChevronLeft className={iconClass} />;
  } else if (direction === 'right') {
    return <ChevronRight className={iconClass} />;
  } else {
    return <Minus className={iconClass} />;
  }
};

export default function FocusReactionGame() {
  const t = useTranslations('games.focusReactionTest.gameUI');
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [countdown, setCountdown] = useState<number>(GAME_CONFIG.COUNTDOWN_DURATION);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [trialStartTime, setTrialStartTime] = useState<number | null>(null);
  const [showingFixation, setShowingFixation] = useState<boolean>(false);
  const [feedbackResult, setFeedbackResult] = useState<{ correct: boolean; visible: boolean }>({ correct: false, visible: false });
  const [isProcessingResponse, setIsProcessingResponse] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  
  // Refs
  const gameRef = useRef<HTMLDivElement>(null);
  
  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('focusReactionBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Focus the game container for keyboard input
  useEffect(() => {
    if (gameRef.current && gameState === GameState.PLAYING) {
      gameRef.current.focus();
    }
  }, [gameState]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== GameState.PLAYING || isProcessingResponse || !trialStartTime) return;
    
    let response: 'left' | 'right' | null = null;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      response = 'left';
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      response = 'right';
    }
    
    if (response) {
      e.preventDefault();
      // Direct call to avoid circular dependency
      if (!trialStartTime || !trials[currentTrialIndex] || isProcessingResponse) return;
      
      setIsProcessingResponse(true);
      
      const currentTrial = trials[currentTrialIndex];
      const responseTime = Date.now() - trialStartTime;
      const isCorrect = response === currentTrial.correctResponse;
      
      console.log('Keyboard - Trial:', currentTrial);
      console.log('Keyboard - Response:', response, 'Correct:', currentTrial.correctResponse, 'IsCorrect:', isCorrect);
      
      const result: GameResult = {
        trial: { ...currentTrial, response, responseTime, isCorrect },
        reactionTime: responseTime,
        accuracy: isCorrect
      };
      
      const newResults = [...results, result];
      setResults(newResults);
      setTrialStartTime(null);
      setFeedbackResult({ correct: isCorrect, visible: true });
      
      setTimeout(() => {
        setFeedbackResult({ correct: false, visible: false });
        setIsProcessingResponse(false);
        
        if (currentTrialIndex + 1 >= trials.length) {
          const stats = calculateStats(newResults);
          if (stats && stats.accuracy > (bestScore || 0)) {
            setBestScore(stats.accuracy);
            localStorage.setItem('focusReactionBestScore', stats.accuracy.toString());
            toast.success(t('newBestScore'));
          }
          setGameState(GameState.RESULTS);
        } else {
          setCurrentTrialIndex(prev => prev + 1);
          // Start next trial
          setShowingFixation(false);
          setFeedbackResult({ correct: false, visible: false });
          setTrialStartTime(Date.now());
        }
      }, GAME_CONFIG.FEEDBACK_DURATION);
    }
  }, [gameState, isProcessingResponse, trialStartTime, trials, currentTrialIndex, results, bestScore, t]);

  // Add keyboard event listener
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState, handleKeyDown]);

  const handleResponse = useCallback((response: 'left' | 'right') => {
    if (!trialStartTime || !trials[currentTrialIndex] || isProcessingResponse) return;
    
    setIsProcessingResponse(true);
    
    const currentTrial = trials[currentTrialIndex];
    const responseTime = Date.now() - trialStartTime;
    const isCorrect = response === currentTrial.correctResponse;
    
    // Debug logging
    console.log('Trial:', currentTrial);
    console.log('Response:', response, 'Correct:', currentTrial.correctResponse, 'IsCorrect:', isCorrect);
    
    // Create result
    const result: GameResult = {
      trial: { ...currentTrial, response, responseTime, isCorrect },
      reactionTime: responseTime,
      accuracy: isCorrect
    };
    
    const newResults = [...results, result];
    setResults(newResults);
    
    // Clear trial state
    setTrialStartTime(null);
    
    // Show feedback
    setFeedbackResult({ correct: isCorrect, visible: true });
    
    setTimeout(() => {
      setFeedbackResult({ correct: false, visible: false });
      setIsProcessingResponse(false);
      
      if (currentTrialIndex + 1 >= trials.length) {
        // Game finished
        const stats = calculateStats(newResults);
        if (stats && stats.accuracy > (bestScore || 0)) {
          setBestScore(stats.accuracy);
          localStorage.setItem('focusReactionBestScore', stats.accuracy.toString());
          toast.success(t('newBestScore'));
        }
        setGameState(GameState.RESULTS);
      } else {
        // Next trial
        setCurrentTrialIndex(prev => prev + 1);
        startTrial();
      }
    }, GAME_CONFIG.FEEDBACK_DURATION);
  }, [trials, currentTrialIndex, results, trialStartTime, isProcessingResponse, bestScore, t]);

  const startTrial = useCallback(() => {
    setShowingFixation(false);
    setFeedbackResult({ correct: false, visible: false });
    setTrialStartTime(Date.now());
  }, []);

  const startGame = useCallback(() => {
    const newTrials = generateTrials();
    setTrials(newTrials);
    setCurrentTrialIndex(0);
    setResults([]);
    setGameState(GameState.COUNTDOWN);
    setFeedbackResult({ correct: false, visible: false });
    
    // Countdown
    let count = GAME_CONFIG.COUNTDOWN_DURATION;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        setGameState(GameState.PLAYING);
        startTrial();
      }
    }, 1000);
  }, [startTrial]);

  const shareScore = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameState.START);
    setTrials([]);
    setCurrentTrialIndex(0);
    setResults([]);
    setTrialStartTime(null);
    setShowingFixation(false);
    setFeedbackResult({ correct: false, visible: false });
    setIsProcessingResponse(false);
    setCountdown(GAME_CONFIG.COUNTDOWN_DURATION);
  }, []);


  const progress = trials.length > 0 ? ((currentTrialIndex + 1) / trials.length) * 100 : 0;
  const stats = calculateStats(results);
  const currentTrial = trials[currentTrialIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="w-full">
        <div className="p-8">
          {/* START STATE */}
          {gameState === GameState.START && (
            <div className="text-center space-y-6">
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold">{t('title')}</h2>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    {t('instructions')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">游戏规则</h3>
                    <p className="text-sm text-muted-foreground mb-4">专注中间箭头的方向，忽略两侧干扰</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <ArrowIcon direction="right" />
                        <ArrowIcon direction="right" />
                        <ArrowIcon direction="left" />
                        <ArrowIcon direction="right" />
                        <ArrowIcon direction="right" />
                      </div>
                      <div className="text-xs text-muted-foreground">中间箭头指向左，选择左</div>
                    </div>
                  </div>
                </div>
                
                {bestScore && (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-sm text-green-700 dark:text-green-300">
                      🏆 {t('bestScore')}: <span className="font-semibold">{bestScore}%</span>
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={startGame} size="lg" className="px-8">
                <Play className="w-5 h-5 mr-2" />
                {t('startGame')}
              </Button>
            </div>
          )}

          {/* COUNTDOWN STATE */}
          {gameState === GameState.COUNTDOWN && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">{t('getReady')}</h2>
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-bold text-primary"
              >
                {countdown}
              </motion.div>
            </div>
          )}

          {/* PLAYING STATE */}
          {gameState === GameState.PLAYING && (
            <div className="space-y-6 outline-none" ref={gameRef} tabIndex={0}>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {t('trial')} {currentTrialIndex + 1} / {trials.length}
                </div>
                <Progress value={progress} className="w-48" />
              </div>
              
              <div className="text-center py-16 relative">
                {/* Feedback display above arrows */}
                {feedbackResult.visible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className={`text-3xl font-bold ${
                      feedbackResult.correct ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {feedbackResult.correct ? '✓' : '✗'}
                    </div>
                  </motion.div>
                )}
                
                {currentTrial ? (
                  <div className="flex items-center justify-center gap-2">
                    {currentTrial.stimuli.map((direction, index) => (
                      <ArrowIcon 
                        key={`${currentTrial.id}-${index}`}
                        direction={direction}
                      />
                    ))}
                  </div>
                ) : null}
                
                <div className="mt-8 text-sm text-muted-foreground">
                  专注中间箭头的方向
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleResponse('left')}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={isProcessingResponse || !trialStartTime}
                >
                  <ChevronLeft className="w-5 h-5" />
                  {t('left')}
                </Button>
                <Button
                  onClick={() => handleResponse('right')}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={isProcessingResponse || !trialStartTime}
                >
                  {t('right')}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* RESULTS STATE */}
          {gameState === GameState.RESULTS && stats && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <div className="text-2xl">🎯</div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">测试完成！</h2>
                <p className="text-gray-600 dark:text-gray-400">以下是您的认知能力评估报告</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      <div className="text-2xl mb-1">🎯</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      stats.accuracy >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      stats.accuracy >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stats.accuracy >= 90 ? '优秀' : stats.accuracy >= 75 ? '良好' : '待提升'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">{stats.accuracy}%</div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">准确率</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                    {stats.accuracy >= 90 ? "注意力集中度很高" :
                     stats.accuracy >= 75 ? "控制能力不错" : "需要更多练习"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-purple-600 dark:text-purple-400">
                      <div className="text-2xl mb-1">⚡</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      stats.avgReactionTime <= 400 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      stats.avgReactionTime <= 600 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stats.avgReactionTime <= 400 ? '很快' : stats.avgReactionTime <= 600 ? '正常' : '较慢'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">{stats.avgReactionTime}ms</div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">平均反应时</div>
                  <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
                    {stats.avgReactionTime <= 400 ? "信息处理速度很高" :
                     stats.avgReactionTime <= 600 ? "处理速度正常" : "可以进一步提升"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/30 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      <div className="text-2xl mb-1">🛡️</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      stats.flankerEffect <= 30 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      stats.flankerEffect <= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stats.flankerEffect <= 30 ? '优秀' : stats.flankerEffect <= 60 ? '良好' : '待提升'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">{stats.flankerEffect}ms</div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">侧翼效应</div>
                  <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    {stats.flankerEffect <= 30 ? "抗干扰能力优秀" :
                     stats.flankerEffect <= 60 ? "抗干扰能力良好" : "容易受干扰影响"}
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">认知能力评估</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">基于Eriksen Flanker Task的科学分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/60 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      详细分析
                    </h4>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p>
                        <strong className="text-gray-800 dark:text-gray-200">准确率 {stats.accuracy}%</strong>: {
                          stats.accuracy >= 90 ? "优秀！您的注意力集中度很高，能够有效忽略干扰信息。" :
                          stats.accuracy >= 75 ? "良好。您的注意力控制能力不错，还有提升空间。" :
                          "需要改进。建议多练习提高注意力集中度。"
                        }
                      </p>
                      <p>
                        <strong className="text-gray-800 dark:text-gray-200">平均反应时 {stats.avgReactionTime}ms</strong>: {
                          stats.avgReactionTime <= 400 ? "反应很快！您的信息处理速度很高。" :
                          stats.avgReactionTime <= 600 ? "反应速度正常，符合一般水平。" :
                          "反应较慢，可能需要更多练习来提高处理速度。"
                        }
                      </p>
                      <p>
                        <strong className="text-gray-800 dark:text-gray-200">侧翼效应 {stats.flankerEffect}ms</strong>: {
                          stats.flankerEffect <= 30 ? "抗干扰能力优秀！您能很好地抑制无关信息的影响。" :
                          stats.flankerEffect <= 60 ? "抗干扰能力良好，但仍会受到一些冲突信息的影响。" :
                          "容易受到干扰信息影响，建议训练提高选择性注意力。"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      综合评估
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      此测试评估您的<strong className="text-gray-800 dark:text-gray-200">执行注意力</strong>和<strong className="text-gray-800 dark:text-gray-200">认知控制</strong>能力。
                      {stats.accuracy >= 85 && stats.flankerEffect <= 40 
                        ? "您表现出色，具有很强的认知灵活性和注意力控制能力，适合需要高度专注的工作。"
                        : stats.accuracy >= 70 && stats.flankerEffect <= 70
                        ? "您的认知控制能力处于正常水平，通过练习可以进一步提升专注力。"
                        : "建议通过注意力训练和冥想等方式提高认知控制能力。"
                      }
                    </p>
                  </div>

                  <div className="bg-white/60 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      实际应用
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      执行注意力在日常生活中非常重要，影响学习效率、工作表现和驾驶安全。良好的执行注意力有助于在嘈杂环境中保持专注，快速切换任务，并抵抗干扰信息的影响。
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button
                  onClick={shareScore}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  分享结果
                </Button>
                <Button 
                  onClick={resetGame} 
                  size="lg"
                  className="flex items-center gap-3 px-6 py-3"
                >
                  <RotateCcw className="w-5 h-5" />
                  再次测试
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={t('title')}
        shareText={stats ? `我在专注反应测试中获得了 ${stats.accuracy}% 的准确率！平均反应时间 ${stats.avgReactionTime}ms，侧翼效应 ${stats.flankerEffect}ms。` : ''}
      />
    </div>
  );
}