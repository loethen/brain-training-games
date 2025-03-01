import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "../config";
import { cn } from "@/lib/utils";
import { PlayCircle, Share2, Volume2, Square, Settings, PauseCircle } from "lucide-react";
import { Howl } from "howler";
import { useInterval } from "@/hooks/useInterval";
import { useTimeout } from "@/hooks/useTimeout";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// 定义游戏状态类型
type GameState = "idle" | "playing" | "complete";
// 试验刺激类型：麻将牌和音频
type TrialStimuli = { tile: string; audio: string };
// 用户响应类型：位置匹配和音频匹配
type Response = { positionMatch: boolean | null; audioMatch: boolean | null };
// 试验结果类型：包含刺激、响应和正确性评估
type TrialResult = {
    stimuli: TrialStimuli;
    response: Response;
    isPositionMatch: boolean;
    isAudioMatch: boolean;
    isCorrectPositionResponse: boolean;
    isCorrectAudioResponse: boolean;
};
// 游戏设置类型
type GameSettings = {
    selectedNBack: number;
    selectedTypes: ("position" | "audio")[];
};

// 游戏设置自定义钩子
function useGameSettings() {
    // 默认游戏设置
    const [settings, setSettings] = useState<GameSettings>({
        selectedNBack: GAME_CONFIG.difficulty.initialLevel,      // 默认N-back等级
        selectedTypes: ["position", "audio"] // 默认启用双模式
    });

    // 安全更新设置的方法
    const updateSettings = useCallback((updater: (prev: GameSettings) => GameSettings) => {
        setSettings(prev => {
            const newSettings = updater(prev);
            // 验证设置有效性：至少需要保持一个训练模式启用
            if (newSettings.selectedTypes.length === 0) {
                toast("必须至少保持一个训练模式启用");
                return prev; // 返回之前的有效设置
            }
            return newSettings;
        });
    }, []);

    return { settings, updateSettings };
}

export default function GameComponent() {
    const { settings, updateSettings } = useGameSettings();
    
    // 游戏状态
    const [gameState, setGameState] = useState<GameState>("idle");
    const [currentTrial, setCurrentTrial] = useState(0);
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]);
    const [currentStimuli, setCurrentStimuli] = useState<TrialStimuli | null>(null);
    const [currentResponse, setCurrentResponse] = useState<Response>({ positionMatch: null, audioMatch: null });
    const [results, setResults] = useState<TrialResult[]>([]);
    const [accuracy, setAccuracy] = useState({
        position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
        audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [intervalDelay, setIntervalDelay] = useState<number | null>(null);
    
    // 音频相关
    const audioRef = useRef<Howl | null>(null);
    
    // 生成随机麻将牌和音频
    const generateRandomStimuli = useCallback((): TrialStimuli => {
        const tiles = GAME_CONFIG.mahjong.tiles;
        const tileIndex = Math.floor(Math.random() * tiles.length);
        const audioIndex = Math.floor(Math.random() * tiles.length);
        
        return {
            tile: tiles[tileIndex].id,
            audio: tiles[audioIndex].id
        };
    }, []);
    
    // 播放音频
    const playAudio = useCallback((tileId: string) => {
        const tile = GAME_CONFIG.mahjong.tiles.find(t => t.id === tileId);
        if (!tile) return;
        
        // 如果已有音频在播放，先停止
        if (audioRef.current) {
            audioRef.current.stop();
        }
        
        // 创建新的音频实例
        const audioPath = `${GAME_CONFIG.mahjong.audioPath}${tile.audio}.mp3`;
        audioRef.current = new Howl({
            src: [audioPath],
            volume: 0.8,
            onloaderror: (id, error) => {
                console.error("音频加载错误:", error);
                toast.error("音频加载失败");
            }
        });
        
        // 播放音频
        audioRef.current.play();
    }, []);
    
    // 开始新的试验
    const startNewTrial = useCallback(() => {
        // 生成新的刺激
        const newStimuli = generateRandomStimuli();
        
        // 更新试验历史和当前刺激
        setTrialHistory(prev => [...prev, newStimuli]);
        setCurrentStimuli(newStimuli);
        setCurrentTrial(prev => prev + 1);
        
        // 重置当前响应
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        
        // 播放音频
        playAudio(newStimuli.audio);
    }, [generateRandomStimuli, playAudio]);
    
    // 评估用户响应
    const evaluateResponse = useCallback((response: Response) => {
        if (!currentStimuli || currentTrial <= settings.selectedNBack) return;
        
        // 获取N步之前的刺激
        const previousStimuli = trialHistory[currentTrial - settings.selectedNBack - 1];
        if (!previousStimuli) return;
        
        // 判断是否匹配
        const isPositionMatch = currentStimuli.tile === previousStimuli.tile;
        const isAudioMatch = currentStimuli.audio === previousStimuli.audio;
        
        // 判断响应是否正确
        const isCorrectPositionResponse = 
            (isPositionMatch && response.positionMatch === true) || 
            (!isPositionMatch && response.positionMatch !== true);
        
        const isCorrectAudioResponse = 
            (isAudioMatch && response.audioMatch === true) || 
            (!isAudioMatch && response.audioMatch !== true);
        
        // 添加到结果中
        setResults(prev => [...prev, {
            stimuli: currentStimuli,
            response,
            isPositionMatch,
            isAudioMatch,
            isCorrectPositionResponse,
            isCorrectAudioResponse
        }]);
    }, [currentStimuli, currentTrial, settings.selectedNBack, trialHistory]);
    
    // 用户响应处理
    const handleResponse = useCallback((type: "position" | "audio") => {
        if (gameState !== "playing") return;
        
        setCurrentResponse(prev => {
            const newResponse = { ...prev };
            if (type === "position") {
                newResponse.positionMatch = true;
            } else if (type === "audio") {
                newResponse.audioMatch = true;
            }
            return newResponse;
        });
    }, [gameState]);
    
    // 开始游戏
    const startGame = useCallback(() => {
        setIsLoading(true);
        
        // 重置游戏状态
        setGameState("idle");
        setCurrentTrial(0);
        setTrialHistory([]);
        setCurrentStimuli(null);
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        setResults([]);
        setAccuracy({
            position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
            audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 }
        });
        
        // 延迟开始游戏，给用户准备时间
        setTimeout(() => {
            setIsLoading(false);
            setGameState("playing");
            
            // 设置试验间隔
            setIntervalDelay(GAME_CONFIG.trials.interval);
        }, 1000);
    }, []);
    
    // 结束游戏并计算准确率
    const endGame = useCallback(() => {
        setIntervalDelay(null);
        setGameState("complete");
        
        // 评估最后一次试验（如果存在）
        if (currentTrial > 0 && trialHistory.length > 0) {
            evaluateResponse(currentResponse);
        }
        
        if (results.length > 0) {
            // 位置统计
            const positionMatches = results.filter(r => r.isPositionMatch).length;
            const positionCorrect = results.filter(r => 
                r.isPositionMatch && r.response.positionMatch === true
            ).length;
            const positionMissed = positionMatches - positionCorrect;
            const positionFalseAlarms = results.filter(r => 
                !r.isPositionMatch && r.response.positionMatch === true
            ).length;

            // 音频统计
            const audioMatches = results.filter(r => r.isAudioMatch).length;
            const audioCorrect = results.filter(r => 
                r.isAudioMatch && r.response.audioMatch === true
            ).length;
            const audioMissed = audioMatches - audioCorrect;
            const audioFalseAlarms = results.filter(r => 
                !r.isAudioMatch && r.response.audioMatch === true
            ).length;

            const newAccuracy = {
                position: {
                    total: positionMatches,
                    correct: positionCorrect,
                    missed: positionMissed,
                    falseAlarms: positionFalseAlarms
                },
                audio: {
                    total: audioMatches,
                    correct: audioCorrect,
                    missed: audioMissed,
                    falseAlarms: audioFalseAlarms
                }
            };
            
            setAccuracy(newAccuracy);
            
            // 检查是否完美得分并触发彩带庆祝
            const isPerfectScore = 
                (positionMatches === 0 || positionCorrect === positionMatches) && 
                (audioMatches === 0 || audioCorrect === audioMatches) &&
                positionFalseAlarms === 0 && 
                audioFalseAlarms === 0;
                
            if (isPerfectScore && currentTrial > 5) {
                // 触发彩带庆祝
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, [results, currentTrial, trialHistory, currentResponse, evaluateResponse]);
    
    // 分享得分
    const shareScore = useCallback(() => {
        const positionAccuracy = accuracy.position.total > 0
            ? Math.round((accuracy.position.correct / accuracy.position.total) * 100)
            : 0;
        const audioAccuracy = accuracy.audio.total > 0
            ? Math.round((accuracy.audio.correct / accuracy.audio.total) * 100)
            : 0;
        
        const text = `我在麻将 Dual ${settings.selectedNBack}-Back 挑战中获得了 ${positionAccuracy}% 的位置准确率和 ${audioAccuracy}% 的音频准确率！`;
        
        if (navigator.share) {
            navigator.share({
                title: '麻将 Dual N-Back 挑战',
                text: text,
                url: window.location.href
            }).catch(err => {
                console.error('分享失败:', err);
                copyToClipboard(text);
            });
        } else {
            copyToClipboard(text);
        }
    }, [accuracy, settings.selectedNBack]);
    
    // 复制到剪贴板
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            toast.error('复制失败');
        });
    };
    
    // 使用自定义钩子处理试验间隔
    useInterval(() => {
        if (currentTrial >= GAME_CONFIG.trials.perRound) {
            endGame();
            return;
        }
        
        // 如果不是第一次试验，评估上一次的响应
        if (currentTrial > 0) {
            evaluateResponse(currentResponse);
        }
        
        startNewTrial();
    }, intervalDelay);
    
    // 使用自定义钩子处理游戏开始延迟
    useTimeout(() => {
        if (gameState === "playing" && currentTrial === 0) {
            startNewTrial();
        }
    }, gameState === "playing" && currentTrial === 0 ? GAME_CONFIG.trials.startDelay : null);
    
    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== "playing") return;
            
            if (e.key === "a" || e.key === "A") {
                handleResponse("position");
            } else if (e.key === "l" || e.key === "L") {
                handleResponse("audio");
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameState, handleResponse]);
    
    // 清理音频
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.stop();
            }
        };
    }, []);

    // 获取麻将牌名称
    const getTileName = (tileId: string) => {
        const tile = GAME_CONFIG.mahjong.tiles.find(t => t.id === tileId);
        return tile ? tile.name : "";
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col items-center">
                {/* 游戏设置 */}
                <div className="w-full flex justify-between items-center mb-6">
                    <div className="text-xl font-bold">
                        {settings.selectedNBack}-Back
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="p-2">
                                <h4 className="mb-2 text-sm font-medium">N-Back 级别</h4>
                                <Slider
                                    defaultValue={[settings.selectedNBack]}
                                    min={1}
                                    max={GAME_CONFIG.difficulty.maxLevel}
                                    step={1}
                                    onValueChange={(values) => {
                                        updateSettings(prev => ({
                                            ...prev,
                                            selectedNBack: values[0]
                                        }));
                                    }}
                                    disabled={gameState === "playing"}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>1</span>
                                    <span>{GAME_CONFIG.difficulty.maxLevel}</span>
                                </div>
                            </div>
                            
                            <DropdownMenuSeparator />
                            
                            <div className="p-2">
                                <h4 className="mb-2 text-sm font-medium">训练模式</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="position"
                                            checked={settings.selectedTypes.includes("position")}
                                            onCheckedChange={(checked) => {
                                                updateSettings(prev => ({
                                                    ...prev,
                                                    selectedTypes: checked
                                                        ? [...prev.selectedTypes, "position"]
                                                        : prev.selectedTypes.filter(t => t !== "position")
                                                }));
                                            }}
                                            disabled={gameState === "playing"}
                                        />
                                        <Label htmlFor="position">位置 (麻将牌)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="audio"
                                            checked={settings.selectedTypes.includes("audio")}
                                            onCheckedChange={(checked) => {
                                                updateSettings(prev => ({
                                                    ...prev,
                                                    selectedTypes: checked
                                                        ? [...prev.selectedTypes, "audio"]
                                                        : prev.selectedTypes.filter(t => t !== "audio")
                                                }));
                                            }}
                                            disabled={gameState === "playing"}
                                        />
                                        <Label htmlFor="audio">音频</Label>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* 游戏区域 */}
                {gameState === "idle" ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">
                            麻将 Dual N-Back 挑战
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-md">
                            {GAME_CONFIG.messages.start.replace("{level}", settings.selectedNBack.toString())}
                        </p>
                        <Button 
                            onClick={startGame} 
                            disabled={isLoading}
                            size="lg"
                        >
                            {isLoading ? (
                                <>加载中...</>
                            ) : (
                                <>
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    开始训练
                                </>
                            )}
                        </Button>
                    </div>
                ) : gameState === "playing" ? (
                    <>
                        <div className="text-sm text-muted-foreground mb-4">
                            试验 {currentTrial}/{GAME_CONFIG.trials.perRound}
                        </div>
                        
                        {/* 麻将牌展示区域 */}
                        <div className="relative w-full max-w-md aspect-[3/1] mb-8">
                            {/* 左侧麻将牌（模糊） */}
                            <div className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-center">
                                <div className="w-full h-5/6 bg-muted/50 rounded-lg flex items-center justify-center blur-sm">
                                    <img 
                                        src={`${GAME_CONFIG.mahjong.basePath}${currentStimuli?.tile || 'dragon_red'}.svg`} 
                                        alt="麻将牌" 
                                        className="w-3/4 h-3/4 object-contain opacity-50"
                                    />
                                </div>
                            </div>
                            
                            {/* 中间麻将牌（当前） */}
                            <div className="absolute left-1/3 top-0 w-1/3 h-full flex items-center justify-center">
                                <div className="w-full h-full bg-background shadow-lg rounded-lg flex items-center justify-center transform scale-110 z-10">
                                    {currentStimuli && (
                                        <img 
                                            src={`${GAME_CONFIG.mahjong.basePath}${currentStimuli.tile}.svg`} 
                                            alt={getTileName(currentStimuli.tile)}
                                            className="w-3/4 h-3/4 object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                            
                            {/* 右侧麻将牌（模糊） */}
                            <div className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-center">
                                <div className="w-full h-5/6 bg-muted/50 rounded-lg flex items-center justify-center blur-sm">
                                    <img 
                                        src={`${GAME_CONFIG.mahjong.basePath}${currentStimuli?.tile || 'dragon_white'}.svg`} 
                                        alt="麻将牌" 
                                        className="w-3/4 h-3/4 object-contain opacity-50"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* 音频指示器 */}
                        <div className="mb-8">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-12 w-12 rounded-full"
                                disabled
                            >
                                <Volume2 className={cn(
                                    "h-6 w-6",
                                    currentStimuli ? "text-primary" : "text-muted-foreground"
                                )} />
                            </Button>
                        </div>
                        
                        {/* 响应按钮 */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <Button 
                                onClick={() => handleResponse("position")}
                                variant={currentResponse.positionMatch ? "default" : "outline"}
                                className="h-16"
                                disabled={!settings.selectedTypes.includes("position")}
                            >
                                <Square className="mr-2 h-5 w-5" />
                                位置匹配 (A)
                            </Button>
                            <Button 
                                onClick={() => handleResponse("audio")}
                                variant={currentResponse.audioMatch ? "default" : "outline"}
                                className="h-16"
                                disabled={!settings.selectedTypes.includes("audio")}
                            >
                                <Volume2 className="mr-2 h-5 w-5" />
                                音频匹配 (L)
                            </Button>
                        </div>
                        
                        {/* 暂停按钮 */}
                        <div className="mt-8">
                            <Button 
                                variant="outline" 
                                onClick={endGame}
                            >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                结束训练
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-bold mb-4">
                            训练结果
                        </h2>
                        <div className="bg-muted/30 p-6 rounded-lg mb-6 max-w-md mx-auto">
                            <div className="grid grid-cols-2 gap-6">
                                {/* 位置结果 */}
                                <div className="space-y-3 border-r pr-4">
                                    <h3 className="font-semibold text-primary">位置</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold">
                                            {accuracy.position.correct}/{accuracy.position.total}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {accuracy.position.total > 0 
                                                ? Math.round((accuracy.position.correct / accuracy.position.total) * 100) 
                                                : 0}% 准确率
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>漏掉:</span>
                                            <span>{accuracy.position.missed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>误报:</span>
                                            <span>{accuracy.position.falseAlarms}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 音频结果 */}
                                <div className="space-y-3 pl-2">
                                    <h3 className="font-semibold text-primary">音频</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold">
                                            {accuracy.audio.correct}/{accuracy.audio.total}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {accuracy.audio.total > 0 
                                                ? Math.round((accuracy.audio.correct / accuracy.audio.total) * 100) 
                                                : 0}% 准确率
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>漏掉:</span>
                                            <span>{accuracy.audio.missed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>误报:</span>
                                            <span>{accuracy.audio.falseAlarms}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/40">
                                <div className="text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">总体表现:</span>
                                        <span className="font-bold">
                                            {Math.round(((accuracy.position.correct + accuracy.audio.correct) / 
                                                (accuracy.position.total + accuracy.audio.total || 1)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        <p>级别: {settings.selectedNBack}-Back • 试验: {currentTrial}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button onClick={startGame} disabled={isLoading}>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                再次挑战
                            </Button>
                            <Button variant="outline" onClick={shareScore}>
                                <Share2 className="w-4 h-4 mr-2" />
                                分享
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 