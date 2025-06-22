'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GAME_CONFIG } from '../config';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { useTimeout } from '@/hooks/useTimeout';
import { useInterval } from '@/hooks/useInterval';
import { PatternGenerators } from '../patterns/PatternGenerators';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import '../styles.css';
import confetti from 'canvas-confetti';

type GameState = 'start' | 'observing' | 'input' | 'result' | 'gameOver' | 'animating';

// 关卡配置接口
interface LevelConfig {
    blocksRange: [number, number];
    pattern: string[];
    observer: [number, number];
    animation: string[];
}

// 游戏结果统计
interface GameStats {
    totalLevels: number;
    correctAnswers: number;
    totalTime: number;
    levelResults: { level: number; correct: boolean; userAnswer: number; correctAnswer: number }[];
}

// 动画控制器接口
interface AnimationController {
    name: string;
    execute: (
        cubesGroup: THREE.Group,
        scene: THREE.Scene,
        onComplete: () => void
    ) => void;
}



// 动画控制器实现
const AnimationControllers: Record<string, AnimationController> = {
    flyIn: {
        name: 'flyIn',
        execute: (cubesGroup: THREE.Group, scene: THREE.Scene, onComplete: () => void) => {
            // 从左上角飞到右下角的动画
            const duration = 3000;
            const startTime = Date.now();
            const startPosition = { x: -12, y: 8, z: 8 };
            const endPosition = { x: 12, y: -8, z: -8 };
            
            // 找到网格元素
            let gridHelper: THREE.GridHelper | null = null;
            let gridBorder: THREE.LineLoop | null = null;
            
            scene.children.forEach(child => {
                if (child instanceof THREE.GridHelper) {
                    gridHelper = child;
                } else if (child instanceof THREE.LineLoop) {
                    gridBorder = child;
                }
            });
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 匀速运动
                const currentX = startPosition.x + (endPosition.x - startPosition.x) * progress;
                const currentY = startPosition.y + (endPosition.y - startPosition.y) * progress;
                const currentZ = startPosition.z + (endPosition.z - startPosition.z) * progress;
                
                cubesGroup.position.set(currentX, currentY, currentZ);
                if (gridHelper) {
                    gridHelper.position.set(currentX, currentY - 0.01, currentZ);
                }
                if (gridBorder) {
                    gridBorder.position.set(currentX, currentY, currentZ);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 重置位置
                    cubesGroup.position.set(0, 0, 0);
                    cubesGroup.visible = false;
                    if (gridHelper) {
                        gridHelper.position.set(0, -0.01, 0);
                    }
                    if (gridBorder) {
                        gridBorder.position.set(0, 0, 0);
                    }
                    onComplete();
                }
            };
            
            animate();
        }
    }
};

// 新的关卡配置
const LEVEL_CONFIGS: LevelConfig[] = [
    {
        blocksRange: [3, 4],
        pattern: ["corner"],
        observer: [800, 1000],
        animation: [],
    },
    {
        blocksRange: [4, 6],
        pattern: ["line", "tower"],
        observer: [700, 800],
        animation: ["flyIn", ""],
    },
    {
        blocksRange: [5, 7],
        pattern: ["cross", "tower"],
        observer: [600, 800],
        animation: ["flyIn", ""],
    },
    {
        blocksRange: [7, 9],
        pattern: ["scattered", "tower"],
        observer: [600, 800],
        animation: ["flyIn", ""],
    },
    {
        blocksRange: [3, 4],
        pattern: ["random_fill"],
        observer: [250, 300],
        animation: [],
    },
    {
        blocksRange: [20, 23],
        pattern: ["random_fill"],
        observer: [300, 400],
        animation: [],
    },
];

// 工具函数：从数组中随机选择
function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 工具函数：从范围中随机选择数字
function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function GameComponent() {
    // 翻译
    const t = useTranslations('games.countingBoxes.gameUI');
    
    // 游戏状态
    const [gameState, setGameState] = useState<GameState>('start');
    const [level, setLevel] = useState(1);
    const [correctBlockCount, setCorrectBlockCount] = useState(0);
    const [timerDisplay, setTimerDisplay] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [observeTimeLeft, setObserveTimeLeft] = useState<number | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const [lastResult, setLastResult] = useState<{ correct: boolean } | null>(
        null
    );
    const [gameStats, setGameStats] = useState<GameStats>({
        totalLevels: 0,
        correctAnswers: 0,
        totalTime: 0,
        levelResults: []
    });
    const [gameStartTime, setGameStartTime] = useState<number>(0);

    // Refs for Three.js
    const sceneRef = useRef<HTMLDivElement>(null);
    const sceneInstanceRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const cubesGroupRef = useRef<THREE.Group | null>(null);
    const correctHeightMapRef = useRef<number[]>([]);
    const isInitializedRef = useRef(false);
    const containerSizeRef = useRef<{ width: number; height: number }>({
        width: 400,
        height: 400,
    });
    const selectedAnimationRef = useRef<string>('default');

    // Three.js 颜色常量
    const CUBE_COLOR = new THREE.Color(0xffffff);
    const SUCCESS_COLOR = new THREE.Color(0x1eba38);
    const EDGE_COLOR = new THREE.Color(0x000000);
    const GRID_COLOR = new THREE.Color(0x434343);
    const BACKGROUND_COLOR = new THREE.Color(0xf5f5f5);

    // 使用useTimeout进行观察时间控制
    useTimeout(() => {
        if (gameState === 'observing') {
            startInputPhase();
        }
    }, gameState === 'observing' ? observeTimeLeft : null);

    useTimeout(() => {
        if (gameState === 'result' && level < LEVEL_CONFIGS.length) {
            goToNextLevel();
        }
    }, gameState === 'result' && level < LEVEL_CONFIGS.length ? 3000 : null);

    useTimeout(() => {
        if (gameState === 'result' && level === LEVEL_CONFIGS.length) {
            setGameStats((prev) => ({
                ...prev,
                totalTime: Date.now() - gameStartTime,
            }));
            setGameState('gameOver');
        }
    }, gameState === 'result' && level === LEVEL_CONFIGS.length ? 1000 : null);

    useInterval(
        () => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            }
        },
        gameState === 'result' && countdown > 0 ? 1000 : null
    );

    // Three.js 初始化
    const initThree = useCallback(() => {
        if (!sceneRef.current || isInitializedRef.current) return;

        isInitializedRef.current = true;

        // 清理现有的canvas（如果存在）
        const container = sceneRef.current;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // 1. Scene
        const scene = new THREE.Scene();
        scene.background = BACKGROUND_COLOR;
        sceneInstanceRef.current = scene;

        // 2. Camera
        const aspect = 400 / 400; // 固定aspect ratio
        const camera = new THREE.OrthographicCamera(
            -5 * aspect,
            5 * aspect,
            5,
            -5,
            1,
            1000
        );
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // 3. Renderer - 针对不同屏幕优化
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            precision: "highp", // 高精度，改善线条质量
            stencil: false, // 不需要模板缓冲
            depth: true,
            logarithmicDepthBuffer: false,
        });

        // 设置渲染器尺寸和像素比以避免模糊 - 自适应容器大小
        const containerRect = container.getBoundingClientRect();
        const size = Math.min(containerRect.width, containerRect.height, 600); // 最大600px
        const width = size;
        const height = size;

        // 保存容器尺寸供后续使用
        containerSizeRef.current = { width, height };

        renderer.setSize(width, height);
        // 简化的DPI设置：确保各类屏幕的最佳质量
        renderer.setPixelRatio(window.devicePixelRatio);

        // 确保canvas样式尺寸正确
        const canvas = renderer.domElement;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.style.display = "block";

        container.appendChild(canvas);
        rendererRef.current = renderer;

        // 4. Grid
        const gridHelper = new THREE.GridHelper(
            GAME_CONFIG.gridSize,
            GAME_CONFIG.gridSize,
            GRID_COLOR,
            GRID_COLOR
        );
        gridHelper.position.y = -0.01; // 轻微下移避免与方块重叠
        scene.add(gridHelper);

        // 5. Grid Border - 添加清晰的边框
        const s = GAME_CONFIG.gridSize / 2;
        const points = [];
        points.push(new THREE.Vector3(-s, 0, -s));
        points.push(new THREE.Vector3(s, 0, -s));
        points.push(new THREE.Vector3(s, 0, s));
        points.push(new THREE.Vector3(-s, 0, s));

        const borderGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const borderMaterial = new THREE.LineBasicMaterial({
            color: EDGE_COLOR,
        });
        const gridBorder = new THREE.LineLoop(borderGeometry, borderMaterial);
        scene.add(gridBorder);

        // 6. Lights - 从左下角照射的光照设置
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 适当的环境光
        scene.add(ambientLight);

        // 主光源：从左下角照射
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(-15, -10, 10); // 左下角位置
        mainLight.target.position.set(0, 0, 0); // 照向场景中心
        scene.add(mainLight);
        scene.add(mainLight.target);

        // 补光：从右上角轻微补光，避免阴影过暗
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(10, 15, 5); // 右上角位置
        scene.add(fillLight);

        // 顶部补光：确保顶面有足够亮度
        const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
        topLight.position.set(0, 20, 0); // 正上方位置
        scene.add(topLight);

        // 7. Cubes group
        const cubesGroup = new THREE.Group();
        scene.add(cubesGroup);
        cubesGroupRef.current = cubesGroup;

        // Start animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // 处理窗口大小变化（如果需要响应式）
        const handleResize = () => {
            if (renderer.getPixelRatio() !== window.devicePixelRatio) {
                renderer.setPixelRatio(window.devicePixelRatio);
            }
        };

        window.addEventListener("resize", handleResize);

        // 返回清理函数
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 清空方块
    const clearBoard = useCallback(() => {
        if (cubesGroupRef.current) {
            while (cubesGroupRef.current.children.length > 0) {
                cubesGroupRef.current.remove(cubesGroupRef.current.children[0]);
            }
        }
    }, []);

    // 添加单个方块
    const addCube = useCallback(
        (index: number, heightLevel: number, color: THREE.Color) => {
            if (!cubesGroupRef.current) return;

            const CUBE_SIZE = 1; // Three.js中使用标准化单位
            const geometry = new THREE.BoxGeometry(
                CUBE_SIZE,
                CUBE_SIZE,
                CUBE_SIZE
            );

            // 为每个面创建不同的材质
            // 检查是否是成功状态（绿色）
            const isSuccessColor = color.getHex() === SUCCESS_COLOR.getHex();
            const sideColor = isSuccessColor ? color.getHex() : 0xe1eaf0;

            const materials = [
                new THREE.MeshStandardMaterial({
                    color: sideColor,
                    roughness: 0.1,
                    metalness: 0.0,
                }), // right - 侧面
                new THREE.MeshStandardMaterial({
                    color: sideColor,
                    roughness: 0.1,
                    metalness: 0.0,
                }), // left - 侧面
                new THREE.MeshStandardMaterial({
                    // top - 顶面使用传入的颜色，增加亮度
                    color: color,
                    roughness: 0.1,
                    metalness: 0.0,
                    emissive: new THREE.Color(color).multiplyScalar(0.3), // 大幅增加自发光
                    emissiveIntensity: 1.0, // 确保自发光强度
                }),
                new THREE.MeshStandardMaterial({
                    color: sideColor,
                    roughness: 0.1,
                    metalness: 0.0,
                }), // bottom - 底面
                new THREE.MeshStandardMaterial({
                    color: sideColor,
                    roughness: 0.1,
                    metalness: 0.0,
                }), // front - 正面
                new THREE.MeshStandardMaterial({
                    color: sideColor,
                    roughness: 0.1,
                    metalness: 0.0,
                }), // back - 背面
            ];

            const cube = new THREE.Mesh(geometry, materials);

            // 计算位置
            const gridOffset = GAME_CONFIG.gridSize / 2 - CUBE_SIZE / 2;
            const x = (index % GAME_CONFIG.gridSize) - gridOffset;
            const y = heightLevel * CUBE_SIZE + CUBE_SIZE / 2;
            const z = Math.floor(index / GAME_CONFIG.gridSize) - gridOffset;
            cube.position.set(x, y, z);

            // 添加完美的边框 - 简化但有效的设置
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({
                    color: EDGE_COLOR,
                })
            );
            // 轻微向外偏移边框避免Z-fighting
            line.scale.setScalar(1.001);
            cube.add(line);

            cubesGroupRef.current.add(cube);
        },
        []
    );

    // 根据高度图渲染方块
    const renderCubesFromHeightMap = useCallback(
        (heightMap: number[], color: THREE.Color) => {
            clearBoard();
            heightMap.forEach((height, index) => {
                if (height > 0) {
                    for (let h = 0; h < height; h++) {
                        addCube(index, h, color);
                    }
                }
            });
        },
        [clearBoard, addCube]
    );

    // 开始定时器 - 使用新的配置化观察时间
    const startTimer = useCallback(() => {
        if (level > LEVEL_CONFIGS.length) return;
        
        const levelConfig = LEVEL_CONFIGS[level - 1];
        const observeTime = randomInRange(levelConfig.observer[0], levelConfig.observer[1]);
        
        setObserveTimeLeft(observeTime);
    }, [level]);

    // 新的生成关卡函数 - 使用模块化的模式生成器
    const generateLevel = useCallback(() => {
        clearBoard();
        setCorrectBlockCount(0);

        // 获取当前关卡配置
        if (level > LEVEL_CONFIGS.length) {
            return;
        }
        const levelConfig = LEVEL_CONFIGS[level - 1];
        
        // 随机选择配置参数
        const targetBlocks = randomInRange(levelConfig.blocksRange[0], levelConfig.blocksRange[1]);
        const selectedPattern = randomChoice(levelConfig.pattern);
        // animation字段支持数组，随机选一个动画
        const selectedAnimation = levelConfig.animation && levelConfig.animation.length > 0 ? randomChoice(levelConfig.animation) : 'default';
        
        // 使用模式生成器生成方块布局
        const patternGenerator = PatternGenerators[selectedPattern];
        if (!patternGenerator) {
            console.error(`Unknown pattern: ${selectedPattern}`);
            return;
        }
        
        const heightMap = patternGenerator.generate(GAME_CONFIG.gridSize, targetBlocks);
        
        // 计算实际生成的方块总数（包括堆叠）
        const actualBlocks = heightMap.reduce((sum: number, height: number) => sum + height, 0);
        setCorrectBlockCount(actualBlocks);
        correctHeightMapRef.current = [...heightMap];
        
        // 渲染方块
        renderCubesFromHeightMap(correctHeightMapRef.current, CUBE_COLOR);
        
        // 保存选择的动画类型供后续使用
        selectedAnimationRef.current = selectedAnimation;

        // flyIn动画：直接执行动画，动画结束后进入输入阶段，不设置观察时间
        if (selectedAnimation === "flyIn" && cubesGroupRef.current && sceneInstanceRef.current) {
            setGameState("animating");
            const cubesGroup = cubesGroupRef.current;
            const scene = sceneInstanceRef.current;
            // 设置初始位置
            cubesGroup.position.set(-12, 8, 8);
            scene.children.forEach(child => {
                if (child instanceof THREE.GridHelper) {
                    child.position.set(-12, 8 - 0.01, 8);
                } else if (child instanceof THREE.LineLoop) {
                    child.position.set(-12, 8, 8);
                }
            });
            AnimationControllers.flyIn.execute(cubesGroup, scene, () => {
                setGameState("input");
            });
            return;
        }

        // 普通流程
        setGameState('observing');
        startTimer();
    
    }, [level, clearBoard, renderCubesFromHeightMap, startTimer]);

    // 开始输入阶段
    const startInputPhase = useCallback(() => {
        const selectedAnimation = selectedAnimationRef.current;
        
        // 如果有特殊动画，使用动画控制器
        const animationController = AnimationControllers[selectedAnimation];
        if (animationController && cubesGroupRef.current && sceneInstanceRef.current) {
            animationController.execute(cubesGroupRef.current, sceneInstanceRef.current, () => {
                setGameState("input");
            });
        } else {
            // 默认行为：直接隐藏方块并进入输入阶段
            setGameState("input");
            if (cubesGroupRef.current) {
                cubesGroupRef.current.visible = false;
            }
        }
    }, []);

    // 开始游戏
    const startGame = useCallback(() => {
        setGameStartTime(Date.now());
        setGameStats({
            totalLevels: 0,
            correctAnswers: 0,
            totalTime: 0,
            levelResults: []
        });
        setLevel(1);
        setUserAnswer('');
        setGameState('observing');
        generateLevel();
        startTimer();
    }, [generateLevel, startTimer]);

    // 检查答案 - 新机制：答对答错都进入下一关
    const checkAnswer = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const userAnswerNum = parseInt(userAnswer, 10);
            const isCorrect = userAnswerNum === correctBlockCount;

            const result = {
                level,
                correct: isCorrect,
                userAnswer: userAnswerNum,
                correctAnswer: correctBlockCount,
            };

            // 更新游戏统计
            setGameStats((prev) => ({
                ...prev,
                totalLevels: level,
                correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
                levelResults: [...prev.levelResults, result],
            }));

            // 显示方块
            if (cubesGroupRef.current) {
                cubesGroupRef.current.visible = true;
            }

                            // 立即显示结果
                setLastResult({ correct: isCorrect });
                if (isCorrect) {
                    renderCubesFromHeightMap(
                        correctHeightMapRef.current,
                        SUCCESS_COLOR
                    );
                    setTimerDisplay(t('correct') + '! ' + t('actualCount', { count: correctBlockCount }));
                } else {
                    renderCubesFromHeightMap(
                        correctHeightMapRef.current,
                        CUBE_COLOR
                    );
                    setTimerDisplay(t('incorrect') + '! ' + t('actualCount', { count: correctBlockCount }));
                }

            setGameState("result");
            setCountdown(3);
        },
        [
            userAnswer,
            correctBlockCount,
            level,
            renderCubesFromHeightMap,
        ]
    );

    const goToNextLevel = useCallback(() => {
        setLevel((prev) => prev + 1);
        setUserAnswer('');
        setTimerDisplay('');
        setLastResult(null);
        setGameState('observing');
    }, [level, gameStartTime]);

    // 监听关卡变化，自动生成新关卡
    useEffect(() => {
        if (gameState === 'observing') {
            generateLevel();
            startTimer();
        }
        // 其他gameState不再触发generateLevel
    }, [level, gameState, generateLevel, startTimer]);

    // 结算页全对时触发礼花动画
    useEffect(() => {
        if (
            gameState === 'gameOver' &&
            gameStats.totalLevels > 0 &&
            gameStats.correctAnswers === gameStats.totalLevels
        ) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [gameState, gameStats]);

    // 初始化Three.js
    useEffect(() => {
        initThree();

        // 清理函数
        return () => {
            // 完全清理Three.js资源
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current = null;
            }

            if (sceneInstanceRef.current) {
                sceneInstanceRef.current.clear();
                sceneInstanceRef.current = null;
            }

            if (cubesGroupRef.current) {
                cubesGroupRef.current = null;
            }

            // 清理DOM元素
            if (sceneRef.current) {
                while (sceneRef.current.firstChild) {
                    sceneRef.current.removeChild(sceneRef.current.firstChild);
                }
            }

            // 重置初始化标志
            isInitializedRef.current = false;
        };
    }, []);

    // 处理窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                const containerRect = sceneRef.current.getBoundingClientRect();
                const size = Math.min(
                    containerRect.width,
                    containerRect.height,
                    600
                );

                if (size !== containerSizeRef.current.width) {
                    rendererRef.current.setSize(size, size);
                    containerSizeRef.current = { width: size, height: size };

                    // 更新canvas样式
                    const canvas = rendererRef.current.domElement;
                    canvas.style.width = size + "px";
                    canvas.style.height = size + "px";
                }
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col items-center gap-5 text-foreground p-4">
            {/* Three.js 场景容器 */}
            <div className="responsive-game-container relative">
                <div ref={sceneRef} className="counting-boxes-canvas-container" />

                {/* 计时器显示 - 绝对定位在grid上方 */}
                {gameState === "result" &&
                countdown > 0 &&
                level < LEVEL_CONFIGS.length ? (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="text-center font-bold text-foreground shadow rounded-2xl px-6 py-2 bg-background/60 backdrop-blur-sm">
                            {t('nextLevel', { seconds: countdown })}
                        </div>
                    </div>
                ) : null}

                {/* 提示信息 */}
                {gameState === "observing" && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="text-center text-xl font-bold text-foreground shadow rounded-2xl px-6 py-2 bg-background/60 backdrop-blur-sm">
                            {t('observing')}
                        </div>
                    </div>
                )}

                {/* UI 覆盖层 */}
                {gameState !== "observing" && (
                    <div className="absolute inset-0 flex justify-center items-end z-10 rounded-lg text-center bg-transparent">
                        <div className="flex flex-col gap-4 items-center">
                            {/* 开始画面 */}
                            {gameState === "start" && (
                                <>
                                    <Button
                                        onClick={startGame}
                                        className="game-button"
                                        size="lg"
                                    >
                                        {t('startGame')}
                                    </Button>
                                </>
                            )}

                            {/* 输入画面 */}
                            {gameState === "input" && (
                                <div>
                                    <h2 className="text-xl text-black font-semibold m-0">
                                        {t('howMany')}
                                    </h2>
                                    <form
                                        onSubmit={checkAnswer}
                                        className="flex gap-3 items-center mt-4 justify-center"
                                    >
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) =>
                                                setUserAnswer(e.target.value)
                                            }
                                            required
                                            autoFocus
                                            className="w-20 px-3 py-2 text-lg text-center bg-background border border-border rounded-md game-input focus:border-primary focus:outline-none"
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="game-button"
                                        >
                                            {t('enter')}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* 结果显示画面 */}
                            {gameState === "result" && (
                                <div className="text-center">
                                    {lastResult ? (
                                        <div className="flex items-center justify-center gap-3 mb-4 text-black">
                                            {lastResult.correct ? (
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            ) : (
                                                <XCircle className="w-8 h-8 text-red-500" />
                                            )}
                                            <span className="text-2xl font-semibold">
                                                {timerDisplay}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* 游戏结束统计画面 */}
                            {gameState === "gameOver" && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="rounded-lg p-6 bg-background/50 backdrop-blur-sm max-w-md w-full">
                                        <h2 className="text-2xl font-bold text-center mb-4">
                                            🎉 {t('gameOver')}
                                        </h2>

                                        {/* 总体统计 */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between">
                                                <span>{t('accuracyLabel')}</span>
                                                <span className="font-bold">
                                                    {gameStats.totalLevels > 0
                                                        ? `${
                                                              gameStats.correctAnswers
                                                          }/${
                                                              gameStats.totalLevels
                                                          } (${Math.round(
                                                              (gameStats.correctAnswers /
                                                                  gameStats.totalLevels) *
                                                                  100
                                                          )}%)`
                                                        : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t('totalTimeLabel')}</span>
                                                <span className="font-bold">
                                                    {Math.round(
                                                        gameStats.totalTime /
                                                            1000
                                                    )}
                                                    {t('seconds')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 鼓励文案 */}
                                        <div className="mb-6 text-center text-lg font-semibold">
                                            {(() => {
                                                const rate =
                                                    gameStats.totalLevels > 0
                                                        ? gameStats.correctAnswers /
                                                          gameStats.totalLevels
                                                        : 0;
                                                if (rate === 1)
                                                    return t('encouragement.perfect');
                                                if (rate >= 0.7)
                                                    return t('encouragement.great');
                                                if (rate >= 0.4)
                                                    return t('encouragement.good');
                                                return t('encouragement.keepTrying');
                                            })()}
                                        </div>

                                        {/* 重新开始按钮 */}
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={startGame}
                                                className="game-button"
                                                size="lg"
                                            >
                                                {t('playAgain')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}