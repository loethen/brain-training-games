import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Eye, Calculator } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import './styles.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'games.countBlocks' });
    
    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        openGraph: {
            title: t('metadata.ogTitle'),
            description: t('metadata.ogDescription'),
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        }
    };
}

export default function CountBlocksPage() {
  const t = useTranslations('games.countBlocks');
  
  return (
      <GamePageTemplate
              gameId="count-blocks"
              title={t('title')}
              subtitle={t('subtitle')}
              gameComponent={<Game />}
              howToPlay={
                  <>
                      <p>
                          {t('howToPlay.intro')}
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>
                              {t('howToPlay.step1')}
                          </li>
                          <li>
                              {t('howToPlay.step2')}
                          </li>
                          <li>
                              {t('howToPlay.step3')}
                          </li>
                          <li>
                              {t('howToPlay.step4')}
                          </li>
                      </ul>
                  </>
              }
              benefits={[
                  {
                      icon: <Brain className="w-10 h-10" />,
                      title: t('benefits.workingMemory.title'),
                      description: t('benefits.workingMemory.description'),
                  },
                  {
                      icon: <Eye className="w-10 h-10" />,
                      title: t('benefits.spatialMemory.title'),
                      description: t('benefits.spatialMemory.description'),
                  },
                  {
                      icon: <Calculator className="w-10 h-10" />,
                      title: t('benefits.counting.title'),
                      description: t('benefits.counting.description'),
                  },
              ]}
              faq={[
                  {
                      question: t('faq.stacking.question'),
                      answer: t('faq.stacking.answer'),
                  },
                  {
                      question: t('faq.difficulty.question'),
                      answer: t('faq.difficulty.answer'),
                  },
                  {
                      question: t('faq.benefits.question'),
                      answer: t('faq.benefits.answer'),
                  },
              ]}
          />
  );
} 