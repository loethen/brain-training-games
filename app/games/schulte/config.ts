export const GAME_CONFIG = {
  grid: {
    size: 5, // 5x5 grid
    cellSize: 80,
    gap: 8,
    colors: {
      cell: {
        bg: 'bg-white/5',
        hover: 'hover:bg-white/10',
        active: 'bg-primary/20',
        correct: 'bg-green-500/20',
        wrong: 'bg-red-500/20'
      },
      text: {
        default: 'text-foreground',
        highlight: 'text-primary',
        correct: 'text-green-500',
        wrong: 'text-red-500'
      }
    }
  },
  timing: {
    preview: 3000,
    targetTime: 30000, // 30 seconds target time
    bonusThreshold: 25000 // 25 seconds for bonus
  },
  scoring: {
    base: 1000,
    timeMultiplier: 15, // 增加时间奖励
    streakBonus: 150, // 增加连击奖励
    maxStreak: 5,
    perfectBonus: 500 // 新增完美通关奖励
  },
  difficulty: {
    levels: [
      { size: 3, numbers: 9, targetTime: 12000, name: 'Beginner' },
      { size: 4, numbers: 16, targetTime: 20000, name: 'Intermediate' },
      { size: 5, numbers: 25, targetTime: 30000, name: 'Advanced' },
      { size: 6, numbers: 36, targetTime: 40000, name: 'Expert' }
    ]
  },
  messages: {
    start: "Find numbers in sequence, starting from 1",
    success: "Excellent! Time: {time}s",
    newBest: "🎉 New Personal Best!",
    fail: "Keep practicing! You'll get better!",
    levelComplete: "Level {level} - {name} completed!",
    perfect: "Perfect! No mistakes! ��"
  }
} as const; 