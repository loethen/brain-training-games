import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Game configuration for sorting
// ASC means lower score is better (e.g. milliseconds)
// DESC means higher score is better (e.g. levels, points)
const GAME_CONFIG = {
    "reaction-time": "ASC",
    "cps-test": "DESC",
    "frog-memory-leap": "DESC",
    "fish-trace": "DESC",
} as Record<string, "ASC" | "DESC">;

const ADJECTIVES = ["Focus", "Speedy", "Clever", "Brave", "Swift", "Ninja", "Pro", "Epic", "Turbo", "Cool", "Zen", "Mind"];
const NOUNS = ["Fox", "Owl", "Cat", "Wolf", "Brain", "Hero", "Master", "Star", "Eagle", "Panda", "Tiger", "Bear"];

// Obscured salt for basic anti-tampering (Must match client-side lib/leaderboard.ts)
const SALT = "fFg$9dL2!pQx";

async function verifySignature(gameId: string, score: number, timestamp: number, signature: string): Promise<boolean> {
    const message = `${gameId}:${score}:${timestamp}:${SALT}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return signature === expectedSignature;
}

function generateRandomName() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const id = Math.floor(Math.random() * 9000) + 1000;
    return `${adj}_${noun}_${id}`;
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const gameId = searchParams.get("gameId");

        if (!gameId) {
            return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
        }

        const sortOrder = GAME_CONFIG[gameId] || "DESC";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const env = getCloudflareContext().env as any;

        // Fetch top 20
        const top20Result = await env.DB.prepare(
            `SELECT player_name as playerName, score, created_at as createdAt FROM leaderboard WHERE game_id = ? ORDER BY score ${sortOrder} LIMIT 20`
        ).bind(gameId).all();

        // Fetch aggregate stats
        const statsResult = await env.DB.prepare(
            `SELECT AVG(score) as averageScore, COUNT(id) as totalPlayers FROM leaderboard WHERE game_id = ?`
        ).bind(gameId).first();

        return NextResponse.json({
            top20: top20Result.results,
            averageScore: statsResult?.averageScore || 0,
            totalPlayers: statsResult?.totalPlayers || 0,
        });
    } catch (error) {
        console.error("Leaderboard GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { gameId?: string; score?: number; timestamp?: number; signature?: string };
        const { gameId, score, timestamp, signature } = body;

        if (!gameId || typeof score !== "number" || !timestamp || !signature) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // 1. Timestamp validation (reject if older than 5 minutes or in future)
        const now = Date.now();
        if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
            return NextResponse.json({ error: "Request expired" }, { status: 400 });
        }

        // 2. Verify Cryptographic Signature
        const isValid = await verifySignature(gameId, score, timestamp, signature);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        // 3. Sanity Checks per game (Hard limits for human physiology)
        if (gameId === "cps-test" && score > 35) {
            return NextResponse.json({ error: "Score rejected (Humanly impossible CPS)" }, { status: 400 });
        }
        if (gameId === "reaction-time" && (score < 80 || score > 10000)) {
            return NextResponse.json({ error: "Score rejected (Outside human limits)" }, { status: 400 });
        }
        if (gameId === "frog-memory-leap" && score > 50000) {
            return NextResponse.json({ error: "Score rejected (Score too high)" }, { status: 400 });
        }
        if (gameId === "fish-trace" && score > 50000) {
            return NextResponse.json({ error: "Score rejected" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const env = getCloudflareContext().env as any;
        const playerName = generateRandomName();

        await env.DB.prepare(
            `INSERT INTO leaderboard (game_id, player_name, score) VALUES (?, ?, ?)`
        ).bind(gameId, playerName, score).run();

        return NextResponse.json({ success: true, playerName });
    } catch (error) {
        console.error("Leaderboard POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
