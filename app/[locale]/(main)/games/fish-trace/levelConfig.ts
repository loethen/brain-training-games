// 定义游戏关卡配置
export interface LevelConfig {
  fishCount: number;
  glowingCount: number;
  timeMultiplier: number;
  description: string;
}

// 各个关卡的具体配置
export const LEVEL_CONFIG: LevelConfig[] = [
  {
    fishCount: 6,
    glowingCount: 2,
    timeMultiplier: 1.2,
    description: '入门级'  // 可以根据需要翻译
  },
  {
    fishCount: 8,
    glowingCount: 3,
    timeMultiplier: 1.0,
    description: '初级'
  },
  {
    fishCount: 10,
    glowingCount: 4,
    timeMultiplier: 0.9,
    description: '中级'
  },
  {
    fishCount: 12,
    glowingCount: 5,
    timeMultiplier: 0.8,
    description: '高级'
  },
  {
    fishCount: 15,
    glowingCount: 6,
    timeMultiplier: 0.7,
    description: '专家级'
  }
];

// 默认解锁的最大关卡
export const DEFAULT_MAX_LEVEL = 1;

// 最大可用关卡数
export const MAX_AVAILABLE_LEVELS = LEVEL_CONFIG.length; 