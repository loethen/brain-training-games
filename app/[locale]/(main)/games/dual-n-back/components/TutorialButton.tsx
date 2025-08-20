'use client';

import { useTranslations } from 'next-intl';
import { analytics } from '@/lib/analytics';

export default function TutorialButton() {
  const t = useTranslations('games.dualNBack.gameUI.tutorial');

  const handleClick = () => {
    // 追踪教程按钮点击事件
    analytics.tutorial.buttonClick({
      game_id: 'dual-n-back',
      source: 'how_to_play_section'
    });
  };

  return (
    <button 
      id="tutorial-trigger-howtoplay"
      className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
      onClick={handleClick}
    >
      🎓 {t('interactiveTutorial')}
    </button>
  );
}