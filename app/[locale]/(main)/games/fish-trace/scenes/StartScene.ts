import { Scene } from 'phaser';
import { GAME_CONFIG } from '../config';
import { LEVEL_CONFIG } from '../levelConfig';

export class StartScene extends Scene {
    private canFullscreen: boolean = false;
    private isMobile: boolean = false;
    private translate: (key: string) => string = (key: string) => key;
    
    // 关卡选择相关属性
    private selectedLevel: number = 1;
    private levelButtons: Phaser.GameObjects.Container[] = [];
    private startButton: Phaser.GameObjects.Image | null = null;

    constructor() {
        super({ key: 'StartScene' });
    }

    init() {
        this.translate = this.game.registry.get('t') || ((key: string) => key);
        
        // 读取上次选择的关卡（如果有）
        const savedLevel = localStorage.getItem('fishGameCurrentLevel');
        if (savedLevel) {
            this.selectedLevel = parseInt(savedLevel);
            // 确保关卡有效
            if (this.selectedLevel < 1 || this.selectedLevel > LEVEL_CONFIG.length) {
                this.selectedLevel = 1;
            }
        }
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
        const descStyle = { 
            fontFamily: 'Arial', 
            fontSize: '20px', 
            color: '#ffffff', 
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        };
        this.add.text(width/2, height * 0.53, this.getLevelDescription(), descStyle)
            .setOrigin(0.5)
            .setShadow(1, 1, '#000000', 3)
            .setName('levelDesc');
            
        // 添加开始游戏按钮
        const btnScale = Math.min(width, height) * 0.0008;
        this.startButton = this.add.image(width/2, height * 0.8, "sea_btn")
            .setScale(btnScale)
            .setInteractive({useHandCursor: true})
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
        const buttonSize = 70; // 增大按钮尺寸
        const spacing = 90; // 调整按钮间距
        const totalWidth = (LEVEL_CONFIG.length - 1) * spacing;
        const startX = width/2 - totalWidth/2;
        
        for (let i = 0; i < LEVEL_CONFIG.length; i++) {
            const levelNum = i + 1;
            
            // 创建圆形按钮容器
            const container = this.add.container(startX + i * spacing, height * 0.45);
            
            // 创建圆形背景
            const circle = this.add.circle(0, 0, buttonSize/2, 0x0088ff);
            circle.setStrokeStyle(3, 0xffffff);
            
            // 添加文本
            const textStyle = { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', fontWeight: 'bold' };
            const text = this.add.text(0, 0, levelNum.toString(), textStyle)
                .setOrigin(0.5);
                
            // 将元素添加到容器
            container.add([circle, text]);
            
            // 给整个容器添加交互区域
            const hitArea = new Phaser.Geom.Circle(0, 0, buttonSize/2);
            container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
            // 检查input是否存在
            if (container.input) {
                container.input.cursor = 'pointer';
            }
            
            // 添加交互事件
            container.on('pointerup', () => {
                this.selectLevel(levelNum);
            });
            
            container.on('pointerover', () => {
                circle.setFillStyle(0x44aaff);
            });
            
            container.on('pointerout', () => {
                circle.setFillStyle(levelNum === this.selectedLevel ? 0x0099ff : 0x0088ff);
            });
            
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
        this.selectedLevel = level;
        
        // 更新所有按钮样式
        for (let i = 0; i < this.levelButtons.length; i++) {
            const container = this.levelButtons[i];
            const circle = container.getAt(0) as Phaser.GameObjects.Shape;
            const levelNum = i + 1;
            
            circle.setFillStyle(levelNum === this.selectedLevel ? 0x0099ff : 0x0088ff);
            circle.setStrokeStyle(levelNum === this.selectedLevel ? 4 : 3, 
                                 levelNum === this.selectedLevel ? 0xffff00 : 0xffffff);
        }
        
        // 更新描述文本
        const descText = this.children.getByName('levelDesc') as Phaser.GameObjects.Text;
        if (descText) {
            descText.setText(this.getLevelDescription());
        }
    }
    
    // 获取当前选择关卡的描述
    private getLevelDescription(): string {
        const levelIndex = this.selectedLevel - 1;
        
        if (levelIndex >= 0 && levelIndex < LEVEL_CONFIG.length) {
            const config = LEVEL_CONFIG[levelIndex];
            // 通过translate函数访问，已经配置了前缀，所以路径需要简化
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