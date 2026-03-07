'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FrogSVGProps {
    size?: number;
    isJumping?: boolean;
    /** Rotation in degrees — 0 = sprite default heading (~205° CW from north). */
    rotation?: number;
    /** Total jump duration in ms — sprite animation timing scales to match. */
    jumpDuration?: number;
    className?: string;
}

/**
 * Frog component using the original sprite sheet with frame-by-frame animation.
 * When isJumping transitions to true, cycles through jump frames in sequence.
 * Rotation prop controls which direction the frog faces.
 *
 * Sprite sheet: /games/assets/frog/frog_jump.png (242 × 994)
 * Animation sequence:
 *   idle  → frame_0001 (sitting)
 *   jump  → crouch → stretch (in-air) → land → sit
 */

const SPRITE_URL = '/games/assets/frog/frog_jump.png';
const SHEET_W = 242;
const SHEET_H = 994;

// Sprite frames from the atlas JSON
const FRAMES = {
    sit: { x: 1, y: 844, w: 158, h: 149 }, // frame_0001 - compact sitting
    crouch: { x: 1, y: 316, w: 231, h: 295 }, // frame_0002 - crouching to jump
    stretch: { x: 1, y: 1, w: 240, h: 313 }, // frame_0003 - fully stretched in air
    land: { x: 1, y: 613, w: 222, h: 229 }, // frame_0004 - landing
};

// Largest frame dimensions — used as uniform bounding box so frog never shrinks
const MAX_FRAME_W = 240;
const MAX_FRAME_H = 313;

/**
 * Build jump animation keyframes scaled to the given total duration.
 * Proportions: crouch 15%, stretch 55%, land 25%, sit 5% (=100%)
 */
function buildJumpSequence(totalMs: number): { frame: keyof typeof FRAMES; hold: number }[] {
    return [
        { frame: 'crouch', hold: Math.round(totalMs * 0.15) },
        { frame: 'stretch', hold: Math.round(totalMs * 0.55) },
        { frame: 'land', hold: Math.round(totalMs * 0.25) },
        { frame: 'sit', hold: 0 },
    ];
}

export function FrogSVG({ size = 50, isJumping = false, rotation = 0, jumpDuration = 900, className = '' }: FrogSVGProps) {
    const [currentFrame, setCurrentFrame] = useState<keyof typeof FRAMES>('sit');
    const animRef = useRef<NodeJS.Timeout[]>([]);
    const prevJumping = useRef(false);

    useEffect(() => {
        // Only trigger animation on rising edge: false → true
        if (isJumping && !prevJumping.current) {
            // Clear any pending frame timers
            animRef.current.forEach(clearTimeout);
            animRef.current = [];

            const sequence = buildJumpSequence(jumpDuration);
            let elapsed = 0;
            sequence.forEach(({ frame, hold }) => {
                const timer = setTimeout(() => {
                    setCurrentFrame(frame);
                }, elapsed);
                animRef.current.push(timer);
                elapsed += hold;
            });
        }

        // On falling edge (jump ended), ensure we're back to sit
        if (!isJumping && prevJumping.current) {
            animRef.current.forEach(clearTimeout);
            animRef.current = [];
            setCurrentFrame('sit');
        }

        prevJumping.current = isJumping;

        return () => {
            animRef.current.forEach(clearTimeout);
        };
    }, [isJumping, jumpDuration]);

    const frame = FRAMES[currentFrame];

    // Use the largest frame as a uniform bounding box so the frog never shrinks
    // Scale the uniform box to fit within `size`
    const uniformAspect = MAX_FRAME_W / MAX_FRAME_H;
    const boxW = uniformAspect >= 1 ? size : size * uniformAspect;
    const boxH = uniformAspect >= 1 ? size / uniformAspect : size;

    // Scale factor: how much to scale the current frame to fit proportionally
    // within the uniform bounding box
    const frameScale = Math.min(boxW / frame.w, boxH / frame.h);
    const displayW = frame.w * frameScale;
    const displayH = frame.h * frameScale;

    // Background-size scales the entire sheet so the frame area maps to displayW/displayH
    const bgW = (SHEET_W / frame.w) * displayW;
    const bgH = (SHEET_H / frame.h) * displayH;

    // Background-position offsets
    const bgX = -(frame.x / frame.w) * displayW;
    const bgY = -(frame.y / frame.h) * displayH;

    return (
        <div
            className={className}
            style={{
                width: boxW,
                height: boxH,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
            }}
        >
            <div
                style={{
                    width: displayW,
                    height: displayH,
                    backgroundImage: `url(${SPRITE_URL})`,
                    backgroundSize: `${bgW}px ${bgH}px`,
                    backgroundPosition: `${bgX}px ${bgY}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'auto',
                }}
            />
        </div>
    );
}
