'use client';

import dynamic from 'next/dynamic'

const GameComponent = dynamic(() => import('./GameComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div>Loading game...</div>
        </div>
    )
});

export default function Game() {
    return (
        <div className="max-w-3xl mx-auto aspect-[4/3]">
            <GameComponent />
        </div>
    );
} 