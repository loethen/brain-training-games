DROP TABLE IF EXISTS leaderboard;
CREATE TABLE leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    player_id TEXT,
    player_name TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'standard',
    score REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_leaderboard_game_id ON leaderboard(game_id);
CREATE INDEX idx_leaderboard_game_mode ON leaderboard(game_id, mode);
CREATE INDEX idx_leaderboard_game_player ON leaderboard(game_id, player_id);
