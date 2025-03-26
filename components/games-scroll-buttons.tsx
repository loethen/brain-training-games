'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

export function GamesScrollButtons() {
    return (
        <>
            <button 
                onClick={() => {
                    const container = document.getElementById('games-container');
                    if (container) {
                        container.scrollBy({ left: -400, behavior: 'smooth' });
                    }
                }}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-emerald-500 shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-emerald-600"
                aria-label="Previous"
            >
                <ChevronLeft className="h-12 w-12 text-white" />
            </button>
            <button 
                onClick={() => {
                    const container = document.getElementById('games-container');
                    if (container) {
                        container.scrollBy({ left: 400, behavior: 'smooth' });
                    }
                }}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-emerald-500 shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-emerald-600"
                aria-label="Next"
            >
                <ChevronRight className="h-12 w-12 text-white" />
            </button>
        </>
    );
} 