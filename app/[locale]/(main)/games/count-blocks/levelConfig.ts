import { BlockPosition, GAME_CONFIG } from './config';

export interface LevelConfig {
  level: number;
  minBlocks: number;
  maxBlocks: number;
  maxStackHeight: number;
  displayTime: number;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, minBlocks: 3, maxBlocks: 6, maxStackHeight: 1, displayTime: 3000 },
  { level: 2, minBlocks: 4, maxBlocks: 8, maxStackHeight: 2, displayTime: 2800 },
  { level: 3, minBlocks: 6, maxBlocks: 10, maxStackHeight: 2, displayTime: 2600 },
  { level: 4, minBlocks: 8, maxBlocks: 12, maxStackHeight: 3, displayTime: 2400 },
  { level: 5, minBlocks: 10, maxBlocks: 15, maxStackHeight: 3, displayTime: 2200 },
];

export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find(c => c.level === level);
  return config || LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
}

export function generateRandomBlocks(levelConfig: LevelConfig): BlockPosition[] {
  const { minBlocks, maxBlocks, maxStackHeight } = levelConfig;
  const targetBlocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;
  
  const blocks: BlockPosition[] = [];
  const usedPositions = new Set<string>();
  
  let currentBlocks = 0;
  
  while (currentBlocks < targetBlocks) {
    const row = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
    const col = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
    const posKey = `${row}-${col}`;
    
    if (!usedPositions.has(posKey)) {
      // 为这个位置生成随机高度（1-maxStackHeight）
      const height = Math.floor(Math.random() * maxStackHeight) + 1;
      
      // 确保不超过目标方块数
      const actualHeight = Math.min(height, targetBlocks - currentBlocks);
      
      if (actualHeight > 0) {
        blocks.push({ row, col, height: actualHeight });
        usedPositions.add(posKey);
        currentBlocks += actualHeight;
      }
    }
  }
  
  return blocks;
} 