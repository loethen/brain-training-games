import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "../config";
import { cn } from "@/lib/utils";
import {
    PlayCircle,
    Share2,
    Volume2,
    Settings,
    PauseCircle,
} from "lucide-react";
import { Howl } from "howler";
import { useInterval } from "@/hooks/useInterval";
import { useTimeout } from "@/hooks/useTimeout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
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
// 游戏设置类型
type GameSettings = {
    selectedNBack: number;
    voiceType: "male" | "female";
    selectedTypes: ("position" | "audio")[];
    trialsPerRound: number;
    trialInterval: number;
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

// Define the form schema
const settingsFormSchema = z.object({
    selectedNBack: z.number().min(1).max(4),
    voiceType: z.enum(["male", "female"]),
    selectedTypes: z.array(z.enum(["position", "audio"])).min(1),
    trialsPerRound: z.number().min(10).max(100),
    trialInterval: z.number().min(1000).max(5000),
});

export default function GameComponent() {
    const { settings, updateSettings } = useGameSettings();

    // 原useGameLogic中的状态
    const [gameState, setGameState] = useState<GameState>("idle");
    const [currentTrial, setCurrentTrial] = useState(0); // 当前试验次数
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]); // 试验历史记录
    const [results, setResults] = useState<TrialResult[]>([]); // 所有试验结果存储
    const [currentResponse, setCurrentResponse] = useState<Response>({
        audioMatch: null,
        positionMatch: null,
    }); // 当前用户的响应状态
    const [isAudioHighlight, setIsAudioHighlight] = useState(false);
    const [isPositionHighlight, setIsPositionHighlight] = useState(false);

    // 添加一个状态来存储当前游戏会话的麻将集
    const [sessionMahjong, setSessionMahjong] = useState<string[]>([]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Create the form
    const form = useForm<z.infer<typeof settingsFormSchema>>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: settings,
    });

    // Handle form submission
    const onSubmit = useCallback(
        (values: z.infer<typeof settingsFormSchema>) => {
            updateSettings(() => values);
            setIsSettingsOpen(false);
        },
        [updateSettings]
    );

    // Reset form when dialog opens
    useEffect(() => {
        if (isSettingsOpen) {
            form.reset(settings);
        }
    }, [isSettingsOpen, form, settings]);

    const gameContainerRef = useRef<HTMLDivElement>(null);

    const startGame = useCallback(() => {
        setIsLoading(true);
        setGameState("idle");
        setCurrentTrial(0);
        setTrialHistory([]);
        setResults([]);
        setSlidePosition(0); // 重置滑动位置

        const allMahjong = GAME_CONFIG.symbols;
        
        // 为了保持滑动设计的趣味性，我们需要加载更多的麻将
        // 确保至少有20个麻将用于滑动显示，但不超过可用的总数
        const displayTileCount = GAME_CONFIG.trials.perRound;
        
        // 随机选择不重复的麻将
        const shuffledMahjong = [...allMahjong].sort(() => Math.random() - 0.5);
        const selectedMahjong = shuffledMahjong.slice(0, displayTileCount);

        setSessionMahjong(selectedMahjong);
        setStartDelay(GAME_CONFIG.trials.startDelay);

        setTimeout(() => {
            gameContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 50);
    }, []);

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
                toast("You have already responded to this type");
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

    // 组件本地状态
    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const [activePosition, setActivePosition] = useState<string | null>(null); // 当前激活的位置
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

    // 添加滑动位置状态
    const [slidePosition, setSlidePosition] = useState(0);

    // 定时器钩子：控制试验间隔
    useInterval(() => {
        if (currentTrial < settings.trialsPerRound) {
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
        setAccuracy({
            position: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
            audio: { total: 0, correct: 0, missed: 0, falseAlarms: 0 },
        });
        setIsLoading(false);
        startNextTrial();
        setStartDelay(null);
    }, startDelay);

    // 修改加载音频文件的useEffect
    useEffect(() => {
        // 在 effect 中保存对 audioRefs.current 的引用
        const currentAudioRefs = audioRefs.current;

        // 清除之前的音频引用
        Object.values(currentAudioRefs).forEach((audio) => audio.unload());

        // 只加载本局游戏需要的字母音频
        sessionMahjong.forEach((mahjong) => {
            currentAudioRefs[mahjong] = new Howl({
                src: [
                    `${GAME_CONFIG.audio.basePath}${
                        GAME_CONFIG.audio.voices[settings.voiceType]
                    }${mahjong.toLowerCase()}.mp3`,
                ],
                onplay: () => setIsAudioPlaying(true),
                onend: () => setIsAudioPlaying(false),
            });
        });

        // 使用保存的引用进行清理
        return () =>
            Object.values(currentAudioRefs).forEach((audio) => audio.unload());
    }, [settings.voiceType, sessionMahjong]);

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

            // Check for perfect score and trigger confetti
            const isPerfectScore =
                (positionMatches === 0 ||
                    positionCorrect === positionMatches) &&
                (audioMatches === 0 || audioCorrect === audioMatches) &&
                positionFalseAlarms === 0 &&
                audioFalseAlarms === 0;

            if (isPerfectScore && currentTrial > 5) {
                // Trigger confetti celebration
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

        // Evaluate the previous trial's response if it exists
        if (currentTrial > 0 && trialHistory.length > 0) {
            evaluateResponse(currentResponse);
        }

        // 生成新刺激，有20%概率创建匹配项
        const newStimuli = generateTrial();
        let positionStimuli = newStimuli.position;
        let audioStimuli = newStimuli.audio;

        // 当有足够历史记录时，按概率创建匹配
        if (trialHistory.length >= settings.selectedNBack) {
            const nBackTrial = trialHistory[trialHistory.length - settings.selectedNBack];

            if (settings.selectedTypes.includes("position") && Math.random() < 0.2) {
                positionStimuli = nBackTrial.position;
            }

            if (settings.selectedTypes.includes("audio") && Math.random() < 0.2) {
                audioStimuli = nBackTrial.audio;
            }
        }

        // 最终确定的刺激
        const finalStimuli = {
            position: positionStimuli,
            audio: audioStimuli,
        };

        // 更新界面状态 - 只在需要时显示位置刺激
        if (settings.selectedTypes.includes("position")) {
            setActivePosition(finalStimuli.position);
            
            // 计算滑动位置 - 考虑到麻将宽度和间隙
            // 每个麻将宽度为160px，间隙为48px (gap-12 in Tailwind equals 3rem or 48px)
            const tileWidth = 160;
            const gapWidth = 48;
            const slideAmount = currentTrial * -(tileWidth + gapWidth);
            
            setSlidePosition(slideAmount);
        } else {
            setActivePosition(null);
        }

        // 只在需要时播放音频
        if (
            settings.selectedTypes.includes("audio") &&
            audioRefs.current[finalStimuli.audio]
        ) {
            audioRefs.current[finalStimuli.audio].play(); // 播放音频
        }

        // 重置用户响应状态
        setCurrentResponse({ positionMatch: null, audioMatch: null });

        // 更新试验历史（保留最近N次记录）
        setTrialHistory((prev) => [...prev, finalStimuli]);

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
    ]);

    // 分享游戏分数
    const shareScore = useCallback(() => {
        let text = "";

        if (settings.selectedTypes.length === 2) {
            text = `I achieved ${accuracy.position.correct}/${accuracy.position.total} position and ${accuracy.audio.correct}/${accuracy.audio.total} audio accuracy in ${settings.selectedNBack}-Back training!`;
        } else if (settings.selectedTypes.includes("position")) {
            text = `I achieved ${accuracy.position.correct}/${accuracy.position.total} position accuracy in ${settings.selectedNBack}-Back training!`;
        } else {
            text = `I achieved ${accuracy.audio.correct}/${accuracy.audio.total} audio accuracy in ${settings.selectedNBack}-Back training!`;
        }

        if (navigator.share) {
            navigator
                .share({
                    title: `My ${
                        settings.selectedTypes.length === 2
                            ? "Dual"
                            : settings.selectedTypes[0]
                    } N-Back Score`,
                    text,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            navigator.clipboard
                .writeText(text + " " + window.location.href)
                .then(() => alert("Score copied to clipboard!"));
        }
    }, [settings.selectedNBack, settings.selectedTypes, accuracy]);

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

    // 添加无响应处理 - 在每个试验结束时自动评估
    useEffect(() => {
        if (gameState === "playing" && currentTrial > 0) {
            const timer = setTimeout(() => {
                // Call evaluateResponse with the current response before the next trial
                evaluateResponse(currentResponse);

                const currentStimuli = trialHistory[trialHistory.length - 1];
                const nBackIndex =
                    trialHistory.length - 1 - settings.selectedNBack;
                const nBackStimuli =
                    nBackIndex >= 0 && trialHistory.length > nBackIndex
                        ? trialHistory[nBackIndex]
                        : undefined;

                const isPositionMatch = nBackStimuli
                    ? currentStimuli.position === nBackStimuli.position
                    : false;
                const isAudioMatch = nBackStimuli
                    ? currentStimuli.audio === nBackStimuli.audio
                    : false;

                const autoResponse = { ...currentResponse };

                // 仅当需要响应但未响应时标记为错误
                if (settings.selectedTypes.includes("position")) {
                    if (
                        isPositionMatch &&
                        autoResponse.positionMatch === null
                    ) {
                        autoResponse.positionMatch = false; // 应响应但未响应
                    }
                }

                if (settings.selectedTypes.includes("audio")) {
                    if (isAudioMatch && autoResponse.audioMatch === null) {
                        autoResponse.audioMatch = false; // 应响应但未响应
                    }
                }
            }, settings.trialInterval - 200);

            return () => clearTimeout(timer);
        }
    }, [
        currentTrial,
        currentResponse,
        gameState,
        settings.selectedTypes,
        evaluateResponse,
        trialHistory,
        settings.selectedNBack,
        settings.trialInterval,
    ]);

    return (
        <div
            className="container mx-auto p-4 flex flex-col justify-center"
            ref={gameContainerRef}
            style={{ scrollMarginTop: "90px" }}
        >
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
                                onClick={() => window.location.reload()}
                                variant="outline"
                                size="sm"
                            >
                                Restart
                            </Button>
                        </>
                    )}
                    <Dialog
                        open={isSettingsOpen}
                        onOpenChange={setIsSettingsOpen}
                    >
                        <DialogTrigger asChild>
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
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Game Settings</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="selectedNBack"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="flex items-center justify-between">
                                                    N-Back Level
                                                    <span className="text-sm text-muted-foreground">
                                                        {field.value}-Back
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Slider
                                                        min={1}
                                                        max={
                                                            GAME_CONFIG
                                                                .difficulty
                                                                .maxLevel
                                                        }
                                                        step={1}
                                                        value={[field.value]}
                                                        onValueChange={(vals) =>
                                                            field.onChange(
                                                                vals[0]
                                                            )
                                                        }
                                                        disabled={
                                                            gameState ===
                                                            "playing"
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="voiceType"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>
                                                    Voice Type
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                        className="flex space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="male"
                                                                id="male"
                                                            />
                                                            <Label htmlFor="male">
                                                                Male
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="female"
                                                                id="female"
                                                            />
                                                            <Label htmlFor="female">
                                                                Female
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="selectedTypes"
                                        render={() => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>
                                                    Training Mode
                                                </FormLabel>
                                                <div className="space-y-2">
                                                    {["position", "audio"].map(
                                                        (type) => (
                                                            <div
                                                                key={type}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={`mode-${type}`}
                                                                    checked={form
                                                                        .watch(
                                                                            "selectedTypes"
                                                                        )
                                                                        .includes(
                                                                            type as
                                                                                | "position"
                                                                                | "audio"
                                                                        )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        const currentTypes =
                                                                            form.getValues(
                                                                                "selectedTypes"
                                                                            );
                                                                        const newTypes =
                                                                            checked
                                                                                ? [
                                                                                      ...currentTypes,
                                                                                      type as
                                                                                          | "position"
                                                                                          | "audio",
                                                                                  ]
                                                                                : currentTypes.filter(
                                                                                      (
                                                                                          t
                                                                                      ) =>
                                                                                          t !==
                                                                                          type
                                                                                  );

                                                                        if (
                                                                            newTypes.length ===
                                                                            0
                                                                        ) {
                                                                            toast(
                                                                                "Must keep at least one training mode enabled"
                                                                            );
                                                                            return;
                                                                        }

                                                                        form.setValue(
                                                                            "selectedTypes",
                                                                            newTypes
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        gameState ===
                                                                            "playing" ||
                                                                        (form.watch(
                                                                            "selectedTypes"
                                                                        )
                                                                            .length ===
                                                                            1 &&
                                                                            form
                                                                                .watch(
                                                                                    "selectedTypes"
                                                                                )
                                                                                .includes(
                                                                                    type as
                                                                                        | "position"
                                                                                        | "audio"
                                                                                ))
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`mode-${type}`}
                                                                >
                                                                    {type
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        type.slice(
                                                                            1
                                                                        )}
                                                                </Label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="trialsPerRound"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="flex items-center justify-between">
                                                    Trials Per Round
                                                    <span className="text-sm text-muted-foreground">
                                                        {field.value} trials
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Slider
                                                        min={10}
                                                        max={50}
                                                        step={5}
                                                        value={[field.value]}
                                                        onValueChange={(vals) =>
                                                            field.onChange(
                                                                vals[0]
                                                            )
                                                        }
                                                        disabled={
                                                            gameState ===
                                                            "playing"
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="trialInterval"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="flex items-center justify-between">
                                                    Trial Speed
                                                    <span className="text-sm text-muted-foreground">
                                                        {(
                                                            field.value / 1000
                                                        ).toFixed(1)}
                                                        s
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Slider
                                                        min={1500}
                                                        max={4000}
                                                        step={250}
                                                        value={[field.value]}
                                                        onValueChange={(vals) =>
                                                            field.onChange(
                                                                vals[0]
                                                            )
                                                        }
                                                        disabled={
                                                            gameState ===
                                                            "playing"
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={gameState === "playing"}
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
                {gameState === "idle" ? (
                    <div className="text-center py-8">
                        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">
                                Mahjong Dual N-Back Challenge
                            </h3>
                            <p className="text-muted-foreground">
                                Track {settings.selectedTypes.join(" and ")}{" "}
                                from {settings.selectedNBack} steps back.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <ShimmerButton
                                onClick={startGame}
                                disabled={isLoading}
                            >
                                <span className="flex items-center justify-center text-white">
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    {isLoading
                                        ? "Starting..."
                                        : "Start Challenge"}
                                </span>
                            </ShimmerButton>
                        </div>
                    </div>
                ) : gameState === "playing" ? (
                    <div className="text-center py-6">
                        <div className="text-lg font-medium text-muted-foreground">
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
                                {sessionMahjong.map((mahjong) => (
                                    <div
                                        key={mahjong}
                                        className="flex-shrink-0 flex items-center justify-center"
                                    >
                                        <div
                                            className={cn(
                                                "bg-white rounded-2xl shadow-[6px_6px_0px_#ddd,12px_14px_0px_#10ab3b] w-[160px] aspect-[2/3] flex items-center justify-center relative before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] before:pointer-events-none", // 增加尺寸、阴影和内阴影
                                                activePosition === mahjong &&
                                                    "ring-3 ring-primary" // 增加ring尺寸
                                            )}
                                        >
                                            <Image
                                                src={`${GAME_CONFIG.symbolBasePath}${mahjong}.svg`}
                                                alt={mahjong}
                                                width={120} // 增加图片尺寸
                                                height={180}
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
                                            Position{" "}
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
                                            Sound{" "}
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
                                            Position
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
                                disabled={isLoading}
                                className="rounded-full"
                            >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Play Again
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
    );
}
