import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Target, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { generateAlternates } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'games.stroopEffectTest' });
    
    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        openGraph: {
            title: t('metadata.ogTitle'),
            description: t('metadata.ogDescription'),
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        },
        alternates: generateAlternates(locale, 'games/stroop-effect-test'),
    };
}

export default function StroopEffectTestPage() {
  const t = useTranslations('games.stroopEffectTest');
  
  return (
      <GamePageTemplate
          gameId="stroop-effect-test"
          title={t('title')}
          subtitle={t('subtitle')}
          gameComponent={<Game />}
          howToPlay={
              <>
                  <p>
                      {t('howToPlay.description')}
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
                  title: t('benefits.cognitiveFlexibility.title'),
                  description: t('benefits.cognitiveFlexibility.description'),
              },
              {
                  icon: <Target className="w-10 h-10" />,
                  title: t('benefits.selectiveAttention.title'),
                  description: t('benefits.selectiveAttention.description'),
              },
              {
                  icon: <Zap className="w-10 h-10" />,
                  title: t('benefits.conflictResolution.title'),
                  description: t('benefits.conflictResolution.description'),
              },
          ]}
          faq={[
              {
                  question: t('faq.whatIsStroop.question'),
                  answer: t('faq.whatIsStroop.answer'),
              },
              {
                  question: t('faq.whyDifficult.question'),
                  answer: t('faq.whyDifficult.answer'),
              },
              {
                  question: t('faq.howToImprove.question'),
                  answer: t('faq.howToImprove.answer'),
              },
              {
                  question: t('faq.realWorldApps.question'),
                  answer: t('faq.realWorldApps.answer'),
              },
          ]}
      />
  );
} 