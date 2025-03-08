export const GAME_CONFIG = {
    trials: {
        perRound: 20, // Number of trials per round
        interval: 3000, // Time between trials in ms
        startDelay: 500, // Delay before first trial
    },
    difficulty: {
        initialLevel: 2, // Start with 2-back
        maxLevel: 9, // Maximum n-back level
    },
    symbols: [
        // Basic tiles (using English terminology)
        "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", // Characters
        "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", // Dots
        "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", // Bamboos

        // Honor tiles
        "red", "green", "white", // Dragons
        "east", "south", "west", "north", // Winds

        // Flower tiles
        "spring", "summer", "autumn", "winter", // Seasons
        "plum", "orchid", "bamboo", "chrysanthemum", // Flowers
    ],
    symbolBasePath: "/games/mahjong-dual-n-back/symbols/",
    audio: {
        basePath: "/games/mahjong-dual-n-back/audio/",
        voices: {
            male: "male/",
            female: "female/",
            chinese_female: "chinese_female/",
        },
    },
    messages: {
        start: "Remember both symbol and position from N steps back",
        levelUp: "Great job! Moving to {level}-back",
        levelDown: "Let's try an easier level: {level}-back",
        complete: "Training complete! Symbol accuracy: {symbol}%, Position accuracy: {position}%",
    },
} as const; 