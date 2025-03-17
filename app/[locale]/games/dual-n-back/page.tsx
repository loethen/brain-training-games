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
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale, namespace: 'games' });
  
  return {
    title: t('dualNBack.metaTitle'),
    description: t('dualNBack.metaDescription'),
    keywords: t('dualNBack.metaKeywords').split(',').map(keyword => keyword.trim()),
    openGraph: {
      title: t('dualNBack.ogTitle'),
      description: t('dualNBack.ogDescription'),
      images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
  };
}

export default function DualNBackPage() {
  const t = useTranslations('games');
  
  return (
    <GamePageTemplate
      gameId="dual-n-back"
      title={t('dualNBack.title')}
      subtitle={t('dualNBack.subtitle')}
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>{t('dualNBack.howToPlayIntro')}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('dualNBack.howToPlay1')}</li>
            <li>{t('dualNBack.howToPlay2')}</li>
            <li>{t('dualNBack.howToPlay3')}</li>
            <li>{t('dualNBack.howToPlay4')}</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Brain className="w-10 h-10" />,
          title: t('dualNBack.benefits.workingMemory.title'),
          description: t('dualNBack.benefits.workingMemory.description')
        },
        {
          icon: <Layers className="w-10 h-10" />,
          title: t('dualNBack.benefits.fluidIntelligence.title'),
          description: t('dualNBack.benefits.fluidIntelligence.description')
        },
        {
          icon: <Zap className="w-10 h-10" />,
          title: t('dualNBack.benefits.attentionControl.title'),
          description: t('dualNBack.benefits.attentionControl.description')
        }
      ]}
      faq={[
        {
          question: t('dualNBack.faq.science.question'),
          answer: t('dualNBack.faq.science.answer')
        },
        {
          question: t('dualNBack.faq.practice.question'),
          answer: t('dualNBack.faq.practice.answer')
        },
        {
          question: t('dualNBack.faq.challenging.question'),
          answer: t('dualNBack.faq.challenging.answer')
        },
        {
          question: t('dualNBack.faq.improvements.question'),
          answer: t('dualNBack.faq.improvements.answer')
        }
      ]}
      relatedGames={["mahjong-dual-n-back", "block-memory-challenge"]}
    />
  );
} 