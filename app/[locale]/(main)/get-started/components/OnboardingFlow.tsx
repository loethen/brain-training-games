'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

// 导入测试组件
import ReactionTimeTest from './tests/ReactionTimeTest';
import MemoryTest from './tests/MemoryTest';
import ProcessingSpeedTest from './tests/ProcessingSpeedTest';
import StroopTest from './tests/StroopTest';
import WordMemoryTest from './tests/WordMemoryTest';

interface AssessmentResults {
  reactionTime: number | null; // 平均反应时间 (ms)
  memoryScore: number | null;  // 记忆得分 (0-100)
  processingSpeed: number | null; // 处理速度得分 (0-100)
  stroopScore: number | null; // Stroop测试得分 (0-100)
  stroopReactionTime: number | null; // Stroop平均反应时间
  wordMemoryScore: number | null; // 词汇记忆得分 (0-100)
  wordsRecalled: number | null; // 回忆的词汇数量
}

type TestType = 'reaction' | 'memory' | 'processing' | 'stroop' | 'wordmemory';

// 根据目标返回相应的测试
const getTestsForGoal = (goal: string): TestType[] => {
  switch (goal) {
    case 'focus':
      return ['reaction', 'processing'];
    case 'memory':
      return ['memory', 'wordmemory'];
    case 'speed':
      return ['reaction', 'stroop'];
    case 'general':
      return ['reaction', 'memory'];
    default:
      return ['reaction', 'processing'];
  }
};

export default function OnboardingFlow() {
  const t = useTranslations('getStarted');
  const tRecommendations = useTranslations('getStarted.gameRecommendations');
  const tAnalysis = useTranslations('getStarted.testAnalysis');
  
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults>({
    reactionTime: null,
    memoryScore: null,
    processingSpeed: null,
    stroopScore: null,
    stroopReactionTime: null,
    wordMemoryScore: null,
    wordsRecalled: null
  });

  const currentTestTypes = useMemo(() => getTestsForGoal(selectedGoal), [selectedGoal]);

  const goalOptions = [
    {
      id: 'focus',
      icon: '🎯',
      title: t('goalSetting.goals.focus.title'),
      subtitle: t('goalSetting.goals.focus.subtitle')
    },
    {
      id: 'memory',
      icon: '🧠',
      title: t('goalSetting.goals.memory.title'),
      subtitle: t('goalSetting.goals.memory.subtitle')
    },
    {
      id: 'speed',
      icon: '⚡',
      title: t('goalSetting.goals.speed.title'),
      subtitle: t('goalSetting.goals.speed.subtitle')
    },
    {
      id: 'general',
      icon: '🔄',
      title: t('goalSetting.goals.general.title'),
      subtitle: t('goalSetting.goals.general.subtitle')
    }
  ];

  // 开始评估
  const startAssessment = useCallback(() => {
    // 追踪开始评估事件
    analytics.assessment.start({
      test_type: `assessment_${selectedGoal}`,
    });
    
    setCurrentTestIndex(0);
    setStep(prev => prev + 1);
  }, [selectedGoal]);

  // 进入下一个测试
  const proceedToNextTest = useCallback(() => {
    setStep(prev => prev + 1);
    if (currentTestIndex < currentTestTypes.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    }
  }, [currentTestIndex, currentTestTypes.length]);

  // 检查是否是最后一个测试并追踪完成事件
  const handleTestCompleteWithTracking = useCallback(() => {
    if (currentTestIndex === currentTestTypes.length - 1) {
      // 追踪评估完成事件
      analytics.assessment.complete({
        test_type: `assessment_${selectedGoal}`,
        recommendations: ['dual-n-back'] // 默认推荐，实际推荐会在渲染时计算
      });
    }
    proceedToNextTest();
  }, [currentTestIndex, currentTestTypes.length, selectedGoal, proceedToNextTest]);

  // 各种测试完成的回调
  const handleReactionTimeComplete = useCallback((avgReactionTime: number) => {
    setAssessmentResults(prev => ({ ...prev, reactionTime: avgReactionTime }));
    handleTestCompleteWithTracking();
  }, [handleTestCompleteWithTracking]);

  const handleMemoryComplete = useCallback((score: number) => {
    setAssessmentResults(prev => ({ ...prev, memoryScore: score }));
    handleTestCompleteWithTracking();
  }, [handleTestCompleteWithTracking]);

  const handleProcessingSpeedComplete = useCallback((score: number) => {
    setAssessmentResults(prev => ({ ...prev, processingSpeed: score }));
    handleTestCompleteWithTracking();
  }, [handleTestCompleteWithTracking]);

  const handleStroopComplete = useCallback((score: number, avgReactionTime: number) => {
    setAssessmentResults(prev => ({ 
      ...prev, 
      stroopScore: score, 
      stroopReactionTime: avgReactionTime 
    }));
    handleTestCompleteWithTracking();
  }, [handleTestCompleteWithTracking]);

  const handleWordMemoryComplete = useCallback((score: number, wordsRecalled: number) => {
    setAssessmentResults(prev => ({ 
      ...prev, 
      wordMemoryScore: score, 
      wordsRecalled: wordsRecalled 
    }));
    handleTestCompleteWithTracking();
  }, [handleTestCompleteWithTracking]);

  // 推荐游戏逻辑
  const getRecommendation = useCallback((goal: string) => {
    const results = assessmentResults;
    
    let recommendation = {
      gameName: tRecommendations('gameNames.dualNBack'),
      gameSlug: "dual-n-back",
      reason: tRecommendations('recommendations.dualNBack'),
      benefits: ["提升工作记忆", "增强注意力"]
    };

    // 根据目标和测试结果推荐
    if (goal === 'focus') {
      if (results.processingSpeed && results.processingSpeed >= 70) {
        recommendation = {
          gameName: tRecommendations('gameNames.stroopEffect'),
          gameSlug: "stroop-effect-test",
          reason: tRecommendations('recommendations.stroopEffect'),
          benefits: ["提升注意力控制", "增强认知灵活性"]
        };
      } else {
        recommendation = {
          gameName: tRecommendations('gameNames.largerNumber'),
          gameSlug: "larger-number",
          reason: tRecommendations('recommendations.largerNumber'),
          benefits: ["提升反应速度", "增强注意力"]
        };
      }
    } else if (goal === 'memory') {
      if (results.memoryScore && results.memoryScore >= 75) {
        recommendation = {
          gameName: tRecommendations('gameNames.dualNBack'),
          gameSlug: "dual-n-back",
          reason: tRecommendations('recommendations.dualNBack'),
          benefits: ["挑战工作记忆极限", "提升多任务处理"]
        };
      } else {
        recommendation = {
          gameName: tRecommendations('gameNames.frogMemoryLeap'),
          gameSlug: "frog-memory-leap",
          reason: tRecommendations('recommendations.frogMemoryLeap'),
          benefits: ["增强序列记忆", "提升专注力"]
        };
      }
    } else if (goal === 'speed') {
      if (results.reactionTime && results.reactionTime <= 350) {
        recommendation = {
          gameName: tRecommendations('gameNames.stroopEffect'),
          gameSlug: "stroop-effect-test",
          reason: tRecommendations('recommendations.stroopEffect'),
          benefits: ["挑战认知速度", "提升冲突处理"]
        };
      } else {
        recommendation = {
          gameName: tRecommendations('gameNames.reactionTime'),
          gameSlug: "reaction-time",
          reason: tRecommendations('recommendations.reactionTime'),
          benefits: ["提升反应速度", "增强敏捷性"]
        };
      }
    } else { // general
      if (results.reactionTime && results.processingSpeed) {
        if (results.reactionTime <= 400 && results.processingSpeed >= 60) {
          recommendation = {
            gameName: tRecommendations('gameNames.dualNBack'),
            gameSlug: "dual-n-back",
            reason: tRecommendations('recommendations.dualNBack'),
            benefits: ["全面提升认知能力", "增强大脑可塑性"]
          };
        } else {
          recommendation = {
            gameName: tRecommendations('gameNames.schulteTable'),
            gameSlug: "schulte-table",
            reason: tRecommendations('recommendations.schulteTable'),
            benefits: ["提升视觉注意力", "增强专注力"]
          };
        }
      }
    }

    return recommendation;
  }, [assessmentResults, tRecommendations]);

  // 渲染步骤进度条 - 动态根据测试数量显示
  const renderStepIndicator = () => {
    // 总步骤数：目标选择(1) + 测试数量 + 推荐(1)
    const totalSteps = 1 + currentTestTypes.length + 1;
    const stepIndexes = Array.from({ length: totalSteps }, (_, i) => i);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {stepIndexes.map((stepIndex) => (
          <div key={stepIndex} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                stepIndex < step
                  ? "bg-green-500 text-white"
                  : stepIndex === step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {stepIndex < step ? (
                <Check size={16} />
              ) : stepIndex === step ? (
                <div className="w-3 h-3 bg-white rounded-full" />
              ) : (
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              )}
            </div>
            {stepIndex < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 transition-all ${
                  stepIndex < step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染评估测试内容
  const renderAssessmentContent = () => {
    if (currentTestTypes.length === 0 || currentTestIndex >= currentTestTypes.length) {
      return null;
    }

    const currentTestType = currentTestTypes[currentTestIndex];
    
    switch (currentTestType) {
      case 'reaction':
        return <ReactionTimeTest onComplete={handleReactionTimeComplete} />;
      case 'memory':
        return <MemoryTest onComplete={handleMemoryComplete} />;
      case 'processing':
        return <ProcessingSpeedTest onComplete={handleProcessingSpeedComplete} />;
      case 'stroop':
        return <StroopTest onComplete={handleStroopComplete} />;
      case 'wordmemory':
        return <WordMemoryTest onComplete={handleWordMemoryComplete} />;
      default:
        return null;
    }
  };

  // 生成简化的分析文本
  const generateSimplifiedAnalysis = () => {
    const results = assessmentResults;
    const testNames = [];
    const performances = [];
    
    // 分析各项测试表现
    if (results.reactionTime) {
      testNames.push(tAnalysis('testNames.reactionSpeed'));
      if (results.reactionTime <= 350) {
        performances.push(tAnalysis('performances.reactionFast'));
      } else if (results.reactionTime > 500) {
        performances.push(tAnalysis('performances.reactionSlow'));
      } else {
        performances.push(tAnalysis('performances.reactionNormal'));
      }
    }
    
    if (results.processingSpeed) {
      testNames.push(tAnalysis('testNames.numberComparison'));
      if (results.processingSpeed >= 70) {
        performances.push(tAnalysis('performances.processingGood'));
      } else if (results.processingSpeed < 50) {
        performances.push(tAnalysis('performances.processingPoor'));
      } else {
        performances.push(tAnalysis('performances.processingAverage'));
      }
    }
    
    if (results.memoryScore) {
      testNames.push(tAnalysis('testNames.sequenceMemory'));
      if (results.memoryScore >= 75) {
        performances.push(tAnalysis('performances.memoryStrong'));
      } else if (results.memoryScore < 50) {
        performances.push(tAnalysis('performances.memoryWeak'));
      } else {
        performances.push(tAnalysis('performances.memoryAverage'));
      }
    }
    
    if (results.stroopScore) {
      testNames.push(tAnalysis('testNames.attentionControl'));
      if (results.stroopScore >= 75) {
        performances.push(tAnalysis('performances.attentionExcellent'));
      } else if (results.stroopScore < 60) {
        performances.push(tAnalysis('performances.attentionPoor'));
      } else {
        performances.push(tAnalysis('performances.attentionAverage'));
      }
    }
    
    if (results.wordMemoryScore) {
      testNames.push(tAnalysis('testNames.wordMemory'));
      if (results.wordMemoryScore >= 75) {
        performances.push(tAnalysis('performances.wordMemoryStrong'));
      } else if (results.wordMemoryScore < 50) {
        performances.push(tAnalysis('performances.wordMemoryWeak'));
      } else {
        performances.push(tAnalysis('performances.wordMemoryAverage'));
      }
    }
    
    // 生成口语化的分析
    let analysisText = tRecommendations('analysisIntro');
    if (performances.length >= 2) {
      analysisText += `${performances[0]}，${performances[1]}。`;
    } else if (performances.length === 1) {
      analysisText += `${performances[0]}。`;
    }
    
    return analysisText;
  };

  // 动态生成步骤内容
  const getStepContent = (stepIndex: number) => {
    if (stepIndex === 0) {
      // 目标选择步骤
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t('goalSetting.title')}</h2>
          <p className="mb-6 text-muted-foreground">{t('goalSetting.subtitle')}</p>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {goalOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md relative ${
                  selectedGoal === option.id
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md transform scale-[1.02]"
                    : "border-border hover:border-green-300"
                }`}
                onClick={() => setSelectedGoal(option.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-lg">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                  </div>
                  {selectedGoal === option.id && (
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (stepIndex > 0 && stepIndex <= currentTestTypes.length) {
      // 测试步骤 - 直接显示测试内容，不需要标题和描述
      return renderAssessmentContent();
    } else {
      // 推荐步骤 - 简化版本
      const recommendation = getRecommendation(selectedGoal);
      const analysisText = generateSimplifiedAnalysis();

      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{tRecommendations('testComplete')}</h2>
            <p className="text-muted-foreground">{tRecommendations('personalizedRecommendation')}</p>
          </div>

          {/* 简化的分析和推荐 */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <div className="text-center space-y-4">
              {/* 口语化分析 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysisText}
                </p>
              </div>
              
              {/* 推荐游戏 */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{tRecommendations('recommendStart')}</h3>
                <div className="text-3xl font-bold text-blue-600">{recommendation.gameName}</div>
                <p className="text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
              </div>
            </div>
          </div>

          {/* 开始训练按钮 */}
          <div className="text-center">
            <Link href={`/games/${recommendation.gameSlug}`}>
              <button 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                onClick={() => {
                  // 追踪推荐游戏点击事件
                  analytics.navigation.recommendation({
                    from_page: 'get-started',
                    to_page: `games/${recommendation.gameSlug}`,
                    source: 'assessment_recommendation',
                    game_to: recommendation.gameSlug
                  });
                }}
              >
                {tRecommendations('startTraining')}
                <ArrowRight size={18} />
              </button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">{tRecommendations('basedOnResults')}</p>
          </div>
        </div>
      );
    }
  };



  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      {/* 步骤进度指示器 */}
      {renderStepIndicator()}
      
      <div className="w-full max-w-2xl p-6 bg-background/80 rounded-2xl shadow">
        <div className="mb-6">
          {getStepContent(step)}
        </div>
        
        {/* 只在目标选择阶段显示开始测试按钮 */}
        {step === 0 && (
          <div className="flex justify-center">
            <button
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
              onClick={startAssessment}
              disabled={!selectedGoal}
            >
              {t('buttons.startAssessment')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 