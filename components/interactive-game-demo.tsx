'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// 动态导入GameDemo组件，避免SSR问题
const GameDemo = dynamic(() => import('@/app/[locale]/(main)/games/dual-n-back/components/GameDemo'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading Interactive Tutorial...</p>
      </div>
    </div>
  )
});

interface InteractiveGameDemoProps {
  size?: 'default' | 'compact';
  variant?: 'primary' | 'secondary';
}

export function InteractiveGameDemo({ size = 'default', variant = 'primary' }: InteractiveGameDemoProps) {
  const [isGameDemoOpen, setIsGameDemoOpen] = useState(false);
  const t = useTranslations('blog.interactiveDemo');

  const isCompact = size === 'compact';
  const buttonClass = variant === 'primary'
    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white";

  return (
    <div className={`${isCompact ? 'my-4 p-4' : 'my-8 p-6'} border-2 border-dashed border-primary/20 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20`}>
      <div className="text-center mb-4">
        <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold text-primary mb-2`}>
          🎮 {t('title')}
        </h3>
        {!isCompact && (
          <p className="text-muted-foreground mb-4">
            {t('description')}
          </p>
        )}
        <button
          onClick={() => setIsGameDemoOpen(true)}
          className={`px-6 py-3 ${buttonClass} rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out`}
        >
          🚀 {t('buttonText')}
        </button>
      </div>

      <GameDemo
        isOpen={isGameDemoOpen}
        onClose={() => setIsGameDemoOpen(false)}
        onComplete={() => {
          setIsGameDemoOpen(false);
          // 可以在这里添加完成教程后的逻辑
        }}
      />
    </div>
  );
}