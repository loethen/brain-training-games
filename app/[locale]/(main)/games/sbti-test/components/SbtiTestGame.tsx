'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { submitScoreToLeaderboard } from '@/lib/leaderboard';
import {
    DIM_EXPLANATIONS,
    DRUNK_TRIGGER_QUESTION_ID,
    NORMAL_TYPES,
    TYPE_IMAGES,
    TYPE_LIBRARY,
    dimensionMeta,
    dimensionOrder,
    questions,
    specialQuestions,
    type DimensionLevel,
} from '../data';
import { Play, RotateCcw, Sparkles, ArrowLeft, LoaderCircle } from 'lucide-react';
import {
    EN_DIMENSION_EXPLANATIONS,
    EN_DIMENSION_NAMES,
    EN_QUESTION_COPY,
    EN_TYPE_COPY,
} from '../copy';

type Screen = 'intro' | 'test' | 'loading' | 'result';
type AnswerMap = Record<string, number | undefined>;
type DimensionKey = keyof typeof dimensionMeta;
type RegularQuestion = (typeof questions)[number];
type SpecialQuestion = (typeof specialQuestions)[number];
type QuizQuestion = RegularQuestion | SpecialQuestion;
type TypeLibraryEntry = (typeof TYPE_LIBRARY)[keyof typeof TYPE_LIBRARY];

type RankedType = TypeLibraryEntry & {
    pattern: string;
    distance: number;
    exact: number;
    similarity: number;
};

interface ResultData {
    rawScores: Record<DimensionKey, number>;
    levels: Record<DimensionKey, DimensionLevel>;
    ranked: RankedType[];
    bestNormal: RankedType;
    finalType: TypeLibraryEntry | RankedType;
    special: boolean;
    secondaryType: RankedType | null;
    mode: 'normal' | 'drunk' | 'fallback';
}

const orderedDimensions = dimensionOrder as DimensionKey[];
const LETTER_CODES = ['A', 'B', 'C', 'D'];

function shuffle<T>(items: T[]): T[] {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
}

function isSpecialQuestion(question: QuizQuestion): question is SpecialQuestion {
    return 'special' in question && question.special === true;
}

function sumToLevel(score: number): DimensionLevel {
    if (score <= 3) return 'L';
    if (score === 4) return 'M';
    return 'H';
}

function levelNum(level: DimensionLevel) {
    return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern: string): DimensionLevel[] {
    return pattern.replace(/-/g, '').split('') as DimensionLevel[];
}

function buildVisibleQuestions(questionDeck: QuizQuestion[], answers: AnswerMap): QuizQuestion[] {
    const visible = [...questionDeck];
    const gateIndex = visible.findIndex((question) => question.id === 'drink_gate_q1');
    if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
        visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    return visible;
}

function computeResult(answers: AnswerMap): ResultData {
    const rawScores = {} as Record<DimensionKey, number>;
    const levels = {} as Record<DimensionKey, DimensionLevel>;

    orderedDimensions.forEach((dimension) => {
        rawScores[dimension] = 0;
    });

    questions.forEach((question) => {
        rawScores[question.dim as DimensionKey] += Number(answers[question.id] || 0);
    });

    orderedDimensions.forEach((dimension) => {
        levels[dimension] = sumToLevel(rawScores[dimension]);
    });

    const userVector = orderedDimensions.map((dimension) => levelNum(levels[dimension]));
    const ranked = NORMAL_TYPES.map((type) => {
        const vector = parsePattern(type.pattern).map(levelNum);
        let distance = 0;
        let exact = 0;

        for (let index = 0; index < vector.length; index += 1) {
            const diff = Math.abs(userVector[index] - vector[index]);
            distance += diff;
            if (diff === 0) exact += 1;
        }

        const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

        return {
            ...type,
            ...TYPE_LIBRARY[type.code as keyof typeof TYPE_LIBRARY],
            distance,
            exact,
            similarity,
        };
    }).sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        if (b.exact !== a.exact) return b.exact - a.exact;
        return b.similarity - a.similarity;
    });

    const bestNormal = ranked[0];
    const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2;

    if (drunkTriggered) {
        return {
            rawScores,
            levels,
            ranked,
            bestNormal,
            finalType: TYPE_LIBRARY.DRUNK,
            special: true,
            secondaryType: bestNormal,
            mode: 'drunk',
        };
    }

    if (bestNormal.similarity < 60) {
        return {
            rawScores,
            levels,
            ranked,
            bestNormal,
            finalType: TYPE_LIBRARY.HHHH,
            special: true,
            secondaryType: null,
            mode: 'fallback',
        };
    }

    return {
        rawScores,
        levels,
        ranked,
        bestNormal,
        finalType: bestNormal,
        special: false,
        secondaryType: null,
        mode: 'normal',
    };
}

export default function SbtiTestGame() {
    const locale = useLocale();
    const t = useTranslations('sbtiTest.gameUI');
    const [screen, setScreen] = useState<Screen>('intro');
    const [questionDeck, setQuestionDeck] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<AnswerMap>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [result, setResult] = useState<ResultData | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [screen]);

    useEffect(() => {
        if (screen !== 'loading') return;

        const timeoutId = window.setTimeout(() => {
            setResult(computeResult(answers));
            setScreen('result');
        }, 1400);

        return () => window.clearTimeout(timeoutId);
    }, [answers, screen]);

    useEffect(() => {
        if (screen !== 'result' || !result) return;
        void submitScoreToLeaderboard('sbti-test', 1, { mode: result.finalType.code });
    }, [result, screen]);

    const visibleQuestions = useMemo(() => buildVisibleQuestions(questionDeck, answers), [answers, questionDeck]);
    const currentQuestion = visibleQuestions[currentQuestionIndex] ?? null;
    const isEnglish = locale === 'en';
    const hasReachedSubmit = visibleQuestions.length > 0 && currentQuestionIndex >= visibleQuestions.length;
    const currentStep = hasReachedSubmit ? visibleQuestions.length : currentQuestion ? currentQuestionIndex + 1 : 0;
    const progress = visibleQuestions.length > 0 && currentStep > 0
        ? (currentStep / visibleQuestions.length) * 100
        : 0;
    const localizedCurrentQuestion = useMemo(() => {
        if (!currentQuestion || !isEnglish) return currentQuestion;

        const englishCopy = EN_QUESTION_COPY[currentQuestion.id];
        if (!englishCopy) return currentQuestion;

        return {
            ...currentQuestion,
            text: englishCopy.text,
            options: currentQuestion.options.map((option, index) => ({
                ...option,
                label: englishCopy.options[index] || option.label,
            })),
        };
    }, [currentQuestion, isEnglish]);

    const startTest = () => {
        const shuffled = shuffle(questions);
        const insertIndex = Math.floor(Math.random() * shuffled.length) + 1;
        const baseDeck: QuizQuestion[] = [
            ...shuffled.slice(0, insertIndex),
            specialQuestions[0],
            ...shuffled.slice(insertIndex),
        ];

        setQuestionDeck(baseDeck);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResult(null);
        setScreen('test');
    };

    const handleAnswer = (questionId: string, value: number) => {
        const nextAnswers = {
            ...answers,
            [questionId]: value,
        };

        if (questionId === 'drink_gate_q1' && value !== 3) {
            delete nextAnswers[DRUNK_TRIGGER_QUESTION_ID];
        }

        const nextVisibleQuestions = buildVisibleQuestions(questionDeck, nextAnswers);
        const answeredQuestionIndex = nextVisibleQuestions.findIndex((question) => question.id === questionId);
        const nextQuestionIndex = answeredQuestionIndex + 1;

        setAnswers(nextAnswers);

        if (nextQuestionIndex >= nextVisibleQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            return;
        }

        setCurrentQuestionIndex(nextQuestionIndex);
    };

    const handleSubmit = () => {
        if (!hasReachedSubmit) return;
        setScreen('loading');
    };

    const goToPreviousQuestion = () => {
        setCurrentQuestionIndex((current) => Math.max(0, current - 1));
    };

    const backToIntro = () => {
        setScreen('intro');
        setCurrentQuestionIndex(0);
        setResult(null);
    };

    const resultBadge = (() => {
        if (!result) return '';
        if (result.mode === 'drunk') return t('result.drunkBadge');
        if (result.mode === 'fallback') {
            return t('result.fallbackBadge', { similarity: result.bestNormal.similarity });
        }
        return t('result.normalBadge', {
            similarity: result.bestNormal.similarity,
            exact: result.bestNormal.exact,
        });
    })();

    const resultSubline = (() => {
        if (!result) return '';
        if (result.mode === 'drunk') return t('result.drunkSub');
        if (result.mode === 'fallback') return t('result.fallbackSub');
        return t('result.normalSub');
    })();

    const resultKicker = (() => {
        if (!result) return '';
        if (result.mode === 'drunk') return t('result.drunkKicker');
        if (result.mode === 'fallback') return t('result.fallbackKicker');
        return t('result.normalKicker');
    })();
    const localizedFinalType = result && isEnglish
        ? EN_TYPE_COPY[result.finalType.code] || null
        : null;
    const localizedSecondaryType = result?.secondaryType && isEnglish
        ? EN_TYPE_COPY[result.secondaryType.code] || null
        : null;
    const getDimensionName = (dimension: DimensionKey) => {
        if (!isEnglish) return dimensionMeta[dimension].name;
        return EN_DIMENSION_NAMES[dimension] || dimensionMeta[dimension].name;
    };
    const getDimensionExplanation = (dimension: DimensionKey, level: DimensionLevel) => {
        if (!isEnglish) return DIM_EXPLANATIONS[dimension][level];
        return EN_DIMENSION_EXPLANATIONS[dimension]?.[level] || DIM_EXPLANATIONS[dimension][level];
    };

    return (
        <div className="mx-auto max-w-5xl">
            {screen === 'intro' && (
                <div className="p-6 md:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t('introEyebrow')}
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                        {t('introTitle')}
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
                        {t('introDescription')}
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-[24px] border border-border bg-background/90 p-4">
                            <div className="text-2xl font-semibold tracking-[-0.03em] text-foreground">31</div>
                            <div className="mt-1 text-sm text-muted-foreground">{t('stats.questions')}</div>
                        </div>
                        <div className="rounded-[24px] border border-border bg-background/90 p-4">
                            <div className="text-2xl font-semibold tracking-[-0.03em] text-foreground">27</div>
                            <div className="mt-1 text-sm text-muted-foreground">{t('stats.types')}</div>
                        </div>
                        <div className="rounded-[24px] border border-border bg-background/90 p-4">
                            <div className="text-2xl font-semibold tracking-[-0.03em] text-foreground">3 min</div>
                            <div className="mt-1 text-sm text-muted-foreground">{t('stats.duration')}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={startTest}
                            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 hover:opacity-90"
                        >
                            <Play className="h-4 w-4" />
                            {t('start')}
                        </button>
                    </div>
                </div>
            )}

            {screen === 'test' && (
                <div className="p-4 md:p-6">
                    <div className="sticky top-4 z-10 mb-6 rounded-[24px] border border-border bg-background/95 p-4 backdrop-blur">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="min-w-[180px] flex-1">
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-foreground transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                {t('progress', {
                                    answered: currentStep,
                                    total: visibleQuestions.length,
                                })}
                            </div>
                        </div>
                    </div>

                    {localizedCurrentQuestion && (
                        <article className="rounded-[28px] border border-border bg-background p-5 md:p-6">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                                <span className="rounded-full border border-border bg-muted px-3 py-1">
                                    {t('questionNumber', { index: currentStep })}
                                </span>
                                <span>
                                    {isSpecialQuestion(localizedCurrentQuestion) ? t('bonusQuestion') : t('hiddenDimension')}
                                </span>
                            </div>

                            <h3 className="whitespace-pre-wrap text-base leading-8 text-foreground md:text-lg">
                                {localizedCurrentQuestion.text}
                            </h3>

                            <p className="mt-4 text-sm text-muted-foreground">
                                {t('autoAdvanceHint')}
                            </p>

                            <div className="mt-5 grid gap-3">
                                {localizedCurrentQuestion.options.map((option, optionIndex) => {
                                    const isSelected = answers[localizedCurrentQuestion.id] === option.value;

                                    return (
                                        <button
                                            key={`${localizedCurrentQuestion.id}-${option.value}`}
                                            type="button"
                                            onClick={() => handleAnswer(localizedCurrentQuestion.id, option.value)}
                                            className={cn(
                                                'flex items-start gap-4 rounded-[20px] border px-4 py-4 text-left transition-all',
                                                isSelected
                                                    ? 'border-foreground bg-muted shadow-sm'
                                                    : 'border-border bg-background hover:border-foreground/30 hover:bg-muted/50'
                                            )}
                                        >
                                            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold text-foreground">
                                                {LETTER_CODES[optionIndex]}
                                            </span>
                                            <span className="leading-7 text-foreground/90">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={backToIntro}
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {t('backToStart')}
                                </button>

                                <button
                                    type="button"
                                    onClick={goToPreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                        currentQuestionIndex === 0
                                            ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                            : 'border border-border bg-background text-foreground hover:bg-muted'
                                    )}
                                >
                                    {t('previousQuestion')}
                                </button>
                            </div>
                        </article>
                    )}

                    {hasReachedSubmit && (
                        <article className="rounded-[28px] border border-border bg-background p-5 md:p-6">
                            <div className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                {t('submitReadyEyebrow')}
                            </div>
                            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
                                {t('submitReadyTitle')}
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                                {t('submitReadyDescription')}
                            </p>

                            <div className="mt-6 rounded-[24px] border border-border bg-muted/40 p-4">
                                <div className="text-sm font-medium text-foreground">
                                    {t('progress', {
                                        answered: visibleQuestions.length,
                                        total: visibleQuestions.length,
                                    })}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t('submitHintComplete')}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousQuestion}
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {t('previousQuestion')}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-colors hover:opacity-90"
                                >
                                    {t('submit')}
                                </button>
                            </div>
                        </article>
                    )}
                </div>
            )}

            {screen === 'loading' && (
                <div className="p-4 md:p-6">
                    <section className="rounded-[28px] border border-border bg-background p-6 md:p-10">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
                                <LoaderCircle className="h-6 w-6 animate-spin text-foreground" />
                            </div>
                            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
                                {t('loadingTitle')}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                                {t('loadingDescription')}
                            </p>

                            <div className="mt-8 space-y-3 text-left">
                                <div className="rounded-[20px] border border-border bg-muted/40 p-4 animate-pulse">
                                    <div className="h-2 w-24 rounded-full bg-foreground/15" />
                                    <div className="mt-3 h-2 w-full rounded-full bg-foreground/10" />
                                </div>
                                <div className="rounded-[20px] border border-border bg-muted/40 p-4 animate-pulse [animation-delay:120ms]">
                                    <div className="h-2 w-20 rounded-full bg-foreground/15" />
                                    <div className="mt-3 h-2 w-4/5 rounded-full bg-foreground/10" />
                                </div>
                                <div className="rounded-[20px] border border-border bg-muted/40 p-4 animate-pulse [animation-delay:240ms]">
                                    <div className="h-2 w-28 rounded-full bg-foreground/15" />
                                    <div className="mt-3 h-2 w-2/3 rounded-full bg-foreground/10" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {screen === 'result' && result && (
                <div className="p-4 md:p-6">
                    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                        <div className="rounded-[28px] border border-border bg-muted/30 p-4">
                            <Image
                                src={TYPE_IMAGES[result.finalType.code as keyof typeof TYPE_IMAGES]}
                                alt={`${result.finalType.code} ${localizedFinalType?.name || result.finalType.cn}`}
                                width={960}
                                height={1280}
                                className="h-auto w-full rounded-[20px] bg-white object-contain"
                            />
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                {localizedFinalType?.intro || result.finalType.intro}
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-[28px] border border-border bg-background p-6">
                                <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                    {resultKicker}
                                </div>
                                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                                    {result.finalType.code} ({localizedFinalType?.name || result.finalType.cn})
                                </h3>
                                <div className="mt-4 inline-flex rounded-full border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground">
                                    {resultBadge}
                                </div>
                                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                    {resultSubline}
                                </p>
                                {result.secondaryType && (
                                    <p className="mt-3 text-sm leading-7 text-foreground/80">
                                        {t('result.secondaryType', {
                                            code: result.secondaryType.code,
                                            name: localizedSecondaryType?.name || result.secondaryType.cn,
                                        })}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-[28px] border border-border bg-background p-6">
                                <h3 className="text-lg font-semibold text-foreground">{t('result.analysisTitle')}</h3>
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-foreground/85">
                                    {localizedFinalType?.desc || result.finalType.desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 rounded-[28px] border border-border bg-background p-6">
                        <h3 className="text-lg font-semibold text-foreground">{t('result.dimensionsTitle')}</h3>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {orderedDimensions.map((dimension) => (
                                <div
                                    key={dimension}
                                    className="rounded-[20px] border border-border bg-muted/30 p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between gap-4">
                                        <div className="text-sm font-semibold text-foreground">
                                            {getDimensionName(dimension)}
                                        </div>
                                        <div className="text-xs font-semibold text-muted-foreground">
                                            {result.levels[dimension]} / {result.rawScores[dimension]}
                                        </div>
                                    </div>
                                    <p className="text-sm leading-7 text-muted-foreground">
                                        {getDimensionExplanation(dimension, result.levels[dimension])}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 rounded-[28px] border border-border bg-background p-6">
                        <h3 className="text-lg font-semibold text-foreground">{t('result.funNoteTitle')}</h3>
                        <p className="mt-4 text-sm leading-8 text-muted-foreground">
                            {result.special ? t('result.funNoteSpecial') : t('result.funNoteDefault')}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={startTest}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            <RotateCcw className="h-4 w-4" />
                            {t('restart')}
                        </button>
                        <button
                            type="button"
                            onClick={backToIntro}
                            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-colors hover:opacity-90"
                        >
                            {t('backToStart')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
