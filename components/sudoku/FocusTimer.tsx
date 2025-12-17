"use client"

import React, { useEffect, useState } from 'react';
import { Timer, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FocusTimerProps {
    isActive: boolean;
    onPauseToggle: () => void;
}

export function FocusTimer({ isActive, onPauseToggle }: FocusTimerProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <Timer className="w-4 h-4 text-indigo-500" />
            <span className="font-mono text-lg font-medium text-slate-700 w-[60px] text-center">
                {formatTime(seconds)}
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={onPauseToggle}
                className="h-6 w-6 ml-1 text-slate-400 hover:text-indigo-600"
            >
                {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
        </div>
    );
}
