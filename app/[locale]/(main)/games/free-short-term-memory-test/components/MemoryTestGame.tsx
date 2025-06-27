'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

type GameState = 'instruction' | 'presentation' | 'recall' | 'setup' | 'results';

interface Demographics {
  ageGroup: string;
  gender: 'male' | 'female' | 'other' | '';
}

interface GameResults {
  wordsRecalled: string[];
  correctWords: string[];
  score: number;
  percentile?: number;
  timeSpent: number;
}

export default function MemoryTestGame() {
  const t = useTranslations('games.freeShortTermMemoryTest');
  
  // Get word bank from translations
  const wordBank = t.raw('wordBank') as string[];
  
  const [gameState, setGameState] = useState<GameState>('presentation');
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''));
  const [demographics, setDemographics] = useState<Demographics>({ ageGroup: '', gender: '' });
  const [results, setResults] = useState<GameResults | null>(null);
  const [startTime, setStartTime] = useState(0);

  // Generate words on client side to avoid hydration mismatch
  useEffect(() => {
    if (wordBank.length > 0 && currentWords.length === 0) {
      const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
      setCurrentWords(shuffled.slice(0, 12));
    }
  }, [wordBank, currentWords.length]);

  const proceedToRecall = useCallback(() => {
    setGameState('recall');
    setStartTime(Date.now());
  }, []);

  const submitRecall = useCallback(() => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const userWords = userInputs
      .map((input: string) => input.toLowerCase().trim())
      .filter((word: string) => word.length > 0);

    const correctWords = currentWords.filter((phrase: string) => 
      userWords.some((userWord: string) => {
        // Allow partial matches and flexible matching
        const normalizedPhrase = phrase.toLowerCase().replace(/\s+/g, '');
        const normalizedUser = userWord.replace(/\s+/g, '');
        return normalizedPhrase.includes(normalizedUser) || 
               normalizedUser.includes(normalizedPhrase) ||
               phrase.toLowerCase().split(' ').some((word: string) => word === userWord);
      })
    );

    const score = Math.round((correctWords.length / currentWords.length) * 100);

    setResults({
      wordsRecalled: userWords,
      correctWords,
      score,
      timeSpent
    });

    setGameState('setup');
  }, [userInputs, currentWords, startTime]);

  const calculatePercentile = useCallback((score: number, ageGroup: string, gender: string) => {
    // Simplified percentile calculation based on research approximations
    // This is a basic implementation - in real world, you'd use proper normative data
    let basePercentile = score;
    
    // Age group adjustments (younger people typically perform better)
    if (ageGroup === 'under-18') basePercentile -= 8;
    else if (ageGroup === '18-25') basePercentile -= 5;
    else if (ageGroup === '65+') basePercentile += 10;
    else if (ageGroup === '46-65') basePercentile += 5;
    
    // Gender adjustments are minimal in most memory research
    if (gender === 'female') basePercentile += 2; // Slight advantage in verbal memory
    
    return Math.max(1, Math.min(99, basePercentile));
  }, []);

  const submitDemographics = useCallback(() => {
    if (results && demographics.ageGroup && demographics.gender) {
      const percentile = calculatePercentile(results.score, demographics.ageGroup, demographics.gender);
      
      setResults({
        ...results,
        percentile
      });
    }
    
    setGameState('results');
    
    // Celebrate if score is good
    if (results && results.score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [results, demographics, calculatePercentile]);



  const updateUserInput = useCallback((index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  }, [userInputs]);

  const resetGame = useCallback(() => {
    // Generate new words and start fresh
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    setCurrentWords(shuffled.slice(0, 12));
    setGameState('presentation');
    setUserInputs(Array(12).fill(''));
    setDemographics({ ageGroup: '', gender: '' });
    setResults(null);
    setStartTime(0);
  }, [wordBank]);

  // Show loading state until words are generated
  if (currentWords.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="text-center space-y-4">
          <div className="text-xl font-medium">Loading...</div>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        {gameState === 'presentation' && (
            <div className="text-center space-y-8">
              <div className="space-y-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('memorizeTheseWords')}
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t('studyAtYourPace')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {currentWords.map((phrase, index) => (
                  <div
                    key={index}
                    className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl text-center font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border border-blue-100 dark:border-blue-800"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      {phrase}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Button 
                  onClick={proceedToRecall} 
                  size="lg"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t('ready')}
                </Button>
              </div>
            </div>
          )}

          {gameState === 'recall' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t('recall.title')}
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                  {t('recall.gridInstruction')}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-lg font-medium">{t('recall.inputLabel')}</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {userInputs.map((input, index) => (
                    <Input
                      key={index}
                      value={input}
                      onChange={(e) => updateUserInput(index, e.target.value)}
                      className="text-center h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                      style={{ animationDelay: `${index * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  onClick={submitRecall} 
                  size="lg"
                  disabled={userInputs.every(input => input.trim().length === 0)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('submitRecall')}
                </Button>
              </div>
            </div>
          )}

          {gameState === 'setup' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t('setup.title')}
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                  {t('setup.description')}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-3xl p-8 max-w-2xl mx-auto border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
                <div className="space-y-8">
                  {/* Age Group Section */}
                  <div className="space-y-4">
                    <Label className="text-xl font-bold text-emerald-700 dark:text-emerald-300 block text-center">{t('setup.ageGroup')}</Label>
                                         <div className="grid grid-cols-3 gap-3">
                       {[
                         { value: "under-18", label: t('setup.ageUnder18'), emoji: "🌟" },
                         { value: "18-25", label: t('setup.age18to25'), emoji: "🎯" },
                         { value: "26-45", label: t('setup.age26to45'), emoji: "🚀" },
                         { value: "46-65", label: t('setup.age46to65'), emoji: "⭐" },
                         { value: "65+", label: t('setup.age65plus'), emoji: "🏆" }
                       ].map((age) => (
                        <div
                          key={age.value}
                          className={`relative cursor-pointer group transition-all duration-200 ${
                            demographics.ageGroup === age.value
                              ? 'scale-105'
                              : 'hover:scale-102'
                          }`}
                          onClick={() => setDemographics({ ...demographics, ageGroup: age.value })}
                        >
                          <div className={`
                            p-4 rounded-2xl border-2 text-center transition-all duration-200
                            ${demographics.ageGroup === age.value
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 hover:shadow-md'
                            }
                          `}>
                            <div className="text-2xl mb-2">{age.emoji}</div>
                            <div className="font-semibold text-sm">{age.label}</div>
                          </div>
                          {demographics.ageGroup === age.value && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Section */}
                  <div className="space-y-4">
                    <Label className="text-xl font-bold text-emerald-700 dark:text-emerald-300 block text-center">{t('setup.gender')}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "male", label: t('setup.male'), emoji: "👨" },
                        { value: "female", label: t('setup.female'), emoji: "👩" },
                        { value: "other", label: t('setup.other'), emoji: "🌟" }
                      ].map((gender) => (
                        <div
                          key={gender.value}
                          className={`relative cursor-pointer group transition-all duration-200 ${
                            demographics.gender === gender.value
                              ? 'scale-105'
                              : 'hover:scale-102'
                          }`}
                          onClick={() => setDemographics({ ...demographics, gender: gender.value as Demographics['gender'] })}
                        >
                          <div className={`
                            p-4 rounded-2xl border-2 text-center transition-all duration-200
                            ${demographics.gender === gender.value
                              ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-400 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 hover:border-teal-400 hover:shadow-md'
                            }
                          `}>
                            <div className="text-2xl mb-2">{gender.emoji}</div>
                            <div className="font-semibold text-sm">{gender.label}</div>
                          </div>
                          {demographics.gender === gender.value && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={submitDemographics}
                  disabled={!demographics.ageGroup || !demographics.gender}
                  size="lg"
                  className="px-10 py-4 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('setup.submit')}
                </Button>
              </div>
            </div>
          )}

          {gameState === 'results' && results && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Trophy className="w-20 h-20 mx-auto text-yellow-500 drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
                    {results.score}
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  {t('results.title')}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {results.score >= 80 ? t('results.excellent') : 
                   results.score >= 60 ? t('results.good') : 
                   t('results.keepPracticing')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {t('results.performance')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{t('results.wordsRecalled')}:</span>
                      <span className="font-bold text-xl text-blue-600">{results.correctWords.length}/12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{t('results.accuracy')}:</span>
                      <span className="font-bold text-xl text-green-600">{results.score}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{t('results.timeSpent')}:</span>
                      <span className="font-bold text-xl text-purple-600">{Math.round(results.timeSpent)}s</span>
                    </div>
                    {results.percentile && (
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                        <span className="font-medium">{t('results.percentile')}:</span>
                        <span className="font-bold text-xl text-orange-600">{results.percentile}th</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t('results.correctWords')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {results.correctWords.length > 0 ? (
                        results.correctWords.map((word, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 px-3 py-2 bg-green-100 dark:bg-green-900 rounded-lg shadow-sm"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <span className="font-medium">{word}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm">{t('results.noMatches')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Missed Words Section */}
              {currentWords.filter(word => !results.correctWords.includes(word)).length > 0 && (
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800 shadow-lg max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      {t('results.missedWords')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {currentWords
                        .filter(word => !results.correctWords.includes(word))
                        .map((word, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 rounded-lg shadow-sm text-sm"
                          >
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">×</span>
                            </div>
                            <span className="font-medium">{word}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Encouragement Section */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-2xl p-6 max-w-4xl mx-auto border border-yellow-200 dark:border-yellow-800 shadow-lg">
                <div className="text-center space-y-4">
                  <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {t('results.encouragement')}
                  </h4>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('results.trainingTip')}
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  onClick={resetGame} 
                  size="lg" 
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 gap-3"
                >
                  <RotateCcw className="w-5 h-5" />
                  {t('tryAgain')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } 