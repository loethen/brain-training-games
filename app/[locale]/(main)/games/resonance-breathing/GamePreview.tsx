'use client';

import { motion } from 'framer-motion';

export function GamePreview() {
    const petals = [
        { openAngle: -60, color: '#A5E3D9', opacity: 0.7, scale: 0.85 },
        { openAngle: 60, color: '#A5E3D9', opacity: 0.7, scale: 0.85 },
        { openAngle: -40, color: '#7DD4C6', opacity: 0.8, scale: 0.9 },
        { openAngle: 40, color: '#7DD4C6', opacity: 0.8, scale: 0.9 },
        { openAngle: -20, color: '#5DC8B8', opacity: 0.85, scale: 0.95 },
        { openAngle: 20, color: '#5DC8B8', opacity: 0.85, scale: 0.95 },
        { openAngle: 0, color: '#4ABDAC', opacity: 0.9, scale: 1 },
    ];

    // Smaller dimensions for preview
    const petalWidth = 30;
    const petalHeight = 80;

    return (
        <div className="relative w-full h-full min-h-[200px] bg-white border border-gray-100 rounded-lg overflow-hidden flex items-end justify-center pb-4">
            <svg width="160" height="140" viewBox="0 0 200 140" className="overflow-visible">
                {/* Horizon line - gray-200 */}
                <line x1="20" y1="130" x2="180" y2="130" stroke="#E5E7EB" strokeWidth="1" />

                {/* Petals container - centered at Point B (100, 130) */}
                <g transform="translate(100, 130)">
                    {petals.map((petal, index) => (
                        <motion.g
                            key={index}
                            animate={{
                                rotate: [0, petal.openAngle, 0],
                                scaleX: petal.scale,
                                scaleY: petal.scale,
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.abs(petal.openAngle) * 0.002,
                            }}
                        >
                            <g>
                                {/* Visible Petal */}
                                <path
                                    d={`M0 0
                     C-${petalWidth} -${petalHeight * 0.4}, -${petalWidth} -${petalHeight * 0.8}, 0 -${petalHeight}
                     C${petalWidth} -${petalHeight * 0.8}, ${petalWidth} -${petalHeight * 0.4}, 0 0`}
                                    fill={petal.color}
                                    opacity={petal.opacity}
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

            {/* Label - Black font */}
            <motion.div
                className="absolute bottom-2 text-black/40 text-[10px] uppercase font-bold tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                BREATHE
            </motion.div>
        </div>
    );
}
