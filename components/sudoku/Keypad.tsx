"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeypadProps {
    onNumberClick: (num: number) => void;
    onDeleteClick: () => void;
    onNoteToggle: () => void;
    isNoteMode: boolean;
    t: (key: string) => string;
}

export function Keypad({
    onNumberClick,
    onDeleteClick,
    onNoteToggle,
    isNoteMode,
    t
}: KeypadProps) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-6">
            <div className="flex justify-between gap-2 px-2">
                <Button
                    variant={isNoteMode ? "default" : "outline"}
                    onClick={onNoteToggle}
                    className={cn("flex-1 transition-all", isNoteMode ? "bg-indigo-600 hover:bg-indigo-700" : "text-slate-600")}
                >
                    <Pencil className="w-4 h-4 mr-2" />
                    {isNoteMode ? t('keypad.notesOn') : t('keypad.notesOff')}
                </Button>
                <Button
                    variant="outline"
                    onClick={onDeleteClick}
                    className="flex-1 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                >
                    <Eraser className="w-4 h-4 mr-2" />
                    {t('keypad.erase')}
                </Button>
            </div>

            <div className="grid grid-cols-9 sm:grid-cols-9 gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                        key={num}
                        onClick={() => onNumberClick(num)}
                        variant="outline"
                        className="h-12 text-xl font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    >
                        {num}
                    </Button>
                ))}
            </div>
        </div>
    );
}
