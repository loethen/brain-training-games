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
        const body = (await req.json()) as { gameId?: string; score?: number };
        const { gameId, score } = body;

        if (!gameId || typeof score !== "number") {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
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
