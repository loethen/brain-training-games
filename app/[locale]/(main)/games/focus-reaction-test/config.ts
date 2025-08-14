export enum GameState {
  START = 'START',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  TRIAL_FEEDBACK = 'TRIAL_FEEDBACK',
  RESULTS = 'RESULTS'
}

export enum TrialType {
  CONGRUENT = 'CONGRUENT',     // >>>>>, <<<<< - flankers match target
  INCONGRUENT = 'INCONGRUENT', // >><>>, <<><<  - flankers conflict with target
  NEUTRAL = 'NEUTRAL'          // --<--, -->--  - neutral flankers
}

export enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Trial {
  id: number;
  type: TrialType;
  targetDirection: Direction;
  stimuli: ('left' | 'right' | 'neutral')[];
  correctResponse: 'left' | 'right';
  startTime?: number;
  responseTime?: number;
  response?: 'left' | 'right';
  isCorrect?: boolean;
}

export interface GameResult {
  trial: Trial;
  reactionTime: number;
  accuracy: boolean;
}

export const GAME_CONFIG = {
  TOTAL_TRIALS: 20,
  COUNTDOWN_DURATION: 3,
  TRIAL_DURATION: 2000,
  FEEDBACK_DURATION: 500,
  FIXATION_DURATION: 500,
  
  // Trial distribution
  CONGRUENT_RATIO: 0.4,    // 40% congruent trials
  INCONGRUENT_RATIO: 0.4,  // 40% incongruent trials  
  NEUTRAL_RATIO: 0.2,      // 20% neutral trials
  
  // Styling
  ARROW_SIZE: 'text-4xl',
  STIMULI_COLOR: 'text-foreground',
  TARGET_COLOR: 'text-primary',
};

// Stimuli patterns for different trial types
export const STIMULI_PATTERNS: Record<TrialType, Record<Direction, ('left' | 'right' | 'neutral')[]>> = {
  [TrialType.CONGRUENT]: {
    [Direction.LEFT]: ['left', 'left', 'left', 'left', 'left'],
    [Direction.RIGHT]: ['right', 'right', 'right', 'right', 'right']
  },
  [TrialType.INCONGRUENT]: {
    [Direction.LEFT]: ['right', 'right', 'left', 'right', 'right'],
    [Direction.RIGHT]: ['left', 'left', 'right', 'left', 'left']
  },
  [TrialType.NEUTRAL]: {
    [Direction.LEFT]: ['neutral', 'neutral', 'left', 'neutral', 'neutral'],
    [Direction.RIGHT]: ['neutral', 'neutral', 'right', 'neutral', 'neutral']
  }
};

export function generateTrials(): Trial[] {
  const trials: Trial[] = [];
  const totalTrials = GAME_CONFIG.TOTAL_TRIALS;
  
  // Calculate number of each trial type
  const congruentCount = Math.floor(totalTrials * GAME_CONFIG.CONGRUENT_RATIO);
  const incongruentCount = Math.floor(totalTrials * GAME_CONFIG.INCONGRUENT_RATIO);
  const neutralCount = totalTrials - congruentCount - incongruentCount;
  
  console.log('Trial counts:', { totalTrials, congruentCount, incongruentCount, neutralCount });
  
  let trialId = 1;
  
  // Generate congruent trials
  for (let i = 0; i < congruentCount; i++) {
    const direction = Math.random() > 0.5 ? Direction.LEFT : Direction.RIGHT;
    trials.push({
      id: trialId++,
      type: TrialType.CONGRUENT,
      targetDirection: direction,
      stimuli: STIMULI_PATTERNS[TrialType.CONGRUENT][direction],
      correctResponse: direction === Direction.LEFT ? 'left' : 'right'
    });
  }
  
  // Generate incongruent trials  
  for (let i = 0; i < incongruentCount; i++) {
    const direction = Math.random() > 0.5 ? Direction.LEFT : Direction.RIGHT;
    trials.push({
      id: trialId++,
      type: TrialType.INCONGRUENT,
      targetDirection: direction,
      stimuli: STIMULI_PATTERNS[TrialType.INCONGRUENT][direction],
      correctResponse: direction === Direction.LEFT ? 'left' : 'right'
    });
  }
  
  // Generate neutral trials
  for (let i = 0; i < neutralCount; i++) {
    const direction = Math.random() > 0.5 ? Direction.LEFT : Direction.RIGHT;
    trials.push({
      id: trialId++,
      type: TrialType.NEUTRAL,
      targetDirection: direction,
      stimuli: STIMULI_PATTERNS[TrialType.NEUTRAL][direction],
      correctResponse: direction === Direction.LEFT ? 'left' : 'right'
    });
  }
  
  // Shuffle trials
  const shuffledTrials = shuffleArray(trials);
  console.log('Generated trials:', shuffledTrials.length, shuffledTrials);
  return shuffledTrials;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateStats(results: GameResult[]) {
  if (results.length === 0) return null;
  
  const totalTrials = results.length;
  const correctTrials = results.filter(r => r.accuracy).length;
  const accuracy = (correctTrials / totalTrials) * 100;
  
  // Calculate reaction times for correct trials only
  const correctRTs = results
    .filter(r => r.accuracy)
    .map(r => r.reactionTime);
  
  const avgReactionTime = correctRTs.length > 0 
    ? correctRTs.reduce((sum, rt) => sum + rt, 0) / correctRTs.length 
    : 0;
  
  // Calculate stats by trial type
  const congruentTrials = results.filter(r => r.trial.type === TrialType.CONGRUENT);
  const incongruentTrials = results.filter(r => r.trial.type === TrialType.INCONGRUENT);
  
  const congruentRT = congruentTrials
    .filter(r => r.accuracy)
    .map(r => r.reactionTime);
  const incongruentRT = incongruentTrials
    .filter(r => r.accuracy)
    .map(r => r.reactionTime);
  
  const avgCongruentRT = congruentRT.length > 0 
    ? congruentRT.reduce((sum, rt) => sum + rt, 0) / congruentRT.length 
    : 0;
  const avgIncongruentRT = incongruentRT.length > 0 
    ? incongruentRT.reduce((sum, rt) => sum + rt, 0) / incongruentRT.length 
    : 0;
  
  // Flanker effect: difference between incongruent and congruent RTs
  // Ensure it's not negative (can happen with small sample sizes)
  const flankerEffect = Math.max(0, avgIncongruentRT - avgCongruentRT);
  
  return {
    totalTrials,
    accuracy: Math.round(accuracy),
    avgReactionTime: Math.round(avgReactionTime),
    avgCongruentRT: Math.round(avgCongruentRT),
    avgIncongruentRT: Math.round(avgIncongruentRT),
    flankerEffect: Math.round(flankerEffect),
    congruentAccuracy: Math.round((congruentTrials.filter(r => r.accuracy).length / congruentTrials.length) * 100),
    incongruentAccuracy: Math.round((incongruentTrials.filter(r => r.accuracy).length / incongruentTrials.length) * 100)
  };
}