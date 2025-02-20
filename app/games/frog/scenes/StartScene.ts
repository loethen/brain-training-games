import { Scene } from 'phaser';
import { GAME_CONFIG } from '../config';

export class StartScene extends Scene {
    private canFullscreen: boolean = false;
    private isMobile: boolean = false;

    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image("pond", GAME_CONFIG.assets.pond);
        this.load.image("start_btn", GAME_CONFIG.assets.startBtn);
        
        this.canFullscreen = this.scale.fullscreen.available;
        this.isMobile = this.sys.game.device.os.iPhone || 
                        this.sys.game.device.os.android || 
                        this.sys.game.device.os.iPad;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.image(width/2, height/2, "pond").setScale(0.6);

        const btn = this.add.image(width/2, height/2, "start_btn")
            .setScale(0.6);
        
        const transition = (cb: () => void) => {
            this.tweens.add({
                targets: [btn],
                scale: 2,
                alpha: 0,
                ease: 'Power2',
                duration: 1000,
                onComplete: () => {
                    if (cb) cb();
                }
            });
        }

        btn.setInteractive();
        btn.on('pointerup', () => {
            if (this.canFullscreen && this.isMobile) {
                this.scale.startFullscreen();
            }
            
            transition(() => {
                this.startGame();
            });
        });

        // 添加键盘事件监听
        this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Space' || event.code === 'Enter') {
                transition(() => {
                    this.startGame();
                });
            }
        });
    }

    startGame() {
        const config = {
            numLilyPads: GAME_CONFIG.lilyPad.count,
            numJumps: GAME_CONFIG.difficulty.initial.numJumps,
            jumpSequence: Phaser.Utils.Array.Shuffle([...Array(GAME_CONFIG.lilyPad.count).keys()])
        };

        this.scene.transition({
            target: 'FrogScene',
            duration: 1000,
            data: config
        });
    }

    init(data: { nextLevel?: number; score?: number }) {
        if (data.nextLevel) {
            // 如果是从其他关卡来的，直接开始新关卡
            this.time.delayedCall(100, () => {
                this.scene.start('FrogScene', {
                    level: data.nextLevel,
                    score: data.score
                });
            });
        }
    }
} 