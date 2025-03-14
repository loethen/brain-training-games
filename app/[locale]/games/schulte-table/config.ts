export const GAME_CONFIG = {
  grid: {
    size: 5, // 5x5 网格
    gap: 8,
  },
  timing: {
    targetTime: 30000, // 30秒目标时间
  },
  scoring: {
    base: 1000,
    timeMultiplier: 15
  },
  messages: {
    start: "Find numbers in sequence, starting from 1",
    success: "Excellent! Time: {time}s",
    newBest: "🎉 New Personal Best!",
    fail: "Keep practicing! You'll get better!",
    perfect: "Perfect! No mistakes! ��"
  }
} as const; 