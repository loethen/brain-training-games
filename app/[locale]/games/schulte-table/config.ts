export const GAME_CONFIG = {
  grid: {
    size: 5, // 5x5 网格
    gap: 4,
  },
  messages: {
    start: "Find numbers in sequence, starting from 1",
    success: "Excellent! Time: {time}s",
    newBest: "🎉 New Personal Best!",
    fail: "Keep practicing! You'll get better!",
    perfect: "Perfect! No mistakes! ��"
  }
} as const; 