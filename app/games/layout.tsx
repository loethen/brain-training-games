import React from 'react';

interface GamesLayoutProps {
  children: React.ReactNode;
}

export default function GamesLayout({ children }: GamesLayoutProps) {
  return (
    <div className="py-12 max-w-7xl mx-auto">
      {/* 游戏内容将被注入到这里 */}
      {children}
    </div>
  );
} 