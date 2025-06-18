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

        // 游戏共13关，预设关卡模式
        const levelPatterns: Array<{
            blocksRange: [number, number];
            pattern: string;
        }> = [
            { blocksRange: [3, 5], pattern: "corner" }, // 关卡1：角落模式 3-5个
            { blocksRange: [4, 6], pattern: "line" }, // 关卡2：直线模式 4-6个
            { blocksRange: [4, 7], pattern: "cross" }, // 关卡3：十字模式 4-7个
            { blocksRange: [5, 8], pattern: "scattered" }, // 关卡4：分散模式 5-8个
            { blocksRange: [5, 8], pattern: "tower" }, // 关卡5：塔楼模式 5-8个
            { blocksRange: [6, 9], pattern: "border" }, // 关卡6：边框模式 6-9个
            { blocksRange: [6, 9], pattern: "cluster" }, // 关卡7：聚集模式 6-9个
            { blocksRange: [7, 10], pattern: "mixed" }, // 关卡8：混合模式 7-10个
            { blocksRange: [20, 23], pattern: "dense_fill" }, // 关卡9：密集填充20-23个
            { blocksRange: [18, 22], pattern: "few_holes" }, // 关卡10：少数空洞18-22个
            { blocksRange: [15, 20], pattern: "layered_dense" }, // 关卡11：分层密集15-20个
            { blocksRange: [16, 21], pattern: "complex_mix" }, // 关卡12：复杂混合16-21个
            { blocksRange: [22, 25], pattern: "final_challenge" }, // 关卡13：终极挑战22-25个
        ];

        // 游戏最多13关
        if (level > 13) {
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
            // 智能可见性模式：确保每个方块都始终可见
            const maxAttempts = targetBlocks * 15;
            let attempts = 0;

            while (totalBlocks < targetBlocks && attempts < maxAttempts) {
                const randomIndex = Math.floor(
                    Math.random() *
                        (GAME_CONFIG.gridSize * GAME_CONFIG.gridSize)
                );
                const currentHeight = heightMap[randomIndex];
                const row = Math.floor(randomIndex / GAME_CONFIG.gridSize);
                const col = randomIndex % GAME_CONFIG.gridSize;

                let shouldPlace = false;
                
                // 🎯 绝对可见性策略：确保每个方块都能被摄像机看到
                let maxHeight = 1; // 默认单层，绝对可见
                
                // 只有在"绝对安全区域"才允许多层
                const isAbsoluteSafeForMultiLayer = (r: number, c: number): boolean => {
                    // 策略1：边界区域绝对安全（没有前方遮挡者）
                    const isRightEdge = c === 4; // 最右边列
                    const isBottomEdge = r === 4; // 最底边行
                    const isCorner = (r === 4 && c === 4); // 右下角
                    
                    // 策略2：非对角线位置相对安全
                    const hasNoPotentialBlocker = (r === 0 || c === 0); // 左边缘或上边缘
                    
                    return isRightEdge || isBottomEdge || isCorner || hasNoPotentialBlocker;
                };
                
                // 根据模式和位置决定最大高度
                if (pattern === "tower") {
                    if (row === 2 && col === 2) {
                        // 中心塔：只有在确保周围没有遮挡者时才允许高塔
                        maxHeight = 3; // 适度限制，确保可见性
                    } else if (isAbsoluteSafeForMultiLayer(row, col)) {
                        maxHeight = 2; // 安全区域允许2层
                    }
                    // 其他位置保持单层
                } else if (pattern === "mixed") {
                    // 混合模式：只在最安全的位置允许多层
                    if ((row === 4 && col >= 2) || (col === 4 && row >= 2)) {
                        maxHeight = 2; // 最边缘位置允许2层
                    }
                    // 其他位置保持单层
                } else {
                    // 所有其他模式：纯单层，确保100%可见
                    maxHeight = 1;
                }

                // 根据模式决定放置策略
                switch (pattern) {
                    case "corner":
                        shouldPlace =
                            (row <= 1 || row >= 3) && (col <= 1 || col >= 3);
                        break;
                    case "line":
                        shouldPlace = row === 2 || col === 2;
                        break;
                    case "cross":
                        shouldPlace = row === 2 || col === 2;
                        break;
                    case "border":
                        shouldPlace =
                            row === 0 || row === 4 || col === 0 || col === 4;
                        break;
                    case "cluster":
                        shouldPlace =
                            row >= 1 && row <= 3 && col >= 1 && col <= 3;
                        break;
                    case "tower":
                        // 塔楼模式：保守的可见性优先策略
                        if (row === 2 && col === 2) {
                            shouldPlace = true; // 中心塔（最高）
                        } else if (isAbsoluteSafeForMultiLayer(row, col)) {
                            // 安全区域：较高概率
                            shouldPlace = Math.random() < 0.7;
                        } else {
                            // 其他位置：低概率，确保稀疏分布
                            shouldPlace = Math.random() < 0.3;
                        }
                        break;
                    case "layered_dense":
                        shouldPlace = Math.random() < 0.8; // 高密度单层
                        break;
                    case "complex_mix":
                        const isBorder =
                            row === 0 || row === 4 || col === 0 || col === 4;
                        const isCenter =
                            row >= 1 && row <= 3 && col >= 1 && col <= 3;
                        shouldPlace =
                            (isBorder && Math.random() < 0.7) ||
                            (isCenter && Math.random() < 0.8);
                        break;
                    case "final_challenge":
                        shouldPlace = Math.random() < 0.9; // 超高密度单层
                        break;
                    case "mixed":
                        // 混合模式：后方密集，前方稀疏
                        const posteriorWeight = (row + col) / 8; // 0到1之间
                        shouldPlace = Math.random() < 0.3 + posteriorWeight * 0.4;
                        break;
                    default: // scattered
                        shouldPlace = Math.random() < 0.6;
                        break;
                }

                // 简化的放置逻辑：不需要复杂的可见性检查
                if (
                    shouldPlace &&
                    currentHeight < maxHeight &&
                    currentHeight < Math.max(GAME_CONFIG.maxHeight, maxHeight)
                ) {
                    heightMap[randomIndex] = currentHeight + 1;
                    totalBlocks++;
                }

                attempts++;
            }
        }

        // 🎉 完美逻辑：所有生成的方块都保证可见！
        const visibleBlockCount = totalBlocks;
        setCorrectBlockCount(visibleBlockCount);
        correctHeightMapRef.current = [...heightMap];
        renderCubesFromHeightMap(correctHeightMapRef.current, CUBE_COLOR);
    }, [level, clearBoard, renderCubesFromHeightMap]);

    // 开始定时器
    const startTimer = useCallback(() => {
        // 基础观察时间：500-1000毫秒
        let randomObserveTime = Math.random() * 300 + 400; // 300-700ms

        if (level === 8) {
            randomObserveTime = Math.random() * 500 + 1000; // 500-1000ms
        }

        // 从11关开始增加6-10秒观察时间
        if (level >= 11) {
            const extraTime = Math.random() * 4000 + 6000; // 6000-10000ms
            randomObserveTime += extraTime;
        }

        // 不显示倒计时，直接等待随机时间后进入输入阶段
        timerInterval.current = setTimeout(() => {
            startInputPhase();
        }, randomObserveTime);
    }, [level]);

    // 开始输入阶段
    const startInputPhase = useCallback(() => {
        setGameState("input");
        // 隐藏方块
        if (cubesGroupRef.current) {
            cubesGroupRef.current.visible = false;
        }
    }, []);

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
                if (level >= 13) {
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
                        setLevel((prev) => prev + 1);
                        setUserAnswer("");
                        setTimerDisplay("");
                        setGameState("observing");
                        generateLevel();
                        // 延迟一帧后开始计时，确保关卡生成完成
                        setTimeout(() => startTimer(), 50);
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
            generateLevel,
            startTimer,
            clearBoard,
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