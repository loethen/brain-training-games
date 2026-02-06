'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface LotusFlowerProps {
    phase: 'inhale' | 'exhale' | 'idle';
    duration: number;
}

export default function LotusFlower({ phase, duration }: LotusFlowerProps) {
    const isInhale = phase === 'inhale';
    const isExhale = phase === 'exhale';
    const isActive = isInhale || isExhale;
    const t = useTranslations('games.resonanceBreathing.ui');

    // 7 petals configuration
    const petals = [
        // Outer
        { id: 'left-3', openAngle: -60, color: '#A5E3D9', opacity: 0.7, scale: 0.85 },
        { id: 'right-3', openAngle: 60, color: '#A5E3D9', opacity: 0.7, scale: 0.85 },
        // Middle
        { id: 'left-2', openAngle: -40, color: '#7DD4C6', opacity: 0.8, scale: 0.9 },
        { id: 'right-2', openAngle: 40, color: '#7DD4C6', opacity: 0.8, scale: 0.9 },
        // Inner
        { id: 'left-1', openAngle: -20, color: '#5DC8B8', opacity: 0.85, scale: 0.95 },
        { id: 'right-1', openAngle: 20, color: '#5DC8B8', opacity: 0.85, scale: 0.95 },
        // Center
        { id: 'center', openAngle: 0, color: '#4ABDAC', opacity: 0.9, scale: 1 },
    ];

    // Petal dimensions
    const petalWidth = 80;
    const petalHeight = 220;

    return (
        <div className="relative w-80 h-72 md:w-96 md:h-[22rem] flex items-end justify-center">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 350"
                className="overflow-visible"
            >
                {/* Horizon line - Minimalist Gray */}
                <line
                    x1="0"
                    y1="330"
                    x2="400"
                    y2="330"
                    stroke="#E5E7EB" // gray-200
                    strokeWidth="1"
                />

                {/* Petals container - translated to Horizon Point (200, 330) */}
                <g transform="translate(200, 330)">
                    {petals.map((petal) => (
                        <motion.g
                            key={petal.id}
                            animate={{
                                rotate: isInhale ? petal.openAngle : 0,
                                scaleX: petal.scale,
                                scaleY: petal.scale
                            }}
                            transition={{
                                duration: duration,
                                ease: isInhale ? 'easeOut' : 'easeIn',
                                delay: isInhale ? Math.abs(petal.openAngle) * 0.002 : 0
                            }}
                        >
                            <g>
                                {/* Visible Petal - Cubic Bezier for rounder shape */}
                                <path
                                    d={`M0 0 
                     C-${petalWidth} -${petalHeight * 0.4}, -${petalWidth} -${petalHeight * 0.8}, 0 -${petalHeight}
                     C${petalWidth} -${petalHeight * 0.8}, ${petalWidth} -${petalHeight * 0.4}, 0 0`}
                                    fill={petal.color}
                                    opacity={petal.opacity}
                                />

                                {/* Inner detail line */}
                                <path
                                    d={`M0 0 L0 -${petalHeight * 0.7}`}
                                    stroke="white"
                                    strokeWidth="1.5"
                                    opacity="0.3"
                                    fill="none"
                                />

                                {/* INVISIBLE COUNTER-BALANCE */}
                                <rect
                                    x={-petalWidth}
                                    y={0}
                                    width={petalWidth * 2}
                                    height={petalHeight}
                                    fill="none"
                                    opacity="0"
                                />
                            </g>
                        </motion.g>
                    ))}
                </g>
            </svg>

            {/* Phase text - Minimalist Black/Gray */}
            <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium tracking-[0.2em] uppercase"
                animate={{ opacity: isActive ? 1 : 0.4 }}
            >
                <span className="text-black">
                    {isInhale ? t('inhale') : isExhale ? t('exhale') : t('ready')}
                </span>
            </motion.div>
        </div>
    );
}
