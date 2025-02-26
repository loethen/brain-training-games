export const GAME_CONFIG = {
  trials: {
    perRound: 15, // Number of trials per round
    interval: 3000, // Time between trials in ms
    startDelay: 2500, // Delay before first trial
  },
  grid: {
    size: 3, // 3x3 grid
  },
  difficulty: {
    initialLevel: 1, // Start with 1-back
    maxLevel: 4, // Maximum n-back level
    targetAccuracy: 80, // Percentage required to advance
  },
  audio: {
    letters: ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'],
    basePath: '/games/dual-n-back/audio/',
    voices: {
        male: 'male/',
        female: 'female/'
    }
  },
  messages: {
    start: "Remember both position and sound from N steps back",
    levelUp: "Great job! Moving to {level}-back",
    levelDown: "Let's try an easier level: {level}-back",
    complete: "Training complete! Position accuracy: {position}%, Audio accuracy: {audio}%"
  }
} as const; 