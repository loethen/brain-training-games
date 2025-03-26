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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
                aria-label="Previous"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
                onClick={() => {
                    const container = document.getElementById('games-container');
                    if (container) {
                        container.scrollBy({ left: 400, behavior: 'smooth' });
                    }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
                aria-label="Next"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </>
    );
} 