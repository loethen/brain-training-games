// 完全按照原始HTML的配置
export const GAME_CONFIG = {
  gridSize: 5,        // GRID_SIZE
  cubeSize: 50,       // CUBE_SIZE  
  maxHeight: 3,       // MAX_HEIGHT
  observeTime: 3,     // OBSERVE_TIME - 观察时间（秒）
} as const;

export type GameConfig = typeof GAME_CONFIG; 