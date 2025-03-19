export type DifficultySettings = {
  minNumber: number;
  maxNumber: number;
  minDifference: number;
  attempts: number;
  accuracy: number;
};

export const GAME_CONFIG = {
  gameTime: 30_000, // 30 seconds
  initialDifficulty: {
    minNumber: 10,
    maxNumber: 99, // 限制最大数字为两位数
    minDifference: 2,
    attempts: 40, // 从较小的次数开始
    accuracy: 90  // 初始准确率
  },
  difficultyAdjustment: {
    attemptsIncrement: 5, // 每次成功后增加的尝试次数
    minDifferenceDecrement: 1 // 每次成功后减少的最小差值
  },
  // 计算准确率的函数 - 允许错一个
  calculateRequiredAccuracy: (attempts: number): number => {
    // 允许错一个的准确率计算公式
    return Math.round(((attempts - 1) / attempts) * 100);
  }
} as const; 