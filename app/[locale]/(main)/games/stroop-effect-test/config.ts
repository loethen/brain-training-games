export interface ColorConfig {
  name: string;
  value: string;
  key: string;
  keyCode: string;
}

export interface GameConfig {
  colors: ColorConfig[];
  rounds: number;
  timeLimit: number;
  difficulties: {
    easy: { congruentRatio: number };
    medium: { congruentRatio: number };
    hard: { congruentRatio: number };
  };
}

export const COLORS: ColorConfig[] = [
  { name: 'red', value: '#EF4444', key: '1', keyCode: 'Digit1' },
  { name: 'blue', value: '#3B82F6', key: '2', keyCode: 'Digit2' },
  { name: 'green', value: '#10B981', key: '3', keyCode: 'Digit3' },
  { name: 'yellow', value: '#F59E0B', key: '4', keyCode: 'Digit4' },
  { name: 'purple', value: '#8B5CF6', key: '5', keyCode: 'Digit5' },
  { name: 'pink', value: '#EC4899', key: '6', keyCode: 'Digit6' },
];

export const GAME_CONFIG: GameConfig = {
  colors: COLORS,
  rounds: 20,
  timeLimit: 3000, // 3 seconds
  difficulties: {
    easy: { congruentRatio: 0.6 }, // 60% congruent
    medium: { congruentRatio: 0.4 }, // 40% congruent
    hard: { congruentRatio: 0.2 }, // 20% congruent
  },
};

export interface StroopTrial {
  word: string;
  color: string;
  isCongruent: boolean;
  correctAnswer: string;
}

export interface GameResult {
  trial: StroopTrial;
  userAnswer: string;
  reactionTime: number;
  isCorrect: boolean;
}

export enum GameState {
  START = 'start',
  COUNTDOWN = 'countdown',
  PLAYING = 'playing',
  RESULT = 'result',
  SUMMARY = 'summary'
}

export const generateTrial = (colors: ColorConfig[], isCongruent: boolean): StroopTrial => {
  const wordColor = colors[Math.floor(Math.random() * colors.length)];
  const displayColor = isCongruent ? 
    wordColor : 
    colors[Math.floor(Math.random() * colors.length)];
  
  return {
    word: wordColor.name,
    color: displayColor.value,
    isCongruent,
    correctAnswer: displayColor.name,
  };
}; 