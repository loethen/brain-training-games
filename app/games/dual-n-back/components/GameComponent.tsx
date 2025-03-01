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
// 游戏状态：空闲、进行中、已完成
type GameState = "idle" | "playing" | "complete";
// 试验刺激类型：位置和字母
type TrialStimuli = { position: number; letter: string };
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
    voiceType: "male" | "female";
    selectedTypes: ("position" | "audio")[];
};

// 游戏设置自定义钩子
function useGameSettings() {
    // 默认游戏设置
    const [settings, setSettings] = useState<GameSettings>({
        selectedNBack: GAME_CONFIG.difficulty.initialLevel,      // 默认N-back等级
        voiceType: "male",      // 默认语音类型
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
    
    // 原useGameLogic中的状态
    const [gameState, setGameState] = useState<GameState>("idle");
    const [currentTrial, setCurrentTrial] = useState(0); // 当前试验次数
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]); // 试验历史记录
    const [results, setResults] = useState<TrialResult[]>([]); // 所有试验结果存储
    const [currentResponse, setCurrentResponse] = useState<Response>({
        positionMatch: null,
        audioMatch: null,
    }); // 当前用户的响应状态
    const [isPositionHighlight, setIsPositionHighlight] = useState(false);
    const [isAudioHighlight, setIsAudioHighlight] = useState(false);

    const startGame = useCallback(() => {
        setIsLoading(true);
        setGameState("idle");
        setCurrentTrial(0);
        setTrialHistory([]);
        setResults([]);
        setStartDelay(GAME_CONFIG.trials.startDelay);
    }, []);

    // 修改handleResponse方法
    const handleResponse = useCallback((type: "position" | "audio") => {
        // 设置高亮状态
        if (type === "position") {
            setIsPositionHighlight(true);
            setTimeout(() => setIsPositionHighlight(false), 300);
        } else {
            setIsAudioHighlight(true);
            setTimeout(() => setIsAudioHighlight(false), 300);
        }

        setCurrentResponse(prev => {
            // 如果已经响应过该类型，则不再更新
            if (prev[`${type}Match`] !== null) {
                return prev;
            }
            
            // Create the updated response
            const updatedResponse = {
                ...prev,
                [`${type}Match`]: true
            };
            
            return updatedResponse;
        });
    }, []);

    const evaluateResponse = useCallback((response: Response) => {
        if (trialHistory.length === 0) return; // Safety check
        
        const currentStimuli = trialHistory[trialHistory.length - 1];
        const nBackIndex = trialHistory.length - 1 - settings.selectedNBack;
        
        // Only evaluate if we have enough history
        if (nBackIndex < 0) return;
        
        const nBackStimuli = trialHistory[nBackIndex];
        
        const isPositionMatch = currentStimuli.position === nBackStimuli.position;
        const isAudioMatch = currentStimuli.letter === nBackStimuli.letter;
        
        const newResult = {
            stimuli: currentStimuli,
            response,
            isPositionMatch,
            isAudioMatch,
            isCorrectPositionResponse: 
                isPositionMatch ? 
                    response.positionMatch === true :  // 当有匹配时，必须响应true
                    response.positionMatch !== true,   // 当无匹配时，必须不响应true（可以是false或null）
            
            isCorrectAudioResponse: 
                isAudioMatch ? 
                    response.audioMatch === true : 
                    response.audioMatch !== true
        };
        
        setResults(prev => [...prev, newResult]);
    }, [trialHistory, settings.selectedNBack]);

    // 组件本地状态
    const [isLoading, setIsLoading] = useState(false);          // 加载状态
    const [activePosition, setActivePosition] = useState<number | null>(null); // 当前激活的位置
    const [accuracy, setAccuracy] = useState<{ 
        position: { total: number; correct: number; missed: number; falseAlarms: number };
        audio: { total: number; correct: number; missed: number; falseAlarms: number }
    }>({ 
        position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
        audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 }
    }); // 准确率统计
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // 音频播放状态
    const [intervalDelay, setIntervalDelay] = useState<number | null>(null); // 试验间隔
    const [startDelay, setStartDelay] = useState<number | null>(null); // 开始延迟
    const [isPaused, setIsPaused] = useState(false);             // 暂停状态
    const audioRefs = useRef<{ [key: string]: Howl }>({});      // 音频引用缓存

    // 定时器钩子：控制试验间隔
    useInterval(() => {
        if (currentTrial < GAME_CONFIG.trials.perRound) {
            setActivePosition(null); // 重置激活位置
            startNextTrial();
        } else {
            endGame();
            setIntervalDelay(null);
        }
    }, intervalDelay);

    // 延时钩子：控制游戏开始
    useTimeout(() => {
        setGameState("playing");
        setCurrentTrial(0);
        setTrialHistory([]);
        setResults([]);
        setActivePosition(null);
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        setAccuracy({ position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 }, audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 } });
        setIsLoading(false);
        startNextTrial();
        setStartDelay(null);
    }, startDelay);

    // 加载音频文件
    useEffect(() => {
        // 在 effect 中保存对 audioRefs.current 的引用
        const currentAudioRefs = audioRefs.current;
        
        GAME_CONFIG.audio.letters.forEach((letter) => {
            currentAudioRefs[letter] = new Howl({
                src: [`${GAME_CONFIG.audio.basePath}${
                    GAME_CONFIG.audio.voices[settings.voiceType]
                }${letter.toLowerCase()}.mp3`],
                onplay: () => setIsAudioPlaying(true),
                onend: () => setIsAudioPlaying(false),
            });
        });
        
        // 使用保存的引用进行清理
        return () => Object.values(currentAudioRefs).forEach((audio) => audio.unload());
    }, [settings.voiceType]);

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
            
            // Check for perfect score and trigger confetti
            const isPerfectScore = 
                (positionMatches === 0 || positionCorrect === positionMatches) && 
                (audioMatches === 0 || audioCorrect === audioMatches) &&
                positionFalseAlarms === 0 && 
                audioFalseAlarms === 0;
                
            if (isPerfectScore && currentTrial > 5) {
                // Trigger confetti celebration
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, [results, currentTrial, trialHistory, currentResponse, evaluateResponse]);

    // 生成随机试验刺激
    const generateTrial = useCallback((): TrialStimuli => {
        // 随机生成位置（0-8对应3x3网格）
        const position = Math.floor(Math.random() * 9);
        // 随机选择字母
        const letter = GAME_CONFIG.audio.letters[
            Math.floor(Math.random() * GAME_CONFIG.audio.letters.length)
        ];
        return { position, letter };
    }, []);

    // 开始下一个试验的核心逻辑
    const startNextTrial = useCallback(() => {
        if (currentTrial >= GAME_CONFIG.trials.perRound) {
            endGame();
            return;
        }

        // Evaluate the previous trial's response if it exists
        if (currentTrial > 0 && trialHistory.length > 0) {
            evaluateResponse(currentResponse);
        }

        // 生成新刺激，有20%概率创建匹配项
        const newStimuli = generateTrial();
        let positionStimuli = newStimuli.position;
        let letterStimuli = newStimuli.letter;

        // 当有足够历史记录时，按概率创建匹配
        if (trialHistory.length >= settings.selectedNBack) {
            const nBackTrial = trialHistory[trialHistory.length - settings.selectedNBack];
            if (Math.random() < 0.2) positionStimuli = nBackTrial.position;
            if (Math.random() < 0.2) letterStimuli = nBackTrial.letter;
        }

        // 最终确定的刺激
        const finalStimuli = { position: positionStimuli, letter: letterStimuli };
        
        // 更新界面状态
        setActivePosition(finalStimuli.position);  // 显示位置刺激
        if (audioRefs.current[finalStimuli.letter]) {
            audioRefs.current[finalStimuli.letter].play(); // 播放音频
        }
        
        // 重置用户响应状态
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        
        // 更新试验历史（保留最近N次记录）
        setTrialHistory(prev => [...prev, finalStimuli]);

        // 更新试验计数
        setCurrentTrial(prev => prev + 1);
        
        // 设置下一个试验的间隔
        setIntervalDelay(GAME_CONFIG.trials.interval);
    }, [currentTrial, generateTrial, settings.selectedNBack, trialHistory, endGame, evaluateResponse, currentResponse]);

    // 分享游戏分数
    const shareScore = useCallback(() => {
        const text = `I achieved ${accuracy.position.correct}/${accuracy.position.total} position and ${accuracy.audio.correct}/${accuracy.audio.total} audio accuracy in ${settings.selectedNBack}-Back training!`;
        if (navigator.share) {
            navigator
                .share({
                    title: "My Dual N-Back Score",
                    text,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            navigator.clipboard
                .writeText(text + " " + window.location.href)
                .then(() => alert("Score copied to clipboard!"));
        }
    }, [settings.selectedNBack, accuracy]);

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
            setIntervalDelay(GAME_CONFIG.trials.interval);
        } else {
            setIntervalDelay(null);
        }
        setIsPaused(!isPaused);
    }, [gameState, isPaused]);

    // 添加无响应处理 - 在每个试验结束时自动评估
    useEffect(() => {
        if (gameState === "playing" && currentTrial > 0) {
            const timer = setTimeout(() => {
                // Call evaluateResponse with the current response before the next trial
                evaluateResponse(currentResponse);
                
                const currentStimuli = trialHistory[trialHistory.length - 1];
                const nBackIndex = trialHistory.length - 1 - settings.selectedNBack;
                const nBackStimuli = nBackIndex >= 0 && trialHistory.length > nBackIndex 
                    ? trialHistory[nBackIndex]
                    : undefined;
                
                const isPositionMatch = nBackStimuli 
                    ? currentStimuli.position === nBackStimuli.position
                    : false;
                const isAudioMatch = nBackStimuli
                    ? currentStimuli.letter === nBackStimuli.letter
                    : false;

                const autoResponse = { ...currentResponse };
                
                // 仅当需要响应但未响应时标记为错误
                if (settings.selectedTypes.includes("position")) {
                    if (isPositionMatch && autoResponse.positionMatch === null) {
                        autoResponse.positionMatch = false; // 应响应但未响应
                    }
                }
                
                if (settings.selectedTypes.includes("audio")) {
                    if (isAudioMatch && autoResponse.audioMatch === null) {
                        autoResponse.audioMatch = false; // 应响应但未响应
                    }
                }
            }, GAME_CONFIG.trials.interval - 200);
            
            return () => clearTimeout(timer);
        }
    }, [currentTrial, currentResponse, gameState, settings.selectedTypes, evaluateResponse, trialHistory, settings.selectedNBack]);

    return (
        <div className="container mx-auto p-4 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            {settings.selectedTypes.length === 2
                                ? "Dual"
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
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={gameState === "playing"}
                            >
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Settings
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-background p-4 w-64"
                        >
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <Label className="flex justify-between items-center">
                                        <span>Difficulty</span>
                                        <span className="text-primary">
                                            {settings.selectedNBack}-Back
                                        </span>
                                    </Label>
                                    <Slider
                                        min={1}
                                        max={4}
                                        step={1}
                                        value={[settings.selectedNBack]}
                                        onValueChange={([val]) =>
                                            updateSettings((p) => ({
                                                ...p,
                                                selectedNBack: val,
                                            }))
                                        }
                                        disabled={gameState === "playing"}
                                    />
                                </div>
                                <DropdownMenuSeparator />
                                <div className="flex items-center justify-between">
                                    <span>Voice</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateSettings((p) => ({
                                                    ...p,
                                                    voiceType:
                                                        p.voiceType === "male"
                                                            ? "female"
                                                            : "male",
                                                }))
                                            }
                                        >
                                            {settings.voiceType === "male"
                                                ? "Male"
                                                : "Female"}
                                        </Button>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <div className="space-y-2">
                                    <Label>Training Mode</Label>
                                    {["position", "audio"].map((type) => (
                                        <div
                                            key={type}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                id={`mode-${type}`}
                                                checked={settings.selectedTypes.includes(
                                                    type as "position" | "audio"
                                                )}
                                                onCheckedChange={(checked) => {
                                                    const newTypes = checked
                                                        ? [
                                                              ...settings.selectedTypes,
                                                              type as
                                                                  | "position"
                                                                  | "audio",
                                                          ]
                                                        : settings.selectedTypes.filter(
                                                              (t) => t !== type
                                                          );
                                                    if (newTypes.length === 0)
                                                        return;
                                                    updateSettings((p) => ({
                                                        ...p,
                                                        selectedTypes: newTypes,
                                                    }));
                                                }}
                                                disabled={
                                                    gameState === "playing" ||
                                                    (settings.selectedTypes
                                                        .length === 1 &&
                                                        settings.selectedTypes.includes(
                                                            type as
                                                                | "position"
                                                                | "audio"
                                                        ))
                                                }
                                            />
                                            <Label htmlFor={`mode-${type}`}>
                                                {type.charAt(0).toUpperCase() +
                                                    type.slice(1)}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
                {gameState === "idle" ? (
                    <div className="text-center py-8">
                        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">
                                Dual N-Back Challenge
                            </h3>
                            <p className="text-muted-foreground">
                                Track {settings.selectedTypes.join(" and ")}{" "}
                                from {settings.selectedNBack} steps back.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            onClick={startGame}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            <PlayCircle className="w-5 h-5 mr-2" />
                            {isLoading ? "Starting..." : "Start Challenge"}
                        </Button>
                    </div>
                ) : gameState === "playing" ? (
                    <div className="text-center py-6">
                        <div className="text-lg font-medium mb-4">
                            Trial {currentTrial} of{" "}
                            {GAME_CONFIG.trials.perRound}
                        </div>

                        <div
                            className={cn(
                                "grid grid-cols-3 gap-2 mx-auto mb-6"
                            )}
                        >
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "aspect-square rounded-lg transition-all duration-300",
                                        activePosition === index
                                            ? "bg-primary"
                                            : "bg-foreground/5"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex justify-center gap-4">
                            {settings.selectedTypes.includes("position") && (
                                <Button
                                    onClick={() => handleResponse("position")}
                                    variant="outline"
                                    className={cn(
                                        "border-2",
                                        isPositionHighlight && "hover:border-primary border-primary"
                                    )}
                                >
                                    <Square className="w-4 h-4 mr-2" />
                                    A: Position Match
                                </Button>
                            )}
                            {settings.selectedTypes.includes("audio") && (
                                <Button
                                    onClick={() => handleResponse("audio")}
                                    variant="outline"
                                    className={cn(
                                        "border-2",
                                        isAudioHighlight && "hover:border-primary border-primary"
                                    )}
                                >
                                    <Volume2
                                        className={cn(
                                            "w-4 h-4 mr-2",
                                            isAudioPlaying && "animate-pulse"
                                        )}
                                    />
                                    L: Sound Match
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
                            <div className="grid grid-cols-2 gap-6">
                                {/* Position Results */}
                                <div className="space-y-3 border-r pr-4">
                                    <h3 className="font-semibold text-primary">Position</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold">
                                            {accuracy.position.correct}/{accuracy.position.total}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {accuracy.position.total > 0 
                                                ? Math.round((accuracy.position.correct / accuracy.position.total) * 100) 
                                                : 0}% Accuracy
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>Missed:</span>
                                            <span>{accuracy.position.missed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>False Alarms:</span>
                                            <span>{accuracy.position.falseAlarms}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Audio Results */}
                                <div className="space-y-3 pl-2">
                                    <h3 className="font-semibold text-primary">Audio</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold">
                                            {accuracy.audio.correct}/{accuracy.audio.total}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {accuracy.audio.total > 0 
                                                ? Math.round((accuracy.audio.correct / accuracy.audio.total) * 100) 
                                                : 0}% Accuracy
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>Missed:</span>
                                            <span>{accuracy.audio.missed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>False Alarms:</span>
                                            <span>{accuracy.audio.falseAlarms}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/40">
                                <div className="text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Overall Performance:</span>
                                        <span className="font-bold">
                                            {Math.round(((accuracy.position.correct + accuracy.audio.correct) / 
                                                (accuracy.position.total + accuracy.audio.total || 1)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        <p>Level: {settings.selectedNBack}-Back • Trials: {currentTrial}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button onClick={startGame} disabled={isLoading}>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Play Again
                            </Button>
                            <Button variant="outline" onClick={shareScore}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
