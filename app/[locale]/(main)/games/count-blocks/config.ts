// 完全按照原始HTML的配置
export const GAME_CONFIG = {
  gridSize: 5,        // GRID_SIZE
} as const;

export type GameConfig = typeof GAME_CONFIG; 