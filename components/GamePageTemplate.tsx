import React from 'react';
import { GameHeader } from '@/components/GameHeader';
import GameCategories from '@/components/game-categories';

interface GamePageTemplateProps {
  gameId: string;
  title: string;
  subtitle: string;
  gameComponent: React.ReactNode;
  howToPlay: React.ReactNode;
  benefits?: React.ReactNode;
  faq?: React.ReactNode;
}

export function GamePageTemplate({
  gameId,
  title,
  subtitle,
  gameComponent,
  howToPlay,
  benefits,
  faq
}: GamePageTemplateProps) {
  return (
    <>
      {/* 游戏标题和描述 */}
      <GameHeader title={title} subtitle={subtitle} />

      {/* 游戏组件 */}
      <section className="mb-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8">
        {gameComponent}
      </section>

      {/* 游戏玩法说明 */}
      <section className="max-w-3xl mx-auto mb-16 space-y-6">
        <div className="p-6 rounded-lg bg-muted/50">
          <h3 className="text-xl font-semibold mb-3">🎯 How to Play</h3>
          <div className="space-y-3 text-lg text-muted-foreground">
            {howToPlay}
          </div>
        </div>
      </section>

      {/* 认知益处 - 可选 */}
      {benefits && (
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Cognitive Benefits</h2>
          {benefits}
        </section>
      )}

      {/* FAQ部分 - 可选 */}
      {faq && (
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq}
          </div>
        </section>
      )}

      {/* 训练类别标签 */}
      <section className="mt-16 border-t pt-8">
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground mb-4">
            Training Categories
          </h3>
          <GameCategories gameId={gameId} />
        </div>
      </section>
    </>
  );
} 