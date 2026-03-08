import { DEFAULT_LEADERBOARD_MODE } from "@/lib/leaderboard-config";

export function getLeaderboardSnapshotPath(
  gameId: string,
  mode: string = DEFAULT_LEADERBOARD_MODE
) {
  return `leaderboards/${gameId}/${mode}.json`;
}

export function getPublicLeaderboardUrl(
  gameId: string,
  mode: string = DEFAULT_LEADERBOARD_MODE
) {
  const baseUrl = process.env["NEXT_PUBLIC_LEADERBOARD_BASE_URL"]?.trim();
  if (!baseUrl) {
    return null;
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  return `${normalizedBaseUrl}/${getLeaderboardSnapshotPath(gameId, mode)}`;
}
