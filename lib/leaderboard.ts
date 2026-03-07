export async function submitScoreToLeaderboard(gameId: string, score: number) {
    try {
        const res = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId, score }),
        });
        if (res.ok) {
            const data = await res.json() as { playerName: string };
            const event = new CustomEvent('leaderboardUpdated', {
                detail: { gameId, playerName: data.playerName, score }
            });
            window.dispatchEvent(event);
        }
    } catch (e) {
        console.error("Failed to submit score", e);
    }
}
