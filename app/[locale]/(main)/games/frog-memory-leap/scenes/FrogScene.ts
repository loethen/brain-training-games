import { Scene, Math as PhaserMath } from 'phaser';
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
    private translate: (key: string, params?: Record<string, string | number>) => string;

    constructor() {
        super({ key: 'FrogScene' });
        this.translate = (key: string) => key;
    }

    init(config: { level?: number; score?: number; numLilyPads?: number; numJumps?: number; jumpSequence?: number[] }) {
        this.translate = this.game.registry.get('t') || ((key: string) => key);
        
        // Stop all running tweens to prevent memory leaks
        this.tweens.killAll();
        
        // Clear any existing timers or delayed calls
        this.time.removeAllEvents();
        
        // Clean up existing objects before creating new ones
        this.cleanupCurrentLevel();
        
        this.level = config.level || 1;
        this.score = config.score || 0;
        
        this.numJumps = Math.min(
            GAME_CONFIG.difficulty.initial.numJumps + 
            (this.level - 1) * GAME_CONFIG.difficulty.increment.numJumps,
            GAME_CONFIG.difficulty.maxJumps
        );
        
        this.numLilyPads = Math.max(
            config.numLilyPads || GAME_CONFIG.lilyPad.count,
            this.numJumps + 2
        );

        // We'll initialize jumpSequence later after we know how many lily pads we actually have
        this.jumpSequence = config.jumpSequence || [];
            
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
        // Clear existing graphics before creating new ones
        this.children.removeAll(true);
        
        // Create the main elements
        this.add.image(400, 300, 'pond').setScale(0.6);
        this.createMessage();
        this.createLilyPads();
        this.createFrog();
        this.createAnimations();
        
        // Add a slight delay before starting the level
        this.time.delayedCall(100, () => {
            this.setupAutoJump();
        });
        
        this.setText(this.translate('watch'));
    }

    createLilyPads() {
        // Implement Poisson Disk Sampling
        const positions = this.generatePoissonDiskPoints(
            GAME_CONFIG.bounds.x.min,
            GAME_CONFIG.bounds.x.max,
            GAME_CONFIG.bounds.y.min,
            GAME_CONFIG.bounds.y.max,
            GAME_CONFIG.lilyPad.spacing,
            30 // Maximum attempts per sample
        );

        // Use however many positions we got (up to numLilyPads)
        const usablePositions = positions.slice(0, this.numLilyPads);
        const actualNumPads = usablePositions.length;
        
        // Create all lily pads using the positions we have
        for (let i = 0; i < actualNumPads; i++) {
            const { x, y } = usablePositions[i];
            this.createSingleLilyPad(x, y, i);
        }
        
        // Now that we know how many lily pads we have, generate the jump sequence
        if (this.jumpSequence.length !== this.numJumps + 1) {
            this.generateJumpSequence(actualNumPads);
        }
    }

    // Helper method to create a single lily pad
    private createSingleLilyPad(x: number, y: number, index: number) {
        const shadow = this.add.graphics({ 
            x: x + GAME_CONFIG.lilyPad.shadow.offset.x, 
            y: y + GAME_CONFIG.lilyPad.shadow.offset.y 
        });
        shadow.fillStyle(0x000000, GAME_CONFIG.lilyPad.shadow.alpha);
        shadow.fillCircle(0, 0, GAME_CONFIG.lilyPad.shadow.radius);

        const lilyPad = this.add.sprite(x, y, 'lilyPad')
            .setScale(GAME_CONFIG.lilyPad.scale) as LilyPad;
        lilyPad.setInteractive();
        lilyPad.on('pointerdown', () => this.handleLilyPadClick(index));
        
        this.lilyPads.push(lilyPad);
        this.createRippleForLilyPad(lilyPad);
    }

    // Poisson Disk Sampling algorithm
    private generatePoissonDiskPoints(
        xMin: number, 
        xMax: number, 
        yMin: number, 
        yMax: number, 
        minDistance: number, 
        maxAttempts: number = 30
    ): Array<{x: number, y: number}> {
        const width = xMax - xMin;
        const height = yMax - yMin;
        
        // Calculate cell size for grid acceleration
        const cellSize = minDistance / Math.sqrt(2);
        
        // Calculate grid dimensions
        const gridWidth = Math.ceil(width / cellSize);
        const gridHeight = Math.ceil(height / cellSize);
        
        // Initialize grid to store points
        const grid: Array<number | null> = new Array(gridWidth * gridHeight).fill(null);
        
        // List to store active points for sampling
        const active: Array<{x: number, y: number}> = [];
        
        // List to store all sample points
        const points: Array<{x: number, y: number}> = [];
        
        // Start with a random point
        const firstPoint = {
            x: xMin + Math.random() * width,
            y: yMin + Math.random() * height
        };
        
        // Insert first point into the data structures
        active.push(firstPoint);
        points.push(firstPoint);
        
        const gridIndex = (x: number, y: number): number => {
            return Math.floor((x - xMin) / cellSize) + Math.floor((y - yMin) / cellSize) * gridWidth;
        };
        
        grid[gridIndex(firstPoint.x, firstPoint.y)] = 0;
        
        // Main sampling loop
        while (active.length > 0) {
            // Pick a random active point
            const randomIndex = Math.floor(Math.random() * active.length);
            const point = active[randomIndex];
            let found = false;
            
            // Try to find a new point around the chosen point
            for (let i = 0; i < maxAttempts; i++) {
                // Generate a random point within annulus
                const angle = Math.random() * Math.PI * 2;
                const radius = minDistance + Math.random() * minDistance;
                
                const newX = point.x + radius * Math.cos(angle);
                const newY = point.y + radius * Math.sin(angle);
                
                // Check if the new point is in bounds
                if (newX >= xMin && newX < xMax && newY >= yMin && newY < yMax) {
                    // Check if the new point is far enough from other points
                    const newGridX = Math.floor((newX - xMin) / cellSize);
                    const newGridY = Math.floor((newY - yMin) / cellSize);
                    
                    let isValid = true;
                    
                    // Check neighboring cells in the grid for existing points
                    for (let nx = Math.max(0, newGridX - 2); nx <= Math.min(gridWidth - 1, newGridX + 2); nx++) {
                        for (let ny = Math.max(0, newGridY - 2); ny <= Math.min(gridHeight - 1, newGridY + 2); ny++) {
                            const neighborIndex = nx + ny * gridWidth;
                            const neighborPointIndex = grid[neighborIndex];
                            
                            if (neighborPointIndex !== null) {
                                const neighborPoint = points[neighborPointIndex];
                                const dist = PhaserMath.Distance.Between(newX, newY, neighborPoint.x, neighborPoint.y);
                                
                                if (dist < minDistance) {
                                    isValid = false;
                                    break;
                                }
                            }
                        }
                        if (!isValid) break;
                    }
                    
                    // If valid, add the new point
                    if (isValid) {
                        const newPoint = { x: newX, y: newY };
                        const idx = points.length;
                        
                        points.push(newPoint);
                        active.push(newPoint);
                        grid[gridIndex(newX, newY)] = idx;
                        
                        found = true;
                        break;
                    }
                }
            }
            
            // If no point was found after maxAttempts, remove current point from active list
            if (!found) {
                active.splice(randomIndex, 1);
            }
        }
        
        return points;
    }

    createRippleForLilyPad(lilyPad: LilyPad) {
        const rippleGraphics = this.add.graphics();
        
        // 只保留内层涟漪效果
        const rippleData = { alpha: 1, radius: GAME_CONFIG.lilyPad.ripple.radius.from };
        
        const rippleTween = this.tweens.add({
            targets: rippleData,
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: GAME_CONFIG.lilyPad.ripple.duration,
            paused: true,
            repeat: -1,
            onUpdate: () => {
                rippleGraphics.clear();
                
                if (rippleData.alpha > 0) {
                    // 内圈涟漪
                    rippleGraphics.lineStyle(
                        GAME_CONFIG.lilyPad.ripple.lineWidth, 
                        GAME_CONFIG.lilyPad.ripple.color, 
                        rippleData.alpha
                    );
                    rippleGraphics.strokeCircle(lilyPad.x, lilyPad.y, rippleData.radius);
                }
            },
            onStop: () => {
                rippleGraphics.clear();
                rippleGraphics.destroy();
            }
        });

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
        // Check if the animation already exists before creating it
        if (!this.anims.exists('jump')) {
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
    }

    createMessage() {
        const messageY = GAME_CONFIG.ui.message.y;
        
        this.messageBg = this.add.graphics();
        this.messageBg.fillStyle(GAME_CONFIG.ui.message.background.color, GAME_CONFIG.ui.message.background.alpha);
        this.messageBg.lineStyle(
            GAME_CONFIG.ui.message.background.borderWidth, 
            GAME_CONFIG.ui.message.background.borderColor
        );
        
        this.messageText = this.add.text(
            this.scale.width / 2,
            messageY,
            '',
            GAME_CONFIG.ui.message.style
        ).setOrigin(0.5, 0.5);
        
        this.messageText.setStroke('#000000', 2);
        this.messageText.setShadow(1, 1, '#000000', 2, true, true);
        
        this.messageBg.setDepth(this.messageText.depth - 1);
    }

    setText(message: string) {
        this.messageText.setColor('#FFFFFF');
        this.messageText.setText(message);
        
        const padding = GAME_CONFIG.ui.message.style.padding;
        const textWidth = this.messageText.width;
        const textHeight = this.messageText.height;
        const cornerRadius = GAME_CONFIG.ui.message.background.cornerRadius;
        const messageY = GAME_CONFIG.ui.message.y;
        
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
        
        this.tweens.killTweensOf(this.messageText);
        this.messageText.setScale(0.85);
        this.tweens.add({
            targets: this.messageText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    setupAutoJump() {
        const jumpDelay = Math.max(
            GAME_CONFIG.difficulty.maxSpeed,
            GAME_CONFIG.difficulty.initial.jumpDelay * 
            Math.pow(GAME_CONFIG.difficulty.increment.speedup, this.level - 1)
        );

        this.setText(this.translate('level', { level: this.level.toString(), jumps: this.numJumps.toString() }));

        this.time.delayedCall(2000, () => {
            this.setText(this.translate('watch'));
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
            const currentPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex]];
            currentPad.rippleTween?.pause();

            const nextPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex + 1]];
            const angle = PhaserMath.Angle.Between(
                this.frog.x,
                this.frog.y,
                nextPad.x,
                nextPad.y
            );

            this.frog.angle = PhaserMath.RadToDeg(angle) - 135;

            this.tweens.add({
                targets: this.frog,
                x: nextPad.x,
                y: nextPad.y,
                onStart: () => {
                    this.frog.play('jump');
                },
                onComplete: () => {
                    this.frog.setTexture('frog', GAME_CONFIG.frog.frames.idle);
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
        
        this.lilyPads.forEach(pad => pad.rippleTween?.pause());
        
        const startPad = this.lilyPads[this.jumpSequence[0]];
        this.frog.setPosition(startPad.x, startPad.y);
        this.frog.setTexture('frog', GAME_CONFIG.frog.frames.idle);
        this.frog.angle = 0;
        
        startPad.rippleTween?.restart();
        
        this.setText(this.translate('repeat'));
    }

    handleLilyPadClick(padIndex: number) {
        if (this.gameState !== 'playing') return;
        
        const correctPadIndex = this.jumpSequence[this.currentJumpIndex];
        
        if (padIndex === correctPadIndex) {
            const currentPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex - 1]];
            currentPad.rippleTween?.pause();

            const targetPad = this.lilyPads[padIndex];
            this.createCorrectGlow(targetPad);
            
            this.playerSequence.push(padIndex);
            
            const angle = PhaserMath.Angle.Between(
                this.frog.x,
                this.frog.y,
                targetPad.x,
                targetPad.y
            );

            this.frog.angle = PhaserMath.RadToDeg(angle) - 135;

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
                    targetPad.rippleTween?.restart();
                    
                    this.currentJumpIndex++;
                    
                    if (this.currentJumpIndex > this.numJumps) {
                        this.handleSuccess();
                    }
                },
            });
        } else {
            this.handleFailure();
        }
    }

    createCorrectGlow(lilyPad: LilyPad) {
        const ripple = this.add.graphics();
        
        this.tweens.add({
            targets: { radius: GAME_CONFIG.lilyPad.ripple.radius.from, alpha: 1 },
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: 500,
            onUpdate: (tween, target) => {
                const currentRadius = target.radius;
                const currentAlpha = target.alpha;
                
                ripple.clear();
                ripple.lineStyle(
                    GAME_CONFIG.lilyPad.ripple.lineWidth, 
                    0x00ff00,
                    currentAlpha
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
        this.setText(this.translate('gameOver'));
        this.streakMultiplier = 1;

        const wrongPad = this.lilyPads[this.jumpSequence[this.currentJumpIndex]];
        const ripple = this.add.graphics();

        this.tweens.add({
            targets: { radius: GAME_CONFIG.lilyPad.ripple.radius.from, alpha: 1 },
            alpha: { from: 1, to: 0 },
            radius: { 
                from: GAME_CONFIG.lilyPad.ripple.radius.from, 
                to: GAME_CONFIG.lilyPad.ripple.radius.to 
            },
            ease: 'Sine.easeOut',
            duration: 500,
            onUpdate: (tween, target) => {
                const currentRadius = target.radius;
                const currentAlpha = target.alpha;
                
                ripple.clear();
                ripple.lineStyle(
                    GAME_CONFIG.lilyPad.ripple.lineWidth, 
                    0xff0000,
                    currentAlpha
                );
                ripple.strokeCircle(wrongPad.x, wrongPad.y, currentRadius);
            },
            onComplete: () => {
                ripple.destroy();
                this.time.delayedCall(500, () => {
                    const scoreText = this.add.text(
                        this.scale.width / 2,
                        this.scale.height / 2 - 40,
                        this.translate('score', { score: this.score.toString() }),
                        {
                            fontSize: '28px',
                            fontFamily: 'Arial',
                            color: '#ffffff',
                            fontStyle: 'bold',
                            stroke: '#000000',
                            strokeThickness: 3,
                            align: 'center'
                        }
                    ).setOrigin(0.5);
                    
                    this.tweens.add({
                        targets: scoreText,
                        scale: { from: 0.8, to: 1 },
                        duration: 300,
                        ease: 'Back.easeOut'
                    });
                    
                    this.createRetryButton();
                });
            }
        });
    }

    createRetryButton() {
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        const buttonBg = this.add.graphics();
        
        buttonBg.fillStyle(0xFFD700);
        
        buttonBg.fillRoundedRect(-120, -25, 240, 50, 25);
        
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);
        shadow.fillRoundedRect(-120, 0, 240, 25, { tl: 0, tr: 0, bl: 25, br: 25 });
        
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);
        highlight.fillRoundedRect(-115, -22, 230, 15, 20);
        
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-120, -25, 240, 50, 25);
        
        const buttonText = this.add.text(0, 0, this.translate('tryAgain'), {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        buttonContainer.setSize(240, 50);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerup', () => {
            buttonContainer.disableInteractive();
            
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.cameras.main.fadeOut(300);
                    
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.cleanupCurrentLevel();
                        
                        this.init({
                            level: this.level,
                            score: this.score
                        });
                        
                        this.create();
                        
                        this.cameras.main.fadeIn(300);
                    });
                }
            });
        });
    }

    handleSuccess() {
        this.gameState = 'complete';
        const levelScore = this.calculateScore();
        this.score += levelScore;
        
        this.createSuccessConfetti();
        
        const nextJumps = Math.min(
            GAME_CONFIG.difficulty.initial.numJumps + 
            this.level * GAME_CONFIG.difficulty.increment.numJumps,
            GAME_CONFIG.difficulty.maxJumps
        );
        
        if (nextJumps === GAME_CONFIG.difficulty.maxJumps && 
            this.numJumps === GAME_CONFIG.difficulty.maxJumps) {
            this.setText(this.translate('maxLevel', { score: this.score.toString() }));
            this.time.delayedCall(1500, () => {
                this.createRetryFromStartButton();
            });
        } else {
            this.setText(this.translate('success', { 
                score: this.score.toString(), 
                level: this.level.toString() 
            }));
            
            this.time.delayedCall(1500, () => {
                const scoreText = this.add.text(
                    this.scale.width / 2,
                    this.scale.height / 2 - 40,
                    this.translate('score', { score: this.score.toString() }),
                    {
                        fontSize: '28px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        fontStyle: 'bold',
                        stroke: '#000000',
                        strokeThickness: 3,
                        align: 'center'
                    }
                ).setOrigin(0.5);
                
                this.tweens.add({
                    targets: scoreText,
                    scale: { from: 0.8, to: 1 },
                    duration: 300,
                    ease: 'Back.easeOut'
                });
                
                this.createNextLevelButton();
            });
        }
    }

    createNextLevelButton() {
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        const buttonBg = this.add.graphics();
        
        buttonBg.fillStyle(0xFFD700);
        
        buttonBg.fillRoundedRect(-120, -30, 240, 60, 30);
        
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);
        shadow.fillRoundedRect(-120, 0, 240, 30, { tl: 0, tr: 0, bl: 30, br: 30 });
        
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);
        highlight.fillRoundedRect(-115, -27, 230, 20, 25);
        
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-120, -30, 240, 60, 30);
        
        const buttonText = this.add.text(0, 0, this.translate('nextLevel'), {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        buttonContainer.setSize(240, 60);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-120, -30, 240, 60, 30);
        });
        
        buttonContainer.on('pointerup', () => {
            buttonContainer.disableInteractive();
            
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.cameras.main.fadeOut(300);
                    
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        const nextLevel = this.level + 1;
                        const currentScore = this.score;
                        
                        this.cleanupCurrentLevel();
                        
                        this.init({
                            level: nextLevel,
                            score: currentScore
                        });
                        
                        this.create();
                        
                        this.cameras.main.fadeIn(300);
                    });
                }
            });
        });
    }

    createRetryFromStartButton() {
        const buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);
        
        const buttonBg = this.add.graphics();
        
        buttonBg.fillStyle(0xFFD700);
        
        buttonBg.fillRoundedRect(-120, -25, 240, 50, 25);
        
        const shadow = this.add.graphics();
        shadow.fillStyle(0xFFA500, 0.5);
        shadow.fillRoundedRect(-120, 0, 240, 25, { tl: 0, tr: 0, bl: 25, br: 25 });
        
        const highlight = this.add.graphics();
        highlight.fillStyle(0xFFFFFF, 0.3);
        highlight.fillRoundedRect(-115, -22, 230, 15, 20);
        
        const border = this.add.graphics();
        border.lineStyle(3, 0x000000, 0.3);
        border.strokeRoundedRect(-120, -25, 240, 50, 25);
        
        const buttonText = this.add.text(0, 0, this.translate('playAgain'), {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        
        buttonContainer.add([buttonBg, shadow, highlight, border, buttonText]);
        
        buttonContainer.setSize(240, 50);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFE44D).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFD700).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });
            buttonBg.clear().fillStyle(0xFFA500).fillRoundedRect(-120, -25, 240, 50, 25);
        });
        
        buttonContainer.on('pointerup', () => {
            buttonContainer.disableInteractive();
            
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.cameras.main.fadeOut(300);
                    
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.cleanupCurrentLevel();
                        
                        this.init({
                            level: 1,
                            score: 0
                        });
                        
                        this.create();
                        
                        this.cameras.main.fadeIn(300);
                    });
                }
            });
        });

        const finalScoreText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 50,
            this.translate('finalScore', { score: this.score.toString() }),
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#FFD700',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
            }
        ).setOrigin(0.5);
        
        this.tweens.add({
            targets: finalScoreText,
            scale: { from: 0.8, to: 1 },
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    calculateScore() {
        let levelScore = GAME_CONFIG.scoring.base * this.streakMultiplier;
        
        const timeElapsed = Date.now() - this.startTime;
        if (timeElapsed < GAME_CONFIG.scoring.timeBonus.threshold) {
            levelScore += GAME_CONFIG.scoring.timeBonus.points;
        }
        
        this.streakMultiplier += GAME_CONFIG.scoring.streak.multiplier;
        
        return Math.floor(levelScore);
    }

    update() {
        // 确保涟漪效果正确显示
        this.lilyPads.forEach(lilyPad => {
            const isCurrentPad = this.frog.x === lilyPad.x && this.frog.y === lilyPad.y;
            
            if (isCurrentPad && lilyPad.rippleTween?.paused) {
                lilyPad.rippleTween.restart();
            } else if (!isCurrentPad && !lilyPad.rippleTween?.paused) {
                lilyPad.rippleTween?.pause();
                lilyPad.rippleGraphics?.clear();
            }
        });
    }

    shutdown() {
        this.lilyPads.forEach(pad => {
            pad.rippleTween?.stop();
            pad.rippleGraphics?.clear();
            pad.rippleGraphics?.destroy();
        });
        this.children.removeAll();
        this.lilyPads = [];
        this.frog?.destroy();
        this.messageText?.destroy();
        this.messageBg?.destroy();
        
        this.time.removeAllEvents();
        
        this.tweens.killAll();
        
        this.add.particles().destroy();
    }

    private createSuccessConfetti() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        const burst = this.add.particles(0, 0, 'confetti', {
            x: centerX,
            y: centerY - 150,
            frame: [0, 4, 8, 12, 16],
            lifespan: { min: 2500, max: 3000 },
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            gravityY: 100,
            scale: { start: 1, end: 0.2 },
            quantity: 1,
            frequency: -1,
            blendMode: 'ADD',
            rotate: {
                onEmit: () => PhaserMath.Between(0, 360),
                onUpdate: (particle) => {
                    return particle.rotation + 2;
                }
            }
        });

        burst.explode(40);

        this.time.delayedCall(2500, () => {
            burst.destroy();
        });
    }

    cleanupCurrentLevel() {
        this.lilyPads.forEach(pad => {
            pad.rippleTween?.stop();
            pad.rippleGraphics?.destroy();
            pad.destroy();
        });
        this.lilyPads = [];
        
        this.frog?.destroy();
        
        this.children.list
            .filter(child => 
                child !== this.messageText && 
                child !== this.messageBg
            )
            .forEach(child => {
                if (child instanceof Phaser.GameObjects.Container) {
                    child.destroy(true);
                } else if (child.destroy) {
                    child.destroy();
                }
            });
    }

    // Create a jump sequence that may include repeated pads
    private generateJumpSequence(actualNumPads: number) {
        // If we have a predefined sequence, use it
        if (this.jumpSequence.length > 0) {
            return;
        }
        
        // If we don't have enough pads, we'll need to repeat some
        this.jumpSequence = [];
        
        // Always start from a random first pad
        const firstPadIndex = Math.floor(Math.random() * actualNumPads);
        this.jumpSequence.push(firstPadIndex);
        
        // Generate the remaining jumps, allowing for repeats if necessary
        for (let i = 0; i < this.numJumps; i++) {
            let nextPadIndex;
            let attempts = 0;
            const maxAttempts = 10; // Prevent infinite loops
            
            do {
                // Pick a random pad index
                nextPadIndex = Math.floor(Math.random() * actualNumPads);
                attempts++;
                
                // Try to avoid the immediately previous pad if possible
                // But allow it if we've made too many attempts or have very few pads
            } while (
                nextPadIndex === this.jumpSequence[this.jumpSequence.length - 1] && 
                attempts < maxAttempts && 
                actualNumPads > 2
            );
            
            this.jumpSequence.push(nextPadIndex);
        }
    }
} 