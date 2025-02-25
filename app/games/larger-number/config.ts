export const GAME_CONFIG = {
  gameTime: 30000, // 30 seconds total game time
  difficulty: {
    minNumber: 1,
    maxNumber: 100,
    minDifference: 5 // Consistent difficulty throughout
  },
  scoring: {
    correct: 10, // Points per correct answer
    penalty: 0   // No penalty for wrong answers
  },
  challenges: {
    beginner: {
      attempts: 30,
      accuracy: 70,
      message: "Complete 30 attempts with at least 70% accuracy"
    },
    intermediate: {
      attempts: 40,
      accuracy: 80,
      message: "Complete 40 attempts with at least 80% accuracy"
    },
    advanced: {
      attempts: 50,
      accuracy: 90,
      message: "Complete 50 attempts with at least 90% accuracy"
    },
    expert: {
      attempts: 60,
      accuracy: 95,
      message: "Complete 60 attempts with at least 95% accuracy"
    }
  },
  ui: {
    colors: {
      correct: "#4CAF50",
      incorrect: "#F44336",
      neutral: "#2196F3"
    }
  },
  messages: {
    start: "Select the larger number!",
    timeUp: "Time's up!",
    success: "Challenge Completed! 🏆",
    failure: "Challenge Failed! Try again!",
    nextChallenge: "Next Challenge: {message}"
  }
} as const; 