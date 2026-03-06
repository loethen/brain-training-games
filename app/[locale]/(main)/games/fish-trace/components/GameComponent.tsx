'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useFishEngine, getLevelParams, GamePhase, Difficulty } from '../hooks/useFishEngine';
import { SunfishSVG } from './SunfishSVG';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GameSettings {
    difficulty: Difficulty;
    startLevel: number;
}

const DEFAULT_SETTINGS: GameSettings = {
    difficulty: 'medium',
    startLevel: 1,
};

const SETTINGS_KEY = 'fishTraceSettings';
const BEST_SCORE_KEY = 'fishTraceBestScore';

export default function GameComponent() {
    const t = useTranslations('games.fishTrace');
    const containerRef = useRef<HTMLDivElement>(null);

    // Settings
    const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Level + Score
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [roundPoints, setRoundPoints] = useState<number | null>(null); // for +N animation
    const [roundResult, setRoundResult] = useState<{ isPerfect: boolean; correct: number; total: number } | null>(null);

    // Game phase
    const [phase, setPhase] = useState<GamePhase>('idle');
    const [message, setMessage] = useState('');

    // Progress bar
    const [progressTotal, setProgressTotal] = useState(0);
    const [progressStartTime, setProgressStartTime] = useState(0);
    const [progressElapsed, setProgressElapsed] = useState(0);

    // Force render trigger (for fish selection updates)
    const [, forceRender] = useState(0);

    // Load best score & settings
    useEffect(() => {
        const saved = localStorage.getItem(BEST_SCORE_KEY);
        if (saved) setBestScore(parseInt(saved, 10) || 0);

        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
                setLevel(parsed.startLevel || 1);
            } catch { /* ignore */ }
        }
    }, []);

    // Current level params driven by difficulty
    const levelParams = getLevelParams(level, settings.difficulty);

    const {
        fishesRef,
        initFishes,
        startMovement,
        stopMovement,
        toggleSelection,
        markResults,
        calculateScore,
    } = useFishEngine({
        containerWidth: containerRef.current?.clientWidth || 800,
        containerHeight: containerRef.current?.clientHeight || 600,
        fishCount: levelParams.fishCount,
        targetCount: levelParams.targetCount,
        speedMultiplier: levelParams.speed
    });

    // Refs for animating DOM elements at 60fps
    const fishNodeRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

    // Progress bar animation loop
    useEffect(() => {
        if (progressTotal <= 0) return;
        let frameId: number;
        const tick = () => {
            const elapsed = Date.now() - progressStartTime;
            setProgressElapsed(Math.min(elapsed, progressTotal));
            if (elapsed < progressTotal) {
                frameId = requestAnimationFrame(tick);
            }
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [progressTotal, progressStartTime]);

    // Sync Loop: copy ref coordinates to DOM nodes at 60fps
    useEffect(() => {
        let frameId: number;
        const renderLoop = () => {
            if (phase === 'watching' || phase === 'tracking') {
                const fishes = fishesRef.current;
                Object.values(fishes).forEach(fish => {
                    const node = fishNodeRefs.current[fish.id];
                    if (node) {
                        const flipX = fish.vx < 0 ? -1 : 1;
                        node.style.transform = `translate(${fish.x - 30}px, ${fish.y - 30}px) scaleX(${flipX})`;
                    }
                });
            }
            frameId = requestAnimationFrame(renderLoop);
        };

        if (phase === 'watching' || phase === 'tracking') {
            frameId = requestAnimationFrame(renderLoop);
        }
        return () => cancelAnimationFrame(frameId);
    }, [phase, fishesRef]);

    const saveSettings = (newSettings: GameSettings) => {
        setSettings(newSettings);
        setLevel(newSettings.startLevel);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        setIsSettingsOpen(false);
    };

    const startGame = useCallback(() => {
        setPhase('watching');
        setMessage(t('start'));
        setRoundPoints(null);
        setRoundResult(null);

        const { glowDuration, trackDuration } = getLevelParams(level, settings.difficulty);

        // Start progress bar for glow phase
        setProgressTotal(glowDuration);
        setProgressStartTime(Date.now());
        setProgressElapsed(0);

        setTimeout(() => {
            initFishes();
            startMovement();
            forceRender(p => p + 1);

            setTimeout(() => {
                setMessage(t('glowEnding'));
            }, glowDuration - 1000);

            // Tracking phase
            setTimeout(() => {
                setPhase('tracking');
                setMessage(t('tracking'));
                // Progress bar for tracking
                setProgressTotal(trackDuration);
                setProgressStartTime(Date.now());
                setProgressElapsed(0);

                // Selection phase
                setTimeout(() => {
                    stopMovement();
                    setPhase('selecting');
                    setMessage(t('selection'));
                    setProgressTotal(0);
                    forceRender(p => p + 1);
                }, trackDuration);

            }, glowDuration);
        }, 100);
    }, [t, level, settings.difficulty, initFishes, startMovement, stopMovement]);

    const handleFishClick = (id: number) => {
        if (phase !== 'selecting') return;
        toggleSelection(id);
        forceRender(p => p + 1);
    };

    const confirmSelection = () => {
        setPhase('completed');
        markResults();
        setProgressTotal(0);

        const result = calculateScore(level);
        setRoundResult({ isPerfect: result.isPerfect, correct: result.correct, total: result.total });
        setRoundPoints(result.points);

        const newScore = score + result.points;
        setScore(newScore);

        // Update best score
        if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem(BEST_SCORE_KEY, String(newScore));
        }

        if (result.isPerfect) {
            setMessage(t('perfect'));
        } else if (result.correct > 0) {
            setMessage(t('partial'));
        } else {
            setMessage(t('gameOver'));
        }

        forceRender(p => p + 1);

        // Auto-advance if perfect
        if (result.isPerfect) {
            setTimeout(() => {
                setLevel(l => l + 1);
                setTimeout(() => startGame(), 300);
            }, 2000);
        }
    };

    // Reset game completely
    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setPhase('idle');
        setMessage('');
        setRoundPoints(null);
        setRoundResult(null);
        setProgressTotal(0);
    };

    const fishes = Object.values(fishesRef.current);

    // Progress bar percentage
    const progressPct = progressTotal > 0 ? Math.max(0, 1 - progressElapsed / progressTotal) : 0;

    return (
        <div className="w-full h-full flex flex-col font-mono bg-white dark:bg-zinc-950 rounded-xl overflow-hidden">

            {/* Top HUD */}
            <div className="flex justify-between items-center px-6 py-3 bg-transparent shrink-0 z-20">
                <div className="flex items-center gap-3">
                    {phase !== 'idle' && (
                        <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {t('level')} {level}
                        </span>
                    )}
                    <div className="font-bold text-lg tracking-wide text-zinc-800 dark:text-zinc-200">
                        {phase === 'idle' ? t('title') : message}
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    {phase !== 'idle' && (
                        <div className="flex gap-3 text-sm font-bold tracking-wider">
                            <span className="text-zinc-600 dark:text-zinc-400">
                                {t('scorePrefix')} {score}
                            </span>
                            {bestScore > 0 && (
                                <span className="text-zinc-400 dark:text-zinc-600">
                                    {t('bestScore')} {bestScore}
                                </span>
                            )}
                        </div>
                    )}
                    {phase === 'idle' && (
                        <GameSettingsDialog
                            settings={settings}
                            onSave={saveSettings}
                            isOpen={isSettingsOpen}
                            onOpenChange={setIsSettingsOpen}
                            t={t}
                        />
                    )}
                </div>
            </div>

            {/* Play Area */}
            <div
                className="relative flex-1 w-full min-h-0 overflow-hidden bg-[url('/games/assets/sea/sea_bg.png')] bg-cover bg-center"
                ref={containerRef}
            >
                {/* Score Popup Animation */}
                <AnimatePresence>
                    {roundPoints !== null && roundPoints > 0 && (
                        <motion.div
                            key={`score-popup-${Date.now()}`}
                            initial={{ opacity: 1, y: 0, scale: 1 }}
                            animate={{ opacity: 0, y: -80, scale: 1.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                        >
                            <span className="text-4xl font-black text-green-400 drop-shadow-lg">
                                +{roundPoints}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Level Announce */}
                <AnimatePresence>
                    {phase === 'watching' && (
                        <motion.div
                            key={`level-announce-${level}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                        >
                            <span className="text-3xl font-black tracking-widest uppercase text-white/80 drop-shadow-xl">
                                {t('round', { level })}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Idle Decorative Fishes */}
                {phase === 'idle' && (
                    <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={`deco-fish-${i}`}
                                className="absolute"
                                initial={{
                                    x: -80,
                                    y: 100 + i * 120,
                                }}
                                animate={{
                                    x: [
                                        -80,
                                        (containerRef.current?.clientWidth || 800) + 80
                                    ],
                                }}
                                transition={{
                                    duration: 12 + i * 4,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    delay: i * 3,
                                }}
                            >
                                <SunfishSVG
                                    isGlowing={false}
                                    isSelected={false}
                                    isTarget={false}
                                    isChecking={false}
                                    isWrongSelection={false}
                                    size={40 + i * 10}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Game Fishes */}
                <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
                    {phase !== 'idle' && fishes.map(fish => {
                        const isGlowing = phase === 'watching' && fish.isTarget;
                        const flipX = fish.vx < 0 ? -1 : 1;

                        return (
                            <div
                                key={fish.id}
                                ref={el => { fishNodeRefs.current[fish.id] = el; }}
                                onClick={() => handleFishClick(fish.id)}
                                className="absolute top-0 left-0 cursor-pointer"
                                style={{
                                    transform: phase === 'selecting' || phase === 'completed'
                                        ? `translate(${fish.x - 30}px, ${fish.y - 30}px) scaleX(${flipX})`
                                        : undefined,
                                    transition: phase === 'selecting' || phase === 'completed' ? 'transform 0.5s ease' : 'none',
                                    willChange: 'transform'
                                }}
                            >
                                <SunfishSVG
                                    isGlowing={isGlowing}
                                    isSelected={fish.isSelected}
                                    isTarget={fish.isTarget}
                                    isChecking={fish.isChecking}
                                    isWrongSelection={fish.isWrongSelection}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Phase transition overlay */}
                <AnimatePresence>
                    {(phase === 'tracking') && (
                        <motion.div
                            key="dimmer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 z-5 pointer-events-none bg-black/10"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            {progressTotal > 0 && (
                <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 shrink-0 overflow-hidden">
                    <motion.div
                        className="h-full rounded-r-full bg-cyan-400"
                        style={{ width: `${progressPct * 100}%` }}
                        transition={{ duration: 0.05 }}
                    />
                </div>
            )}

            {/* Bottom Controls */}
            <div className="h-24 shrink-0 flex items-center justify-center bg-transparent relative z-20">
                <AnimatePresence mode="popLayout">
                    {phase === 'idle' && (
                        <motion.div
                            key="idle-menu"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => startGame()}
                                    className="w-56 h-14 text-2xl font-bold uppercase tracking-widest rounded-xl shadow-md"
                                >
                                    {t('startBtn')}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === 'selecting' && (
                        <motion.div
                            key="confirm-btn"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <Button
                                size="lg"
                                onClick={confirmSelection}
                                className="font-bold py-6 px-12 text-lg uppercase tracking-widest rounded-xl shadow-md"
                            >
                                {t('confirmSelection')}
                            </Button>
                        </motion.div>
                    )}

                    {phase === 'completed' && (
                        <motion.div
                            key="result-menu"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            {roundResult && (
                                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
                                    {roundResult.correct}/{roundResult.total} {t('scorePrefix')} {roundPoints !== null ? `+${roundPoints}` : ''}
                                </div>
                            )}
                            {!roundResult?.isPerfect && (
                                <Button
                                    size="lg"
                                    onClick={() => startGame()}
                                    className="font-bold py-5 px-10 text-lg uppercase tracking-widest rounded-xl shadow-md hover:scale-105 transition-transform"
                                >
                                    {t('tryAgain')}
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function GameSettingsDialog({
    settings,
    onSave,
    isOpen,
    onOpenChange,
    t
}: {
    settings: GameSettings;
    onSave: (settings: GameSettings) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    t: ReturnType<typeof useTranslations>;
}) {
    const [tempSettings, setTempSettings] = useState(settings);

    useEffect(() => {
        setTempSettings(settings);
    }, [settings, isOpen]);

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const difficultyLabels: Record<Difficulty, string> = {
        easy: t('difficultyEasy'),
        medium: t('difficultyMedium'),
        hard: t('difficultyHard'),
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 shadow-sm rounded-full">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm font-mono rounded-xl">
                <DialogHeader>
                    <DialogTitle className="uppercase font-bold tracking-widest">{t('settings')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-4">
                    {/* Difficulty */}
                    <div className="space-y-2.5">
                        <Label className="uppercase font-bold tracking-wider text-sm">{t('difficultyLabel')}</Label>
                        <div className="flex gap-2">
                            {difficulties.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setTempSettings({ ...tempSettings, difficulty: d })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${tempSettings.difficulty === d
                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md scale-105'
                                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    {difficultyLabels[d]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Level */}
                    <div className="space-y-2">
                        <Label htmlFor="startLevel" className="uppercase font-bold tracking-wider text-sm">{t('startLevel')}</Label>
                        <Input
                            id="startLevel"
                            type="number"
                            min="1"
                            max="20"
                            value={tempSettings.startLevel}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setTempSettings({
                                    ...tempSettings,
                                    startLevel: Math.min(20, Math.max(1, val))
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="uppercase font-bold text-sm tracking-wider">
                        {t('cancel')}
                    </Button>
                    <Button onClick={() => onSave(tempSettings)} className="uppercase font-bold text-sm tracking-wider">
                        {t('save')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}