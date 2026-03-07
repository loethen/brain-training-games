// Obscured salt for basic anti-tampering
const SALT = "fFg$9dL2!pQx";

async function generateSignature(gameId: string, score: number, timestamp: number): Promise<string> {
    const message = `${gameId}:${score}:${timestamp}:${SALT}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function submitScoreToLeaderboard(gameId: string, score: number) {
    try {
        const timestamp = Date.now();
        const signature = await generateSignature(gameId, score, timestamp);

        const res = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId, score, timestamp, signature }),
        });

        if (res.ok) {
            const data = await res.json() as { playerName: string };
            const event = new CustomEvent('leaderboardUpdated', {
                detail: { gameId, playerName: data.playerName, score }
            });
            window.dispatchEvent(event);
        } else {
            console.error("Score submission rejected:", await res.text());
        }
    } catch (e) {
        console.error("Failed to submit score", e);
    }
}
