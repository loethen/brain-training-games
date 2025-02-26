'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { GAME_CONFIG } from '../config';
import { cn } from '@/lib/utils';
import { PlayCircle, Share2, Volume2, Square, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Howl } from 'howler';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"

type GameState = 'idle' | 'playing' | 'complete';
type TrialStimuli = {
  position: number;
  letter: string;
};
type Response = {
  positionMatch: boolean | null;
  audioMatch: boolean | null;
};
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
  voiceType: 'male' | 'female';
  selectedTypes: ('position' | 'audio')[];
};

export default function GameComponent() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [nBackLevel, setNBackLevel] = useState<number>(GAME_CONFIG.difficulty.initialLevel);
    const [currentTrial, setCurrentTrial] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activePosition, setActivePosition] = useState<number | null>(null);
    const [trialHistory, setTrialHistory] = useState<TrialStimuli[]>([]);
    const [results, setResults] = useState<TrialResult[]>([]);
    const [currentResponse, setCurrentResponse] = useState<Response>({
        positionMatch: null,
        audioMatch: null
    });
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [accuracy, setAccuracy] = useState({ position: 0, audio: 0 });
    const [settings, setSettings] = useState<GameSettings>({
        selectedNBack: 1,
        voiceType: 'female',
        selectedTypes: ['position', 'audio']
    });
    
    // Audio references
    const audioRefs = useRef<{[key: string]: Howl}>({});
    
    // Load best score from localStorage
    useEffect(() => {
        // Preload audio files
        const { voiceType } = settings;
        GAME_CONFIG.audio.letters.forEach(letter => {
            audioRefs.current[letter] = new Howl({
                src: [
                    `${GAME_CONFIG.audio.basePath}${GAME_CONFIG.audio.voices[voiceType]}${letter.toLowerCase()}.mp3`
                ]
            });
        });
        
        return () => {
            // Cleanup audio resources
            Object.values(audioRefs.current).forEach(audio => audio.unload());
        };
    }, [settings.voiceType]);

    // End the game
    const endGame = useCallback(() => {
        setGameState('complete');
        
        // Calculate accuracy
        if (results.length > 0) {
            const positionCorrect = results.filter(r => r.isCorrectPositionResponse).length;
            const audioCorrect = results.filter(r => r.isCorrectAudioResponse).length;
            
            setAccuracy({
                position: Math.round((positionCorrect / results.length) * 100),
                audio: Math.round((audioCorrect / results.length) * 100)
            });
        }
    }, [results]);

    // Start a new game
    const startGame = useCallback(() => {
        // Validate that at least one training mode is selected
        if (settings.selectedTypes.length === 0) {
            alert("Please select at least one training mode (Position or Audio)");
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            setGameState('playing');
            setCurrentTrial(0);
            setTrialHistory([]);
            setResults([]);
            setNBackLevel(settings.selectedNBack);
            setActivePosition(null);
            setCurrentResponse({ positionMatch: null, audioMatch: null });
            setShowFeedback(false);
            setFeedbackMessage('');
            setAccuracy({ position: 0, audio: 0 });
            
            // Start the first trial after a delay
            setTimeout(() => {
                startNextTrial();
            }, GAME_CONFIG.trials.startDelay);
            
            setIsLoading(false);
        }, 1000);
    }, [settings.selectedNBack, settings.selectedTypes]);

    // Generate a random trial
    const generateTrial = useCallback((): TrialStimuli => {
        const position = Math.floor(Math.random() * 9); // 0-8 for 3x3 grid
        const letter = GAME_CONFIG.audio.letters[
            Math.floor(Math.random() * GAME_CONFIG.audio.letters.length)
        ];
        
        return { position, letter };
    }, []);

    // Start the next trial
    const startNextTrial = useCallback(() => {
        if (currentTrial >= GAME_CONFIG.trials.perRound) {
            endGame();
            return;
        }
        
        // Generate new stimuli
        const newStimuli = generateTrial();
        
        // Determine if this should be a match (20% chance for each type)
        let positionStimuli = newStimuli.position;
        let letterStimuli = newStimuli.letter;
        
        // If we have enough history and random chance says make a match
        if (trialHistory.length >= nBackLevel) {
            const nBackTrial = trialHistory[trialHistory.length - nBackLevel];
            
            // 20% chance for position match
            if (Math.random() < 0.2) {
                positionStimuli = nBackTrial.position;
            }
            
            // 20% chance for audio match (independent of position)
            if (Math.random() < 0.2) {
                letterStimuli = nBackTrial.letter;
            }
        }
        
        const finalStimuli = { position: positionStimuli, letter: letterStimuli };
        
        // Present the stimuli
        setActivePosition(finalStimuli.position);
        
        // Play the audio
        if (audioRefs.current[finalStimuli.letter]) {
            audioRefs.current[finalStimuli.letter].play();
        }
        
        // Reset response for new trial
        setCurrentResponse({ positionMatch: null, audioMatch: null });
        
        // Add to history
        setTrialHistory(prev => [...prev, finalStimuli]);
        setCurrentTrial(prev => prev + 1);
        
        // Clear the active position after a delay
        setTimeout(() => {
            setActivePosition(null);
            
            // Schedule the next trial if not the last one
            if (currentTrial < GAME_CONFIG.trials.perRound - 1) {
                setTimeout(() => {
                    startNextTrial();
                }, GAME_CONFIG.trials.interval - 1000); // Subtract the display time
            } else {
                // This was the last trial
                setTimeout(() => {
                    endGame();
                }, 1000);
            }
        }, 1000);
    }, [currentTrial, generateTrial, nBackLevel, trialHistory, endGame]);

    // Handle user responses
    const handleResponse = useCallback((type: 'position' | 'audio') => {
        if (gameState !== 'playing' || currentTrial === 0) return;
        
        const updatedResponse = { ...currentResponse };
        
        if (type === 'position') {
            updatedResponse.positionMatch = true;
        } else if (type === 'audio') {
            updatedResponse.audioMatch = true;
        }
        
        setCurrentResponse(updatedResponse);
        
        // Check if this response can be evaluated
        if (trialHistory.length > nBackLevel) {
            const currentStimuli = trialHistory[trialHistory.length - 1];
            const nBackStimuli = trialHistory[trialHistory.length - 1 - nBackLevel];
            
            // Determine if the response was correct
            if (type === 'position') {
                const isPositionMatch = currentStimuli.position === nBackStimuli.position;
                const isCorrect = isPositionMatch === updatedResponse.positionMatch;
                
                // Show immediate feedback
                setShowFeedback(true);
                setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect");
                
                setTimeout(() => {
                    setShowFeedback(false);
                }, 500);
            } else if (type === 'audio') {
                const isAudioMatch = currentStimuli.letter === nBackStimuli.letter;
                const isCorrect = isAudioMatch === updatedResponse.audioMatch;
                
                // Show immediate feedback
                setShowFeedback(true);
                setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect");
                
                setTimeout(() => {
                    setShowFeedback(false);
                }, 500);
            }
        }
        
        // Check if both responses have been made
        if (updatedResponse.positionMatch !== null && updatedResponse.audioMatch !== null) {
            evaluateResponse(updatedResponse);
        }
    }, [gameState, currentTrial, currentResponse, trialHistory, nBackLevel]);

    // Evaluate the user's response
    const evaluateResponse = useCallback((response: Response) => {
        if (trialHistory.length <= nBackLevel) return;
        
        const currentStimuli = trialHistory[trialHistory.length - 1];
        const nBackStimuli = trialHistory[trialHistory.length - 1 - nBackLevel];
        
        const isPositionMatch = currentStimuli.position === nBackStimuli.position;
        const isAudioMatch = currentStimuli.letter === nBackStimuli.letter;
        
        const isCorrect = {
            position: (isPositionMatch && response.positionMatch === true) || 
                      (!isPositionMatch && !response.positionMatch),
            audio: (isAudioMatch && response.audioMatch === true) || 
                   (!isAudioMatch && !response.audioMatch)
        };
        
        const result: TrialResult = {
            stimuli: currentStimuli,
            response,
            isPositionMatch,
            isAudioMatch,
            isCorrectPositionResponse: isCorrect.position,
            isCorrectAudioResponse: isCorrect.audio
        };
        
        setResults(prev => [...prev, result]);
        
        // Show feedback
        setShowFeedback(true);
        setFeedbackMessage(isCorrect.position && isCorrect.audio ? 'Correct!' : 'Incorrect');
        
        setTimeout(() => {
            setShowFeedback(false);
        }, 500);
    }, [nBackLevel, trialHistory]);

    // Share score
    const shareScore = useCallback(() => {
        const text = `I achieved ${accuracy.position}% position and ${accuracy.audio}% audio accuracy in ${nBackLevel}-Back training!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Dual N-Back Score',
                text: text,
                url: window.location.href,
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(text + ' ' + window.location.href)
                .then(() => alert('Score copied to clipboard!'))
                .catch(err => console.error('Error copying text:', err));
        }
    }, [nBackLevel, accuracy]);

    return (
        <div className="container mx-auto p-4">
            {/* Header with game info and settings */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            {settings.selectedTypes.length === 2
                                ? "Dual"
                                : settings.selectedTypes.includes("position")
                                ? "Position"
                                : "Audio"}
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
                            className="capitalize"
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
                        <DropdownMenuContent align="end" className="bg-background p-4 w-64">
                            <div className="space-y-4">
                                {/* 难度级别 - 使用Slider */}
                                <div className="space-y-4">
                                    <Label className="flex justify-between items-center">
                                        <span>Difficulty Level</span>
                                        <span className="text-primary">
                                            {settings.selectedNBack}-Back
                                        </span>
                                    </Label>
                                    <Slider
                                        min={1}
                                        max={4}
                                        step={1}
                                        value={[settings.selectedNBack]}
                                        onValueChange={(value) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                selectedNBack: value[0],
                                            }))
                                        }
                                        disabled={gameState === "playing"}
                                    />
                                </div>
                                <DropdownMenuSeparator />
                                {/* 语音类型 - 单个Switch切换 */}
                                <div className="space-y-2">
                                    <Label className="flex items-center justify-between">
                                        <span>Voice Type</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {settings.voiceType === "male"
                                                    ? "Male"
                                                    : "Female"}
                                            </span>
                                            <Switch
                                                checked={
                                                    settings.voiceType ===
                                                    "male"
                                                }
                                                onCheckedChange={(checked) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        voiceType: checked
                                                            ? "male"
                                                            : "female",
                                                    }))
                                                }
                                                disabled={
                                                    gameState === "playing"
                                                }
                                            />
                                        </div>
                                    </Label>
                                </div>
                                <DropdownMenuSeparator />
                                {/* 训练模式 - 多选使用Checkbox */}
                                <div className="space-y-2">
                                    <Label>Training Mode</Label>
                                    <div className="flex flex-col gap-2">
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
                                                            ? [...settings.selectedTypes, type as "position" | "audio"]
                                                            : settings.selectedTypes.filter((t) => t !== type);
                                                        
                                                        // Prevent removing the last selected type
                                                        if (newTypes.length === 0) {
                                                            return;
                                                        }
                                                        
                                                        setSettings((prev) => ({
                                                            ...prev,
                                                            selectedTypes: newTypes,
                                                        }));
                                                    }}
                                                    disabled={
                                                        gameState === "playing" || 
                                                        (settings.selectedTypes.length === 1 && 
                                                         settings.selectedTypes.includes(type as "position" | "audio"))
                                                    }
                                                />
                                                <Label htmlFor={`mode-${type}`}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main game area */}
            <div className="max-w-md mx-auto">
                {gameState === "idle" ? (
                    <div className="text-center py-8">
                        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">
                                Dual N-Back Challenge
                            </h3>
                            <p className="text-muted-foreground">
                                Track both position and sound from{" "}
                                {settings.selectedNBack} steps back in the
                                sequence.
                            </p>
                            <p className="text-muted-foreground mt-2">
                                Press the buttons when you detect a match with
                                the item {settings.selectedNBack} steps ago.
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

                        {/* 3x3 Grid */}
                        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
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

                        {/* Response buttons */}
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
                                            "bg-success hover:bg-success/90",
                                        showFeedback &&
                                            feedbackMessage === "Incorrect" &&
                                            currentResponse.positionMatch &&
                                            "bg-destructive hover:bg-destructive/90"
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
                                            "bg-success hover:bg-success/90",
                                        showFeedback &&
                                            feedbackMessage === "Incorrect" &&
                                            currentResponse.audioMatch &&
                                            "bg-destructive hover:bg-destructive/90"
                                    )}
                                    disabled={
                                        currentResponse.audioMatch !== null
                                    }
                                >
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Sound Match
                                </Button>
                            )}
                        </div>

                        <div className="mt-6 text-sm text-muted-foreground">
                            Press when you detect a match with the item{" "}
                            {nBackLevel} steps ago
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-bold mb-4">
                            Training Complete!
                        </h2>

                        {/* Results */}
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                            <div className="flex justify-center items-center gap-2 mb-3">
                                <h3 className="font-bold text-lg">
                                    Training Results
                                </h3>
                            </div>
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
                                <div className="text-sm text-muted-foreground mt-6">
                                    Target:{" "}
                                    {GAME_CONFIG.difficulty.targetAccuracy}%
                                    accuracy to advance
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