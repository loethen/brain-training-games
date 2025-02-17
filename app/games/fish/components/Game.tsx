'use client';

import dynamic from 'next/dynamic'

// 动态导入 Phaser 相关内容
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
        <div className="w-full h-full">
            <GameComponent />
        </div>
    );
} 