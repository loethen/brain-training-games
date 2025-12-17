"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { Board } from '@/lib/sudoku';

interface SudokuBoardProps {
    board: Board;
    initialBoard: Board;
    selectedCell: { row: number; col: number } | null;
    onCellClick: (row: number, col: number) => void;
    notes: Record<string, number[]>;
    isMistake: (row: number, col: number) => boolean;
}

export function SudokuBoard({
    board,
    initialBoard,
    selectedCell,
    onCellClick,
    notes,
    isMistake
}: SudokuBoardProps) {

    return (
        <div className="grid grid-cols-9 gap-[1px] bg-slate-300 border-2 border-slate-800 w-full max-w-md aspect-square mx-auto rounded-lg overflow-hidden shadow-xl select-none">
            {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const isInitial = initialBoard[rowIndex][colIndex] !== null;
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                    // Highlight logic
                    const isSameRow = selectedCell?.row === rowIndex;
                    const isSameCol = selectedCell?.col === colIndex;
                    const isSameBox = selectedCell &&
                        Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                        Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);
                    const isSameNumber = cell !== null && selectedCell && board[selectedCell.row][selectedCell.col] === cell;

                    const isHighlighted = (isSameRow || isSameCol || isSameBox) && !isSelected;
                    const isNumberHighlighted = isSameNumber && cell !== null;
                    const hasError = isMistake(rowIndex, colIndex);

                    // Borders for 3x3 boxes
                    const borderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-slate-800 border-r-2' : '';
                    const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-slate-800 border-b-2' : '';

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            className={cn(
                                "relative flex items-center justify-center text-xl sm:text-2xl cursor-pointer transition-colors duration-75",
                                "bg-white hover:bg-indigo-50",
                                isHighlighted && "bg-slate-100",
                                isNumberHighlighted && "bg-indigo-200 text-indigo-900 font-bold",
                                isSelected && "bg-indigo-500 text-white animate-pulse-fast",
                                hasError && !isInitial && "text-red-600 bg-red-100",
                                isInitial && "font-bold text-slate-900",
                                !isInitial && "text-indigo-600",
                                borderRight,
                                borderBottom
                            )}
                        >
                            {cell !== null ? cell : (
                                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5 pointer-events-none">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                        <div key={n} className="flex items-center justify-center">
                                            {notes[`${rowIndex}-${colIndex}`]?.includes(n) && (
                                                <span className="text-[8px] sm:text-[10px] leading-none text-slate-400 font-medium">
                                                    {n}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ))}
        </div>
    );
}
