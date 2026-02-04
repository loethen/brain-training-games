import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { generateAlternates } from '@/lib/utils'
import { routing } from '@/i18n/routing'

// Generate static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'games.challenge10Seconds' });

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        openGraph: {
            title: t('metadata.ogTitle'),
            description: t('metadata.ogDescription'),
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        },
        alternates: generateAlternates(locale, 'games/challenge-10-seconds'),
    };
}

export default function Challenge10SecondsPage() {
    const t = useTranslations('games.challenge10Seconds');

    return (
        <GamePageTemplate
            gameId="challenge10Seconds"
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
                    icon: <div className="text-4xl mb-2">⏱️</div>,
                    title: t('benefits.perception.title'),
                    description: t('benefits.perception.description')
                },
                {
                    icon: <div className="text-4xl mb-2">🎯</div>,
                    title: t('benefits.anticipation.title'),
                    description: t('benefits.anticipation.description')
                },
                {
                    icon: <div className="text-4xl mb-2">🧠</div>,
                    title: t('benefits.focus.title'),
                    description: t('benefits.focus.description')
                }
            ]}
            science={{
                title: t('science.title'),
                description: t('science.description'),
                blogArticleTitle: t('science.blogArticleTitle'),
                blogArticleUrl: "/blog/10-seconds-challenge-viral-game"
            }}
            faq={[
                {
                    question: t('faq.trick.question'),
                    answer: t('faq.trick.answer'),
                },
                {
                    question: t('faq.impossible.question'),
                    answer: t('faq.impossible.answer'),
                },
                {
                    question: t('faq.latency.question'),
                    answer: t('faq.latency.answer'),
                },
            ]}
        />
    );
}
