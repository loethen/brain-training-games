export const GAME_CONFIG = {
  GRID_SIZE: 5,
  CUBE_SIZE: 60,
  DISPLAY_TIME: 3000, // 显示方块的时间（毫秒）
  MIN_BLOCKS: 3,      // 最少方块数
  MAX_BLOCKS: 15,     // 最多方块数
  MAX_STACK_HEIGHT: 3, // 最大堆叠高度
} as const;

export const VISUAL_CONFIG = {
  // CSS 变量定义
  BACKGROUND_COLOR: '#1a1a1a',
  GRID_LINE_COLOR: '#00ffff',
  CUBE_FACE_BG: 'rgba(238, 130, 238, 0.4)',
  CUBE_BORDER_COLOR: '#ee82ee',
  GLOW_COLOR: '#00ffff',
} as const;

export type GamePhase = 'ready' | 'displaying' | 'input' | 'result';

export interface BlockPosition {
  row: number;
  col: number;
  height: number; // 该位置的方块堆叠数量
}

export interface GameState {
  phase: GamePhase;
  level: number;
  score: number;
  totalBlocks: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
  blocks: BlockPosition[];
} 