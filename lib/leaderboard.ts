const PLAYER_ID_KEY = "freefocusgames.leaderboard.player-id";

export interface LeaderboardSubmissionOptions {
    mode?: string;
    metadata?: Record<string, unknown>;
}

function getLeaderboardPlayerId() {
    const existingId = localStorage.getItem(PLAYER_ID_KEY);
    if (existingId) {
        return existingId;
    }

    const newId = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(PLAYER_ID_KEY, newId);
    return newId;
}

export async function submitScoreToLeaderboard(
    gameId: string,
    score: number,
    options: LeaderboardSubmissionOptions = {}
) {
    try {
        const playerId = getLeaderboardPlayerId();

        const res = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId,
                playerId,
                score,
                mode: options.mode,
                metadata: options.metadata,
            }),
        });

        if (res.ok) {
            const data = await res.json() as { playerName: string };
            const event = new CustomEvent('leaderboardUpdated', {
                detail: {
                    gameId,
                    playerName: data.playerName,
                    score,
                    mode: options.mode,
                    metadata: options.metadata ?? null,
                }
            });
            window.dispatchEvent(event);
        } else {
            console.error("Score submission rejected:", await res.text());
        }
    } catch (e) {
        console.error("Failed to submit score", e);
    }
}
