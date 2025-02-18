export const GAME_CONFIG = {
    speeds: {
        max: 80,
        min: -80,
        excludeRanges: {
            x: { min: -50, max: 50 },
            y: { min: -20, max: 20 }
        }
    },
    timing: {
        moveDelay: 3000,
        collisionRecovery: 600,
        glowDuration: 12000,
        gameDuration: 18000,
        warningBeforeGlowEnd: 3000,
        selectionTime: 10000,
    },
    fish: {
        count: 10,
        glowingCount: 3,
        scale: {
            base: 0.001,
            bubble: 0.08
        },
        clickableRadius: 40
    },
    glow: {
        color: 0xFF1AAE,
        lineWidth: 5,
        radius: {
            default: 40,
            from: 36,
            to: 50
        }
    },
    assets: {
        seaBg: "/games/assets/sea/sea_bg.png",
        seaBtn: "/games/assets/sea/sea_btn.png",
        bubble: "/games/assets/sea/bubble.png",
        sunfish: {
            path: "/games/assets/sea/sunfish_sprite_3.png",
            frameWidth: 110,
            frameHeight: 81,
            frameRate: 6,
            frames: { start: 0, end: 2 }
        }
    },
    difficulty: {
        initial: {
            fishCount: 4,
            glowingCount: 1,
            timeMultiplier: 1
        },
        increment: {
            fishCount: 2,
            glowingCount: 1,
            timeMultiplier: 0.9
        }
    },
    messages: {
        start: "Watch the fish with glowing circles!",
        glowEnding: "Circles will disappear soon...",
        tracking: "Keep tracking those fish!",
        selection: "Click on the fish that had circles!",
        success: "🎉 Perfect! Level {level} completed!",
        fail: "Game Over! Your final score: ",
        nextLevel: "Continue to Level {level}"
    }
} as const; 