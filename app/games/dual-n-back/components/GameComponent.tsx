"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "../config";
import { cn } from "@/lib/utils";
import { PlayCircle, Share2, Volume2, Square, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Howl } from "howler";
import { useInterval } from "@/hooks/useInterval";
import { useTimeout } from "@/hooks/useTimeout";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress"; // Assuming a progress component exists

type GameState = "idle" | "playing" | "complete";
type TrialStimuli = { position: number; letter: string };
type Response = { positionMatch: boolean | null; audioMatch: boolean | null };
type TrialResult = {
    stimuli: TrialStimuli;
    response: Response;
    isPositionMatch: boolean;
    isAudioMatch: boolean;
    isCorrectPositionResponse: boolean;
    isCorrectAudioResponse: boolean;
};
type GameSettings = {
    selectedNBack: number;
    voiceType: "male" | "female";
    selectedTypes: ("position" | "audio")[];
};

export default function GameComponent() {
    const [gameState, setGameState] = useState<GameState>("idle");
    const [nBackLevel, setNBackLevel] = useState<number>(
        GAME_CONFIG.difficulty.initialLevel
    );
    const [currentTrial, setCurrentTrial] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activePosition, setActivePosition] = useState<number | null>(null);
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]);
    const [results, setResults] = useState<TrialResult[]>([]);
    const [currentResponse, setCurrentResponse] = useState<Response>({
        positionMatch: null,
        audioMatch: null,
    });
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [accuracy, setAccuracy] = useState({ position: 0, audio: 0 });
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [intervalDelay, setIntervalDelay] = useState<number | null>(null);
    const [startDelay, setStartDelay] = useState<number | null>(null);

    const [settings, setSettings] = useState<GameSettings>(() => {
        const saved = localStorage.getItem("nBackSettings");
        return saved
            ? JSON.parse(saved)
            : {
                  selectedNBack: 1,
                  voiceType: "female",
                  selectedTypes: ["position", "audio"],
              };
    });

    const audioRefs = useRef<{ [key: string]: Howl }>({});

    useInterval(() => {
        if (currentTrial < GAME_CONFIG.trials.perRound) {
            setActivePosition(null);
            startNextTrial();
        } else {
            endGame();
            setIntervalDelay(null);
        }
    }, intervalDelay);

    useTimeout(() => {
        setGameState("playing");
        setCurrentTrial(0);
        setTrialHistory([]);
        setResults([]);
        setNBackLevel(settings.selectedNBack);
        setActivePosition(null);
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        setShowFeedback(false);
        setAccuracy({ position: 0, audio: 0 });
        setIsLoading(false);
        startNextTrial();
        setStartDelay(null);
    }, startDelay);

    useEffect(() => {
        localStorage.setItem("nBackSettings", JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        GAME_CONFIG.audio.letters.forEach((letter) => {
            audioRefs.current[letter] = new Howl({
                src: [
                    `${GAME_CONFIG.audio.basePath}${
                        GAME_CONFIG.audio.voices[settings.voiceType]
                    }${letter.toLowerCase()}.mp3`,
                ],
                onloaderror: () =>
                    console.error(`Failed to load audio for ${letter}`),
                onplay: () => setIsAudioPlaying(true),
                onend: () => setIsAudioPlaying(false),
            });
        });
        return () =>
            Object.values(audioRefs.current).forEach((audio) => audio.unload());
    }, [settings.voiceType]);

    const endGame = useCallback(() => {
        setIntervalDelay(null);
        setGameState("complete");
        if (results.length > 0) {
            const positionCorrect = results.filter(
                (r) => r.isCorrectPositionResponse
            ).length;
            const audioCorrect = results.filter(
                (r) => r.isCorrectAudioResponse
            ).length;
            setAccuracy({
                position: Math.round((positionCorrect / results.length) * 100),
                audio: Math.round((audioCorrect / results.length) * 100),
            });
        }
    }, [results]);

    const startGame = useCallback(() => {
        if (settings.selectedTypes.length === 0) {
            alert(
                "Please select at least one training mode (Position or Audio)"
            );
            return;
        }
        setIsLoading(true);
        setStartDelay(1000);
    }, [settings.selectedNBack, settings.selectedTypes]);

    const generateTrial = useCallback((): TrialStimuli => {
        const position = Math.floor(Math.random() * 9);
        const letter =
            GAME_CONFIG.audio.letters[
                Math.floor(Math.random() * GAME_CONFIG.audio.letters.length)
            ];
        return { position, letter };
    }, []);

    const startNextTrial = useCallback(() => {
        if (currentTrial >= GAME_CONFIG.trials.perRound) {
            endGame();
            return;
        }

        const newStimuli = generateTrial();
        let positionStimuli = newStimuli.position;
        let letterStimuli = newStimuli.letter;

        if (trialHistory.length >= nBackLevel) {
            const nBackTrial = trialHistory[trialHistory.length - nBackLevel];
            if (Math.random() < 0.2) positionStimuli = nBackTrial.position;
            if (Math.random() < 0.2) letterStimuli = nBackTrial.letter;
        }

        const finalStimuli = {
            position: positionStimuli,
            letter: letterStimuli,
        };
        setActivePosition(finalStimuli.position);
        if (audioRefs.current[finalStimuli.letter])
            audioRefs.current[finalStimuli.letter].play();
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        setTrialHistory((prev) => [...prev.slice(-nBackLevel), finalStimuli]);

        const nextTrialNumber = currentTrial + 1;
        setCurrentTrial(nextTrialNumber);

        setIntervalDelay(GAME_CONFIG.trials.interval);
    }, [currentTrial, generateTrial, nBackLevel, trialHistory, endGame]);

    const handleResponse = useCallback(
        (type: "position" | "audio") => {
            if (gameState !== "playing" || currentTrial === 0) return;
            const updatedResponse = { ...currentResponse };
            if (type === "position") updatedResponse.positionMatch = true;
            else updatedResponse.audioMatch = true;
            setCurrentResponse(updatedResponse);

            const requiredPosition =
                settings.selectedTypes.includes("position");
            const requiredAudio = settings.selectedTypes.includes("audio");
            const shouldEvaluate =
                (requiredPosition && updatedResponse.positionMatch !== null) ||
                (requiredAudio && updatedResponse.audioMatch !== null) ||
                (!requiredPosition && !requiredAudio);
            if (shouldEvaluate) evaluateResponse(updatedResponse);
        },
        [gameState, currentTrial, currentResponse, settings.selectedTypes]
    );

    const evaluateResponse = useCallback(
        (response: Response) => {
            const nBackIndex = trialHistory.length - 1 - nBackLevel;
            if (nBackIndex < 0) return;

            const currentStimuli = trialHistory[trialHistory.length - 1];
            const nBackStimuli = trialHistory[nBackIndex];
            const isPositionMatch =
                currentStimuli.position === nBackStimuli.position;
            const isAudioMatch = currentStimuli.letter === nBackStimuli.letter;

            const isCorrect = {
                position: settings.selectedTypes.includes("position")
                    ? (isPositionMatch && response.positionMatch) ||
                      (!isPositionMatch && !response.positionMatch)
                    : true,
                audio: settings.selectedTypes.includes("audio")
                    ? (isAudioMatch && response.audioMatch) ||
                      (!isAudioMatch && !response.audioMatch)
                    : true,
            };

            const result: TrialResult = {
                stimuli: currentStimuli,
                response,
                isPositionMatch,
                isAudioMatch,
                isCorrectPositionResponse: isCorrect.position,
                isCorrectAudioResponse: isCorrect.audio,
            };
            setResults((prev) => [...prev, result]);

            setShowFeedback(true);
            setFeedbackMessage(
                isCorrect.position && isCorrect.audio ? "Correct!" : "Incorrect"
            );
            setTimeout(() => setShowFeedback(false), 1000);
        },
        [nBackLevel, trialHistory, settings.selectedTypes]
    );

    const shareScore = useCallback(() => {
        const text = `I achieved ${accuracy.position}% position and ${accuracy.audio}% audio accuracy in ${nBackLevel}-Back training!`;
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
    }, [nBackLevel, accuracy]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            {settings.selectedTypes.length === 2
                                ? "Dual"
                                : settings.selectedTypes[0]}
                        </span>
                        <span>•</span>
                        <span className="font-medium">{nBackLevel}-back</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {gameState !== "idle" && (
                        <Badge
                            variant={
                                gameState === "playing"
                                    ? "destructive"
                                    : "outline"
                            }
                        >
                            {gameState}
                        </Badge>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={gameState === "playing"}
                            >
                                <Settings className="h-4 w-4 mr-1" />
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
                                            setSettings((p) => ({
                                                ...p,
                                                selectedNBack: val,
                                            }))
                                        }
                                        disabled={gameState === "playing"}
                                    />
                                </div>
                                <DropdownMenuSeparator />
                                <Label className="flex items-center justify-between">
                                    <span>Voice</span>
                                    <Switch
                                        checked={settings.voiceType === "male"}
                                        onCheckedChange={(checked) =>
                                            setSettings((p) => ({
                                                ...p,
                                                voiceType: checked
                                                    ? "male"
                                                    : "female",
                                            }))
                                        }
                                        disabled={gameState === "playing"}
                                    />
                                </Label>
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
                                                              type as "position" | "audio",
                                                          ]
                                                        : settings.selectedTypes.filter(
                                                              (t) => t !== type
                                                          );
                                                    if (newTypes.length === 0)
                                                        return;
                                                    setSettings((p) => ({
                                                        ...p,
                                                        selectedTypes: newTypes,
                                                    }));
                                                }}
                                                disabled={
                                                    gameState === "playing" ||
                                                    (settings.selectedTypes
                                                        .length === 1 &&
                                                        settings.selectedTypes.includes(
                                                            type as "position" | "audio"
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

            <div className="max-w-md mx-auto">
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
                        {showFeedback && (
                            <div
                                className={cn(
                                    "mb-4 text-lg font-bold animate-fade-in-out",
                                    feedbackMessage === "Correct!"
                                        ? "text-green-500"
                                        : "text-red-500"
                                )}
                            >
                                {feedbackMessage}
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-2 w-[min(80vw,300px)] mx-auto mb-6">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "aspect-square rounded-lg transition-all duration-300",
                                        activePosition === index
                                            ? "bg-primary scale-95"
                                            : "bg-foreground/5 hover:bg-foreground/10"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {settings.selectedTypes.includes("position") && (
                                <Button
                                    onClick={() => handleResponse("position")}
                                    variant={
                                        currentResponse.positionMatch
                                            ? "default"
                                            : "outline"
                                    }
                                    className={cn(
                                        "flex-1",
                                        showFeedback &&
                                            feedbackMessage === "Correct!" &&
                                            currentResponse.positionMatch &&
                                            "bg-success",
                                        showFeedback &&
                                            feedbackMessage === "Incorrect" &&
                                            currentResponse.positionMatch &&
                                            "bg-destructive"
                                    )}
                                    disabled={
                                        currentResponse.positionMatch !== null
                                    }
                                >
                                    <Square className="w-4 h-4 mr-2" />
                                    Position Match
                                </Button>
                            )}
                            {settings.selectedTypes.includes("audio") && (
                                <Button
                                    onClick={() => handleResponse("audio")}
                                    variant={
                                        currentResponse.audioMatch
                                            ? "default"
                                            : "outline"
                                    }
                                    className={cn(
                                        "flex-1",
                                        showFeedback &&
                                            feedbackMessage === "Correct!" &&
                                            currentResponse.audioMatch &&
                                            "bg-success",
                                        showFeedback &&
                                            feedbackMessage === "Incorrect" &&
                                            currentResponse.audioMatch &&
                                            "bg-destructive"
                                    )}
                                    disabled={
                                        currentResponse.audioMatch !== null
                                    }
                                >
                                    <Volume2
                                        className={cn(
                                            "w-4 h-4 mr-2",
                                            isAudioPlaying && "animate-pulse"
                                        )}
                                    />
                                    Sound Match
                                </Button>
                            )}
                        </div>
                        <Progress
                            value={
                                (currentTrial / GAME_CONFIG.trials.perRound) *
                                100
                            }
                            className="mt-4"
                        />
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-bold mb-4">
                            Training Complete!
                        </h2>
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                            <h3 className="font-bold text-lg mb-3">
                                Training Results
                            </h3>
                            <div className="mt-4 text-lg">
                                <div>Level: {nBackLevel}-back</div>
                                <div className="flex justify-between mt-2">
                                    <span>Position Accuracy:</span>
                                    <span
                                        className={cn(
                                            accuracy.position >=
                                                GAME_CONFIG.difficulty
                                                    .targetAccuracy
                                                ? "text-green-500"
                                                : "text-red-500"
                                        )}
                                    >
                                        {accuracy.position}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Audio Accuracy:</span>
                                    <span
                                        className={cn(
                                            accuracy.audio >=
                                                GAME_CONFIG.difficulty
                                                    .targetAccuracy
                                                ? "text-green-500"
                                                : "text-red-500"
                                        )}
                                    >
                                        {accuracy.audio}%
                                    </span>
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
