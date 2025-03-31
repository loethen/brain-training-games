import { Scene } from 'phaser';
import { GAME_CONFIG } from '../config';

export class StartScene extends Scene {
    private canFullscreen: boolean = false;
    private isMobile: boolean = false;
    private translate: (key: string) => string = (key: string) => key;

    constructor() {
        super({ key: 'StartScene' });
    }

    init() {
        this.translate = this.game.registry.get('t') || ((key: string) => key);
    }

    preload() {
        this.load.image("sea", GAME_CONFIG.assets.seaBg);
        this.load.image("sea_btn", GAME_CONFIG.assets.seaBtn);
        
        this.canFullscreen = this.scale.fullscreen.available;
        this.isMobile = this.sys.game.device.os.iPhone || 
                        this.sys.game.device.os.android || 
                        this.sys.game.device.os.iPad;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.image(width/2, height/2, "sea")
            .setDisplaySize(width, height);

        const btnScale = Math.min(width, height) * 0.001;
        const btn = this.add.image(width/2, height/2, "sea_btn")
            .setScale(btnScale);
        
        const transition = (cb: () => void) => {
            this.tweens.add({
                targets: [btn],
                scale: btnScale * 3,
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
    }

    startGame() {
        this.scene.transition({
            target: 'SunfishScene',
            duration: 1000,
            data: {
                sunfishCount: GAME_CONFIG.fish.count,
                glowingSunfishCount: GAME_CONFIG.fish.glowingCount,
                gameDuration: GAME_CONFIG.timing.gameDuration,
                glowDuration: GAME_CONFIG.timing.glowDuration,
                glowColor: GAME_CONFIG.glow.color
            }
        })
    }
} 