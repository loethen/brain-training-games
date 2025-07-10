'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    setCurrentTestIndex(0);
    setStep(prev => prev + 1);
  }, []);

  // 进入下一个测试
  const proceedToNextTest = useCallback(() => {
    setStep(prev => prev + 1);
    if (currentTestIndex < currentTestTypes.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    }
  }, [currentTestIndex, currentTestTypes.length]);

  // 各种测试完成的回调
  const handleReactionTimeComplete = useCallback((avgReactionTime: number) => {
    setAssessmentResults(prev => ({ ...prev, reactionTime: avgReactionTime }));
    proceedToNextTest();
  }, [proceedToNextTest]);

  const handleMemoryComplete = useCallback((score: number) => {
    setAssessmentResults(prev => ({ ...prev, memoryScore: score }));
    proceedToNextTest();
  }, [proceedToNextTest]);

  const handleProcessingSpeedComplete = useCallback((score: number) => {
    setAssessmentResults(prev => ({ ...prev, processingSpeed: score }));
    proceedToNextTest();
  }, [proceedToNextTest]);

  const handleStroopComplete = useCallback((score: number, avgReactionTime: number) => {
    setAssessmentResults(prev => ({ 
      ...prev, 
      stroopScore: score, 
      stroopReactionTime: avgReactionTime 
    }));
    proceedToNextTest();
  }, [proceedToNextTest]);

  const handleWordMemoryComplete = useCallback((score: number, wordsRecalled: number) => {
    setAssessmentResults(prev => ({ 
      ...prev, 
      wordMemoryScore: score, 
      wordsRecalled: wordsRecalled 
    }));
    proceedToNextTest();
  }, [proceedToNextTest]);

  // 推荐游戏逻辑
  const getRecommendation = useCallback((goal: string) => {
    const results = assessmentResults;
    
    let recommendation = {
      gameName: "双N-back训练",
      gameSlug: "dual-n-back",
      reason: "基于你的测试表现，这个游戏最适合提升你的认知能力。",
      benefits: ["提升工作记忆", "增强注意力"]
    };

    // 根据目标和测试结果推荐
    if (goal === 'focus') {
      if (results.processingSpeed && results.processingSpeed >= 70) {
        recommendation = {
          gameName: "Stroop效应测试",
          gameSlug: "stroop-effect-test",
          reason: "你的处理速度不错！",
          benefits: ["提升注意力控制", "增强认知灵活性"]
        };
      } else {
        recommendation = {
          gameName: "数字大小比较",
          gameSlug: "larger-number",
          reason: "建议从基础的处理速度训练开始。",
          benefits: ["提升反应速度", "增强注意力"]
        };
      }
    } else if (goal === 'memory') {
      if (results.memoryScore && results.memoryScore >= 75) {
        recommendation = {
          gameName: "双N-back训练",
          gameSlug: "dual-n-back",
          reason: "你的记忆力很好！",
          benefits: ["挑战工作记忆极限", "提升多任务处理"]
        };
      } else {
        recommendation = {
          gameName: "青蛙记忆跳跃",
          gameSlug: "frog-memory-leap",
          reason: "建议从趣味记忆游戏开始训练。",
          benefits: ["增强序列记忆", "提升专注力"]
        };
      }
    } else if (goal === 'speed') {
      if (results.reactionTime && results.reactionTime <= 350) {
        recommendation = {
          gameName: "Stroop效应测试",
          gameSlug: "stroop-effect-test",
          reason: "你的反应很快！",
          benefits: ["挑战认知速度", "提升冲突处理"]
        };
      } else {
        recommendation = {
          gameName: "反应时间训练",
          gameSlug: "reaction-time",
          reason: "建议从基础反应训练开始。",
          benefits: ["提升反应速度", "增强敏捷性"]
        };
      }
    } else { // general
      if (results.reactionTime && results.processingSpeed) {
        if (results.reactionTime <= 400 && results.processingSpeed >= 60) {
          recommendation = {
            gameName: "双N-back训练",
            gameSlug: "dual-n-back",
            reason: "你的基础能力不错！",
            benefits: ["全面提升认知能力", "增强大脑可塑性"]
          };
        } else {
          recommendation = {
            gameName: "舒尔特方格",
            gameSlug: "schulte-table",
            reason: "建议从注意力基础训练开始。",
            benefits: ["提升视觉注意力", "增强专注力"]
          };
        }
      }
    }

    return recommendation;
  }, [assessmentResults]);

  // 渲染步骤进度条 - 动态根据测试数量显示
  const renderStepIndicator = () => {
    // 总步骤数：目标选择(1) + 测试数量 + 推荐(1)
    const totalSteps = 1 + currentTestTypes.length + 1;
    const stepIndexes = Array.from({ length: totalSteps }, (_, i) => i);
    
    return (
      <div className="flex items-center justify-center gap-3 mb-8">
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
      testNames.push("反应速度测试");
      if (results.reactionTime <= 350) {
        performances.push("你的反应很快");
      } else if (results.reactionTime > 500) {
        performances.push("反应速度有提升空间");
      } else {
        performances.push("反应速度表现正常");
      }
    }
    
    if (results.processingSpeed) {
      testNames.push("数字比较测试");
      if (results.processingSpeed >= 70) {
        performances.push("处理速度很不错");
      } else if (results.processingSpeed < 50) {
        performances.push("处理速度需要加强");
      } else {
        performances.push("处理速度表现一般");
      }
    }
    
    if (results.memoryScore) {
      testNames.push("序列记忆测试");
      if (results.memoryScore >= 75) {
        performances.push("记忆力很强");
      } else if (results.memoryScore < 50) {
        performances.push("记忆力有待提升");
      } else {
        performances.push("记忆力表现中等");
      }
    }
    
    if (results.stroopScore) {
      testNames.push("注意力控制测试");
      if (results.stroopScore >= 75) {
        performances.push("注意力控制能力优秀");
      } else if (results.stroopScore < 60) {
        performances.push("注意力控制需要练习");
      } else {
        performances.push("注意力控制表现中等");
      }
    }
    
    if (results.wordMemoryScore) {
      testNames.push("词汇记忆测试");
      if (results.wordMemoryScore >= 75) {
        performances.push("词汇记忆能力很强");
      } else if (results.wordMemoryScore < 50) {
        performances.push("词汇记忆需要训练");
      } else {
        performances.push("词汇记忆表现中等");
      }
    }
    
    // 生成口语化的分析
    let analysisText = "通过刚才的测试，";
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
      const selectedOption = goalOptions.find(g => g.id === selectedGoal);
      
      if (!recommendation || !selectedOption) {
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t('recommendation.title')}</h2>
            <p>请先完成前面的步骤。</p>
          </div>
        );
      }

      const analysisText = generateSimplifiedAnalysis();

      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">测试完成！</h2>
            <p className="text-muted-foreground">为你推荐最适合的训练游戏</p>
          </div>

          {/* 简化的分析和推荐 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="text-center space-y-4">
              {/* 口语化分析 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysisText}
                </p>
              </div>
              
              {/* 推荐游戏 */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">推荐你可以先从</h3>
                <div className="text-3xl font-bold text-blue-600">{recommendation.gameName}</div>
                <p className="text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
              </div>
            </div>
          </div>

          {/* 开始训练按钮 */}
          <div className="text-center">
            <Link href={`/games/${recommendation.gameSlug}`}>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                开始训练
                <ArrowRight size={18} />
              </button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">基于你的测试结果定制</p>
          </div>
        </div>
      );
    }
  };

  // 判断是否在测试阶段（不显示导航按钮）
  const isInTestPhase = step > 0 && step <= currentTestTypes.length;
  // 判断是否在最后一步（推荐阶段）
  const isInRecommendationPhase = step > currentTestTypes.length;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      {/* 步骤进度指示器 */}
      {renderStepIndicator()}
      
      <div className="w-full max-w-2xl p-6 bg-background/80 rounded-2xl shadow">
        <div className="mb-6">
          {getStepContent(step)}
        </div>
        
        {/* 只在非测试阶段和非推荐阶段显示导航按钮 */}
        {!isInTestPhase && !isInRecommendationPhase && (
          <div className="flex justify-between">
            <button
              className="px-4 py-2 rounded bg-muted text-foreground disabled:opacity-50"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              {t('buttons.previous')}
            </button>
            <button
              className="px-4 py-2 rounded bg-primary text-white font-semibold disabled:opacity-50"
              onClick={() => {
                if (step === 0) {
                  startAssessment();
                }
              }}
              disabled={step === 0 && !selectedGoal}
            >
              {step === 0 ? t('buttons.startAssessment') : t('buttons.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 