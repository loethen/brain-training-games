"use client";

import dynamic from 'next/dynamic';

// Dynamically import the client-side game component
const GameClient = dynamic(() => import('./GameClient'), {
    ssr: false, // Disable server-side rendering for this component
    loading: () => ( // Optional: Show a loading state while the component loads
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6">Flip Cards Demo</h2>
            <div className="text-center py-10">Loading game...</div>
        </div>
    )
});

// This Game component now only handles the dynamic import
export default function Game() {
    return <GameClient />;
}
