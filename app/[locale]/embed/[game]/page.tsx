'use client'

import { notFound, redirect } from 'next/navigation'

// 支持的游戏列表
const SUPPORTED_GAMES = [
  'schulte-table',
  'dual-n-back',
  'reaction-time',
  'fish-trace',
  'block-memory-challenge',
  'frog-memory-leap',
  'larger-number',
  'mahjong-dual-n-back'
];

// 游戏标题映射
const getGameTitle = (game: string): string => {
  const titles: Record<string, string> = {
    'schulte-table': '舒尔特表训练',
    'dual-n-back': '双N-Back训练',
    'reaction-time': '反应时间测试',
    'fish-trace': '鱼群追踪',
    'block-memory-challenge': '方块记忆挑战',
    'frog-memory-leap': '青蛙记忆跳跃',
    'larger-number': '数字大小比较',
    'mahjong-dual-n-back': '麻将双N-Back'
  };
  
  return titles[game] || 'Focus Game';
};

// 当前实现的游戏嵌入页面
const IMPLEMENTED_GAMES = [
  'schulte-table'
];

export default function EmbeddedGamePage({ params }: { params: { game: string } }) {
  const { game } = params;
  
  // 检查游戏是否支持
  if (!SUPPORTED_GAMES.includes(game)) {
    notFound();
  }
  
  // 检查是否已实现该游戏的嵌入
  if (IMPLEMENTED_GAMES.includes(game)) {
    // 重定向到专门的嵌入页面
    redirect(`/embed/${game}`);
  }
  
  // 其他游戏暂未实现嵌入
  const gameTitle = getGameTitle(game);
  
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-4">游戏嵌入版本开发中</h2>
      <p>
        <a 
          href={`https://freefocusgames.com/games/${game}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          点击此处访问完整版{gameTitle}
        </a>
      </p>
    </div>
  );
}

export const runtime = 'edge'; 