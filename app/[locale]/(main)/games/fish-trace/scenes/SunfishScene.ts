import { Scene, GameObjects, Physics } from 'phaser';
import { GAME_CONFIG } from '../config';
import { LEVEL_CONFIG } from '../levelConfig';

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
    private bgMusic: Phaser.Sound.BaseSound | null = null;
    private isMuted: boolean = false;
    private translate!: (key: string, params?: Record<string, string | number>) => string;

    constructor() {
        super({ key: 'SunfishScene' });
    }

    init(config: { level?: number; score?: number; sunfishCount?: number; glowingSunfishCount?: number; glowColor?: number; glowDuration?: number; gameDuration?: number; ranbowfishCount?: number; }) {
        this.translate = this.game.registry.get('t') || ((key: string) => key);
        
        this.state = {
            level: config.level || 1,
            score: config.score || 0,
            phase: 'watching',
            selectedFish: new Set(),
            correctFish: new Set()
        };

        // 使用levelConfig配置文件来设置鱼的数量和时间
        const levelIndex = Math.min(this.state.level - 1, LEVEL_CONFIG.length - 1);
        const levelConfig = LEVEL_CONFIG[levelIndex];
        
        // 应用关卡配置
        this.sunfishCount = levelConfig.fishCount;
        this.glowingSunfishCount = levelConfig.glowingCount;
        
        // 调整时间
        const timeMultiplier = levelConfig.timeMultiplier;
        this.glowDuration = GAME_CONFIG.timing.glowDuration * timeMultiplier;
        this.gameDuration = GAME_CONFIG.timing.gameDuration * timeMultiplier;

        // 从存储中重新读取静音状态
        this.isMuted = localStorage.getItem('fishGameMuted') === 'true';
        
        console.log(`Starting level ${this.state.level} with ${this.sunfishCount} fish, ${this.glowingSunfishCount} glowing fish, time multiplier: ${timeMultiplier}`);
    }

    preload() {
        this.load.image("sea", GAME_CONFIG.assets.seaBg);
        this.load.image("bubble", GAME_CONFIG.assets.bubble);
        this.load.spritesheet("sunfish", GAME_CONFIG.assets.sunfish.path, {
            frameWidth: GAME_CONFIG.assets.sunfish.frameWidth,
            frameHeight: GAME_CONFIG.assets.sunfish.frameHeight,
        });
        this.load.audio('bgm', GAME_CONFIG.assets.audio.bgm);
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

        // 添加提示文本背景
        const padding = { x: 20, y: 10 };
        const messageY = 50;
        
        const messageBg = this.add.graphics();
        messageBg.fillStyle(0x000000, 0.8);  // 半透明黑色背景
        messageBg.lineStyle(2, 0x333333);    // 添加细边框提升质感
        
        // 创建文本
        this.messageText = this.add.text(
            this.scale.width / 2,
            messageY,
            this.translate('fishTrace.gameUI.start'),
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#FFFFFF',
                padding: padding,
                resolution: 2,           // 提高文字渲染分辨率
                align: 'center',
            }
        ).setOrigin(0.5, 0.5);
        
        // 根据文本宽度绘制圆角背景
        const textWidth = this.messageText.width;
        const textHeight = this.messageText.height;
        const cornerRadius = 16;
        
        messageBg.fillRoundedRect(
            this.scale.width/2 - textWidth/2 - padding.x,
            messageY - textHeight/2 - padding.y,
            textWidth + padding.x * 2,
            textHeight + padding.y * 2,
            cornerRadius
        );
        
        // 确保背景在文本下方
        messageBg.setDepth(this.messageText.depth - 1);

        // 添加轻微发光效果使文字更清晰
        this.messageText.setStroke('#000000', 2);
        this.messageText.setShadow(1, 1, '#000000', 2, true, true);

        // 添加音乐控制按钮
        const soundButton = this.add.container(width - 50, 50);
        
        // 创建圆形背景
        const circle = this.add.graphics();
        circle.fillStyle(0x000000, 0.6);
        circle.lineStyle(2, 0x333333);
        circle.fillCircle(0, 0, 20);
        circle.strokeCircle(0, 0, 20);
        
        // 创建音频图标
        const icon = this.add.graphics();
        
        // 从 localStorage 读取音频状态（添加默认值处理）
        this.drawSoundIcon(icon, this.isMuted);
        
        soundButton.add([circle, icon]);
        soundButton.setInteractive(
            new Phaser.Geom.Circle(0, 0, 20),
            Phaser.Geom.Circle.Contains
        );

        // 添加悬停效果
        soundButton.on('pointerover', () => {
            circle.clear();
            circle.fillStyle(0x000000, 0.8);
            circle.lineStyle(2, 0x333333);
            circle.fillCircle(0, 0, 20);
            circle.strokeCircle(0, 0, 20);
        });

        soundButton.on('pointerout', () => {
            circle.clear();
            circle.fillStyle(0x000000, 0.6);
            circle.lineStyle(2, 0x333333);
            circle.fillCircle(0, 0, 20);
            circle.strokeCircle(0, 0, 20);
        });

        // 在创建新音频实例前清理旧实例
        if (this.bgMusic) {
            this.bgMusic.destroy();
        }
        
        this.bgMusic = this.sound.add('bgm', {
            volume: 0.5,
            loop: true
        });

        // 修改播放逻辑增加状态同步
        if (!this.isMuted) {
            this.tryPlayMusic();
        }

        // 点击切换音乐状态
        soundButton.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            localStorage.setItem('fishGameMuted', this.isMuted.toString());
            
            if (this.isMuted) {
                this.bgMusic?.pause();
            } else {
                this.tryPlayMusic(); // 使用统一播放方法
            }
            icon.clear();
            this.drawSoundIcon(icon, this.isMuted);
        });

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
        // 清理音频资源
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }

    startWatchingPhase() {
        this.state.phase = 'watching';
        this.messageText.setText(this.translate('fishTrace.gameUI.start'));
        
        const glowingFish = this.chooseGlowFishes(this.sunfishGroup, this.glowingSunfishCount);
        
        // 记录正确答案
        this.state.correctFish = new Set(
            glowingFish.map(fish => this.sunfishGroup.getChildren().indexOf(fish))
        );

        // 光圈即将消失的警告
        this.time.delayedCall(this.glowDuration - GAME_CONFIG.timing.warningBeforeGlowEnd, () => {
            this.messageText.setText(this.translate('fishTrace.gameUI.glowEnding'));
        });

        // 进入追踪阶段
        this.time.delayedCall(this.glowDuration, () => {
            this.startTrackingPhase();
        });
    }

    startTrackingPhase() {
        this.state.phase = 'tracking';
        this.messageText.setText(this.translate('fishTrace.gameUI.tracking'));

        // 一段时间后进入选择阶段
        this.time.delayedCall(this.gameDuration - this.glowDuration, () => {
            this.startSelectionPhase();
        });
    }

    startSelectionPhase() {
        this.state.phase = 'selecting';
        this.messageText.setText(this.translate('fishTrace.gameUI.selection'));
        
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

    createGameButton(x: number, y: number, text: string) {
        const buttonWidth = 240;
        const buttonHeight = 70;
        
        const graphics = this.add.graphics();
        const mainColor = 0xFFA666;     // 主体橙色
        const shadowColor = 0xC4783D;   // 底部深橙色阴影
        const highlightColor = 0xFFD0A3; // 顶部高光色
        
        // 创建绘制按钮的函数，方便后续重绘
        const drawButton = () => {
            graphics.clear();  // 清除之前的绘制
            
            // 绘制底部阴影
            graphics.fillStyle(shadowColor);
            graphics.fillRoundedRect(
                -buttonWidth/2, 
                -buttonHeight/2 + 4, 
                buttonWidth, 
                buttonHeight, 
                25
            );
            
            // 绘制按钮主体
            graphics.fillStyle(mainColor);
            graphics.fillRoundedRect(
                -buttonWidth/2, 
                -buttonHeight/2, 
                buttonWidth, 
                buttonHeight - 4, 
                25
            );
            
            // 添加顶部高光渐变
            graphics.fillStyle(highlightColor, 0.5);
            graphics.fillRoundedRect(
                -buttonWidth/2, 
                -buttonHeight/2, 
                buttonWidth, 
                buttonHeight/3, 
                { tl: 25, tr: 25, bl: 0, br: 0 }
            );
        };
        
        // 初始绘制
        drawButton();
        
        // 添加文本
        const buttonText = this.add.text(0, -2, text, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#C4783D',
            strokeThickness: 6,
        }).setOrigin(0.5);
        
        // 创建容器并设置位置
        const container = this.add.container(x, y, [graphics, buttonText]);
        
        // 添加交互区域
        const hitArea = new Phaser.Geom.Rectangle(
            -buttonWidth/2, 
            -buttonHeight/2, 
            buttonWidth, 
            buttonHeight
        );
        container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        
        // 添加交互效果
        let isPointerDown = false;
        
        container.on('pointerover', () => {
            if (!isPointerDown) {
                // 悬停效果：按钮轻微上浮并放大
                this.tweens.add({
                    targets: container,
                    y: y - 2,
                    scaleX: 1.02,
                    scaleY: 1.02,
                    duration: 100,
                    ease: 'Cubic.easeOut'
                });
            }
        });
        
        container.on('pointerout', () => {
            if (!isPointerDown) {
                // 恢复原始状态
                this.tweens.add({
                    targets: container,
                    y: y,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: 'Cubic.easeOut'
                });
            }
        });
        
        container.on('pointerdown', () => {
            isPointerDown = true;
            
            // 按下效果：按钮轻微压扁并下沉
            this.tweens.add({
                targets: container,
                y: y + 2,
                scaleX: 1.03,
                scaleY: 0.97,
                duration: 50,
                ease: 'Cubic.easeOut'
            });
        });
        
        container.on('pointerup', () => {
            isPointerDown = false;
            
            // 弹起效果：恢复原状
            this.tweens.add({
                targets: container,
                y: y,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: 'Back.easeOut'
            });
        });
        
        return container;
    }

    handleSuccess() {
        this.state.score += this.state.level * 100;
        
        // 使用正确的翻译方式，传递参数
        this.messageText.setText(this.translate('fishTrace.gameUI.success', { level: this.state.level }));
        
        // 为下一关按钮使用参数化翻译
        const nextBtn = this.createGameButton(
            this.scale.width / 2,
            this.scale.height / 2,
            this.translate('fishTrace.gameUI.nextLevel')
        );
        
        nextBtn.on('pointerup', () => {
            this.scene.restart({
                level: this.state.level + 1,
                score: this.state.score
            });
        });

        // 解锁下一关（如果是新纪录）
        const nextLevel = this.state.level + 1;
        if (nextLevel <= LEVEL_CONFIG.length) {
            const currentUnlocked = localStorage.getItem('fishGameUnlockedLevel');
            const unlockedLevel = currentUnlocked ? parseInt(currentUnlocked) : 1;
            
            if (nextLevel > unlockedLevel) {
                localStorage.setItem('fishGameUnlockedLevel', nextLevel.toString());
                console.log(`New level unlocked: ${nextLevel}`);
            }
        }
    }

    handleGameOver() {
        // 传递分数参数
        this.messageText.setText(this.translate('fishTrace.gameUI.fail', { score: this.state.score }));
        
        const tryAgainBtn = this.createGameButton(
            this.scale.width / 2,
            this.scale.height / 2,
            this.translate('fishTrace.gameUI.tryAgain')
        );
        
        tryAgainBtn.on('pointerup', () => {
            this.scene.restart({ level: 1, score: 0 });
        });
    }

    // 更新消息文本的方法
    setText(message: string) {
        // 更新文本内容
        this.messageText.setText(message);
        
        // 重新计算背景大小
        const padding = { x: 20, y: 10 };
        const textWidth = this.messageText.width;
        const textHeight = this.messageText.height;
        const cornerRadius = 16;
        const messageY = 50;
        
        // 清除并重绘背景
        const messageBg = this.children.getChildren().find(child => 
            (child as Phaser.GameObjects.Graphics).depth === this.messageText.depth - 1
        ) as Phaser.GameObjects.Graphics;
        messageBg.clear();
        messageBg.fillStyle(0x000000, 0.8);
        messageBg.lineStyle(2, 0x333333);
        messageBg.fillRoundedRect(
            this.scale.width/2 - textWidth/2 - padding.x,
            messageY - textHeight/2 - padding.y,
            textWidth + padding.x * 2,
            textHeight + padding.y * 2,
            cornerRadius
        );
    }

    // 绘制声音图标的方法
    private drawSoundIcon(graphics: Phaser.GameObjects.Graphics, muted: boolean) {
        graphics.lineStyle(2, 0xFFFFFF);
        
        // 绘制扬声器图标
        graphics.beginPath();
        graphics.moveTo(-5, -3);
        graphics.lineTo(-10, -3);
        graphics.lineTo(-10, 3);
        graphics.lineTo(-5, 3);
        graphics.lineTo(0, 8);
        graphics.lineTo(0, -8);
        graphics.lineTo(-5, -3);
        graphics.closePath();
        graphics.strokePath();
        
        if (!muted) {
            // 绘制音波
            graphics.beginPath();
            graphics.arc(3, 0, 5, -Math.PI/3, Math.PI/3);
            graphics.strokePath();
            
            graphics.beginPath();
            graphics.arc(3, 0, 8, -Math.PI/3, Math.PI/3);
            graphics.strokePath();
        } else {
            // 绘制禁音叉号
            graphics.beginPath();
            graphics.moveTo(5, -8);
            graphics.lineTo(12, -1);
            graphics.moveTo(5, -1);
            graphics.lineTo(12, -8);
            graphics.strokePath();
        }
    }

    // 新增专用方法处理音乐播放
    private tryPlayMusic() {
        try {
            // 检查声音系统是否可用
            if (!this.sound || !this.bgMusic) return;
            
            // 安全地获取音频上下文
            let audioContext: AudioContext | null = null;
            
            // 检查是否为WebAudio实例并尝试获取上下文
            if (this.sound.hasOwnProperty('context')) {
                // 使用类型断言为WebAudioSoundManager
                const webAudio = this.sound as Phaser.Sound.WebAudioSoundManager;
                audioContext = webAudio.context;
            }
            
            // 检查声音系统状态并播放
            if (audioContext) {
                if (audioContext.state === 'running') {
                    // 直接播放
                    if (!this.bgMusic.isPlaying) {
                        this.bgMusic.play();
                    }
                } else if (audioContext.state === 'suspended') {
                    // 尝试恢复AudioContext
                    audioContext.resume().then(() => {
                        if (!this.isMuted && !this.bgMusic?.isPlaying) {
                            this.bgMusic?.play();
                        }
                    }).catch((error: Error) => {
                        console.warn('Failed to resume AudioContext:', error);
                    });
                } else {
                    // 等待用户交互
                    this.input.once('pointerdown', () => {
                        if (audioContext) {
                            audioContext.resume().then(() => {
                                if (!this.isMuted && !this.bgMusic?.isPlaying) {
                                    this.bgMusic?.play();
                                }
                            }).catch((error: Error) => {
                                console.warn('Failed to resume AudioContext after interaction:', error);
                            });
                        }
                    });
                }
            } else {
                // 非WebAudio管理器，简单播放方式
                if (this.sound.locked) {
                    this.input.once('pointerdown', () => {
                        if (!this.isMuted && !this.bgMusic?.isPlaying) {
                            this.bgMusic?.play();
                        }
                    });
                } else if (!this.bgMusic.isPlaying) {
                    this.bgMusic.play();
                }
            }
        } catch (error: unknown) {
            console.error('Audio system error:', error);
        }
    }
} 