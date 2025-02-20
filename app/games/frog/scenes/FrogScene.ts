import { Scene } from 'phaser';
import { GAME_CONFIG } from '../config';

interface LilyPad extends Phaser.GameObjects.Sprite {
    rippleTween?: Phaser.Tweens.Tween;
    rippleGraphics?: Phaser.GameObjects.Graphics;
}

export class FrogScene extends Scene {
    private lilyPads: LilyPad[] = [];
    private frog!: Phaser.GameObjects.Sprite;
    private currentJumpIndex: number = 0;
    private numLilyPads: number = GAME_CONFIG.lilyPad.count;
    private numJumps: number = GAME_CONFIG.difficulty.initial.numJumps;
    private jumpSequence: number[] = [];
    private messageText!: Phaser.GameObjects.Text;
    private messageBg!: Phaser.GameObjects.Graphics;
    private gameState: 'watching' | 'playing' | 'complete' = 'watching';
    private playerSequence: number[] = [];
    private level: number = 1;
    private score: number = 0;
    private startTime: number = 0;
    private streakMultiplier: number = 1;

    constructor() {
        super({ key: 'FrogScene' });
    }

    init(config: { level?: number; score?: number; numLilyPads?: number; numJumps?: number; jumpSequence?: number[] }) {
        // 清理之前的游戏对象
        this.lilyPads.forEach(pad => {
            pad.rippleTween?.stop();
            pad.rippleGraphics?.destroy();
        });
        this.lilyPads = [];
        this.frog?.destroy();
        this.messageText?.destroy();
        this.messageBg?.destroy();
        
        // 保存关卡和分数
        this.level = config.level || 1;
        this.score = config.score || 0;
        
        // 计算当前关卡的跳跃次数
        this.numJumps = Math.min(
            GAME_CONFIG.difficulty.initial.numJumps + 
            (this.level - 1) * GAME_CONFIG.difficulty.increment.numJumps,
            GAME_CONFIG.difficulty.maxJumps
        );
        
        // 计算所需的荷叶数量
        this.numLilyPads = Math.max(
            config.numLilyPads || GAME_CONFIG.lilyPad.count,
            this.numJumps + 2  // 确保荷叶数量足够
        );

        // 生成或使用提供的跳跃序列
        if (config.jumpSequence && config.jumpSequence.length === this.numLilyPads) {
            this.jumpSequence = config.jumpSequence;
        } else {
            this.jumpSequence = Phaser.Utils.Array.Shuffle([...Array(this.numLilyPads).keys()]);
        }
            
        // 重置其他状态
        this.currentJumpIndex = 0;
        this.streakMultiplier = 1;
        this.playerSequence = [];
        this.gameState = 'watching';
    }

    preload() {
        this.load.atlas(
            'frog',
            GAME_CONFIG.assets.frog.spritesheet,
            GAME_CONFIG.assets.frog.atlas
        );
        this.load.image('lilyPad', GAME_CONFIG.assets.lilyPad);
        this.load.image('pond', GAME_CONFIG.assets.pond);
        this.load.spritesheet('confetti', '/games/assets/sunset-raster.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        // 确保在创建新对象前清空场景
        this.children.removeAll();
        
        // 创建游戏对象
        this.add.image(400, 300, 'pond').setScale(0.6);
        this.createMessage();
        this.createLilyPads();
        this.createFrog();
        this.createAnimations();
        
        // 延迟开始自动跳跃，给场景加载一些时间
        this.time.delayedCall(100, () => {
            this.setupAutoJump();
        });
        
        this.setText(GAME_CONFIG.messages.start);
    }

    createLilyPads() {
        for (let i = 0; i < this.numLilyPads; i++) {
            let placed = false;
            while (!placed) {
                const x = Phaser.Math.Between(GAME_CONFIG.bounds.x.min, GAME_CONFIG.bounds.x.max);
                const y = Phaser.Math.Between(GAME_CONFIG.bounds.y.min, GAME_CONFIG.bounds.y.max);

                const tooClose = this.lilyPads.some((pad) => {
                    return Phaser.Math.Distance.Between(pad.x, pad.y, x, y) < GAME_CONFIG.lilyPad.spacing;
                });

                if (!tooClose) {
                    // 创建阴影
                    const shadow = this.add.graphics({ 
                        x: x + GAME_CONFIG.lilyPad.shadow.offset.x, 
                        y: y + GAME_CONFIG.lilyPad.shadow.offset.y 
                    });
                    shadow.fillStyle(0x000000, GAME_CONFIG.lilyPad.shadow.alpha);
                    shadow.fillCircle(0, 0, GAME_CONFIG.lilyPad.shadow.radius);

                    // 创建荷叶
                    const lilyPad = this.add.sprite(x, y, 'lilyPad')
                        .setScale(GAME_CONFIG.lilyPad.scale) as LilyPad;
                    lilyPad.setInteractive();
                    lilyPad.on('pointerdown', () => this.handleLilyPadClick(i));
                    
                    this.lilyPads.push(lilyPad);
                    placed = true;

                    this.createRippleForLilyPad(lilyPad);
                }
            }
        }
    }

    createRippleForLilyPad(lilyPad: LilyPad) {
        // 创建一个容器来存放荷叶和它的涟漪效果
        const rippleGraphics = this.add.graphics();
        
        // 创建补间动画
        const rippleTween = this.tweens.add({
            targets: { alpha: 1, radius: GAME_CONFIG.lilyPad.ripple.radius.from },
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: GAME_CONFIG.lilyPad.ripple.duration,
            paused: true,
            repeat: -1,
            onUpdate: (tween, target) => {
                rippleGraphics.clear();
                if (target.alpha > 0) {
                    rippleGraphics.lineStyle(
                        GAME_CONFIG.lilyPad.ripple.lineWidth, 
                        GAME_CONFIG.lilyPad.ripple.color, 
                        target.alpha
                    );
                    rippleGraphics.strokeCircle(lilyPad.x, lilyPad.y, target.radius);
                }
            },
            onStop: () => {
                rippleGraphics.clear();
                rippleGraphics.destroy();  // 添加销毁graphics
            }
        });

        // 保存 tween 引用和 graphics 对象
        lilyPad.rippleTween = rippleTween;
        lilyPad.rippleGraphics = rippleGraphics;
    }

    createFrog() {
        const initialLilyPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex]];
        this.frog = this.add.sprite(
            initialLilyPad.x,
            initialLilyPad.y,
            'frog',
            GAME_CONFIG.frog.frames.idle
        ).setScale(GAME_CONFIG.frog.scale);
    }

    createAnimations() {
        this.anims.create({
            key: 'jump',
            frames: GAME_CONFIG.frog.frames.animation.map(frame => ({
                key: 'frog',
                frame: frame.frame,
                duration: frame.duration
            })),
            frameRate: GAME_CONFIG.frog.frameRate,
            repeat: 0
        });
    }

    createMessage() {
        const messageY = GAME_CONFIG.ui.message.y;
        
        // 创建背景
        this.messageBg = this.add.graphics();
        this.messageBg.fillStyle(GAME_CONFIG.ui.message.background.color, GAME_CONFIG.ui.message.background.alpha);
        this.messageBg.lineStyle(
            GAME_CONFIG.ui.message.background.borderWidth, 
            GAME_CONFIG.ui.message.background.borderColor
        );
        
        // 创建文本
        this.messageText = this.add.text(
            this.scale.width / 2,
            messageY,
            '',
            GAME_CONFIG.ui.message.style
        ).setOrigin(0.5, 0.5);
        
        // 设置文本效果
        this.messageText.setStroke('#000000', 2);
        this.messageText.setShadow(1, 1, '#000000', 2, true, true);
        
        // 确保背景在文本下方
        this.messageBg.setDepth(this.messageText.depth - 1);
    }

    setText(message: string) {
        this.messageText.setColor('#FFFFFF');
        this.messageText.setText(message);
        
        // 重新计算背景大小
        const padding = GAME_CONFIG.ui.message.style.padding;
        const textWidth = this.messageText.width;
        const textHeight = this.messageText.height;
        const cornerRadius = GAME_CONFIG.ui.message.background.cornerRadius;
        const messageY = GAME_CONFIG.ui.message.y;
        
        // 更新背景
        this.messageBg.clear();
        this.messageBg.fillStyle(GAME_CONFIG.ui.message.background.color, GAME_CONFIG.ui.message.background.alpha);
        this.messageBg.lineStyle(
            GAME_CONFIG.ui.message.background.borderWidth, 
            GAME_CONFIG.ui.message.background.borderColor
        );
        this.messageBg.fillRoundedRect(
            this.scale.width/2 - textWidth/2 - padding.x,
            messageY - textHeight/2 - padding.y,
            textWidth + padding.x * 2,
            textHeight + padding.y * 2,
            cornerRadius
        );
    }

    setupAutoJump() {
        const jumpDelay = Math.max(
            GAME_CONFIG.difficulty.maxSpeed,
            GAME_CONFIG.difficulty.initial.jumpDelay * 
            Math.pow(GAME_CONFIG.difficulty.increment.speedup, this.level - 1)
        );

        // 显示关卡预览信息 - 移除速度显示
        this.setText(GAME_CONFIG.messages.nextLevel
            .replace('{level}', this.level.toString())
            .replace('{jumps}', this.numJumps.toString())
        );

        // 添加延迟开始
        this.time.delayedCall(2000, () => {
            this.setText(GAME_CONFIG.messages.jumping);
            this.time.addEvent({
                delay: jumpDelay,
                callback: this.performJump,
                callbackScope: this,
                repeat: this.numJumps - 1
            });
        });
    }

    performJump() {
        if (this.currentJumpIndex < this.jumpSequence.length - 1) {
            // 清理当前荷叶的涟漪效果
            const currentPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex]];
            currentPad.rippleTween?.pause();

            const nextPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex + 1]];
            const angle = Phaser.Math.Angle.Between(
                this.frog.x,
                this.frog.y,
                nextPad.x,
                nextPad.y
            );

            this.frog.angle = Phaser.Math.RadToDeg(angle) - 135;

            this.tweens.add({
                targets: this.frog,
                x: nextPad.x,
                y: nextPad.y,
                onStart: () => {
                    this.frog.play('jump');
                },
                onComplete: () => {
                    this.frog.setTexture('frog', GAME_CONFIG.frog.frames.idle);
                    // 开始新荷叶的涟漪效果
                    nextPad.rippleTween?.restart();
                },
            });
            
            this.currentJumpIndex++;

            if (this.currentJumpIndex === this.numJumps) {
                this.time.delayedCall(
                    GAME_CONFIG.timing.labelDelay,
                    this.startPlayerTurn,
                    [],
                    this
                );
            }
        }
    }

    startPlayerTurn() {
        this.gameState = 'playing';
        this.playerSequence = [];
        this.currentJumpIndex = 1;
        this.startTime = Date.now();
        
        // 清理所有荷叶的涟漪效果
        this.lilyPads.forEach(pad => pad.rippleTween?.pause());
        
        const startPad = this.lilyPads[this.jumpSequence[0]];
        this.frog.setPosition(startPad.x, startPad.y);
        this.frog.setTexture('frog', GAME_CONFIG.frog.frames.idle);
        this.frog.angle = 0;
        
        // 开始初始荷叶的涟漪效果
        startPad.rippleTween?.restart();
        
        this.setText(GAME_CONFIG.messages.yourTurn);
    }

    handleLilyPadClick(padIndex: number) {
        if (this.gameState !== 'playing') return;

        const correctPadIndex = this.jumpSequence[this.currentJumpIndex];
        
        if (padIndex === correctPadIndex) {
            // 清理当前荷叶的涟漪效果
            const currentPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex - 1]];
            currentPad.rippleTween?.pause();

            // 正确选择 - 添加绿色发光效果
            const targetPad = this.lilyPads[padIndex];
            this.createCorrectGlow(targetPad);
            
            // 记录玩家选择
            this.playerSequence.push(padIndex);
            
            // 让青蛙跳到选中的荷叶
            const angle = Phaser.Math.Angle.Between(
                this.frog.x,
                this.frog.y,
                targetPad.x,
                targetPad.y
            );

            this.frog.angle = Phaser.Math.RadToDeg(angle) - 135;

            this.tweens.add({
                targets: this.frog,
                x: targetPad.x,
                y: targetPad.y,
                duration: 500,
                onStart: () => {
                    this.frog.play('jump');
                },
                onComplete: () => {
                    this.frog.setTexture('frog', GAME_CONFIG.frog.frames.idle);
                    // 开始新荷叶的涟漪效果
                    targetPad.rippleTween?.restart();
                    
                    // 更新当前索引
                    this.currentJumpIndex++;
                    
                    // 检查是否完成所有跳跃
                    if (this.currentJumpIndex > this.numJumps) {
                        this.handleSuccess();
                    }
                },
            });
        } else {
            // 错误选择
            this.handleFailure();
        }
    }

    createCorrectGlow(lilyPad: LilyPad) {
        const ripple = this.add.graphics();
        
        this.tweens.add({
            targets: ripple,
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: 500,
            onUpdate: (tween) => {
                const currentRadius = tween.data.find(d => d.key === 'radius')?.current ?? 
                    GAME_CONFIG.lilyPad.ripple.radius.from;
                
                ripple.clear();
                ripple.lineStyle(
                    GAME_CONFIG.lilyPad.ripple.lineWidth, 
                    0x00ff00,  // 绿色
                    tween.data.find(d => d.key === 'alpha')?.current ?? 1
                );
                ripple.strokeCircle(lilyPad.x, lilyPad.y, currentRadius);
            },
            onComplete: () => {
                ripple.destroy();
            }
        });
    }

    handleFailure() {
        this.gameState = 'complete';
        this.setText(GAME_CONFIG.messages.fail);
        this.streakMultiplier = 1;

        // 添加错误选择的视觉反馈
        const wrongPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex]];
        const ripple = this.add.graphics();

        this.tweens.add({
            targets: ripple,
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: 500,
            onUpdate: (tween) => {
                const currentRadius = tween.data.find(d => d.key === 'radius')?.current ?? 
                    GAME_CONFIG.lilyPad.ripple.radius.from;
                
                ripple.clear();
                ripple.lineStyle(
                    GAME_CONFIG.lilyPad.ripple.lineWidth, 
                    0xff0000,  // 红色
                    tween.data.find(d => d.key === 'alpha')?.current ?? 1
                );
                ripple.strokeCircle(wrongPad.x, wrongPad.y, currentRadius);
            },
            onComplete: () => {
                ripple.destroy();
                this.time.delayedCall(500, () => {
                    this.createRetryButton();
                });
            }
        });
    }

    createRetryButton() {
        // 创建按钮容器
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        // 创建按钮背景 - 3D 效果
        const buttonBg = this.add.graphics();
        
        // 主体颜色
        buttonBg.fillStyle(0xFFD700);  // 金色
        
        // 绘制主体形状
        buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
        
        // 添加底部阴影（深色区域）
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);  // 半透明橙色
        shadow.fillRoundedRect(-100, 0, 200, 25, { tl: 0, tr: 0, bl: 25, br: 25 });
        
        // 添加顶部高光效果
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);  // 半透明白色
        highlight.fillRoundedRect(-95, -22, 190, 15, 20);
        
        // 添加边框
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-100, -25, 200, 50, 25);
        
        // 创建文本
        const buttonText = this.add.text(0, 0, 'TRY AGAIN', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        // 添加到容器
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        // 添加交互
        buttonContainer.setSize(200, 50);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // 添加相同的交互效果
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-100, -25, 200, 50, 25);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-100, -25, 200, 50, 25);
        });
        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-100, -25, 200, 50, 25);
        });
        
        buttonContainer.on('pointerup', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.scene.restart({
                        level: this.level,
                        score: this.score
                    });
                }
            });
        });
    }

    handleSuccess() {
        this.gameState = 'complete';
        const levelScore = this.calculateScore();
        this.score += levelScore;
        
        // 创建礼花效果
        this.createSuccessConfetti();
        
        // 检查是否达到最大关卡
        const nextJumps = Math.min(
            GAME_CONFIG.difficulty.initial.numJumps + 
            this.level * GAME_CONFIG.difficulty.increment.numJumps,
            GAME_CONFIG.difficulty.maxJumps
        );
        
        if (nextJumps === GAME_CONFIG.difficulty.maxJumps && 
            this.numJumps === GAME_CONFIG.difficulty.maxJumps) {
            // 通关结束
            this.setText(GAME_CONFIG.messages.maxLevel
                .replace('{score}', this.score.toString())
            );
            this.time.delayedCall(1500, () => {
                this.createRetryFromStartButton();
            });
        } else {
            // 显示当前分数和完成信息
            this.setText(GAME_CONFIG.messages.success
                .replace('{score}', this.score.toString())
                .replace('{level}', this.level.toString())
            );
            
            this.time.delayedCall(1500, () => {
                this.createNextLevelButton();
            });
        }
    }

    createNextLevelButton() {
        // 创建按钮容器
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        // 创建按钮背景 - 3D 效果
        const buttonBg = this.add.graphics();
        
        // 主体颜色
        buttonBg.fillStyle(0xFFD700);  // 金色
        
        // 绘制主体形状 - 增大尺寸
        buttonBg.fillRoundedRect(-120, -30, 240, 60, 30);  // 宽度240，高度60，圆角30
        
        // 添加底部阴影（深色区域）
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);  // 半透明橙色
        shadow.fillRoundedRect(-120, 0, 240, 30, { tl: 0, tr: 0, bl: 30, br: 30 });
        
        // 添加顶部高光效果
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);  // 半透明白色
        highlight.fillRoundedRect(-115, -27, 230, 20, 25);
        
        // 添加边框
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-120, -30, 240, 60, 30);
        
        // 创建文本 - 增大字体
        const buttonText = this.add.text(0, 0, 'NEXT LEVEL', {
            fontSize: '32px',  // 从28px增大到32px
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        // 添加到容器（注意添加顺序，从底层到顶层）
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        // 添加交互 - 更新尺寸
        buttonContainer.setSize(240, 60);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // 悬停效果
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            // 提亮效果
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            // 恢复原色
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            // 按下效果
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerup', () => {
            // 播放按钮动画
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    // 直接重启场景到下一关
                    this.scene.restart({
                        level: this.level + 1,
                        score: this.score
                    });
                }
            });
        });

        // 添加关卡预览文本
        const nextJumps = Math.min(
            GAME_CONFIG.difficulty.initial.numJumps + 
            this.level * GAME_CONFIG.difficulty.increment.numJumps,
            GAME_CONFIG.difficulty.maxJumps
        );
        
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 50,
            `Next: ${nextJumps} jumps`,
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#FFD700',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
            }
        ).setOrigin(0.5);
    }

    // 添加新方法：从头开始的按钮
    createRetryFromStartButton() {
        // 创建按钮容器
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        // 创建按钮背景 - 3D 效果
        const buttonBg = this.add.graphics();
        
        // 主体颜色
        buttonBg.fillStyle(0xFFD700);  // 金色
        
        // 绘制主体形状
        buttonBg.fillRoundedRect(-120, -25, 240, 50, 25);  // 稍微加宽一点以适应更长的文本
        
        // 添加底部阴影（深色区域）
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);  // 半透明橙色
        shadow.fillRoundedRect(-120, 0, 240, 25, { tl: 0, tr: 0, bl: 25, br: 25 });
        
        // 添加顶部高光效果
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);  // 半透明白色
        highlight.fillRoundedRect(-115, -22, 230, 15, 20);
        
        // 添加边框
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-120, -25, 240, 50, 25);
        
        // 创建文本
        const buttonText = this.add.text(0, 0, 'PLAY AGAIN', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        // 添加到容器（注意添加顺序，从底层到顶层）
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        // 添加交互
        buttonContainer.setSize(240, 50);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // 悬停效果
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            // 提亮效果
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            // 恢复原色
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        // 点击效果
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            // 按下效果
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerup', () => {
            // 播放按钮动画
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    // 重启场景到第一关
                    this.scene.restart({
                        level: 1,
                        score: 0
                    });
                }
            });
        });

        // 添加最终分数文本
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 50,
            `Final Score: ${this.score}`,
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#FFD700',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
            }
        ).setOrigin(0.5);
    }

    calculateScore() {
        // 基础分数
        let levelScore = GAME_CONFIG.scoring.base * this.streakMultiplier;
        
        // 时间奖励
        const timeElapsed = Date.now() - this.startTime;
        if (timeElapsed < GAME_CONFIG.scoring.timeBonus.threshold) {
            levelScore += GAME_CONFIG.scoring.timeBonus.points;
            // 显示完美时机奖励
            this.setText(GAME_CONFIG.messages.perfect
                .replace('{bonus}', GAME_CONFIG.scoring.timeBonus.points.toString())
            );
        }
        
        // 增加连击系数
        this.streakMultiplier += GAME_CONFIG.scoring.streak.multiplier;
        
        return Math.floor(levelScore);
    }

    update() {
        this.lilyPads.forEach(lilyPad => {
            const isCurrentPad = this.frog.x === lilyPad.x && this.frog.y === lilyPad.y;
            
            if (isCurrentPad && lilyPad.rippleTween?.paused) {
                lilyPad.rippleTween.restart();
            } else if (!isCurrentPad && !lilyPad.rippleTween?.paused) {
                lilyPad.rippleTween?.pause();
                lilyPad.rippleGraphics?.clear();  // 添加清理
            }
        });
    }

    // 添加场景清理方法
    shutdown() {
        // 清理所有游戏对象
        this.lilyPads.forEach(pad => {
            pad.rippleTween?.stop();
            pad.rippleGraphics?.clear();  // 先清理
            pad.rippleGraphics?.destroy();  // 再销毁
        });
        this.children.removeAll();
        this.lilyPads = [];
        this.frog?.destroy();
        this.messageText?.destroy();
        this.messageBg?.destroy();
        
        // 停止所有正在进行的计时器
        this.time.removeAllEvents();
        
        // 停止所有正在进行的动画
        this.tweens.killAll();
        
        // 清理所有粒子系统
        this.add.particles().destroy();
    }

    // 修改礼花效果方法
    private createSuccessConfetti() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // 在高处创建爆开效果
        const burst = this.add.particles(0, 0, 'confetti', {
            x: centerX,
            y: centerY - 150,  // 在高处爆开
            frame: [0, 4, 8, 12, 16],
            lifespan: { min: 2500, max: 3000 },
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },  // 向所有方向扩散
            gravityY: 100,
            scale: { start: 1, end: 0.2 },
            quantity: 1,
            frequency: -1,  // 一次性爆开
            blendMode: 'ADD',
            rotate: {
                onEmit: () => Phaser.Math.Between(0, 360),
                onUpdate: (particle) => {
                    return particle.rotation + 2;
                }
            }
        });

        burst.explode(40);  // 一次性发射40个粒子

        // 2.5秒后清理爆开效果
        this.time.delayedCall(2500, () => {
            burst.destroy();
        });
    }
} 