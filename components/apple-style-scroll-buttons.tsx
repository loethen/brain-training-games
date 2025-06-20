'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

export function AppleStyleScrollButtons() {
    return (
        <div className="flex gap-3">
            <button 
                onClick={() => {
                    const container = document.getElementById('apple-games-container');
                    if (container) {
                        container.scrollBy({ left: -380, behavior: 'smooth' });
                    }
                }}
                className="flex w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label="Previous"
            >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button 
                onClick={() => {
                    const container = document.getElementById('apple-games-container');
                    if (container) {
                        container.scrollBy({ left: 380, behavior: 'smooth' });
                    }
                }}
                className="flex w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label="Next"
            >
                <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
        </div>
    );
} 