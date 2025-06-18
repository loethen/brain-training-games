'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GAME_CONFIG } from '../config';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import '../styles.css';

type GameState = 'start' | 'observing' | 'input' | 'win' | 'lose';

export default function GameComponent() {
    // 游戏状态
    const [gameState, setGameState] = useState<GameState>("start");
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [correctBlockCount, setCorrectBlockCount] = useState(0);
    const [timerDisplay, setTimerDisplay] = useState("");
    const [userAnswer, setUserAnswer] = useState("");

    // Refs for Three.js
    const sceneRef = useRef<HTMLDivElement>(null);
    const sceneInstanceRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const cubesGroupRef = useRef<THREE.Group | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const correctHeightMapRef = useRef<number[]>([]);
    const isInitializedRef = useRef(false);
    const containerSizeRef = useRef<{ width: number; height: number }>({
        width: 400,
        height: 400,
    });

    // Three.js 颜色常量
    const CUBE_COLOR = new THREE.Color(0xffffff);
    const SUCCESS_COLOR = new THREE.Color(0x1eba38);
    const EDGE_COLOR = new THREE.Color(0x000000);
    const GRID_COLOR = new THREE.Color(0x434343);
    const BACKGROUND_COLOR = new THREE.Color(0xf5f5f5);

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

    // 生成关卡 - 绝对可见性策略
    const generateLevel = useCallback(() => {
        // 🎯 绝对可见性原则：
        // 1. 默认使用单层方块（高度=1），100%保证可见
        // 2. 只在"绝对安全区域"允许多层方块
        // 3. 安全区域定义：边界位置（最右列、最底行、角落、边缘）
        // 4. 确保每个方块至少有一个面（顶面、侧面、前面）能被摄像机看到
        
        clearBoard();
        setCorrectBlockCount(0);
        const heightMap = Array(
            GAME_CONFIG.gridSize * GAME_CONFIG.gridSize
        ).fill(0);

        // 游戏共7关，预设关卡模式
        const levelPatterns: Array<{
            blocksRange: [number, number];
            pattern: string;
        }> = [
            { blocksRange: [3, 5], pattern: "corner" }, // 关卡1：角落模式 3-5个
            { blocksRange: [4, 6], pattern: "line" }, // 关卡2：直线模式 4-6个
            { blocksRange: [4, 6], pattern: "cross" }, // 关卡3：十字模式 5-8个
            { blocksRange: [7, 9], pattern: "scattered" }, // 关卡4：分散模式 7-9个
            { blocksRange: [3, 5], pattern: "dense_fill" }, 
            { blocksRange: [20, 23], pattern: "dense_fill" }, // 关卡5：密集填充20-23个
            { blocksRange: [20, 22], pattern: "few_holes" }, // 关卡6：少数空洞18-22个
        ];

        // 游戏最多7关
        if (level > 7) {
            // 游戏通关，可以显示通关信息或重新开始
            setGameState("win");
            return;
        }

        const levelConfig = levelPatterns[level - 1];
        const [min, max] = levelConfig.blocksRange;
        const targetBlocks = Math.floor(Math.random() * (max - min + 1)) + min;
        const pattern = levelConfig.pattern;



        let totalBlocks = 0; // 总方块数（不管是否可见）

        // 第一步：根据模式生成完整的heightMap布局
        if (
            pattern === "mass_single" ||
            pattern === "dense_fill" ||
            pattern === "few_holes"
        ) {
            // 单层方块模式：直接生成
            const allPositions = [];
            for (
                let i = 0;
                i < GAME_CONFIG.gridSize * GAME_CONFIG.gridSize;
                i++
            ) {
                allPositions.push(i);
            }

            // 随机打乱位置数组
            for (let i = allPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allPositions[i], allPositions[j]] = [
                    allPositions[j],
                    allPositions[i],
                ];
            }

            // 选择前targetBlocks个位置放置方块
            for (
                let i = 0;
                i < Math.min(targetBlocks, allPositions.length);
                i++
            ) {
                heightMap[allPositions[i]] = 1;
                totalBlocks++;
            }
        } else {
            // 智能模式：先收集所有符合条件的位置，然后随机选择
            const validPositions = [];
            
            // 根据模式收集有效位置
            for (let i = 0; i < GAME_CONFIG.gridSize * GAME_CONFIG.gridSize; i++) {
                const row = Math.floor(i / GAME_CONFIG.gridSize);
                const col = i % GAME_CONFIG.gridSize;
                let isValid = false;
                
                switch (pattern) {
                    case "corner":
                        isValid = (row <= 1 || row >= 3) && (col <= 1 || col >= 3);
                        break;
                    case "line":
                        isValid = row === 2 || col === 2;
                        break;
                    case "cross":
                        // 十字模式：中心十字形状 (和line相同，但逻辑上更清晰)
                        isValid = row === 2 || col === 2;
                        break;
                    default: // scattered
                        isValid = true; // 所有位置都有效
                        break;
                }
                
                if (isValid) {
                    validPositions.push(i);
                }
            }
            
            // 随机打乱有效位置
            for (let i = validPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
            }
            
            // 选择前targetBlocks个位置放置方块
            for (let i = 0; i < Math.min(targetBlocks, validPositions.length); i++) {
                heightMap[validPositions[i]] = 1;
                totalBlocks++;
            }
        }

        // 🎉 完美逻辑：所有生成的方块都保证可见！
        const visibleBlockCount = totalBlocks;
        setCorrectBlockCount(visibleBlockCount);
        correctHeightMapRef.current = [...heightMap];
        renderCubesFromHeightMap(correctHeightMapRef.current, CUBE_COLOR);
        
        // 第3关特殊处理：将方块组初始位置设为左上角画外
        if (level === 3 && cubesGroupRef.current && sceneInstanceRef.current) {
            const cubesGroup = cubesGroupRef.current;
            const scene = sceneInstanceRef.current;
            
            // 设置方块组到左上角画外位置
            cubesGroup.position.set(-12, 8, 8);
            
            // 同时移动网格
            scene.children.forEach(child => {
                if (child instanceof THREE.GridHelper) {
                    child.position.set(-12, 8 - 0.01, 8);
                } else if (child instanceof THREE.LineLoop) {
                    child.position.set(-12, 8, 8);
                }
            });
        }
        
        // 调试信息：显示实际生成的方块数
        console.log(`✓ 关卡${level} 生成完成: 模式=${pattern}, 配置=[${min},${max}], 目标=${targetBlocks}, 实际生成=${visibleBlockCount}`);
    }, [level, clearBoard, renderCubesFromHeightMap]);

    // 开始定时器
    const startTimer = useCallback(() => {
        // 基础观察时间：400-700毫秒
        let randomObserveTime = Math.random() * 300 + 400; // 400-700ms

        // 关卡6和7（高难度密集关卡）增加观察时间
        if (level >= 6) {
            const extraTime = Math.random() * 200 + 200; // 200-400ms额外时间
            randomObserveTime += extraTime;
        }

        // 不显示倒计时，直接等待随机时间后进入输入阶段
        timerInterval.current = setTimeout(() => {
            startInputPhase();
        }, randomObserveTime);
    }, [level]);

        // 第3关特殊动画：从摄像机视角的左上角斜着飞到右下角
    const animateLevel3Exit = useCallback(() => {
        if (!cubesGroupRef.current || !sceneInstanceRef.current) return;
        
        // 获取所有需要动画的对象
        const cubesGroup = cubesGroupRef.current;
        const scene = sceneInstanceRef.current;
        
        // 找到网格辅助线
        let gridHelper: THREE.GridHelper | null = null;
        let gridBorder: THREE.LineLoop | null = null;
        
        scene.children.forEach(child => {
            if (child instanceof THREE.GridHelper) {
                gridHelper = child;
            } else if (child instanceof THREE.LineLoop) {
                gridBorder = child;
            }
        });
        
        // 动画参数
        const duration = 3000; // 3秒慢慢飞过，让人眼能看清
        const startTime = Date.now();
        
        // 根据摄像机视角定义位置 (摄像机在(10,10,10)看向(0,0,0))
        // 左上角：负X，正Z，高Y
        // 右下角：正X，负Z，低Y
        const startPosition = { x: -12, y: 8, z: 8 }; // 摄像机视角的左上角
        const endPosition = { x: 12, y: -8, z: -8 }; // 摄像机视角的右下角
        
        // 动画函数
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用平滑的缓入缓出效果
            const easeInOut = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            // 计算当前位置 - 直线飞行
            const currentX = startPosition.x + (endPosition.x - startPosition.x) * easeInOut;
            const currentY = startPosition.y + (endPosition.y - startPosition.y) * easeInOut;
            const currentZ = startPosition.z + (endPosition.z - startPosition.z) * easeInOut;
            
            // 应用位置变换
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
                // 动画完成，进入输入阶段
                setGameState("input");
                // 重置位置
                cubesGroup.position.set(0, 0, 0);
                cubesGroup.visible = false;
                
                if (gridHelper) {
                    gridHelper.position.set(0, -0.01, 0);
                }
                if (gridBorder) {
                    gridBorder.position.set(0, 0, 0);
                }
            }
        };
        
        // 开始动画
        animate();
    }, []);

    // 开始输入阶段
    const startInputPhase = useCallback(() => {
        // 第3关使用特殊动画效果
        if (level === 3) {
            animateLevel3Exit();
        } else {
            // 其他关卡直接隐藏
            setGameState("input");
            if (cubesGroupRef.current) {
                cubesGroupRef.current.visible = false;
            }
        }
    }, [level, animateLevel3Exit]);

    // 开始游戏
    const startGame = useCallback(() => {
        setGameState("observing");
        generateLevel();
        startTimer();
    }, [generateLevel, startTimer]);

    // 检查答案
    const checkAnswer = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const userAnswerNum = parseInt(userAnswer, 10);

            if (userAnswerNum === correctBlockCount) {
                setGameState("win");
                setScore((prev) => prev + level * 10);
                // 显示绿色方块
                renderCubesFromHeightMap(
                    correctHeightMapRef.current,
                    SUCCESS_COLOR
                );

                // 显示方块
                if (cubesGroupRef.current) {
                    cubesGroupRef.current.visible = true;
                }

                // 检查是否通关
                if (level >= 7) {
                    // 游戏通关
                    setTimerDisplay("🎉 恭喜通關！");
                    return;
                }

                // 3秒后自动进入下一关
                let countdown = 3;
                setTimerDisplay(`下一關: ${countdown}s`);

                timerInterval.current = setInterval(() => {
                    countdown--;
                    if (countdown <= 0) {
                        if (timerInterval.current) {
                            clearInterval(timerInterval.current);
                            clearTimeout(timerInterval.current);
                        }
                        // 进入下一关
                        setLevel((prev) => {
                            const nextLevel = prev + 1;
                            // 延迟执行避免状态更新冲突
                            setTimeout(() => {
                                setUserAnswer("");
                                setTimerDisplay("");
                                setGameState("observing");
                                // generateLevel会在level状态更新后自动调用
                            }, 10);
                            return nextLevel;
                        });
                    } else {
                        setTimerDisplay(`下一關: ${countdown}s`);
                    }
                }, 1000);
            } else {
                setGameState("lose");
                // 显示原色方块
                renderCubesFromHeightMap(
                    correctHeightMapRef.current,
                    CUBE_COLOR
                );

                // 显示方块
                if (cubesGroupRef.current) {
                    cubesGroupRef.current.visible = true;
                }

                // 不重置游戏状态，只清除用户答案
                setUserAnswer("");
                setTimerDisplay("");
            }
        },
        [
            userAnswer,
            correctBlockCount,
            level,
            renderCubesFromHeightMap,
        ]
    );

    // 重新尝试当前关卡
    const retryLevel = useCallback(() => {
        setUserAnswer("");
        setTimerDisplay("");
        setGameState("observing");
        generateLevel();
        startTimer();
    }, [generateLevel, startTimer]);

    // 监听关卡变化，自动生成新关卡
    useEffect(() => {
        if (gameState === "observing" && level > 1) {
            // 只有在observing状态且不是第一关时才自动生成
            generateLevel();
            setTimeout(() => startTimer(), 50);
        }
    }, [level, gameState, generateLevel, startTimer]);

    // 初始化Three.js
    useEffect(() => {
        initThree();

        // 清理函数
        return () => {
            if (timerInterval.current) {
                clearTimeout(timerInterval.current);
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
        <div className="flex flex-col items-center gap-5 text-foreground p-4 sm:p-6">
            {/* 信息面板 */}
            <div className="flex justify-between items-center w-full max-w-lg px-4 sm:px-6 py-3">
                <span className="text-lg font-medium">關卡: {level}</span>
                <span className="text-lg font-medium">得分: {score}</span>
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
                {gameState !== "observing" && (
                    <div className="absolute inset-0 flex justify-center items-end z-10 rounded-lg text-center bg-transparent">
                        <div className="flex flex-col gap-4 items-center">
                            {/* 开始画面 */}
                            {gameState === "start" && (
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
                            {gameState === "input" && (
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-foreground m-0">
                                        方塊總數是？
                                    </h2>
                                    <form
                                        onSubmit={checkAnswer}
                                        className="flex gap-3 items-center mt-4"
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
                                            提交
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* 结果画面 */}
                            {(gameState === "win" || gameState === "lose") && (
                                <div className="rounded-lg p-4">
                                    {/* 结果信息 */}
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 text-xl font-semibold justify-center",
                                            gameState === "win"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        )}
                                    >
                                        {gameState === "win" ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <XCircle className="w-6 h-6" />
                                        )}
                                        <span>
                                            {gameState === "win"
                                                ? `正確！答案：${correctBlockCount}`
                                                : `答錯了！正確答案：${correctBlockCount}`}
                                        </span>
                                    </div>

                                    {/* 重新尝试按钮 */}
                                    {gameState === "lose" && (
                                        <div className="mt-4 flex justify-center">
                                            <Button
                                                onClick={retryLevel}
                                                className="game-button"
                                                size="lg"
                                            >
                                                重新挑戰
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}