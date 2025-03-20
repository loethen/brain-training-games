import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Layers, Zap } from 'lucide-react'
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

// 将静态元数据改为动态生成函数
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games.dualNBack' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords').split(',').map(keyword => keyword.trim()),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
  };
}

export default function DualNBackPage() {
  const t = useTranslations('games.dualNBack');
  
  return (
    <GamePageTemplate
      gameId="dual-n-back"
      title={t('title')}
      subtitle={t('subtitle')}
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>{t('howToPlayIntro')}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('howToPlay1')}</li>
            <li>{t('howToPlay2')}</li>
            <li>{t('howToPlay3')}</li>
            <li>{t('howToPlay4')}</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Brain className="w-10 h-10" />,
          title: t('benefits.workingMemory.title'),
          description: t('benefits.workingMemory.description')
        },
        {
          icon: <Layers className="w-10 h-10" />,
          title: t('benefits.fluidIntelligence.title'),
          description: t('benefits.fluidIntelligence.description')
        },
        {
          icon: <Zap className="w-10 h-10" />,
          title: t('benefits.attentionControl.title'),
          description: t('benefits.attentionControl.description')
        }
      ]}
      faq={[
        {
          question: t('faq.science.question'),
          answer: t('faq.science.answer')
        },
        {
          question: t('faq.practice.question'),
          answer: t('faq.practice.answer')
        },
        {
          question: t('faq.challenging.question'),
          answer: t('faq.challenging.answer')
        },
        {
          question: t('faq.improvements.question'),
          answer: t('faq.improvements.answer')
        }
      ]}
      relatedGames={["mahjong-dual-n-back", "block-memory-challenge"]}
    />
  );
} 