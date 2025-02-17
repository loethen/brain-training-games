import { Scene, GameObjects, Physics } from 'phaser';
import { GAME_CONFIG } from '../config';

interface GlowCircle {
    glow: GameObjects.Graphics;
    fish: Physics.Arcade.Sprite;
}

interface GlowGraphics extends GameObjects.Graphics {
    radius?: number;
}

export class SunfishScene extends Scene {
    private sunfishGroup!: Physics.Arcade.Group;
    private glowCircles: GlowCircle[] = [];
    private sunfishCount: number = GAME_CONFIG.fish.count;
    private glowingSunfishCount: number = GAME_CONFIG.fish.glowingCount;
    private glowColor: number = GAME_CONFIG.glow.color;
    private glowDuration: number = GAME_CONFIG.timing.glowDuration;
    private gameDuration: number = GAME_CONFIG.timing.gameDuration;
    private timers: Phaser.Time.TimerEvent[] = [];

    constructor() {
        super({ key: 'SunfishScene' });
    }

    init(config: { sunfishCount?: number; glowingSunfishCount?: number; glowColor?: number; glowDuration?: number; gameDuration?: number; ranbowfishCount?: number; }) {
        this.sunfishCount = config.sunfishCount || GAME_CONFIG.fish.count;
        this.glowingSunfishCount = config.glowingSunfishCount || GAME_CONFIG.fish.glowingCount;
        this.glowColor = config.glowColor || GAME_CONFIG.glow.color;
        this.glowDuration = config.glowDuration || GAME_CONFIG.timing.glowDuration;
        this.gameDuration = config.gameDuration || GAME_CONFIG.timing.gameDuration;
    }

    preload() {
        this.load.image("sea", GAME_CONFIG.assets.seaBg);
        this.load.image("bubble", GAME_CONFIG.assets.bubble);
        this.load.spritesheet("sunfish", GAME_CONFIG.assets.sunfish.path, {
            frameWidth: GAME_CONFIG.assets.sunfish.frameWidth,
            frameHeight: GAME_CONFIG.assets.sunfish.frameHeight,
        });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.image(width/2, height/2, "sea")
            .setDisplaySize(width, height);
        
        this.anims.create({
            key: "swim_sunfish",
            frames: this.anims.generateFrameNumbers("sunfish", GAME_CONFIG.assets.sunfish.frames),
            frameRate: GAME_CONFIG.assets.sunfish.frameRate,
            repeat: -1,
        });

        this.createSunfishes();
        this.chooseGlowFishes(this.sunfishGroup, this.glowingSunfishCount);

        this.time.delayedCall(this.gameDuration, () => {
            this.physics.pause();
            this.tweens.pauseAll();

            this.sunfishGroup.children.each((sunfish, index) => {
                const sprite = sunfish as Physics.Arcade.Sprite;
                const text = this.add.text(sprite.x, sprite.y, (index+1).toString(), {
                    font: `${Math.min(width, height) * 0.05}px Arial`,
                    color: 'red'
                }).setOrigin(0.5, 0.5);
                text.setShadow(0, 0, 'white', 8, true, true);
                return null;
            });
        }, [], this);
    }

    createSunfishes() {
        this.sunfishGroup = this.physics.add.group({
            key: "sunfish",
            repeat: this.sunfishCount - 1,
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
        });

        const width = this.scale.width;
        const height = this.scale.height;
        const scale = Math.min(width, height) * GAME_CONFIG.fish.scale.base;

        this.sunfishGroup.children.iterate((child) => {
            const fish = child as Physics.Arcade.Sprite;
            fish.setX(Phaser.Math.Between(0, width));
            fish.setY(Phaser.Math.Between(0, height));
            fish.setVelocity(0, 0);
            fish.setScale(scale);
            fish.play("swim_sunfish");

            const bubbles = this.add.particles(0, 0, "bubble", {
                speed: { min: -30, max: 30 },
                scale: { start: scale * GAME_CONFIG.fish.scale.bubble, end: 0 },
                frequency: 300,
                lifespan: 2000,
                alpha: { start: 0.8, end: 0 },
                blendMode: "ADD",
            });

            bubbles.startFollow(fish);
            return null;
        });

        this.physics.add.collider(this.sunfishGroup, this.sunfishGroup, (fish1, fish2) => {
            const sunfish1 = fish1 as Physics.Arcade.Sprite;
            const sunfish2 = fish2 as Physics.Arcade.Sprite;
            
            sunfish1.setAcceleration(
                this.randomVelocity(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max),
                this.randomVelocity(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max)
            );
            sunfish2.setAcceleration(
                this.randomVelocity(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max),
                this.randomVelocity(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max)
            );

            this.time.delayedCall(GAME_CONFIG.timing.collisionRecovery, () => {
                sunfish1.setAcceleration(0, 0);
                sunfish2.setAcceleration(0, 0);
            });
        });

        const timer = this.time.delayedCall(GAME_CONFIG.timing.moveDelay, () => {
            this.sunfishGroup.children.iterate((child) => {
                const fish = child as Physics.Arcade.Sprite;
                fish.setVelocity(
                    this.randomVelocity(GAME_CONFIG.speeds.excludeRanges.x.min, GAME_CONFIG.speeds.excludeRanges.x.max),
                    this.randomVelocity(GAME_CONFIG.speeds.excludeRanges.y.min, GAME_CONFIG.speeds.excludeRanges.y.max)
                );
                return null;
            });
        });
        this.timers.push(timer);
    }

    randomVelocity(excludeMin: number, excludeMax: number): number {
        const maxAttempts = 100; // 防止无限循环
        let attempts = 0;
        let velocity = Phaser.Math.Between(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max);
        
        while (velocity >= excludeMin && velocity <= excludeMax && attempts < maxAttempts) {
            velocity = Phaser.Math.Between(GAME_CONFIG.speeds.min, GAME_CONFIG.speeds.max);
            attempts++;
        }
        
        // 如果没找到合适的值，返回一个保底值
        if (attempts >= maxAttempts) {
            return excludeMin > 0 ? GAME_CONFIG.speeds.max : GAME_CONFIG.speeds.min;
        }
        
        return velocity;
    }

    chooseGlowFishes(fishGroup: Physics.Arcade.Group, count: number) {
        const selectedFishes: Physics.Arcade.Sprite[] = [];
        const allFishes = fishGroup.getChildren();

        // 添加安全检查
        const availableCount = Math.min(count, allFishes.length);
        let attempts = 0;
        const maxAttempts = allFishes.length * 2;

        while (selectedFishes.length < availableCount && attempts < maxAttempts) {
            const randomIndex = Phaser.Math.Between(0, allFishes.length - 1);
            const selectedFish = allFishes[randomIndex] as Physics.Arcade.Sprite;

            if (!selectedFishes.includes(selectedFish)) {
                selectedFishes.push(selectedFish);
                console.log("Randomly selected sunfish index:", randomIndex+1);

                const glow = this.add.graphics({ 
                    lineStyle: { 
                        width: GAME_CONFIG.glow.lineWidth, 
                        color: this.glowColor, 
                        alpha: 1 
                    } 
                });
                this.applyGlowEffect(selectedFish, glow);
            }
            attempts++;
        }
    }

    applyGlowEffect(fish: Physics.Arcade.Sprite, glow: GameObjects.Graphics) {
        glow.strokeCircle(fish.x, fish.y, GAME_CONFIG.glow.radius.default);
        
        this.tweens.add({
            targets: glow,
            alpha: { from: 1, to: 0 },
            radius: { from: GAME_CONFIG.glow.radius.from, to: GAME_CONFIG.glow.radius.to },
            ease: 'Sine.easeInOut',
            duration: 1500,
            repeat: -1,
            yoyo: false,
        });

        const redBubbles = this.add.particles(0, 0, "bubble", {
            speed: { min: -30, max: 30 },
            scale: { start: 0.05, end: 0 },
            color: [ this.glowColor ],
            frequency: 300,
            lifespan: 2000,
            alpha: { start: 1, end: 0 },
            blendMode: "ADD",
        });

        redBubbles.startFollow(fish);
        this.glowCircles.push({ glow, fish });

        this.time.delayedCall(this.glowDuration, () => {
            this.tweens.killTweensOf(glow);
            glow.destroy();
            redBubbles.destroy();
        }, [], this);
    }

    update() {
        this.sunfishGroup.children.each((fish) => {
            const sunfish = fish as Physics.Arcade.Sprite;
            sunfish.flipX = (sunfish.body?.velocity?.x ?? 0) < 0;
            return null;
        });

        this.glowCircles.forEach(glowCircle => {
            if (glowCircle.glow && glowCircle.fish) {
                this.drawGlowCircle(glowCircle.glow, glowCircle.fish.x, glowCircle.fish.y);
            }
        });
    }

    drawGlowCircle(glow: GlowGraphics, x: number, y: number) {
        glow.clear();
        glow.lineStyle(GAME_CONFIG.glow.lineWidth, this.glowColor, glow.alpha);
        glow.strokeCircle(x, y, GAME_CONFIG.glow.radius.default);
    }

    shutdown() {
        this.timers.forEach(timer => timer.destroy());
        this.timers = [];
    }
} 