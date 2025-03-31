export const GAME_CONFIG = {
    timing: {
        jumpDelay: 3000,
        labelDelay: 2000,
    },
    frog: {
        scale: 0.43,
        frameRate: 5,
        frames: {
            idle: 'frame_0001.png',
            animation: [
                { frame: 'frame_0001.png', duration: 80 },
                { frame: 'frame_0002.png', duration: 120 },
                { frame: 'frame_0003.png', duration: 120 },
                { frame: 'frame_0004.png', duration: 80 },
                { frame: 'frame_0005.png', duration: 100 },
            ]
        }
    },
    lilyPad: {
        count: 7,
        scale: 0.15,
        spacing: 170,
        shadow: {
            offset: { x: 30, y: 20 },
            alpha: 0.3,
            radius: 35
        },
        ripple: {
            lineWidth: 5,
            color: 0xffffff,
            radius: {
                from: 35,
                to: 90
            },
            duration: 1200
        }
    },
    scoring: {
        base: 100,          // 基础分数
        timeBonus: {        // 时间奖励
            threshold: 3000, // 3秒内完成
            points: 50      // 奖励50分
        },
        streak: {           // 连续正确奖励
            multiplier: 0.1  // 每次正确增加10%
        }
    },
    difficulty: {
        initial: {
            numJumps: 2,    // 改为2次跳跃，让开始更简单
            jumpDelay: 3000 // 3秒间隔
        },
        increment: {
            numJumps: 1,    // 每关增加1次跳跃
            speedup: 0.95   // 每关速度提升5%（改为更温和的递减）
        },
        maxSpeed: 1500,    // 最快1.5秒间隔（增加最小时间，让游戏更可玩）
        maxJumps: 9        // 添加最大跳跃次数限制
    },
    assets: {
        pond: "/games/assets/frog/bg_pond.png",
        startBtn: "/games/assets/frog/start_btn3.png",
        lilyPad: "/games/assets/frog/lily_pad3.png",
        frog: {
            spritesheet: "/games/assets/frog/frog_jump.png",
            atlas: "/games/assets/frog/frog_jump.json"
        }
    },
    bounds: {
        x: { min: 100, max: 700 },
        y: { min: 100, max: 500 }
    },
    messages: {
        start: "Watch our friendly frog's path! 🐸",
        jumping: "Keep your eyes on the jumps...",
        yourTurn: "Your turn! Help the frog follow the same path! 🌿",
        success: "Amazing job! 🎉 Score: {score}\nYou've completed Level {level}!",
        fail: "Oops! Not quite right. Let's try again! 🐸",
        levelStart: "Level {level} begins! 🍃 Remember {jumps} hops!",
        nextLevel: "Ready to hop to Level {level}? 🐸\n{jumps} jumps ahead!",
        maxLevel: "Incredible! You've mastered the pond! 🏆\nYour Final Score: {score}"
    },
    ui: {
        message: {
            y: 50,
            style: {
                fontSize: '24px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#FFFFFF',
                padding: { x: 20, y: 10 },
                resolution: 2,
                align: 'center'
            },
            background: {
                color: 0x000000,
                alpha: 0.8,
                cornerRadius: 16,
                borderWidth: 2,
                borderColor: 0x333333
            }
        },
        button: {
            next: {
                color: '#FF1AAE',      // 粉色按钮
                hoverColor: '#FF47BB'  // 悬停颜色
            }
        }
    }
} as const; 