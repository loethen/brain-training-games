import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "../config";
import { cn } from "@/lib/utils";
import {
    PlayCircle,
    Share2,
    Volume2,
    PauseCircle,
} from "lucide-react";
import { Howl } from "howler";
import { useInterval } from "@/hooks/useInterval";
import { useTimeout } from "@/hooks/useTimeout";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Image from "next/image";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import SettingsDialog, { GameSettings } from "./SettingsDialog";
import { ShareModal } from "@/components/ui/ShareModal";
// 定义游戏状态类型
// 游戏状态：空闲、进行中、已完成
type GameState = "idle" | "playing" | "complete";
// 试验刺激类型：音频和麻将
type TrialStimuli = { audio: string; position: string };
// 用户响应类型：音频匹配和麻将匹配
type Response = { audioMatch: boolean | null; positionMatch: boolean | null };
// 试验结果类型：包含刺激、响应和正确性评估
type TrialResult = {
    stimuli: TrialStimuli;
    response: Response;
    isAudioMatch: boolean;
    isPositionMatch: boolean;
    isCorrectAudioResponse: boolean;
    isCorrectPositionResponse: boolean;
};

// 游戏设置自定义钩子
function useGameSettings() {
    // 默认游戏设置
    const [settings, setSettings] = useState<GameSettings>({
        selectedNBack: GAME_CONFIG.difficulty.initialLevel, // 默认N-back等级
        voiceType: "male", // 默认语音类型
        selectedTypes: ["position", "audio"], // 默认启用双模式
        trialsPerRound: GAME_CONFIG.trials.perRound, // 默认每轮试验次数
        trialInterval: GAME_CONFIG.trials.interval, // 默认试验间隔
    });

    // 安全更新设置的方法
    const updateSettings = useCallback(
        (updater: (prev: GameSettings) => GameSettings) => {
            setSettings((prev) => {
                const newSettings = updater(prev);
                // 验证设置有效性：至少需要保持一个训练模式启用
                if (newSettings.selectedTypes.length === 0) {
                    toast("must select at least one training mode");
                    return prev; // 返回之前的有效设置
                }
                return newSettings;
            });
        },
        []
    );

    return { settings, updateSettings };
}

export default function GameComponent() {
    const { settings, updateSettings } = useGameSettings();

    const [gameState, setGameState] = useState<GameState>("idle");
    const [currentTrial, setCurrentTrial] = useState(0); 
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]); 
    const [results, setResults] = useState<TrialResult[]>([]); 
    const [currentResponse, setCurrentResponse] = useState<Response>({
        audioMatch: null,
        positionMatch: null,
    }); // 当前用户做出的响应状态 true：用户认为存在匹配并做出了响应 false：用户明确表示不存在匹配（在这个游戏实现中很少使用） null：用户没有做出任何响应（默认值）
    const [isAudioHighlight, setIsAudioHighlight] = useState(false);
    const [isPositionHighlight, setIsPositionHighlight] = useState(false);

    // 添加一个状态来存储当前游戏会话的麻将集
    const [sessionMahjong, setSessionMahjong] = useState<string[]>([]);

    const gameContainerRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const [accuracy, setAccuracy] = useState<{
        position: {
            total: number;
            correct: number;
            missed: number;
            falseAlarms: number;
        };
        audio: {
            total: number;
            correct: number;
            missed: number;
            falseAlarms: number;
        };
    }>({
        position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
        audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
    }); // 准确率统计
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // 音频播放状态
    const [intervalDelay, setIntervalDelay] = useState<number | null>(null); // 试验间隔
    const [startDelay, setStartDelay] = useState<number | null>(null); // 开始延迟
    const [isPaused, setIsPaused] = useState(false); // 暂停状态
    const audioRefs = useRef<{ [key: string]: Howl }>({}); // 音频引用缓存
    
    // 添加预加载状态
    const [preloadState, setPreloadState] = useState<{
        isPreloading: boolean;
        loadedAudio: number;
        totalAudio: number;
        loadedImages: number;
        totalImages: number;
        error: string | null;
    }>({
        isPreloading: false,
        loadedAudio: 0,
        totalAudio: 0,
        loadedImages: 0,
        totalImages: 0,
        error: null
    });

    // 添加滑动位置状态
    const [slidePosition, setSlidePosition] = useState(0);

    // 添加分享模态状态
    const [showShareModal, setShowShareModal] = useState(false);

    // 提取所有重置逻辑到一个函数
    const resetAllGameState = useCallback(() => {
        // 重置游戏进度
        setCurrentTrial(0);
        setTrialHistory([]);
        setResults([]);
        setSlidePosition(0);
        
        // 重置用户交互状态
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        
        // 重置统计数据
        setAccuracy({
            position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
            audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
        });
    }, []);

    // 预加载所有游戏资源
    const preloadGameAssets = useCallback(async () => {
        try {
            setPreloadState(prev => ({
                ...prev,
                isPreloading: true,
                error: null
            }));
            
            // 选择麻将
            const allMahjong = GAME_CONFIG.symbols;
            const displayTileCount = GAME_CONFIG.trials.perRound;
            const shuffledMahjong = [...allMahjong].sort(() => Math.random() - 0.5);
            const selectedMahjong = shuffledMahjong.slice(0, displayTileCount);
            setSessionMahjong(selectedMahjong);
            
            // 预加载音频文件
            const totalAudio = selectedMahjong.length;
            setPreloadState(prev => ({
                ...prev,
                totalAudio,
                loadedAudio: 0
            }));
            
            // 清除之前的音频引用
            Object.values(audioRefs.current).forEach(audio => audio.unload());
            
            // 创建加载音频的Promise数组
            const audioPromises = selectedMahjong.map((mahjong) => {
                return new Promise<void>((resolve, reject) => {
                    const audioPath = `${GAME_CONFIG.audio.basePath}${
                        GAME_CONFIG.audio.voices[settings.voiceType]
                    }${mahjong.toLowerCase()}.mp3`;
                    
                    audioRefs.current[mahjong] = new Howl({
                        src: [audioPath],
                        onplay: () => setIsAudioPlaying(true),
                        onend: () => setIsAudioPlaying(false),
                        onload: () => {
                            setPreloadState(prev => ({
                                ...prev,
                                loadedAudio: prev.loadedAudio + 1
                            }));
                            resolve();
                        },
                        onloaderror: (id, error) => {
                            console.error(`Error loading audio ${mahjong}:`, error);
                            reject(new Error(`Failed to load audio: ${mahjong}`));
                        }
                    });
                });
            });
            
            // 预加载麻将图像
            const totalImages = selectedMahjong.length;
            setPreloadState(prev => ({
                ...prev,
                totalImages,
                loadedImages: 0
            }));
            
            // 创建加载图像的Promise数组
            const imagePromises = selectedMahjong.map((mahjong) => {
                return new Promise<void>((resolve, reject) => {
                    // 使用HTMLImageElement代替直接使用Image构造函数
                    const img = document.createElement('img');
                    img.src = `${GAME_CONFIG.symbolBasePath}${mahjong}.svg`;
                    img.onload = () => {
                        setPreloadState(prev => ({
                            ...prev,
                            loadedImages: prev.loadedImages + 1
                        }));
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Error loading image ${mahjong}`);
                        reject(new Error(`Failed to load image: ${mahjong}`));
                    };
                });
            });
            
            // 等待所有资源加载完成
            await Promise.all([...audioPromises, ...imagePromises]);
            
            // 设置开始延迟
            setStartDelay(GAME_CONFIG.trials.startDelay);
            
            // 滚动到游戏区域
            setTimeout(() => {
                gameContainerRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 50);
            
            // 预加载完成，设置游戏状态为playing
            setGameState("playing");
            setPreloadState(prev => ({
                ...prev,
                isPreloading: false
            }));
            
        } catch (error) {
            console.error("Error preloading game assets:", error);
            setPreloadState(prev => ({
                ...prev,
                isPreloading: false,
                error: error instanceof Error ? error.message : "Unknown error loading game assets"
            }));
            // 重置游戏状态
            setGameState("idle");
        }
    }, [settings.voiceType]);

    // 修改后的 startGame 函数
    const startGame = useCallback(() => {
        setIsLoading(true);
        setGameState("idle"); // 先设置为idle状态
        
        // 重置所有游戏状态
        resetAllGameState();
        
        // 开始预加载资源
        preloadGameAssets();
    }, [resetAllGameState, preloadGameAssets]);

    // 修改handleResponse方法
    const handleResponse = useCallback((type: "audio" | "position") => {
        // 设置高亮状态
        if (type === "audio") {
            setIsAudioHighlight(true);
            setTimeout(() => setIsAudioHighlight(false), 300);
        } else {
            setIsPositionHighlight(true);
            setTimeout(() => setIsPositionHighlight(false), 300);
        }

        setCurrentResponse((prev) => {
            // 如果已经响应过该类型，则不再更新
            if (prev[`${type}Match`] !== null) {
                // toast("You have already responded to this type");
                return prev;
            }

            // Create the updated response
            const updatedResponse = {
                ...prev,
                [`${type}Match`]: true,
            };

            return updatedResponse;
        });
    }, []);

    const evaluateResponse = useCallback(
        (response: Response) => {
            if (trialHistory.length === 0) return; // Safety check

            const currentStimuli = trialHistory[trialHistory.length - 1];
            const nBackIndex = trialHistory.length - 1 - settings.selectedNBack;

            // Only evaluate if we have enough history
            if (nBackIndex < 0) return;

            const nBackStimuli = trialHistory[nBackIndex];

            const isPositionMatch =
                currentStimuli.position === nBackStimuli.position;
            const isAudioMatch = currentStimuli.audio === nBackStimuli.audio;

            // Create a new result object
            const newResult = {
                stimuli: currentStimuli,
                response,
                isPositionMatch,
                isAudioMatch,
                // Only evaluate position response if position is a selected type
                isCorrectPositionResponse: !settings.selectedTypes.includes(
                    "position"
                )
                    ? true // Always correct if not selected
                    : isPositionMatch
                    ? response.positionMatch === true // 当有匹配时，必须响应true
                    : response.positionMatch !== true, // 当无匹配时，必须不响应true（可以是false或null）

                // Only evaluate audio response if audio is a selected type
                isCorrectAudioResponse: !settings.selectedTypes.includes(
                    "audio"
                )
                    ? true // Always correct if not selected
                    : isAudioMatch
                    ? response.audioMatch === true
                    : response.audioMatch !== true,
            };

            setResults((prev) => [...prev, newResult]);
        },
        [trialHistory, settings.selectedNBack, settings.selectedTypes]
    );

    

    // 定时器钩子：控制试验间隔
    useInterval(() => {
        if (currentTrial < settings.trialsPerRound) {
            startNextTrial();
        } else {
            endGame();
            setIntervalDelay(null);
        }
    }, intervalDelay);

    // 简化后的 useTimeout 钩子
    useTimeout(() => {
        // 只改变游戏状态和启动游戏，不再重置状态
        setGameState("playing");
        setIsLoading(false);
        startNextTrial();
        setStartDelay(null);
    }, startDelay);

    // 结束游戏并计算准确率
    const endGame = useCallback(() => {
        setIntervalDelay(null);
        setGameState("complete");

        // Evaluate the last trial if it exists
        if (currentTrial > 0 && trialHistory.length > 0) {
            evaluateResponse(currentResponse);
        }

        if (results.length > 0) {
            // 位置统计
            const positionMatches = results.filter(
                (r) => r.isPositionMatch
            ).length;
            const positionCorrect = results.filter(
                (r) => r.isPositionMatch && r.response.positionMatch === true
            ).length;
            const positionMissed = positionMatches - positionCorrect;
            const positionFalseAlarms = results.filter(
                (r) => !r.isPositionMatch && r.response.positionMatch === true
            ).length;

            // 音频统计
            const audioMatches = results.filter((r) => r.isAudioMatch).length;
            const audioCorrect = results.filter(
                (r) => r.isAudioMatch && r.response.audioMatch === true
            ).length;
            const audioMissed = audioMatches - audioCorrect;
            const audioFalseAlarms = results.filter(
                (r) => !r.isAudioMatch && r.response.audioMatch === true
            ).length;

            const newAccuracy = {
                position: {
                    total: positionMatches,
                    correct: positionCorrect,
                    missed: positionMissed,
                    falseAlarms: positionFalseAlarms,
                },
                audio: {
                    total: audioMatches,
                    correct: audioCorrect,
                    missed: audioMissed,
                    falseAlarms: audioFalseAlarms,
                },
            };

            setAccuracy(newAccuracy);

            // 计算每种模式的正确率
            const positionAccuracy = positionMatches > 0 
                ? positionCorrect / positionMatches 
                : 1;
            
            const audioAccuracy = audioMatches > 0 
                ? audioCorrect / audioMatches 
                : 1;

            // 检查是否所有选中的模式都达到100%正确率
            const isPerfectScore = 
                // 如果选择了位置模式，检查位置正确率
                (!settings.selectedTypes.includes("position") || 
                    (positionAccuracy === 1 && positionFalseAlarms === 0)) &&
                // 如果选择了音频模式，检查音频正确率
                (!settings.selectedTypes.includes("audio") || 
                    (audioAccuracy === 1 && audioFalseAlarms === 0)) &&
                // 确保至少完成了一定数量的试验
                currentTrial > 5;

            if (isPerfectScore) {
                // 触发confetti庆祝
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        }
    }, [
        results,
        currentTrial,
        trialHistory,
        currentResponse,
        evaluateResponse,
        settings.selectedTypes,
    ]);

    // 修改生成随机试验刺激的函数
    const generateTrial = useCallback((): TrialStimuli => {
        // 从本局游戏的麻将集中随机选择一个麻将
        const position =
            sessionMahjong[Math.floor(Math.random() * sessionMahjong.length)];

        // 从本局游戏的麻将集中随机选择另一个麻将，用于音频匹配
        const audio =
            sessionMahjong[Math.floor(Math.random() * sessionMahjong.length)];

        return { position, audio };
    }, [sessionMahjong]);

    // 开始下一个试验的核心逻辑
    const startNextTrial = useCallback(() => {
        if (currentTrial >= settings.trialsPerRound) {
            endGame();
            return;
        }

        // 评估上一个试验的响应
        if (currentTrial > 0 && trialHistory.length > 0) {
            evaluateResponse(currentResponse);
        }

        // 生成新刺激，有20%概率创建匹配项
        const newStimuli = generateTrial();
        let positionStimuli = newStimuli.position;
        let audioStimuli = newStimuli.audio;

        // 当有足够历史记录时，按概率创建匹配
        if (trialHistory.length >= settings.selectedNBack) {
            const nBackTrial =
                trialHistory[trialHistory.length - settings.selectedNBack];

            // 计算当前已经生成的匹配数量
            const positionMatches = results.filter(
                (r) => r.isPositionMatch
            ).length;
            const audioMatches = results.filter((r) => r.isAudioMatch).length;

            // 计算剩余试验次数
            const remainingTrials = settings.trialsPerRound - currentTrial;

            // 计算期望的匹配数量（约20%的试验应该有匹配）
            const expectedMatches = Math.ceil(settings.trialsPerRound * 0.2);

            // 位置匹配逻辑
            if (settings.selectedTypes.includes("position")) {
                // 如果匹配数量不足且剩余试验较少，增加匹配概率
                if (positionMatches < expectedMatches && remainingTrials <= (expectedMatches - positionMatches) * 2) {
                    // 强制创建匹配或增加匹配概率
                    positionStimuli = Math.random() < 0.5 ? nBackTrial.position : positionStimuli;
                } 
                // 正常匹配概率
                else if (Math.random() < 0.2) {
                    positionStimuli = nBackTrial.position;
                }
            }

            // 音频匹配逻辑
            if (settings.selectedTypes.includes("audio")) {
                // 如果匹配数量不足且剩余试验较少，增加匹配概率
                if (audioMatches < expectedMatches && remainingTrials <= (expectedMatches - audioMatches) * 2) {
                    // 强制创建匹配或增加匹配概率
                    audioStimuli = Math.random() < 0.5 ? nBackTrial.audio : audioStimuli;
                } 
                // 正常匹配概率
                else if (Math.random() < 0.2) {
                    audioStimuli = nBackTrial.audio;
                }
            }
        }

        // 最终确定的刺激
        const finalStimuli = {
            position: positionStimuli,
            audio: audioStimuli,
        };

        // 更新试验历史
        setTrialHistory((prev) => [...prev, finalStimuli]);

        // 更新滑动位置
        if (settings.selectedTypes.includes("position")) {
            // 计算滑动位置 - 考虑到麻将宽度和间隙
            const tileWidth = 160;
            const gapWidth = 48;
            // 注意：这里使用trialHistory.length而不是currentTrial
            // 因为我们刚刚添加了新的试验到历史中
            const slideAmount = -((trialHistory.length) * (tileWidth + gapWidth));
            setSlidePosition(slideAmount);
        }

        // 只在需要时播放音频
        if (
            settings.selectedTypes.includes("audio") &&
            audioRefs.current[finalStimuli.audio]
        ) {
            audioRefs.current[finalStimuli.audio].play();
        }

        // 重置用户响应状态
        setCurrentResponse({ positionMatch: null, audioMatch: null });

        // 更新试验计数
        setCurrentTrial((prev) => prev + 1);

        // 设置下一个试验的间隔
        setIntervalDelay(settings.trialInterval);
    }, [
        currentTrial,
        generateTrial,
        settings.selectedNBack,
        settings.trialsPerRound,
        settings.trialInterval,
        settings.selectedTypes,
        trialHistory,
        endGame,
        evaluateResponse,
        currentResponse,
        results,
    ]);

    // 分享游戏分数
    const shareScore = useCallback(() => {
        setShowShareModal(true);
    }, []);

    // 添加键盘快捷键支持
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameState !== "playing") return;

            if (e.key === "a" || e.key === "A") {
                handleResponse("position");
            } else if (e.key === "l" || e.key === "L") {
                handleResponse("audio");
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [gameState, handleResponse]);

    // 添加暂停功能
    const togglePause = useCallback(() => {
        if (gameState !== "playing") return;

        if (isPaused) {
            setIntervalDelay(settings.trialInterval);
        } else {
            setIntervalDelay(null);
        }
        setIsPaused(!isPaused);
    }, [gameState, isPaused, settings.trialInterval]);

    return (
        <div className="space-y-8 max-w-lg mx-auto">
            <div
                className="container mx-auto p-4 flex flex-col justify-center"
                ref={gameContainerRef}
                style={{ scrollMarginTop: "90px" }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm text-white">
                            <span>
                                {settings.selectedTypes.length === 2
                                    ? "Dual"
                                    : settings.selectedTypes[0] === "position"
                                    ? "Tile"
                                    : settings.selectedTypes[0] === "audio"
                                    ? "Sound"
                                    : settings.selectedTypes[0]}
                            </span>
                            <span>•</span>
                            <span className="font-medium">
                                {settings.selectedNBack}-back
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {gameState === "playing" && (
                            <>
                                <Button
                                    onClick={togglePause}
                                    variant="outline"
                                    size="sm"
                                >
                                    {isPaused ? (
                                        <PlayCircle className="h-4 w-4" />
                                    ) : (
                                        <PauseCircle className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    onClick={()=>window.location.reload()}
                                    variant="outline"
                                    size="sm"
                                >
                                    Restart
                                </Button>
                            </>
                        )}
                        <SettingsDialog 
                            settings={settings}
                            updateSettings={updateSettings}
                            isDisabled={gameState === "playing"}
                        />
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
                    {gameState === "idle" ? (
                        <div className="text-center py-8">
                            <div className="p-8 bg-muted/20 rounded-lg mb-16">
                                <h3 className="text-lg font-medium mb-2 text-white">
                                    Mahjong Dual N-Back Challenge
                                </h3>
                                <p className="text-white/80">
                                    Track {settings.selectedTypes.map(type => 
                                        type === "position" ? "tile" : 
                                        type === "audio" ? "sound" : type
                                    ).join(" and ")}{" "}
                                    from {settings.selectedNBack} steps back.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <ShimmerButton
                                    onClick={startGame}
                                    disabled={isLoading || preloadState.isPreloading}
                                >
                                    {preloadState.isPreloading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <PlayCircle className="w-5 h-5 mr-2" />
                                            Start Training
                                        </>
                                    )}
                                </ShimmerButton>
                            </div>
                        </div>
                    ) : gameState === "playing" ? (
                        <div className="text-center py-6">
                            <div className="text-lg font-medium text-white">
                                Trial {currentTrial} of {settings.trialsPerRound}
                            </div>

                            <div className="relative w-[176px] mx-auto overflow-hidden pt-6 pb-20">
                                <div
                                    className="flex gap-12"
                                    style={{
                                        transform: `translateX(${slidePosition}px)`,
                                        transition: "transform 0.3s ease-in-out",
                                    }}
                                >
                                    {trialHistory.map((trial, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 flex items-center justify-center"
                                        >
                                            <div
                                                className={cn(
                                                    "bg-white rounded-2xl shadow-[6px_6px_0px_#ddd,12px_14px_0px_#10ab3b] w-[160px] aspect-[2/3] flex items-center justify-center relative before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] before:pointer-events-none",
                                                    index === trialHistory.length - 1 && "ring-3 ring-primary"
                                                )}
                                            >
                                                <Image
                                                    src={`${GAME_CONFIG.symbolBasePath}${trial.position}.svg`}
                                                    alt={trial.position}
                                                    width={120}
                                                    height={180}
                                                    style={{
                                                        width: "120px",
                                                        height: "180px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* If only audio is selected, show a visual indicator for audio */}
                            {!settings.selectedTypes.includes("position") &&
                                settings.selectedTypes.includes("audio") && (
                                    <div className="flex justify-center items-center h-32 mb-6">
                                        <div
                                            className={cn(
                                                "w-16 h-16 rounded-full flex items-center justify-center",
                                                isAudioPlaying
                                                    ? "bg-primary/20"
                                                    : "bg-foreground/5"
                                            )}
                                        >
                                            <Volume2
                                                className={cn(
                                                    "w-8 h-8",
                                                    isAudioPlaying
                                                        ? "text-primary animate-pulse"
                                                        : "text-muted-foreground"
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}

                            <div className="flex justify-center gap-4">
                                {settings.selectedTypes.includes("position") && (
                                    <Button
                                        onClick={() => handleResponse("position")}
                                        variant="outline"
                                        className={cn(
                                            "rounded-lg shadow-md bg-white/90 border-2 border-emerald-800 hover:bg-white",
                                            "text-emerald-900 hover:text-emerald-900 font-medium",
                                            "transition-all duration-200",
                                            isPositionHighlight &&
                                                "border-blue-500 ring-2 ring-blue-200"
                                        )}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center border border-emerald-300">
                                                <span className="text-emerald-700 text-lg">
                                                    🀫
                                                </span>
                                            </div>
                                            <span>
                                                Tile Match{" "}
                                                <span className="text-xs text-emerald-600">
                                                    (A)
                                                </span>
                                            </span>
                                        </div>
                                    </Button>
                                )}
                                {settings.selectedTypes.includes("audio") && (
                                    <Button
                                        onClick={() => handleResponse("audio")}
                                        variant="outline"
                                        className={cn(
                                            "rounded-lg shadow-md bg-white/90 border-2 border-emerald-800 hover:bg-white",
                                            "text-emerald-900 hover:text-emerald-900 font-medium",
                                            "transition-all duration-200",
                                            isAudioHighlight &&
                                                "border-blue-500 ring-2 ring-blue-200"
                                        )}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center border border-amber-300">
                                                <span className="text-amber-700 text-lg">
                                                    🀇
                                                </span>
                                            </div>
                                            <span>
                                                Sound Match{" "}
                                                <span className="text-xs text-emerald-600">
                                                    (L)
                                                </span>
                                            </span>
                                        </div>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <h2 className="text-xl font-bold mb-4">
                                Training Results
                            </h2>
                            <div className="bg-muted/30 p-6 rounded-lg mb-6 max-w-md mx-auto">
                                <div
                                    className={cn(
                                        "grid gap-6",
                                        settings.selectedTypes.length === 2
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                    )}
                                >
                                    {settings.selectedTypes.includes(
                                        "position"
                                    ) && (
                                        <div
                                            className={cn(
                                                "space-y-3",
                                                settings.selectedTypes.length ===
                                                    2 && "border-r pr-4"
                                            )}
                                        >
                                            <h3 className="font-semibold text-primary">
                                                Tile Match
                                            </h3>
                                            <div className="flex flex-col items-center">
                                                <div className="text-3xl font-bold">
                                                    {accuracy.position.correct}/
                                                    {accuracy.position.total}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {accuracy.position.total > 0
                                                        ? Math.round(
                                                              (accuracy.position
                                                                  .correct /
                                                                  accuracy.position
                                                                      .total) *
                                                              100
                                                          )
                                                        : 0}
                                                    % Accuracy
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Missed:</span>
                                                    <span>
                                                        {accuracy.position.missed}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>False Alarms:</span>
                                                    <span>
                                                        {
                                                            accuracy.position
                                                                .falseAlarms
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {settings.selectedTypes.includes("audio") && (
                                        <div
                                            className={cn(
                                                "space-y-3",
                                                settings.selectedTypes.length ===
                                                    2 && "pl-2"
                                            )}
                                        >
                                            <h3 className="font-semibold text-primary">
                                                Audio
                                            </h3>
                                            <div className="flex flex-col items-center">
                                                <div className="text-3xl font-bold">
                                                    {accuracy.audio.correct}/
                                                    {accuracy.audio.total}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {accuracy.audio.total > 0
                                                        ? Math.round(
                                                              (accuracy.audio
                                                                  .correct /
                                                                  accuracy.audio
                                                                      .total) *
                                                              100
                                                          )
                                                        : 0}
                                                    % Accuracy
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Missed:</span>
                                                    <span>
                                                        {accuracy.audio.missed}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>False Alarms:</span>
                                                    <span>
                                                        {accuracy.audio.falseAlarms}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/40">
                                    <div className="text-sm">
                                        {settings.selectedTypes.length === 2 && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                    Overall Performance:
                                                </span>
                                                <span className="font-bold">
                                                    {Math.round(
                                                        ((accuracy.position
                                                            .correct +
                                                            accuracy.audio
                                                                .correct) /
                                                        (accuracy.position
                                                            .total +
                                                            accuracy.audio
                                                                .total || 1)) *
                                                        100
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        )}
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            <p>
                                                Level: {settings.selectedNBack}-Back
                                                • Trials: {currentTrial}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <Button
                                    onClick={startGame}
                                    disabled={isLoading || preloadState.isPreloading}
                                    className="rounded-full"
                                >
                                    {preloadState.isPreloading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Loading... ({preloadState.loadedAudio}/{preloadState.totalAudio} audio, 
                                            {preloadState.loadedImages}/{preloadState.totalImages} images)
                                        </>
                                    ) : (
                                        <>
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                            Play Again
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={shareScore}
                                    className="rounded-full"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Add ShareModal at the end of the component */}
            <ShareModal 
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    );
}
