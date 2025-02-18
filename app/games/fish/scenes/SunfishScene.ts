import { Scene, GameObjects, Physics } from 'phaser';
import { GAME_CONFIG } from '../config';

interface GlowCircle {
    glow: GameObjects.Graphics;
    fish: Physics.Arcade.Sprite;
}

interface GlowGraphics extends GameObjects.Graphics {
    radius?: number;
}

interface GameState {
    level: number;
    score: number;
    phase: 'watching' | 'tracking' | 'selecting' | 'completed';
    selectedFish: Set<number>;
    correctFish: Set<number>;
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
    private state!: GameState;
    private messageText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SunfishScene' });
    }

    init(config: { level?: number; score?: number; sunfishCount?: number; glowingSunfishCount?: number; glowColor?: number; glowDuration?: number; gameDuration?: number; ranbowfishCount?: number; }) {
        this.state = {
            level: config.level || 1,
            score: config.score || 0,
            phase: 'watching',
            selectedFish: new Set(),
            correctFish: new Set()
        };

        // 根据关卡计算鱼的数量
        const { initial, increment } = GAME_CONFIG.difficulty;
        this.sunfishCount = initial.fishCount + 
            Math.max(0, (this.state.level - 1)) * increment.fishCount;
        this.glowingSunfishCount = initial.glowingCount + 
            Math.max(0, (this.state.level - 1)) * increment.glowingCount;

        // 调整时间
        const timeMultiplier = Math.pow(increment.timeMultiplier, this.state.level - 1);
        this.glowDuration = GAME_CONFIG.timing.glowDuration * timeMultiplier;
        this.gameDuration = GAME_CONFIG.timing.gameDuration * timeMultiplier;
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

        // 添加提示文本
        this.messageText = this.add.text(
            this.scale.width / 2,
            50,
            GAME_CONFIG.messages.start,
            {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 },
            }
        ).setOrigin(0.5, 0.5);

        this.createSunfishes();
        this.startWatchingPhase();
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

        return selectedFishes;
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

    startWatchingPhase() {
        this.state.phase = 'watching';
        this.messageText.setText(GAME_CONFIG.messages.start);
        
        const glowingFish = this.chooseGlowFishes(this.sunfishGroup, this.glowingSunfishCount);
        
        // 记录正确答案
        this.state.correctFish = new Set(
            glowingFish.map(fish => this.sunfishGroup.getChildren().indexOf(fish))
        );

        // 光圈即将消失的警告
        this.time.delayedCall(this.glowDuration - GAME_CONFIG.timing.warningBeforeGlowEnd, () => {
            this.messageText.setText(GAME_CONFIG.messages.glowEnding);
        });

        // 进入追踪阶段
        this.time.delayedCall(this.glowDuration, () => {
            this.startTrackingPhase();
        });
    }

    startTrackingPhase() {
        this.state.phase = 'tracking';
        this.messageText.setText(GAME_CONFIG.messages.tracking);

        // 一段时间后进入选择阶段
        this.time.delayedCall(this.gameDuration - this.glowDuration, () => {
            this.startSelectionPhase();
        });
    }

    startSelectionPhase() {
        this.state.phase = 'selecting';
        this.messageText.setText(GAME_CONFIG.messages.selection);
        
        // 停止所有鱼的移动
        this.physics.pause();
        
        // 使鱼可点击
        this.sunfishGroup.getChildren().forEach((fish, index) => {
            const sprite = fish as Phaser.Physics.Arcade.Sprite;
            sprite.setInteractive({ cursor: 'pointer' });
            sprite.on('pointerdown', () => this.handleFishSelection(index));
        });

        // 添加选择时间限制
        this.time.delayedCall(GAME_CONFIG.timing.selectionTime, () => {
            this.checkAnswers();
        });
    }

    handleFishSelection(fishIndex: number) {
        // 如果已经完成选择，不再响应点击
        if (this.state.phase !== 'selecting') return;
        
        const fish = this.sunfishGroup.getChildren()[fishIndex] as Phaser.Physics.Arcade.Sprite;
        
        // 播放点击动画
        this.tweens.add({
            targets: fish,
            scale: fish.scale * 1.2,
            duration: 100,
            yoyo: true,
        });

        // 检查是否点击正确
        if (this.state.correctFish.has(fishIndex)) {
            // 正确选择
            this.state.selectedFish.add(fishIndex);
            fish.setTint(0x00ff00); // 绿色
            
            // 如果选择完所有正确的鱼
            if (this.state.selectedFish.size === this.state.correctFish.size) {
                this.state.phase = 'completed'; // 标记为完成状态
                this.showConfetti();
                this.time.delayedCall(1000, () => {
                    this.handleSuccess();
                });
            }
        } else {
            this.state.phase = 'completed'; // 标记为完成状态
            // 错误选择
            fish.setTint(0xff0000); // 红色
            
            // 显示所有正确答案
            this.sunfishGroup.getChildren().forEach((f, idx) => {
                const sprite = f as Phaser.Physics.Arcade.Sprite;
                if (this.state.correctFish.has(idx)) {
                    sprite.setTint(0xffff00); // 黄色显示正确答案
                    const glow = this.add.graphics({
                        lineStyle: {
                            width: GAME_CONFIG.glow.lineWidth,
                            color: 0xffff00,
                            alpha: 0.8
                        }
                    });
                    this.drawGlowCircle(glow, sprite.x, sprite.y);
                }
            });
            
            // 延迟一秒显示游戏结束
            this.time.delayedCall(1000, () => {
                this.handleGameOver();
            });
        }
    }

    showConfetti() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // 左边礼花筒
        const leftEmitter = this.add.particles(width * 0.2, height * 0.8, "bubble", {
            speed: { min: 400, max: 600 },
            angle: { min: -60, max: -30 }, // 向右上方发射
            scale: { start: 0.15, end: 0 },
            lifespan: 2000,
            quantity: 30,
            frequency: 65,
            tint: [
                0xff0000, // 红色
                0xffff00, // 黄色
                0xff8800, // 橙色
                0xff00ff, // 粉色
                0x00ff00  // 绿色
            ],
            alpha: { start: 1, end: 0 },
            blendMode: "ADD",
            emitting: false // 不持续发射
        });

        // 右边礼花筒
        const rightEmitter = this.add.particles(width * 0.8, height * 0.8, "bubble", {
            speed: { min: 400, max: 600 },
            angle: { min: -150, max: -120 }, // 向左上方发射
            scale: { start: 0.15, end: 0 },
            lifespan: 2000,
            quantity: 30,
            frequency: 65,
            tint: [
                0xff0000, // 红色
                0xffff00, // 黄色
                0xff8800, // 橙色
                0xff00ff, // 粉色
                0x00ff00  // 绿色
            ],
            alpha: { start: 1, end: 0 },
            blendMode: "ADD",
            emitting: false // 不持续发射
        });

        // 发射一次
        leftEmitter.explode(30);
        rightEmitter.explode(30);

        // 0.5秒后再发射一次
        this.time.delayedCall(500, () => {
            leftEmitter.explode(20);
            rightEmitter.explode(20);
        });

        // 1秒后清理粒子发射器
        this.time.delayedCall(2000, () => {
            leftEmitter.destroy();
            rightEmitter.destroy();
        });
    }

    checkAnswers() {
        const correctCount = Array.from(this.state.selectedFish)
            .filter(index => this.state.correctFish.has(index)).length;
        
        // 显示正确答案
        this.sunfishGroup.getChildren().forEach((fish, index) => {
            const sprite = fish as Phaser.Physics.Arcade.Sprite;
            
            if (this.state.correctFish.has(index)) {
                // 正确的鱼
                if (this.state.selectedFish.has(index)) {
                    sprite.setTint(0x00ff00); // 正确选择 - 绿色
                } else {
                    sprite.setTint(0xff0000); // 漏选 - 红色
                }
            } else if (this.state.selectedFish.has(index)) {
                sprite.setTint(0xff0000); // 错误选择 - 红色
            }

            // 为正确的鱼添加光环效果
            if (this.state.correctFish.has(index)) {
                const glow = this.add.graphics({
                    lineStyle: {
                        width: GAME_CONFIG.glow.lineWidth,
                        color: 0xffff00,
                        alpha: 0.8
                    }
                });
                this.drawGlowCircle(glow, sprite.x, sprite.y);
            }
        });

        // 延迟显示结果界面
        this.time.delayedCall(1500, () => {
            if (correctCount === this.state.correctFish.size && 
                this.state.selectedFish.size === this.state.correctFish.size) {
                this.handleSuccess();
            } else {
                this.handleGameOver();
            }
        });
    }

    handleSuccess() {
        this.state.score += this.state.level * 100;
        this.messageText.setText(
            GAME_CONFIG.messages.success.replace('{level}', this.state.level.toString())
        );
        
        // 显示下一关按钮
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            GAME_CONFIG.messages.nextLevel.replace('{level}', (this.state.level + 1).toString()),
            {
                fontSize: '32px',
                fontWeight: 'bold',
                backgroundColor: '#4CAF50',
                padding: { x: 40, y: 20 },
                color: '#ffffff',
                shadow: { color: '#000000', blur: 5, fill: true },
            }
        )
        .setInteractive({ cursor: 'pointer' })
        .setOrigin(0.5)
        .on('pointerover', function(this: Phaser.GameObjects.Text) {
            this.setScale(1.1);
        })
        .on('pointerout', function(this: Phaser.GameObjects.Text) {
            this.setScale(1);
        })
        .on('pointerdown', () => {
            this.scene.restart({
                level: this.state.level + 1,
                score: this.state.score
            });
        });
    }

    handleGameOver() {
        this.messageText.setText(GAME_CONFIG.messages.fail + this.state.score);
        
        // 添加重新开始按钮
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Try Again',
            {
                fontSize: '32px',
                backgroundColor: '#f44336',
                padding: { x: 40, y: 20 },
                color: '#ffffff',
                shadow: { color: '#000000', blur: 5, fill: true },
            }
        )
        .setInteractive({ cursor: 'pointer' })
        .setOrigin(0.5)
        .on('pointerover', function(this: Phaser.GameObjects.Text) {
            this.setScale(1.1);
        })
        .on('pointerout', function(this: Phaser.GameObjects.Text) {
            this.setScale(1);
        })
        .on('pointerdown', () => {
            this.scene.restart({ level: 1, score: 0 });
        });
    }
} 