export const GAME_CONFIG = {
  trials: {
    perRound: 20, // Number of trials per round
    interval: 3000, // Time between trials in ms
    startDelay: 500, // Delay before first trial
  },
  grid: {
    size: 3, // 3x3 grid
  },
  difficulty: {
    initialLevel: 2, // Start with 1-back
    maxLevel: 10, // Maximum n-back level
    targetAccuracy: 80, // Percentage required to advance
  },
  audio: {
    letters: ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'],
    basePath: '/games/dual-n-back/audio/',
    voices: {
        male: 'male/',
        female: 'female/',
        chinese_female: 'chinese_female/'
    }
  },
  messages: {
    // 这些消息将在GameComponent中通过翻译函数获取
    start: "gameMessages.start",
    levelUp: "gameMessages.levelUp",
    levelDown: "gameMessages.levelDown",
    complete: "gameMessages.complete"
  }
} as const; 