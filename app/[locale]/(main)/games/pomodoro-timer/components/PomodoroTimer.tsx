'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Settings, Coffee, Target, Trash2 } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trackStartGame, trackCompleteGame } from '@/lib/analytics';

enum TimerMode {
  FOCUS = 'focus',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak'
}

interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

interface TodayStats {
  date: string;
  completedSessions: number;
  totalFocusTime: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function PomodoroTimer() {
  const t = useTranslations('games.pomodoroTimer.gameUI');

  // Settings
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Timer state
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Session count (resets on page refresh - used for long/short break decision)
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  // Today's stats (persists, but resets each day)
  const [todayStats, setTodayStats] = useState<TodayStats>({
    date: getTodayDate(),
    completedSessions: 0,
    totalFocusTime: 0
  });

  const intervalRef = useRef<number | null>(null);
  const originalTitleRef = useRef<string>('');

  // Load saved data and settings
  useEffect(() => {
    originalTitleRef.current = document.title;

    // Load settings
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTimeLeft(parsed.focusDuration * 60);
    }

    // Load today's stats
    const savedStats = localStorage.getItem('pomodoroTodayStats');
    if (savedStats) {
      const parsed: TodayStats = JSON.parse(savedStats);
      const today = getTodayDate();

      // Check if it's still today, otherwise reset
      if (parsed.date === today) {
        setTodayStats(parsed);
      } else {
        // New day, reset stats
        const newStats: TodayStats = {
          date: today,
          completedSessions: 0,
          totalFocusTime: 0
        };
        setTodayStats(newStats);
        localStorage.setItem('pomodoroTodayStats', JSON.stringify(newStats));
      }
    }

    return () => {
      document.title = originalTitleRef.current;
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Update tab title with countdown
  useEffect(() => {
    if (isRunning) {
      const modeText = mode === TimerMode.FOCUS ? '🎯 Focus' :
                       mode === TimerMode.SHORT_BREAK ? '☕ Break' :
                       '☕ Long Break';
      document.title = `${formatTime(timeLeft)} - ${modeText}`;
    } else {
      document.title = originalTitleRef.current;
    }
  }, [isRunning, timeLeft, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === TimerMode.FOCUS) {
      const newSessionCount = sessionCompletedCount + 1;
      const newTodayStats: TodayStats = {
        ...todayStats,
        completedSessions: todayStats.completedSessions + 1,
        totalFocusTime: todayStats.totalFocusTime + settings.focusDuration
      };

      setSessionCompletedCount(newSessionCount);
      setTodayStats(newTodayStats);
      localStorage.setItem('pomodoroTodayStats', JSON.stringify(newTodayStats));

      // Track completion
      trackCompleteGame({
        game_id: 'pomodoro-timer',
        duration_ms: settings.focusDuration * 60 * 1000,
        score: newTodayStats.completedSessions
      });

      toast.success(t('focusComplete'));

      // Auto-switch to break based on session count
      if (newSessionCount % settings.sessionsUntilLongBreak === 0) {
        switchMode(TimerMode.LONG_BREAK);
      } else {
        switchMode(TimerMode.SHORT_BREAK);
      }
    } else {
      toast.success(t('breakComplete'));
      // Switch to FOCUS mode but don't auto-start, wait for user
      switchMode(TimerMode.FOCUS);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);

    let duration: number;
    switch (newMode) {
      case TimerMode.FOCUS:
        duration = settings.focusDuration;
        break;
      case TimerMode.SHORT_BREAK:
        duration = settings.shortBreakDuration;
        break;
      case TimerMode.LONG_BREAK:
        duration = settings.longBreakDuration;
        break;
    }

    setTimeLeft(duration * 60);
  };

  const toggleTimer = () => {
    if (!isRunning) {
      trackStartGame({
        game_id: 'pomodoro-timer',
        mode: mode
      });
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switchMode(mode);
  };

  const clearTodayStats = () => {
    const newStats: TodayStats = {
      date: getTodayDate(),
      completedSessions: 0,
      totalFocusTime: 0
    };
    setTodayStats(newStats);
    setSessionCompletedCount(0);
    localStorage.setItem('pomodoroTodayStats', JSON.stringify(newStats));
    toast.success(t('statsCleared'));
  };

  const saveSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));

    // Reset all state
    setIsRunning(false);
    setMode(TimerMode.FOCUS);
    setTimeLeft(newSettings.focusDuration * 60);

    setIsSettingsOpen(false);
    toast.success(t('settingsSaved'));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    let totalSeconds: number;
    switch (mode) {
      case TimerMode.FOCUS:
        totalSeconds = settings.focusDuration * 60;
        break;
      case TimerMode.SHORT_BREAK:
        totalSeconds = settings.shortBreakDuration * 60;
        break;
      case TimerMode.LONG_BREAK:
        totalSeconds = settings.longBreakDuration * 60;
        break;
    }
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case TimerMode.FOCUS:
        return 'from-red-500 to-orange-500';
      case TimerMode.SHORT_BREAK:
        return 'from-green-500 to-teal-500';
      case TimerMode.LONG_BREAK:
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4 max-w-2xl mx-auto">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={mode === TimerMode.FOCUS ? "default" : "outline"}
          onClick={() => switchMode(TimerMode.FOCUS)}
          disabled={isRunning}
          size="sm"
        >
          <Target className="w-4 h-4 mr-2" />
          {t('focus')}
        </Button>
        <Button
          variant={mode === TimerMode.SHORT_BREAK ? "default" : "outline"}
          onClick={() => switchMode(TimerMode.SHORT_BREAK)}
          disabled={isRunning}
          size="sm"
        >
          <Coffee className="w-4 h-4 mr-2" />
          {t('shortBreak')}
        </Button>
        <Button
          variant={mode === TimerMode.LONG_BREAK ? "default" : "outline"}
          onClick={() => switchMode(TimerMode.LONG_BREAK)}
          disabled={isRunning}
          size="sm"
        >
          <Coffee className="w-4 h-4 mr-2" />
          {t('longBreak')}
        </Button>
      </div>

      {/* Timer Display */}
      <motion.div
        className="relative w-80 h-80 mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - getProgress() / 100)}`}
            className={`bg-gradient-to-r ${getModeColor()} transition-all duration-1000`}
            style={{
              stroke: mode === TimerMode.FOCUS ? 'rgb(239, 68, 68)' :
                      mode === TimerMode.SHORT_BREAK ? 'rgb(34, 197, 94)' :
                      'rgb(59, 130, 246)'
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl font-bold font-mono tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Mode label - positioned absolutely, not affecting layout */}
        <div className="absolute bottom-16 left-0 right-0 text-center">
          <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
            {t(mode)}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <Button
          size="lg"
          onClick={toggleTimer}
          className="w-28"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              {t('pause')}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {t('start')}
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t('reset')}
        </Button>
        <SettingsDialog
          settings={settings}
          onSave={saveSettings}
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>

      {/* Today's Statistics - Compact */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {t('todayLabel')}: <strong className="text-foreground">{todayStats.completedSessions}</strong> {t('sessions')} · <strong className="text-foreground">{todayStats.totalFocusTime}</strong> {t('minutes')}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearTodayStats}
          className="h-7 px-2"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t('clear')}
        </Button>
      </div>
    </div>
  );
}

function SettingsDialog({
  settings,
  onSave,
  isOpen,
  onOpenChange
}: {
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('games.pomodoroTimer.settings');
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(tempSettings);
  };

  const handleResetToDefault = () => {
    setTempSettings(DEFAULT_SETTINGS);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline">
          <Settings className="w-5 h-5 mr-2" />
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="focusDuration">{t('focusDuration')}</Label>
            <Input
              id="focusDuration"
              type="number"
              min="0"
              max="100"
              value={tempSettings.focusDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setTempSettings({
                  ...tempSettings,
                  focusDuration: Math.min(100, Math.max(0, val))
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreak">{t('shortBreakDuration')}</Label>
            <Input
              id="shortBreak"
              type="number"
              min="0"
              max="100"
              value={tempSettings.shortBreakDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setTempSettings({
                  ...tempSettings,
                  shortBreakDuration: Math.min(100, Math.max(0, val))
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreak">{t('longBreakDuration')}</Label>
            <Input
              id="longBreak"
              type="number"
              min="0"
              max="100"
              value={tempSettings.longBreakDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setTempSettings({
                  ...tempSettings,
                  longBreakDuration: Math.min(100, Math.max(0, val))
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionsUntilLongBreak">{t('sessionsUntilLongBreak')}</Label>
            <Input
              id="sessionsUntilLongBreak"
              type="number"
              min="0"
              max="100"
              value={tempSettings.sessionsUntilLongBreak}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setTempSettings({
                  ...tempSettings,
                  sessionsUntilLongBreak: Math.min(100, Math.max(0, val))
                });
              }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={handleResetToDefault}>
            {t('resetToDefault')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
