DROP INDEX IF EXISTS idx_leaderboard_game_id;
DROP INDEX IF EXISTS idx_leaderboard_game_mode;
DROP INDEX IF EXISTS idx_leaderboard_game_player;

CREATE TABLE leaderboard_compact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    player_id TEXT,
    player_name TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'standard',
    score REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO leaderboard_compact (
    id,
    game_id,
    player_id,
    player_name,
    mode,
    score,
    created_at
)
SELECT
    id,
    game_id,
    player_id,
    player_name,
    mode,
    score,
    created_at
FROM leaderboard;

DROP TABLE leaderboard;
ALTER TABLE leaderboard_compact RENAME TO leaderboard;

CREATE INDEX idx_leaderboard_game_id ON leaderboard(game_id);
CREATE INDEX idx_leaderboard_game_mode ON leaderboard(game_id, mode);
CREATE INDEX idx_leaderboard_game_player ON leaderboard(game_id, player_id);
