'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

// WHO Adult ADHD Self-Report Scale (ASRS-v1.1) questions
const ASRS_QUESTIONS = [
  // Part A (Screening questions 1-6)
  { id: 1, category: 'inattention', key: 'question1', partA: true },
  { id: 2, category: 'inattention', key: 'question2', partA: true },
  { id: 3, category: 'inattention', key: 'question3', partA: true },
  { id: 4, category: 'inattention', key: 'question4', partA: true },
  { id: 5, category: 'hyperactivity', key: 'question5', partA: true },
  { id: 6, category: 'hyperactivity', key: 'question6', partA: true },
  // Part B (Additional questions 7-18)
  { id: 7, category: 'inattention', key: 'question7', partA: false },
  { id: 8, category: 'inattention', key: 'question8', partA: false },
  { id: 9, category: 'inattention', key: 'question9', partA: false },
  { id: 10, category: 'inattention', key: 'question10', partA: false },
  { id: 11, category: 'inattention', key: 'question11', partA: false },
  { id: 12, category: 'hyperactivity', key: 'question12', partA: false },
  { id: 13, category: 'hyperactivity', key: 'question13', partA: false },
  { id: 14, category: 'hyperactivity', key: 'question14', partA: false },
  { id: 15, category: 'hyperactivity', key: 'question15', partA: false },
  { id: 16, category: 'hyperactivity', key: 'question16', partA: false },
  { id: 17, category: 'hyperactivity', key: 'question17', partA: false },
  { id: 18, category: 'hyperactivity', key: 'question18', partA: false },
];

interface AsrsAnswers {
  [key: number]: number; // 0=Never, 1=Rarely, 2=Sometimes, 3=Often, 4=Very Often
}

interface AssessmentInfo {
  subject: string;
  age: string;
}

type Step = 'intro' | 'info' | 'questionnaire' | 'results';

export default function AdultAdhdAssessmentFlow() {
  const t = useTranslations('adultAdhdAssessment');
  const tQuestions = useTranslations('adultAdhdAssessment.questions');
  const tResults = useTranslations('adultAdhdAssessment.results');

  const [step, setStep] = useState<Step>('intro');
  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentInfo>({
    subject: '',
    age: '',
  });
  const [answers, setAnswers] = useState<AsrsAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const getRecommendedGames = useCallback((partAScore: number) => {
    const games = [];
    
    // High likelihood - comprehensive training
    if (partAScore >= 4) {
      games.push('dual-n-back', 'stroop-effect-test', 'schulte-table');
    }
    // Moderate likelihood - focused training
    else if (partAScore >= 2) {
      games.push('stroop-effect-test', 'schulte-table', 'reaction-time');
    }
    // Low likelihood - general enhancement
    else {
      games.push('schulte-table', 'larger-number', 'reaction-time');
    }

    return games.slice(0, 3);
  }, []);

  const handleStartAssessment = () => {
    analytics.assessment.start({
      test_type: 'adult_adhd_asrs'
    });
    setStep('info');
  };

  const handleInfoSubmit = (info: AssessmentInfo) => {
    setAssessmentInfo(info);
    setStep('questionnaire');
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < ASRS_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Calculate Part A score (screening) - questions 1-6
    // ASRS Part A scoring: Q1,2,3: >=2, Q4,5,6: >=3
    const partAScoring = [2, 2, 2, 3, 3, 3]; // Thresholds for Part A questions
    let partAScore = 0;
    
    for (let i = 1; i <= 6; i++) {
      const answer = answers[i] || 0;
      const threshold = partAScoring[i - 1];
      if (answer >= threshold) {
        partAScore++;
      }
    }

    // Note: totalScore and riskLevel are calculated in helper functions when needed

    // Track completion
    analytics.assessment.complete({
      test_type: 'adult_adhd_asrs',
      result: partAScore,
      duration_ms: 0, // Could track this later
      recommendations: getRecommendedGames(partAScore)
    });

    setStep('results');
  };

  const calculatePartAScore = () => {
    const partAScoring = [2, 2, 2, 3, 3, 3];
    let partAScore = 0;
    
    for (let i = 1; i <= 6; i++) {
      const answer = answers[i] || 0;
      const threshold = partAScoring[i - 1];
      if (answer >= threshold) {
        partAScore++;
      }
    }
    
    return partAScore;
  };

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const getRiskLevel = (): 'low' | 'moderate' | 'high' => {
    const partAScore = calculatePartAScore();
    if (partAScore >= 4) return 'high';
    if (partAScore >= 2) return 'moderate';
    return 'low';
  };

  // Render intro step
  const renderIntro = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('aboutScale.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('aboutScale.content')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start space-x-3">
            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('features.professional')}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('features.comprehensive')}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('features.evidence')}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t('learnMore.text')}
          </p>
          <Link 
            href="/blog/adult-adhd-asrs-comprehensive-guide"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {t('learnMore.linkText')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <button
        onClick={handleStartAssessment}
        className="px-8 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg transition-colors shadow-lg"
      >
        {t('buttons.startAssessment')}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t('disclaimer.simple')}
        </p>
      </div>
    </div>
  );

  // Render info collection step
  const renderInfo = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('infoStep.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('infoStep.subtitle')}
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('infoStep.subject')}
            </label>
            <input
              type="text"
              value={assessmentInfo.subject}
              onChange={(e) => setAssessmentInfo(prev => ({ ...prev, subject: e.target.value }))}
              placeholder={t('infoStep.subjectPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('infoStep.age')}
            </label>
            <input
              type="text"
              value={assessmentInfo.age}
              onChange={(e) => setAssessmentInfo(prev => ({ ...prev, age: e.target.value }))}
              placeholder={t('infoStep.agePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <button
          onClick={() => handleInfoSubmit(assessmentInfo)}
          disabled={!assessmentInfo.subject.trim() || !assessmentInfo.age.trim()}
          className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {t('buttons.continue')}
        </button>
      </div>
    </div>
  );

  // Render questionnaire step
  const renderQuestionnaire = () => {
    const question = ASRS_QUESTIONS[currentQuestion];
    const isAnswered = answers[question.id] !== undefined;
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('questionnaire.title')}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {currentQuestion + 1} / {ASRS_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / ASRS_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {tQuestions(question.key)}
            </h3>

            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((value) => (
                <label
                  key={value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[question.id] === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={value}
                    checked={answers[question.id] === value}
                    onChange={() => handleAnswer(question.id, value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[question.id] === value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[question.id] === value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {t(`scale.${['never', 'rarely', 'sometimes', 'often', 'veryOften'][value]}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← 上一题
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {currentQuestion === ASRS_QUESTIONS.length - 1 ? '完成评估' : '下一题 →'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render results step
  const renderResults = () => {
    const partAScore = calculatePartAScore();
    const totalScore = calculateTotalScore();
    const riskLevel = getRiskLevel();
    const recommendedGames = getRecommendedGames(partAScore);

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {tResults('title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {tResults('subtitle')}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {tResults('assessmentSummary')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{tResults('subject')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{assessmentInfo.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{tResults('age')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{assessmentInfo.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{tResults('totalQuestions')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{ASRS_QUESTIONS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{tResults('partAScore')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{partAScore}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{tResults('totalScore')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalScore}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {tResults(`riskLevels.${riskLevel}.title`)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {tResults(`riskLevels.${riskLevel}.description`)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {tResults('recommendation')}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {tResults('gameRecommendations')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {tResults('gameRecommendationsSubtitle')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedGames.map((gameKey) => (
                <Link
                  key={gameKey}
                  href={`/games/${gameKey}`}
                  className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  onClick={() => analytics.navigation.recommendation({
                    from_page: 'adult_adhd_assessment_results',
                    to_page: `game_${gameKey}`,
                    source: 'assessment_recommendation'
                  })}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {tResults(`gameNames.${gameKey}`)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tResults(`gameDescriptions.${gameKey}`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('intro');
                setCurrentQuestion(0);
                setAnswers({});
                setAssessmentInfo({ subject: '', age: '' });
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {tResults('retakeAssessment')}
            </button>
            <Link
              href="/games"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {tResults('exploreAllGames')}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      {step === 'intro' && renderIntro()}
      {step === 'info' && renderInfo()}
      {step === 'questionnaire' && renderQuestionnaire()}
      {step === 'results' && renderResults()}
    </div>
  );
}