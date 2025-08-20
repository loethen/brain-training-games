'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Volume2, Square, CheckCircle, XCircle, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { Howl } from "howler";
import { useTranslations, useLocale } from "next-intl";

// 互动教程序列：1-back逻辑，与实际游戏一致
const TUTORIAL_SEQUENCE = [
    {
        position: 4, // 中间位置
        letter: "A",
        isMatch: { position: false, audio: false },
        instructionKey: "step1",
        expectResponse: false
    },
    {
        position: 1, // 左上
        letter: "B", 
        isMatch: { position: false, audio: false },
        instructionKey: "step2",
        expectResponse: false
    },
    {
        position: 1, // 和上一步位置相同
        letter: "C",
        isMatch: { position: true, audio: false },
        instructionKey: "step3",
        expectResponse: true
    },
    {
        position: 7, // 右下
        letter: "C", // 和上一步声音一样
        isMatch: { position: false, audio: true },
        instructionKey: "step4",
        expectResponse: true
    },
    {
        position: 7, // 和上一步位置也相同
        letter: "C", // 和上一步声音也相同
        isMatch: { position: true, audio: true },
        instructionKey: "step5",
        expectResponse: true
    }
];

interface GameDemoProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function GameDemo({ isOpen, onClose, onComplete }: GameDemoProps) {
    const t = useTranslations('games.dualNBack.gameUI.tutorial');
    const locale = useLocale();
    
    const [currentStep, setCurrentStep] = useState(0);
    const [userResponse, setUserResponse] = useState<{ position: boolean; audio: boolean }>({
        position: false,
        audio: false
    });
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isWaitingForUser, setIsWaitingForUser] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    
    const audioRefs = useRef<{ [key: string]: Howl }>({});
    const currentTutorial = TUTORIAL_SEQUENCE[currentStep];

    // 音频配置 - 移到组件外避免依赖问题
    const AUDIO_BASE_PATH = "/games/dual-n-back/audio/";
    const VOICE_TYPE = "female/";

    // 重置教程状态
    const resetTutorial = useCallback(() => {
        setCurrentStep(0);
        setUserResponse({ position: false, audio: false });
        setFeedback(null);
        setIsWaitingForUser(false);
    }, []);

    // 当弹窗打开时重置
    useEffect(() => {
        if (isOpen) {
            resetTutorial();
        }
    }, [isOpen, resetTutorial]);

    // 加载音频文件
    useEffect(() => {
        const currentAudioRefs = audioRefs.current;
        
        // 清除之前的音频引用
        Object.values(currentAudioRefs).forEach((audio) => audio.unload());
        
        // 加载教程需要的字母音频
        const tutorialLetters = ['A', 'B', 'C'];
        tutorialLetters.forEach((letter) => {
            currentAudioRefs[letter] = new Howl({
                src: [`${AUDIO_BASE_PATH}${VOICE_TYPE}${letter.toLowerCase()}.mp3`],
                onplay: () => setIsAudioPlaying(true),
                onend: () => setIsAudioPlaying(false),
                volume: 0.7
            });
        });
        
        return () => Object.values(currentAudioRefs).forEach((audio) => audio.unload());
    }, []); // 空依赖数组，只在组件挂载时加载一次

    // 播放当前步骤的音频
    const playCurrentAudio = useCallback(() => {
        if (currentTutorial && audioRefs.current[currentTutorial.letter]) {
            audioRefs.current[currentTutorial.letter].play();
        }
    }, [currentTutorial]);

    // 进入下一步
    const nextStep = useCallback(() => {
        setUserResponse({ position: false, audio: false });
        setFeedback(null);
        setIsWaitingForUser(false);

        if (currentStep < TUTORIAL_SEQUENCE.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // 教程完成
            onComplete();
            onClose();
        }
    }, [currentStep, onComplete, onClose]);

    // 返回上一步
    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setUserResponse({ position: false, audio: false });
            setFeedback(null);
            setIsWaitingForUser(false);
        }
    }, [currentStep]);

    // 处理用户点击
    const handleUserClick = useCallback((type: 'position' | 'audio') => {
        if (!isWaitingForUser) return;

        const newResponse = { ...userResponse, [type]: true };
        setUserResponse(newResponse);

        // 检查是否正确
        const isCorrect = currentTutorial.isMatch[type];
        
        // 如果点击错误
        if (!isCorrect) {
            setFeedback('incorrect');
            // 错误时给提示后重置
            setTimeout(() => {
                setFeedback(null);
                setUserResponse({ position: false, audio: false });
            }, 1500);
            return;
        }

        // 如果点击正确，检查是否需要点击两个按钮
        const needsBothButtons = currentTutorial.isMatch.position && currentTutorial.isMatch.audio;
        const clickedBothButtons = newResponse.position && newResponse.audio;
        
        if (needsBothButtons && !clickedBothButtons) {
            // 需要两个按钮但还没点完，显示部分正确反馈
            setFeedback('correct');
        } else {
            // 单个按钮任务完成，或者双按钮任务完成
            setFeedback('correct');
        }
    }, [isWaitingForUser, userResponse, currentTutorial]);

    // 初始化当前步骤的状态
    useEffect(() => {
        if (!currentTutorial) return;

        // 重置状态
        setUserResponse({ position: false, audio: false });
        setFeedback(null);
        
        // 如果这一步需要用户响应，设置等待状态
        if (currentTutorial.expectResponse) {
            setIsWaitingForUser(true);
        } else {
            setIsWaitingForUser(false);
        }

        // 延迟播放音频，确保界面更新完成
        const audioTimer = setTimeout(() => {
            playCurrentAudio();
        }, 500);

        return () => clearTimeout(audioTimer);
    }, [currentStep, currentTutorial, playCurrentAudio]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        {t('title')}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium mb-1">📚 {t('whatIsNBack')}</div>
                        <div>{t('nBackExplanation')}</div>
                        <div className="mt-1 text-xs">{t('tutorialNote')}</div>
                    </div>
                </DialogHeader>

                <div className="space-y-3">
                    {/* 进度指示 */}
                    <div className="flex justify-center">
                        <div className="text-sm text-muted-foreground">
                            {t('stepProgress', { current: currentStep + 1, total: TUTORIAL_SEQUENCE.length })}
                        </div>
                    </div>

                    {/* 游戏网格 */}
                    <div className="flex justify-center">
                        <div className="grid grid-cols-3 gap-3 w-40 h-40">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "aspect-square rounded-lg transition-all duration-500 flex items-center justify-center text-lg font-bold",
                                        currentTutorial?.position === index
                                            ? "bg-primary text-white scale-110 shadow-lg"
                                            : "bg-foreground/5"
                                    )}
                                >
                                    {currentTutorial?.position === index && "●"}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 声音指示器 - 紧凑版 */}
                    <div className="flex justify-center items-center gap-2">
                        <Volume2 className={cn(
                            "w-4 h-4",
                            isAudioPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
                        )} />
                        <span className="text-lg font-bold text-primary">
                            {currentTutorial?.letter || "?"}
                        </span>
                        {currentTutorial && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={playCurrentAudio}
                                className="text-xs h-6 px-2"
                                disabled={isAudioPlaying}
                            >
                                {isAudioPlaying ? t('playingAudio') : t('replayAudio')}
                            </Button>
                        )}
                    </div>

                    {/* 指导说明 */}
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm font-medium mb-2">
                            {currentTutorial && t(currentTutorial.instructionKey)}
                        </div>
                        {isWaitingForUser && (
                            <div className="text-xs text-primary animate-pulse">
                                👆 {locale === 'zh' ? '等待你的操作...' : 'Waiting for your action...'}
                            </div>
                        )}
                    </div>

                    {/* 用户操作按钮 */}
                    {isWaitingForUser && (
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={() => handleUserClick('position')}
                                variant={userResponse.position ? "default" : "outline"}
                                className={cn(
                                    "flex items-center gap-2",
                                    feedback === 'correct' && userResponse.position && "bg-green-500 hover:bg-green-600",
                                    feedback === 'incorrect' && userResponse.position && "bg-red-500 hover:bg-red-600"
                                )}
                                disabled={userResponse.position}
                            >
                                <Square className="w-4 h-4" />
                                {t('positionMatch')}
                                {feedback && userResponse.position && (
                                    feedback === 'correct' ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <XCircle className="w-4 h-4" />
                                )}
                            </Button>
                            <Button
                                onClick={() => handleUserClick('audio')}
                                variant={userResponse.audio ? "default" : "outline"}
                                className={cn(
                                    "flex items-center gap-2",
                                    feedback === 'correct' && userResponse.audio && "bg-green-500 hover:bg-green-600",
                                    feedback === 'incorrect' && userResponse.audio && "bg-red-500 hover:bg-red-600"
                                )}
                                disabled={userResponse.audio}
                            >
                                <Volume2 className="w-4 h-4" />
                                {t('audioMatch')}
                                {feedback && userResponse.audio && (
                                    feedback === 'correct' ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <XCircle className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    )}

                    {/* 导航按钮 */}
                    <div className="flex justify-between items-center gap-4">
                        {/* 上一步按钮 */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {t('prevStep')}
                        </Button>

                        {/* 中间提示区域 */}
                        <div className="flex-1 text-center">
                            {currentTutorial && currentTutorial.expectResponse ? (
                                (() => {
                                    const needsBothButtons = currentTutorial.isMatch.position && currentTutorial.isMatch.audio;
                                    const hasCorrectResponses = needsBothButtons 
                                        ? (userResponse.position && userResponse.audio)
                                        : (currentTutorial.isMatch.position ? userResponse.position : userResponse.audio);
                                    
                                    if (needsBothButtons && (userResponse.position || userResponse.audio) && feedback === 'correct' && !hasCorrectResponses) {
                                        return (
                                            <div className="text-xs text-orange-600 font-medium">
                                                {t('needBothButtons')}
                                            </div>
                                        );
                                    }
                                    return null;
                                })()
                            ) : null}
                        </div>

                        {/* 下一步按钮 */}
                        {currentTutorial && !currentTutorial.expectResponse ? (
                            // 观察步骤：直接显示下一步按钮
                            <Button onClick={nextStep} className="flex items-center gap-1">
                                {currentStep === TUTORIAL_SEQUENCE.length - 1 ? t('completeTutorial') : t('nextStep')}
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : currentTutorial && currentTutorial.expectResponse ? (
                            // 操作步骤：检查是否满足进入下一步的条件
                            (() => {
                                const needsBothButtons = currentTutorial.isMatch.position && currentTutorial.isMatch.audio;
                                const hasCorrectResponses = needsBothButtons 
                                    ? (userResponse.position && userResponse.audio)
                                    : (currentTutorial.isMatch.position ? userResponse.position : userResponse.audio);
                                
                                return hasCorrectResponses && feedback === 'correct' ? (
                                    <Button onClick={nextStep} className="flex items-center gap-1">
                                        {currentStep === TUTORIAL_SEQUENCE.length - 1 ? t('completeTutorial') : t('nextStep')}
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled className="flex items-center gap-1">
                                        {currentStep === TUTORIAL_SEQUENCE.length - 1 ? t('completeTutorial') : t('nextStep')}
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                );
                            })()
                        ) : null}
                    </div>


                    {/* 反馈消息 */}
                    {feedback && (
                        <div className={cn(
                            "text-center p-3 rounded-lg",
                            feedback === 'correct' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                            {feedback === 'correct' ? t('correct') : t('incorrect')}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}