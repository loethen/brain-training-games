import { Scene } from 'phaser';
import { GAME_CONFIG } from '../config';
import { LEVEL_CONFIG, DEFAULT_MAX_LEVEL } from '../levelConfig';

export class StartScene extends Scene {
    private canFullscreen: boolean = false;
    private isMobile: boolean = false;
    private translate: (key: string) => string = (key: string) => key;
    
    // 关卡选择相关属性
    private selectedLevel: number = 1;
    private maxUnlockedLevel: number = 1;
    private levelButtons: Phaser.GameObjects.Container[] = [];
    private startButton: Phaser.GameObjects.Image | null = null;

    constructor() {
        super({ key: 'StartScene' });
    }

    init() {
        this.translate = this.game.registry.get('t') || ((key: string) => key);
        
        // 从本地存储中获取已解锁的最高关卡
        const savedLevel = localStorage.getItem('fishGameUnlockedLevel');
        this.maxUnlockedLevel = savedLevel ? parseInt(savedLevel) : DEFAULT_MAX_LEVEL;
        
        // 默认选择已解锁的最高关卡
        this.selectedLevel = this.maxUnlockedLevel;
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
        
        // 添加背景
        this.add.image(width/2, height/2, "sea")
            .setDisplaySize(width, height);

        // 添加游戏标题
        const titleStyle = { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', stroke: '#000000', strokeThickness: 5 };
        this.add.text(width/2, height * 0.2, this.translate('title') || 'Glowing Fish Trace', titleStyle)
            .setOrigin(0.5)
            .setShadow(2, 2, '#000000', 2, true);

        // 添加选择关卡文本
        const textStyle = { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 };
        this.add.text(width/2, height * 0.3, this.translate('selectLevel') || 'Select Level', textStyle)
            .setOrigin(0.5);
            
        // 创建关卡选择按钮
        this.createLevelButtons();
        
        // 添加关卡描述
        const descStyle = { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'center' };
        this.add.text(width/2, height * 0.6, this.getLevelDescription(), descStyle)
            .setOrigin(0.5)
            .setName('levelDesc');
            
        // 添加开始游戏按钮
        const btnScale = Math.min(width, height) * 0.0008;
        this.startButton = this.add.image(width/2, height * 0.75, "sea_btn")
            .setScale(btnScale)
            .setInteractive()
            .on('pointerup', () => {
                if (this.canFullscreen && this.isMobile) {
                    this.scale.startFullscreen();
                }
                
                this.startGame();
            });
    }
    
    // 创建关卡选择按钮
    private createLevelButtons() {
        const width = this.scale.width;
        const height = this.scale.height;
        const buttonSize = 50;
        const spacing = 70;
        const totalWidth = (LEVEL_CONFIG.length - 1) * spacing;
        const startX = width/2 - totalWidth/2;
        
        for (let i = 0; i < LEVEL_CONFIG.length; i++) {
            const levelNum = i + 1;
            const isUnlocked = levelNum <= this.maxUnlockedLevel;
            
            // 创建圆形按钮容器
            const container = this.add.container(startX + i * spacing, height * 0.45);
            
            // 创建圆形背景
            const circle = this.add.circle(0, 0, buttonSize/2, isUnlocked ? 0x0088ff : 0x666666);
            
            if (isUnlocked) {
                circle.setStrokeStyle(3, 0xffffff);
            }
            
            // 添加文本
            const textStyle = { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' };
            const text = this.add.text(0, 0, levelNum.toString(), textStyle)
                .setOrigin(0.5);
                
            // 将元素添加到容器
            container.add([circle, text]);
            
            // 如果关卡已解锁，添加交互
            if (isUnlocked) {
                circle.setInteractive({ useHandCursor: true })
                    .on('pointerup', () => {
                        this.selectLevel(levelNum);
                    })
                    .on('pointerover', () => {
                        circle.setFillStyle(0x44aaff);
                    })
                    .on('pointerout', () => {
                        circle.setFillStyle(levelNum === this.selectedLevel ? 0x0099ff : 0x0088ff);
                    });
            }
            
            // 设置当前选中的关卡样式
            if (levelNum === this.selectedLevel) {
                circle.setFillStyle(0x0099ff);
                circle.setStrokeStyle(4, 0xffff00);
            }
            
            this.levelButtons.push(container);
        }
    }
    
    // 选择关卡
    private selectLevel(level: number) {
        if (level <= this.maxUnlockedLevel) {
            this.selectedLevel = level;
            
            // 更新所有按钮样式
            for (let i = 0; i < this.levelButtons.length; i++) {
                const container = this.levelButtons[i];
                const circle = container.getAt(0) as Phaser.GameObjects.Shape;
                const levelNum = i + 1;
                
                if (levelNum <= this.maxUnlockedLevel) {
                    circle.setFillStyle(levelNum === this.selectedLevel ? 0x0099ff : 0x0088ff);
                    circle.setStrokeStyle(levelNum === this.selectedLevel ? 4 : 3, 
                                         levelNum === this.selectedLevel ? 0xffff00 : 0xffffff);
                }
            }
            
            // 更新描述文本
            const descText = this.children.getByName('levelDesc') as Phaser.GameObjects.Text;
            if (descText) {
                descText.setText(this.getLevelDescription());
            }
        }
    }
    
    // 获取当前选择关卡的描述
    private getLevelDescription(): string {
        const levelIndex = this.selectedLevel - 1;
        
        if (levelIndex >= 0 && levelIndex < LEVEL_CONFIG.length) {
            const config = LEVEL_CONFIG[levelIndex];
            return this.translate(`levelDesc.${levelIndex}`) || config.description;
        }
        
        return '';
    }

    startGame() {
        // 保存当前选择的关卡
        localStorage.setItem('fishGameCurrentLevel', this.selectedLevel.toString());
        
        // 过渡动画
        if (this.startButton) {
            const btnScale = this.startButton.scale;
            this.tweens.add({
                targets: [this.startButton],
                scale: btnScale * 3,
                alpha: 0,
                ease: 'Power2',
                duration: 1000,
                onComplete: () => {
                    this.transitionToGameScene();
                }
            });
        } else {
            this.transitionToGameScene();
        }
    }
    
    private transitionToGameScene() {
        this.scene.transition({
            target: 'SunfishScene',
            duration: 1000,
            data: {
                level: this.selectedLevel,
                score: 0
            }
        });
    }
} 