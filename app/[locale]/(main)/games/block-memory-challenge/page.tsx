import { Metadata } from "next";
import { PatternRecallGame } from "./components/PatternRecallGame";
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Grid, Brain, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GamePreview } from "./components/GamePreview"
import { useTranslations } from 'next-intl'
import { getTranslations } from "next-intl/server";
import { routing } from '@/i18n/routing';

// Generate static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "games.blockMemoryChallenge" });

    return {
        title: t("metaTitle") || t("title"),
        description: t("metaDescription") || t("description"),
        keywords: t("metaKeywords").split(",").map(keyword => keyword.trim()),
        openGraph: {
            title: t("ogTitle") || `${t("title")} - ${t("subtitle")}`,
            description: t("ogDescription") || t("description"),
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
