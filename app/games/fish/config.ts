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
        gameDuration: 18000
    },
    fish: {
        count: 10,
        glowingCount: 3,
        scale: {
            base: 0.001,
            bubble: 0.08
        }
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
    }
} as const; 