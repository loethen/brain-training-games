'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GAME_CONFIG } from '../config';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import '../styles.css';

type GameState = 'start' | 'observing' | 'input' | 'win' | 'lose';

export default function GameComponent() {
    // 游戏状态
    const [gameState, setGameState] = useState<GameState>('start');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [correctBlockCount, setCorrectBlockCount] = useState(0);
    const [timerDisplay, setTimerDisplay] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    
    // Refs for Three.js
    const sceneRef = useRef<HTMLDivElement>(null);
    const sceneInstanceRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const cubesGroupRef = useRef<THREE.Group | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const correctHeightMapRef = useRef<number[]>([]);
    const isInitializedRef = useRef(false);
    const containerSizeRef = useRef<{ width: number; height: number }>({ width: 400, height: 400 });

    // Three.js 颜色常量
    const CUBE_COLOR = new THREE.Color(0xededed);
    const SUCCESS_COLOR = new THREE.Color(0x1eba38);
    const EDGE_COLOR = new THREE.Color(0x434343);
    const GRID_COLOR = new THREE.Color(0x434343);
    const BACKGROUND_COLOR = new THREE.Color(0xffffff);

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
        const camera = new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 1, 1000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        
        // 设置渲染器尺寸和像素比以避免模糊 - 自适应容器大小
        const containerRect = container.getBoundingClientRect();
        const size = Math.min(containerRect.width, containerRect.height, 600); // 最大600px
        const width = size;
        const height = size;
        
        // 保存容器尺寸供后续使用
        containerSizeRef.current = { width, height };
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制最大像素比为2，避免性能问题
        
        // 确保canvas样式尺寸正确
        const canvas = renderer.domElement;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.style.display = 'block';
        
        container.appendChild(canvas);
        rendererRef.current = renderer;

        // 4. Grid
        const gridHelper = new THREE.GridHelper(GAME_CONFIG.gridSize, GAME_CONFIG.gridSize, GRID_COLOR, GRID_COLOR);
        gridHelper.position.y = -0.01; // 轻微下移避免与方块重叠
        scene.add(gridHelper);

        // 5. Grid Border - 添加清晰的边框
        const s = GAME_CONFIG.gridSize / 2;
        const points = [];
        points.push(new THREE.Vector3(-s, 0, -s));
        points.push(new THREE.Vector3( s, 0, -s));
        points.push(new THREE.Vector3( s, 0,  s));
        points.push(new THREE.Vector3(-s, 0,  s));
        
        const borderGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const borderMaterial = new THREE.LineBasicMaterial({ color: EDGE_COLOR });
        const gridBorder = new THREE.LineLoop(borderGeometry, borderMaterial);
        scene.add(gridBorder);

        // 6. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

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
            const newPixelRatio = Math.min(window.devicePixelRatio, 2);
            if (renderer.getPixelRatio() !== newPixelRatio) {
                renderer.setPixelRatio(newPixelRatio);
            }
        };

        window.addEventListener('resize', handleResize);

        // 返回清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // 清空方块
    const clearBoard = useCallback(() => {
        if (cubesGroupRef.current) {
            while(cubesGroupRef.current.children.length > 0) {
                cubesGroupRef.current.remove(cubesGroupRef.current.children[0]);
            }
        }
    }, []);

    // 添加单个方块
    const addCube = useCallback((index: number, heightLevel: number, color: THREE.Color) => {
        if (!cubesGroupRef.current) return;

        const CUBE_SIZE = 1; // Three.js中使用标准化单位
        const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);

        // 计算位置
        const gridOffset = GAME_CONFIG.gridSize / 2 - CUBE_SIZE / 2;
        const x = (index % GAME_CONFIG.gridSize) - gridOffset;
        const y = heightLevel * CUBE_SIZE + CUBE_SIZE / 2;
        const z = Math.floor(index / GAME_CONFIG.gridSize) - gridOffset;
        cube.position.set(x, y, z);
        
        // 添加完美的边框
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: EDGE_COLOR }));
        cube.add(line);

        cubesGroupRef.current.add(cube);
    }, []);

    // 根据高度图渲染方块
    const renderCubesFromHeightMap = useCallback((heightMap: number[], color: THREE.Color) => {
        clearBoard();
        heightMap.forEach((height, index) => {
            if (height > 0) {
                for (let h = 0; h < height; h++) {
                    addCube(index, h, color);
                }
            }
        });
    }, [clearBoard, addCube]);

         // 生成关卡
    const generateLevel = useCallback(() => {
        clearBoard();
        setCorrectBlockCount(0);
        const heightMap = Array(GAME_CONFIG.gridSize * GAME_CONFIG.gridSize).fill(0);
        const blocksToPlace = Math.min(level * 2 + 3, GAME_CONFIG.gridSize * GAME_CONFIG.gridSize * 2);
        
        let blockCount = 0;
        for(let i = 0; i < blocksToPlace; i++) {
            const randomIndex = Math.floor(Math.random() * (GAME_CONFIG.gridSize * GAME_CONFIG.gridSize));
            if(heightMap[randomIndex] < GAME_CONFIG.maxHeight) {
                heightMap[randomIndex] = heightMap[randomIndex] + 1;
                blockCount++;
            }
        }
        
        setCorrectBlockCount(blockCount);
        correctHeightMapRef.current = [...heightMap];
        renderCubesFromHeightMap(correctHeightMapRef.current, CUBE_COLOR);
    }, [level, clearBoard, renderCubesFromHeightMap]);

    // 开始定时器
    const startTimer = useCallback(() => {
        let timeLeft = GAME_CONFIG.observeTime;
        setTimerDisplay(`觀察: ${timeLeft}s`);
        
        timerInterval.current = setInterval(() => {
            timeLeft--;
            setTimerDisplay(`觀察: ${timeLeft}s`);
            if(timeLeft <= 0) {
                if (timerInterval.current) {
                    clearInterval(timerInterval.current);
                }
                startInputPhase();
            }
        }, 1000);
    }, []);

    // 开始输入阶段
    const startInputPhase = useCallback(() => {
        setGameState('input');
        setTimerDisplay('');
        // 隐藏方块
        if (cubesGroupRef.current) {
            cubesGroupRef.current.visible = false;
        }
    }, []);

    // 开始游戏
    const startGame = useCallback(() => {
        setGameState('observing');
        generateLevel();
        startTimer();
    }, [generateLevel, startTimer]);

    // 检查答案
    const checkAnswer = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const userAnswerNum = parseInt(userAnswer, 10);
        
        if (userAnswerNum === correctBlockCount) {
            setGameState('win');
            setScore(prev => prev + level * 10);
            // 显示绿色方块
            renderCubesFromHeightMap(correctHeightMapRef.current, SUCCESS_COLOR);
        } else {
            setGameState('lose');
            // 显示原色方块
            renderCubesFromHeightMap(correctHeightMapRef.current, CUBE_COLOR);
        }
        
        // 显示方块
        if (cubesGroupRef.current) {
            cubesGroupRef.current.visible = true;
        }
    }, [userAnswer, correctBlockCount, level, renderCubesFromHeightMap]);

    // 下一关或重试
    const nextLevel = useCallback(() => {
        if (gameState === 'win') {
            setLevel(prev => prev + 1);
        }
        setUserAnswer('');
        startGame();
    }, [gameState, startGame]);

    // 初始化Three.js
    useEffect(() => {
        initThree();
        
        // 清理函数
        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
            
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
                const size = Math.min(containerRect.width, containerRect.height, 600);
                
                if (size !== containerSizeRef.current.width) {
                    rendererRef.current.setSize(size, size);
                    containerSizeRef.current = { width: size, height: size };
                    
                    // 更新canvas样式
                    const canvas = rendererRef.current.domElement;
                    canvas.style.width = size + 'px';
                    canvas.style.height = size + 'px';
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col items-center gap-5 text-foreground p-4 sm:p-6">
            {/* 信息面板 */}
            <div className="flex justify-between items-center w-full max-w-lg px-4 sm:px-6 py-3">
                <span className="text-lg font-medium">
                    關卡: {level}
                </span>
                <span className="text-lg font-medium">
                    得分: {score}
                </span>
            </div>

            {/* Three.js 场景容器 */}
            <div className="responsive-game-container relative">
                <div ref={sceneRef} className="count-blocks-canvas-container" />
                
                {/* 计时器显示 - 绝对定位在grid上方 */}
                {timerDisplay && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                            <span className="text-lg font-medium text-primary">
                                {timerDisplay}
                            </span>
                        </div>
                    </div>
                )}

                {/* UI 覆盖层 */}
                {gameState !== 'observing' && (
                    <div className={cn(
                        "absolute inset-0 flex justify-center items-end z-10 rounded-lg text-center",
                        gameState === 'input' ? 'bg-muted/70' : 'bg-transparent'
                    )}>
                        <div className="flex flex-col gap-4 items-center">
                            {/* 开始画面 */}
                            {gameState === 'start' && (
                                <>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-foreground m-0">
                                        Count Blocks
                                    </h2>
                                    <Button
                                        onClick={startGame}
                                        className="game-button"
                                        size="lg"
                                    >
                                        開始遊戲
                                    </Button>
                                </>
                            )}

                            {/* 输入画面 */}
                            {gameState === 'input' && (
                                <>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-foreground m-0">
                                        方塊總數是？
                                    </h2>
                                    <form 
                                        onSubmit={checkAnswer}
                                        className="flex gap-3 items-center"
                                    >
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            required
                                            autoFocus
                                            className="w-20 px-3 py-2 text-lg text-center bg-background border border-border rounded-md game-input focus:border-primary focus:outline-none"
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="game-button"
                                        >
                                            提交
                                        </Button>
                                    </form>
                                </>
                            )}

                            {/* 结果画面 */}
                            {(gameState === 'win' || gameState === 'lose') && (
                                <div className="rounded-lg p-4 space-y-3">
                                    {/* 第一行：图标 + 结果信息 */}
                                    <div className={cn(
                                        "flex items-center gap-3 text-xl font-semibold",
                                        gameState === 'win' ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {gameState === 'win' ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <XCircle className="w-6 h-6" />
                                        )}
                                        <span>
                                            {gameState === 'win' 
                                                ? `正確答案：${correctBlockCount}`
                                                : `${correctBlockCount} (您答：${userAnswer || 0})`
                                            }
                                        </span>
                                    </div>
                                    
                                    {/* 第二行：按钮 */}
                                    <Button
                                        onClick={nextLevel}
                                        className={cn(
                                            "game-button w-full",
                                            gameState === 'win' 
                                                ? 'bg-green-600 hover:bg-green-700' 
                                                : 'bg-red-600 hover:bg-red-700'
                                        )}
                                        size="lg"
                                    >
                                        {gameState === 'win' ? (
                                            <>
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                下一關
                                            </>
                                        ) : (
                                            <>
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                重試
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 