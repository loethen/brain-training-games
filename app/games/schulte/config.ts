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
    timeMultiplier: 10, // Points per second under target time
    streakBonus: 100, // Additional points for consecutive completions
    maxStreak: 5
  },
  difficulty: {
    levels: [
      { size: 3, numbers: 9, targetTime: 15000 },
      { size: 4, numbers: 16, targetTime: 25000 },
      { size: 5, numbers: 25, targetTime: 35000 },
      { size: 6, numbers: 36, targetTime: 45000 }
    ]
  },
  messages: {
    start: "Find numbers in order starting from 1",
    success: "Well done! Time: {time}s",
    newBest: "New best time!",
    fail: "Game Over! Try again!",
    levelComplete: "Level {level} completed!"
  }
} as const; 