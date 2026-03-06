import { useRef, useCallback } from 'react';

export type GamePhase = 'idle' | 'watching' | 'tracking' | 'selecting' | 'completed';

export interface Fish {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    isTarget: boolean;
    isSelected: boolean;
    isChecking: boolean;
    isWrongSelection: boolean;
}

/** Difficulty preset multipliers */
export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
    easy: 0.7,
    medium: 1.0,
    hard: 1.4,
};

/** Compute difficulty parameters from a level number and difficulty preset */
export function getLevelParams(level: number, difficulty: Difficulty = 'medium') {
    const m = DIFFICULTY_MULTIPLIERS[difficulty];
    return {
        fishCount: Math.min(Math.round((4 + level) * m), 20),              // 5,6,7…grows by 1 per level
        targetCount: Math.min(Math.max(1, Math.round((1 + Math.floor(level / 3)) * m)), 6), // grows every 3 levels
        speed: Math.min((0.8 + level * 0.1) * m, 3.0),                    // gentler speed ramp
        glowDuration: Math.max(Math.round((3500 - level * 100) / m), 1200),  // slower shrink
        trackDuration: Math.max(Math.round((5500 - level * 150) / m), 2000), // slower shrink
    };
}

export function useFishEngine({
    containerWidth,
    containerHeight,
    fishCount,
    targetCount,
    speedMultiplier = 1,
    onCollision
}: {
    containerWidth: number;
    containerHeight: number;
    fishCount: number;
    targetCount: number;
    speedMultiplier?: number;
    onCollision?: () => void;
}) {
    const minSpeed = -80 * speedMultiplier;
    const maxSpeed = 80 * speedMultiplier;
    const speedScale = Math.min(containerWidth, containerHeight) / 1000;

    const fishesRef = useRef<Record<number, Fish>>({});
    const isMovingRef = useRef(false);
    const animationRef = useRef<number>(0);

    const getRandomVelocity = useCallback(() => {
        let v = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * speedScale;
        // Avoid speeds too close to 0
        if (Math.abs(v) < 20 * speedScale) {
            v = v > 0 ? 20 * speedScale : -20 * speedScale;
        }
        // Add ±20% random variation for natural feel
        v *= 0.8 + Math.random() * 0.4;
        return v;
    }, [maxSpeed, minSpeed, speedScale]);

    const initFishes = useCallback(() => {
        const newFishes: Record<number, Fish> = {};
        const targetIndices = new Set<number>();
        while (targetIndices.size < targetCount) {
            targetIndices.add(Math.floor(Math.random() * fishCount));
        }

        for (let i = 0; i < fishCount; i++) {
            newFishes[i] = {
                id: i,
                x: 60 + Math.random() * (containerWidth - 120),
                y: 60 + Math.random() * (containerHeight - 120),
                vx: getRandomVelocity(),
                vy: getRandomVelocity(),
                isTarget: targetIndices.has(i),
                isSelected: false,
                isChecking: false,
                isWrongSelection: false
            };
        }
        fishesRef.current = newFishes;
    }, [fishCount, targetCount, containerWidth, containerHeight, getRandomVelocity]);

    const startMovement = useCallback(() => {
        isMovingRef.current = true;
        let lastTime = performance.now();
        const fishRadius = 40;

        // Random mid-tracking velocity perturbation timer
        let nextPerturbTime = performance.now() + 2000 + Math.random() * 3000;

        const loop = (time: number) => {
            if (!isMovingRef.current) return;

            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;
            const dt = Math.min(deltaTime, 0.1);

            const fishes = Object.values(fishesRef.current);

            // Random velocity perturbations for more natural movement
            if (time > nextPerturbTime) {
                const randomFish = fishes[Math.floor(Math.random() * fishes.length)];
                if (randomFish) {
                    randomFish.vx *= (0.85 + Math.random() * 0.3);
                    randomFish.vy *= (0.85 + Math.random() * 0.3);
                    // Ensure minimum speed
                    if (Math.abs(randomFish.vx) < 15 * speedScale) {
                        randomFish.vx = (randomFish.vx > 0 ? 1 : -1) * 20 * speedScale;
                    }
                    if (Math.abs(randomFish.vy) < 15 * speedScale) {
                        randomFish.vy = (randomFish.vy > 0 ? 1 : -1) * 20 * speedScale;
                    }
                }
                nextPerturbTime = time + 1500 + Math.random() * 2500;
            }

            // Update positions
            for (let i = 0; i < fishes.length; i++) {
                const fish = fishes[i];
                fish.x += fish.vx * dt;
                fish.y += fish.vy * dt;

                // Wall collisions
                if (fish.x <= fishRadius) {
                    fish.x = fishRadius;
                    fish.vx = Math.abs(fish.vx);
                } else if (fish.x >= containerWidth - fishRadius) {
                    fish.x = containerWidth - fishRadius;
                    fish.vx = -Math.abs(fish.vx);
                }

                if (fish.y <= fishRadius) {
                    fish.y = fishRadius;
                    fish.vy = Math.abs(fish.vy);
                } else if (fish.y >= containerHeight - fishRadius) {
                    fish.y = containerHeight - fishRadius;
                    fish.vy = -Math.abs(fish.vy);
                }
            }

            // Fish-to-fish collision
            for (let i = 0; i < fishes.length; i++) {
                for (let j = i + 1; j < fishes.length; j++) {
                    const f1 = fishes[i];
                    const f2 = fishes[j];

                    const dx = f2.x - f1.x;
                    const dy = f2.y - f1.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = fishRadius * 1.5;

                    if (distSq < minDist * minDist) {
                        const tempVx = f1.vx;
                        const tempVy = f1.vy;
                        f1.vx = f2.vx;
                        f1.vy = f2.vy;
                        f2.vx = tempVx;
                        f2.vy = tempVy;

                        const dist = Math.sqrt(distSq) || 1;
                        const overlap = (minDist - dist) / 2;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        f1.x -= nx * overlap;
                        f1.y -= ny * overlap;
                        f2.x += nx * overlap;
                        f2.y += ny * overlap;

                        if (onCollision) onCollision();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(loop);
        };
        animationRef.current = requestAnimationFrame(loop);
    }, [containerWidth, containerHeight, onCollision, speedScale]);

    const stopMovement = useCallback(() => {
        isMovingRef.current = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }, []);

    const toggleSelection = useCallback((id: number) => {
        const fish = fishesRef.current[id];
        if (fish) {
            fish.isSelected = !fish.isSelected;
        }
    }, []);

    const markResults = useCallback(() => {
        const fishes = Object.values(fishesRef.current);
        fishes.forEach(fish => {
            fish.isChecking = true;
            if (fish.isSelected && !fish.isTarget) {
                fish.isWrongSelection = true;
            }
        });
    }, []);

    /** Calculate score for the current round */
    const calculateScore = useCallback((level: number): { correct: number; wrong: number; missed: number; total: number; isPerfect: boolean; points: number } => {
        const fishes = Object.values(fishesRef.current);
        const correct = fishes.filter(f => f.isTarget && f.isSelected).length;
        const wrong = fishes.filter(f => !f.isTarget && f.isSelected).length;
        const missed = fishes.filter(f => f.isTarget && !f.isSelected).length;
        const total = fishes.filter(f => f.isTarget).length;
        const isPerfect = wrong === 0 && missed === 0;

        // Points: base per correct, bonus for perfect
        let points = correct * 100;
        if (isPerfect) {
            points += level * 50; // bonus
        }
        // Penalty for wrong selections
        points = Math.max(0, points - wrong * 50);

        return { correct, wrong, missed, total, isPerfect, points };
    }, []);

    return {
        fishesRef,
        initFishes,
        startMovement,
        stopMovement,
        toggleSelection,
        markResults,
        calculateScore,
    };
}
