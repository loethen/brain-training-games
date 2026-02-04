import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { MousePointer2, Zap, Clock } from 'lucide-react'
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
    const t = await getTranslations({ locale, namespace: 'games.cpsTest' });

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        openGraph: {
            title: t('metadata.ogTitle'),
            description: t('metadata.ogDescription'),
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        },
        alternates: generateAlternates(locale, 'games/cps-test'),
    };
}

export default function CPSTestPage() {
    const t = useTranslations('games.cpsTest');

    return (
        <GamePageTemplate
            gameId="cps-test"
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
                    icon: <Clock className="w-10 h-10" />,
                    title: t('benefits.focus.title'),
                    description: t('benefits.focus.description'),
                },
                {
                    icon: <Zap className="w-10 h-10" />,
                    title: t('benefits.neural.title'),
                    description: t('benefits.neural.description'),
                },
                {
                    icon: <MousePointer2 className="w-10 h-10" />,
                    title: t('benefits.flow.title'),
                    description: t('benefits.flow.description'),
                },
            ]}
            faq={[
                {
                    question: t('faq.focus.question'),
                    answer: t('faq.focus.answer'),
                },
                {
                    question: t('faq.warmup.question'),
                    answer: t('faq.warmup.answer'),
                },
                {
                    question: t('faq.improve.question'),
                    answer: t('faq.improve.answer'),
                },
                {
                    question: t('faq.health.question'),
                    answer: t('faq.health.answer'),
                },
            ]}
        />
    );
}
