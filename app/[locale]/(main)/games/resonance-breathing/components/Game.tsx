'use client';

import { useState, useEffect } from 'react';
import LotusFlower from './LotusFlower';
import { useTranslations } from 'next-intl';
import { Play, Pause, Settings, RotateCcw } from 'lucide-react';

type BreathingPhase = 'idle' | 'inhale' | 'exhale';

interface GameSettings {
    inhaleDuration: number;
    exhaleDuration: number;
    sessionDuration: number; // in minutes
}

export default function Game() {
    const t = useTranslations('games.resonanceBreathing');

    const [phase, setPhase] = useState<BreathingPhase>('idle');
    const [isRunning, setIsRunning] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showSettings, setShowSettings] = useState(true);

    const [settings, setSettings] = useState<GameSettings>({
        inhaleDuration: 4,
        exhaleDuration: 6,
        sessionDuration: 5,
    });

    const currentPhaseDuration = phase === 'inhale' ? settings.inhaleDuration : settings.exhaleDuration;

    // Breathing cycle logic
    useEffect(() => {
        if (!isRunning) return;

        // Start with inhale
        if (phase === 'idle') {
            setPhase('inhale');
        }

        const timer = setTimeout(() => {
            if (phase === 'inhale') {
                setPhase('exhale');
            } else if (phase === 'exhale') {
                setPhase('inhale');
                setCycleCount(prev => prev + 1);
            }
        }, (phase === 'inhale' ? settings.inhaleDuration : settings.exhaleDuration) * 1000);

        return () => clearTimeout(timer);
    }, [isRunning, phase, settings.inhaleDuration, settings.exhaleDuration]);

    // Elapsed time tracker
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setElapsedTime(prev => {
                const newTime = prev + 1;
                // Auto-stop when session duration is reached
                if (newTime >= settings.sessionDuration * 60) {
                    setIsRunning(false);
                    setPhase('idle');
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, settings.sessionDuration]);

    const handleStart = () => {
        setIsRunning(true);
        setPhase('inhale');
    };

    const handlePause = () => {
        setIsRunning(false);
        setPhase('idle');
    };

    const handleReset = () => {
        setIsRunning(false);
        setPhase('idle');
        setCycleCount(0);
        setElapsedTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px]">

            {/* Stats bar - Clean Minimalist */}
            <div className="relative z-10 flex gap-12 mb-12 text-gray-900">
                <div className="text-center">
                    <div className="text-3xl font-light font-mono">{cycleCount}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{t('ui.cycles')}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-light font-mono">{formatTime(elapsedTime)}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{t('ui.elapsed')}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-light font-mono">{settings.sessionDuration}:00</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{t('ui.target')}</div>
                </div>
            </div>

            {/* Lotus flower */}
            <div className="relative z-10 mb-16">
                <LotusFlower
                    phase={phase}
                    duration={currentPhaseDuration}
                />
            </div>

            {/* Controls - Black & White Only */}
            <div className="relative z-10 flex items-center gap-6">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-10 py-3 bg-black text-white text-sm font-medium tracking-wide rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Play className="w-4 h-4" fill="currentColor" />
                        {t('ui.start').toUpperCase()}
                    </button>
                ) : (
                    <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-10 py-3 bg-white text-black border border-black text-sm font-medium tracking-wide rounded-full hover:bg-gray-50 transition-all shadow-md"
                    >
                        <Pause className="w-4 h-4" fill="currentColor" />
                        {t('ui.pause').toUpperCase()}
                    </button>
                )}

                <button
                    onClick={handleReset}
                    className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    title={t('ui.reset')}
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-3 rounded-full transition-all ${showSettings ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                    title={t('ui.settings')}
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Settings panel - Minimalist */}
            {showSettings && (
                <div className="w-full max-w-md mt-12 pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs uppercase tracking-widest text-gray-500">{t('ui.inhaleDuration')}</label>
                                <span className="text-sm font-mono">{settings.inhaleDuration}s</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="8"
                                step="0.5"
                                value={settings.inhaleDuration}
                                onChange={(e) => setSettings(s => ({ ...s, inhaleDuration: Number(e.target.value) }))}
                                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                                disabled={isRunning}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs uppercase tracking-widest text-gray-500">{t('ui.exhaleDuration')}</label>
                                <span className="text-sm font-mono">{settings.exhaleDuration}s</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="8"
                                step="0.5"
                                value={settings.exhaleDuration}
                                onChange={(e) => setSettings(s => ({ ...s, exhaleDuration: Number(e.target.value) }))}
                                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                                disabled={isRunning}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs uppercase tracking-widest text-gray-500">{t('ui.sessionDuration')}</label>
                                <span className="text-sm font-mono">{settings.sessionDuration} min</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={settings.sessionDuration}
                                onChange={(e) => setSettings(s => ({ ...s, sessionDuration: Number(e.target.value) }))}
                                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                                disabled={isRunning}
                            />
                        </div>

                        {/* Breathing rate info */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-400">
                                {t('ui.breathingRate', {
                                    rate: (60 / (settings.inhaleDuration + settings.exhaleDuration)).toFixed(1)
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
