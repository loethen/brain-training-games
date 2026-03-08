import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
    DEFAULT_LEADERBOARD_MODE,
    LEADERBOARD_GAME_CONFIG,
    type LeaderboardSortConfig,
} from "@/lib/leaderboard-config";

const ADJECTIVES = ["Focus", "Speedy", "Clever", "Brave", "Swift", "Ninja", "Pro", "Epic", "Turbo", "Cool", "Zen", "Mind"];
const NOUNS = ["Fox", "Owl", "Cat", "Wolf", "Brain", "Hero", "Master", "Star", "Eagle", "Panda", "Tiger", "Bear"];

interface LeaderboardMetadata {
    mistakes?: number;
    completionTimeMs?: number;
}

async function getDatabase() {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as Record<string, unknown>)?.DB;

    if (!db) {
        throw new Error("Cloudflare D1 binding 'DB' is not available.");
    }

    return db as {
        prepare: (query: string) => {
            bind: (...values: unknown[]) => {
                all: () => Promise<{ results: Record<string, unknown>[] }>;
                first: () => Promise<Record<string, unknown> | null>;
                run: () => Promise<unknown>;
            };
        };
    };
}

function getSortConfig(gameId: string): LeaderboardSortConfig {
    return LEADERBOARD_GAME_CONFIG[gameId] || { primary: "DESC" };
}

function getOrderByClause(sortConfig: LeaderboardSortConfig) {
    const orderParts = [`score ${sortConfig.primary}`];
    orderParts.push("created_at ASC");
    return orderParts.join(", ");
}

function isValidMode(mode: string) {
    return /^[a-z0-9-]{1,32}$/i.test(mode);
}

function isValidPlayerId(playerId: string) {
    return /^[a-zA-Z0-9_-]{8,64}$/.test(playerId);
}

async function generateStableName(playerId: string) {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(playerId));
    const hashBytes = Array.from(new Uint8Array(hashBuffer));
    const adj = ADJECTIVES[hashBytes[0] % ADJECTIVES.length];
    const noun = NOUNS[hashBytes[1] % NOUNS.length];
    const id = (((hashBytes[2] << 8) + hashBytes[3]) % 9000) + 1000;
    return `${adj}_${noun}_${id}`;
}

function validateScore(
    gameId: string,
    score: number
) {
    if (!Number.isFinite(score)) {
        return "Invalid score";
    }

    switch (gameId) {
        case "cps-test":
            return score > 35 ? "Score rejected (Humanly impossible CPS)" : null;
        case "reaction-time":
            return score < 80 || score > 10000 ? "Score rejected (Outside human limits)" : null;
        case "frog-memory-leap":
        case "fish-trace":
            return score > 50000 ? "Score rejected" : null;
        case "block-memory-challenge":
            if (!Number.isInteger(score) || score < 1 || score > 100) {
                return "Score rejected (Invalid ranked level)";
            }
            return null;
        case "schulte-table":
            if (score < 3000 || score > 180000) {
                return "Score rejected (Outside expected completion range)";
            }
            return null;
        default:
            return null;
    }
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const gameId = searchParams.get("gameId");
        const mode = searchParams.get("mode") || DEFAULT_LEADERBOARD_MODE;

        if (!gameId || !isValidMode(mode)) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }

        const sortConfig = getSortConfig(gameId);
        const orderByClause = getOrderByClause(sortConfig);
        const db = await getDatabase();

        const top20Result = await db.prepare(
            `WITH ranked_scores AS (
                SELECT
                    COALESCE(player_id, player_name) AS player_key,
                    player_name,
                    score,
                    created_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY COALESCE(player_id, player_name)
                        ORDER BY ${orderByClause}
                    ) AS player_rank
                FROM leaderboard
                WHERE game_id = ? AND mode = ?
            )
            SELECT
                player_name AS playerName,
                score,
                created_at AS createdAt
            FROM ranked_scores
            WHERE player_rank = 1
            ORDER BY ${orderByClause}
            LIMIT 20`
        ).bind(gameId, mode).all();

        const statsResult = await db.prepare(
            `WITH ranked_scores AS (
                SELECT
                    COALESCE(player_id, player_name) AS player_key,
                    score,
                    created_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY COALESCE(player_id, player_name)
                        ORDER BY ${orderByClause}
                    ) AS player_rank
                FROM leaderboard
                WHERE game_id = ? AND mode = ?
            )
            SELECT AVG(score) AS averageScore, COUNT(*) AS totalPlayers
            FROM ranked_scores
            WHERE player_rank = 1`
        ).bind(gameId, mode).first();

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
        const body = (await req.json()) as {
            gameId?: string;
            mode?: string;
            playerId?: string;
            score?: number;
        };
        const {
            gameId,
            mode = DEFAULT_LEADERBOARD_MODE,
            playerId,
            score,
        } = body;

        if (!gameId || typeof score !== "number" || !playerId || !isValidPlayerId(playerId) || !isValidMode(mode)) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const validationError = validateScore(gameId, score);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const db = await getDatabase();
        const playerName = await generateStableName(playerId);

        const recentSubmissions = await db.prepare(
            `SELECT COUNT(id) AS submissionCount
             FROM leaderboard
             WHERE game_id = ?
               AND mode = ?
               AND COALESCE(player_id, player_name) = ?
               AND created_at >= datetime('now', '-1 minute')`
        ).bind(gameId, mode, playerId).first();

        if (Number(recentSubmissions?.submissionCount || 0) >= 8) {
            return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
        }

        const duplicateSubmission = await db.prepare(
            `SELECT id
             FROM leaderboard
             WHERE game_id = ?
               AND mode = ?
               AND COALESCE(player_id, player_name) = ?
               AND score = ?
               AND created_at >= datetime('now', '-10 seconds')
             LIMIT 1`
        ).bind(gameId, mode, playerId, score).first();

        if (duplicateSubmission?.id) {
            return NextResponse.json({ error: "Duplicate submission rejected" }, { status: 409 });
        }

        await db.prepare(
            `INSERT INTO leaderboard (
                game_id,
                player_id,
                player_name,
                mode,
                score
            ) VALUES (?, ?, ?, ?, ?)`
        ).bind(gameId, playerId, playerName, mode, score).run();

        return NextResponse.json({ success: true, playerName });
    } catch (error) {
        console.error("Leaderboard POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
