import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Layers, Zap } from 'lucide-react'
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import TutorialButton from './components/TutorialButton';

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
    other: {
      // JSON-LD for enhanced SEO
      'script:ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": t('title'),
        "description": t('metaDescription'),
        "url": `https://freefocusgames.com/${locale}/games/dual-n-back`,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "30-second Interactive Tutorial",
          "Beginner-Friendly Design", 
          "Scientifically-Backed Training",
          "Real-time Feedback",
          "Progressive Difficulty"
        ],
        "educationalUse": "Cognitive Training",
        "learningResourceType": "Interactive Tutorial",
        "interactivityType": "active"
      })
    }
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
          <div className="my-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('gameUI.tutorial.bestLearningMethod')}</p>
                <p className="text-xs text-muted-foreground">{t('gameUI.tutorial.quickMastery')}</p>
              </div>
              <TutorialButton />
            </div>
          </div>
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
      science={{
        title: t('science.title'),
        description: t('science.description'),
        blogArticleUrl: "/blog/the-science-behind-n-back-training-boost-working-memory",
        blogArticleTitle: t('science.blogArticleTitle'),
        authorityLinks: [
          {
            title: "Jaeggi et al. (2008) - PNAS",
            url: "https://www.pnas.org/content/105/19/6829",
            description: t('science.authorityLinks.jaeggi')
          },
          {
            title: "Working Memory - Wikipedia",
            url: "https://en.wikipedia.org/wiki/Working_memory",
            description: t('science.authorityLinks.wikipedia')
          },
          {
            title: "Dual N-Back Task - Cognitive Training Data",
            url: "https://www.cognitivetrainingdata.org/the-dual-n-back-task/",
            description: t('science.authorityLinks.cognitiveTraining')
          }
        ]
      }}
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