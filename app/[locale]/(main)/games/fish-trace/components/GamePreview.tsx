'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SunfishSVG } from './SunfishSVG'

// Define the animated preview component for Fish Trace
export function GamePreview() {
    const [isMounted, setIsMounted] = useState(false);
    const [fishes, setFishes] = useState<Array<{ id: number, x: number, y: number, isGlowing: boolean, delay: number }>>([]);
    const [bubbles, setBubbles] = useState<Array<{ id: number, size: number, left: number, delay: number, duration: number }>>([]);

    useEffect(() => {
        setIsMounted(true);
        // Create 2 fish with random positions
        const initialFishes = Array.from({ length: 2 }).map((_, i) => ({
            id: i,
            x: 20 + Math.random() * 60, // 20% to 80% width
            y: 20 + Math.random() * 60, // 20% to 80% height
            isGlowing: i === 0, // Only 1 fish will be glowing
            delay: Math.random() * 2 // Random animation delay
        }));

        // Bubble static properties
        const initialBubbles = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            size: 4 + Math.random() * 8,
            left: 10 + Math.random() * 80,
            delay: Math.random() * 5,
            duration: 4 + Math.random() * 4
        }));

        setFishes(initialFishes);
        setBubbles(initialBubbles);
    }, []);

    if (!isMounted) {
        // Return a static placeholder to avoid hydration mismatch
        return (
            <div className="w-full h-full min-h-[250px] relative overflow-hidden rounded-xl bg-gradient-to-b from-blue-400/20 to-blue-600/20 dark:from-blue-900/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="waves-placeholder" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                                <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeOpacity="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#waves-placeholder)" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[250px] relative overflow-hidden rounded-xl bg-gradient-to-b from-blue-400/20 to-blue-600/20 dark:from-blue-900/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800">

            {/* Ocean background elements */}
            <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeOpacity="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#waves)" />
                </svg>
            </div>

            {/* Floating particles (bubbles) */}
            {bubbles.map((bubble) => (
                <motion.div
                    key={`bubble-${bubble.id}`}
                    className="absolute rounded-full bg-blue-100/40 dark:bg-blue-300/20"
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.left}%`,
                        bottom: "-20px"
                    }}
                    animate={{
                        y: [-20, -300],
                        x: [0, Math.random() * 30 - 15, Math.random() * -30 + 15, 0],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: bubble.duration,
                        repeat: Infinity,
                        delay: bubble.delay,
                        ease: "linear"
                    }}
                />
            ))}

            {/* The animated Fishes */}
            {fishes.map((fish) => (
                <motion.div
                    key={fish.id}
                    className="absolute"
                    style={{
                        left: `${fish.x}%`,
                        top: `${fish.y}%`
                    }}
                    animate={{
                        x: [0, Math.random() * 80 - 40, Math.random() * -80 + 40, 0],
                        y: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: fish.delay
                    }}
                >
                    <div className="relative flex items-center justify-center scale-75 md:scale-100">
                        <SunfishSVG
                            isGlowing={fish.isGlowing}
                            isSelected={false}
                            isTarget={fish.isGlowing}
                            isChecking={false}
                            isWrongSelection={false}
                            size={56}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
