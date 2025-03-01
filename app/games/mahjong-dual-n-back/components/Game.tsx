'use client';

import dynamic from 'next/dynamic'

// 动态导入游戏组件以防止SSR问题
const GameComponent = dynamic(() => import('./GameComponent'), {
    ssr: false, // 禁用服务器端渲染
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div>Loading game...</div>
        </div>
    )
});

export default function Game() {
    return (
        <GameComponent />
    );
} 