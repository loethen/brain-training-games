import { DEFAULT_LEADERBOARD_MODE, LEADERBOARD_GAME_CONFIG } from "@/lib/leaderboard-config";

export interface LeaderboardSnapshotEntry {
  playerId: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface LeaderboardSnapshot {
  version: 1;
  gameId: string;
  mode: string;
  updatedAt: string;
  totalPlayers: number;
  scoreSum: number;
  entries: LeaderboardSnapshotEntry[];
}

export function createEmptySnapshot(
  gameId: string,
  mode: string = DEFAULT_LEADERBOARD_MODE
): LeaderboardSnapshot {
  return {
    version: 1,
    gameId,
    mode,
    updatedAt: new Date().toISOString(),
    totalPlayers: 0,
    scoreSum: 0,
    entries: [],
  };
}

export function getLeaderboardSnapshotKey(gameId: string, mode: string) {
  return `leaderboards/${gameId}/${mode}.json`;
}

export function isHigherScoreBetter(gameId: string) {
  return (LEADERBOARD_GAME_CONFIG[gameId] || { primary: "DESC" }).primary === "DESC";
}

export function isBetterScore(gameId: string, candidate: number, current: number) {
  return isHigherScoreBetter(gameId) ? candidate > current : candidate < current;
}

export function sortSnapshotEntries(gameId: string, entries: LeaderboardSnapshotEntry[]) {
  const direction = isHigherScoreBetter(gameId) ? -1 : 1;

  return [...entries].sort((a, b) => {
    if (a.score !== b.score) {
      return (a.score - b.score) * direction;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function updateSnapshotWithScore(
  snapshot: LeaderboardSnapshot,
  entry: LeaderboardSnapshotEntry,
  options: {
    isFirstPlayer: boolean;
    previousBestScore: number | null;
  }
) {
  const isImprovedBest =
    options.previousBestScore !== null &&
    isBetterScore(snapshot.gameId, entry.score, options.previousBestScore);

  if (!options.isFirstPlayer && !isImprovedBest) {
    return snapshot;
  }

  const nextSnapshot: LeaderboardSnapshot = {
    ...snapshot,
    updatedAt: new Date().toISOString(),
    totalPlayers: options.isFirstPlayer ? snapshot.totalPlayers + 1 : snapshot.totalPlayers,
    scoreSum: snapshot.scoreSum,
    entries: [...snapshot.entries],
  };

  if (options.isFirstPlayer) {
    nextSnapshot.scoreSum += entry.score;
  } else if (options.previousBestScore !== null) {
    nextSnapshot.scoreSum += entry.score - options.previousBestScore;
  }

  const existingIndex = nextSnapshot.entries.findIndex(
    (currentEntry) => currentEntry.playerId === entry.playerId
  );

  if (existingIndex >= 0) {
    const existingEntry = nextSnapshot.entries[existingIndex];
    if (isBetterScore(snapshot.gameId, entry.score, existingEntry.score)) {
      nextSnapshot.entries[existingIndex] = entry;
    }
  } else {
    nextSnapshot.entries.push(entry);
  }

  nextSnapshot.entries = sortSnapshotEntries(snapshot.gameId, nextSnapshot.entries).slice(0, 20);
  return nextSnapshot;
}
