import { Metadata } from "next";
import { PatternRecallGame } from "./components/PatternRecallGame";
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Grid, Brain, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GamePreview } from "./components/GamePreview"
import { useTranslations } from 'next-intl'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const messages = (await import(`@/messages/${params.locale}.json`)).default
  const game = messages.games.blockMemoryChallenge;
  
  return {
    title: game.metaTitle || game.title,
    description: game.metaDescription || game.description,
    keywords: game.metaKeywords || [
        "block memory game",
        "visual sequence memory",
        "working memory training",
        "cognitive flexibility exercise",
        "attention span improvement",
        "sequence memorization game",
        "visual pattern recognition",
        "short-term memory practice",
    ].join(", "),
    openGraph: {
        title: game.ogTitle || `${game.title} - ${game.subtitle}`,
        description: game.ogDescription || game.description,
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
  }
}

export default function BlockMemoryPage() {
    const t = useTranslations("games.blockMemoryChallenge");
    const benefitsT = useTranslations("games.blockMemoryChallenge.benefits");
    const howToPlayT = useTranslations("games.blockMemoryChallenge.howToPlay");
    const faqT = useTranslations("games.blockMemoryChallenge.faq");

    return (
        <GamePageTemplate
            gameId="block-memory-challenge"
            title={t("title")}
            subtitle={t("subtitle")}
            gameComponent={<PatternRecallGame />}
            howToPlay={
                <>
                    <p>{howToPlayT("intro")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>{howToPlayT("step1")}</li>
                        <li>{howToPlayT("step2")}</li>
                        <li>{howToPlayT("step3")}</li>
                        <li>{howToPlayT("step4")}</li>
                    </ul>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4">{howToPlayT("watchDemo")}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle>{howToPlayT("demo")}</DialogTitle>
                            <GamePreview />
                        </DialogContent>
                    </Dialog>
                </>
            }
            benefits={[
                {
                    icon: <Brain className="w-10 h-10" />,
                    title: benefitsT("workingMemory.title"),
                    description: benefitsT("workingMemory.description")
                },
                {
                    icon: <Eye className="w-10 h-10" />,
                    title: benefitsT("visualProcessing.title"),
                    description: benefitsT("visualProcessing.description")
                },
                {
                    icon: <Grid className="w-10 h-10" />,
                    title: benefitsT("patternRecognition.title"),
                    description: benefitsT("patternRecognition.description")
                }
            ]}
            faq={[
                {
                    question: faqT("dailyLife.question"),
                    answer: faqT("dailyLife.answer")
                },
                {
                    question: faqT("learning.question"),
                    answer: faqT("learning.answer")
                },
                {
                    question: faqT("practice.question"),
                    answer: faqT("practice.answer")
                },
                {
                    question: faqT("children.question"),
                    answer: faqT("children.answer")
                }
            ]}
            relatedGames={["frog-memory-leap"]}
        />
    );
}
