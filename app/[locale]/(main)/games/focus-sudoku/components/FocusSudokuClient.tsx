"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { SudokuBoard } from '@/components/sudoku/SudokuBoard';
import { Keypad } from '@/components/sudoku/Keypad';
import { FocusTimer } from '@/components/sudoku/FocusTimer';
import { generatePuzzle, Board } from '@/lib/sudoku';
import { Button } from '@/components/ui/button';
import { Trophy, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function FocusSudokuClient() {
    const t = useTranslations('games.focusSudoku');
    const [board, setBoard] = useState<Board>([]);
    const [initialBoard, setInitialBoard] = useState<Board>([]);
    const [solvedBoard, setSolvedBoard] = useState<Board>([]);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [mistakes, setMistakes] = useState(0);
    const [notes, setNotes] = useState<Record<string, number[]>>({});
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    const startNewGame = useCallback((diff: 'easy' | 'medium' | 'hard' = 'easy') => {
        const { initialBoard: init, solvedBoard: solved } = generatePuzzle(diff);
        setInitialBoard(init);
        setSolvedBoard(solved);
        setBoard(JSON.parse(JSON.stringify(init)));
        setMistakes(0);
        setNotes({});
        setIsGameActive(true);
        setIsGameWon(false);
        setSelectedCell(null);
        setDifficulty(diff);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const handleCellClick = (row: number, col: number) => {
        if (!isGameActive) return;
        setSelectedCell({ row, col });
    };

    const checkWin = useCallback((currentBoard: Board) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c] !== solvedBoard[r][c]) return;
            }
        }
        setIsGameWon(true);
        setIsGameActive(false);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, [solvedBoard]);

    const handleNumberInput = useCallback((num: number) => {
        if (!isGameActive) return;

        if (!selectedCell) {
            toast.warning(t('toast.selectCell'));
            return;
        }
        const { row, col } = selectedCell;

        // Cannot edit initial cells
        if (initialBoard[row][col] !== null) return;

        if (isNoteMode) {
            const key = `${row}-${col}`;
            setNotes(prev => {
                const currentNotes = prev[key] || [];
                if (currentNotes.includes(num)) {
                    return { ...prev, [key]: currentNotes.filter(n => n !== num) };
                } else {
                    return { ...prev, [key]: [...currentNotes, num].sort() };
                }
            });
        } else {
            // Check if correct
            if (solvedBoard[row][col] === num) {
                const newBoard = [...board];
                newBoard[row] = [...newBoard[row]];
                newBoard[row][col] = num;
                setBoard(newBoard);

                // Check win condition
                checkWin(newBoard);
            } else {
                setMistakes(m => m + 1);
                toast.error(t('toast.incorrect'));
            }
        }
    }, [isGameActive, selectedCell, initialBoard, isNoteMode, solvedBoard, board, checkWin, t]);

    const handleDelete = useCallback(() => {
        if (!isGameActive || !selectedCell) return;
        const { row, col } = selectedCell;
        if (initialBoard[row][col] !== null) return;

        if (isNoteMode) {
            setNotes(prev => ({ ...prev, [`${row}-${col}`]: [] }));
        } else {
            const newBoard = [...board];
            newBoard[row][col] = null;
            setBoard(newBoard);
        }
    }, [isGameActive, selectedCell, initialBoard, isNoteMode, board]);

    const isMistake = (row: number, col: number) => {
        return board[row][col] !== null && board[row][col] !== solvedBoard[row][col];
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isGameActive) return;

            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= 9) {
                handleNumberInput(num);
                return;
            }

            if (e.key === 'Backspace' || e.key === 'Delete') {
                handleDelete();
                return;
            }

            if (e.key === 'n' || e.key === 'N') {
                setIsNoteMode(prev => !prev);
                return;
            }

            if (!selectedCell) return;
            const { row, col } = selectedCell;

            if (e.key === 'ArrowUp') setSelectedCell({ row: Math.max(0, row - 1), col });
            if (e.key === 'ArrowDown') setSelectedCell({ row: Math.min(8, row + 1), col });
            if (e.key === 'ArrowLeft') setSelectedCell({ row, col: Math.max(0, col - 1) });
            if (e.key === 'ArrowRight') setSelectedCell({ row, col: Math.min(8, col + 1) });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameActive, selectedCell, isNoteMode, board, solvedBoard, handleDelete, handleNumberInput]);

    if (board.length === 0) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    // Hint Feature
    const handleHint = () => {
        if (!isGameActive) return;

        if (selectedCell) {
            const { row, col } = selectedCell;
            if (initialBoard[row][col] === null) {
                const correctNum = solvedBoard[row][col];
                if (board[row][col] !== correctNum) {
                    const newBoard = [...board];
                    newBoard[row][col] = correctNum;
                    setBoard(newBoard);
                    setMistakes(m => m + 1);
                    setNotes(prev => ({ ...prev, [`${row}-${col}`]: [] }));
                    checkWin(newBoard);
                    return;
                }
            }
        }

        const emptyCells: { r: number, c: number }[] = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === null) emptyCells.push({ r, c });
            }
        }

        if (emptyCells.length > 0) {
            const idx = Math.floor(Math.random() * emptyCells.length);
            const { r, c } = emptyCells[idx];
            const newBoard = [...board];
            newBoard[r][c] = solvedBoard[r][c]!;
            setBoard(newBoard);
            setSelectedCell({ row: r, col: c });
            checkWin(newBoard);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-5xl mx-auto p-4">
            {/* Left Column: Board */}
            <div className="flex-1 w-full max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium">{t('mistakes')}: <span className={mistakes > 2 ? 'text-red-500' : 'text-slate-900'}>{mistakes}/3</span></span>
                        <span className="text-slate-500 font-medium capitalize">{t(`difficulty.${difficulty}`)}</span>
                    </div>
                    <FocusTimer isActive={isGameActive} onPauseToggle={() => setIsGameActive(!isGameActive)} />
                </div>

                <SudokuBoard
                    board={board}
                    initialBoard={initialBoard}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                    notes={notes}
                    isMistake={isMistake}
                />

                <div className="flex gap-2 mt-4 justify-center">
                    <Button onClick={handleHint} variant="secondary" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200">
                        💡 {t('hint')}
                    </Button>
                </div>

                <Keypad
                    onNumberClick={handleNumberInput}
                    onDeleteClick={handleDelete}
                    onNoteToggle={() => setIsNoteMode(!isNoteMode)}
                    isNoteMode={isNoteMode}
                    t={t}
                />
            </div>

            {/* Right Column: Controls */}
            <div className="w-full lg:w-64 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        {t('newGame')}
                    </h3>
                    <div className="flex flex-col gap-2">
                        {(['easy', 'medium', 'hard'] as const).map((d) => (
                            <Button
                                key={d}
                                onClick={() => startNewGame(d)}
                                variant={difficulty === d ? "default" : "outline"}
                                className="w-full capitalize justify-start"
                            >
                                {t(`difficulty.${d}`)}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {t('completeGuide')}
                    </h3>
                    <div className="text-sm text-indigo-800 space-y-3 opacity-90">
                        <p><strong>{t('guide.goal')}:</strong> {t('guide.goalContent')}</p>
                        <p><strong>{t('guide.rules')}:</strong></p>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                            <li dangerouslySetInnerHTML={{ __html: t.raw('guide.rule1') }} />
                            <li dangerouslySetInnerHTML={{ __html: t.raw('guide.rule2') }} />
                            <li dangerouslySetInnerHTML={{ __html: t.raw('guide.rule3') }} />
                        </ul>
                        <p className="mt-2 text-xs bg-indigo-100 p-2 rounded">
                            <strong>{t('guide.tip')}:</strong> {t('guide.tipContent')}
                        </p>
                    </div>
                </div>
            </div>

            {isGameWon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('win.title')}</h2>
                        <p className="text-slate-600 mb-6">{t('win.message', { difficulty })}</p>
                        <Button onClick={() => startNewGame(difficulty)} className="w-full">
                            {t('win.playAgain')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
