export const GAME_CONFIG = {
  gameTime: 30_000, // 30 seconds
  difficulty: {
    minNumber: 10,  // 最小为10（2位数的开始）
    maxNumber: 99,  // 最大为99（2位数的结束）
    minDifference: 5 // 确保数字之间有最小差距
  },
  attempts: 50,
  accuracy: 95
} as const; 