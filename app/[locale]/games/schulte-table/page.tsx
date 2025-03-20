import { Metadata } from 'next'
import { SchulteGame } from './components/SchulteGame'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Eye, Brain, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GamePreview } from "./components/GamePreview"
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

// 将静态元数据改为动态生成函数
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games' });
  
  return {
    title: t('schulteTable.metaTitle'),
    description: t('schulteTable.metaDescription'),
    keywords: t('schulteTable.metaKeywords').split(',').map(keyword => keyword.trim()),
    openGraph: {
      title: t('schulteTable.ogTitle'),
      description: t('schulteTable.ogDescription'),
      images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
  };
}

export default function SchultePage() {
  const t = useTranslations('games');
  const benefitsT = useTranslations('games.schulteTable.benefits');
  const faqT = useTranslations('games.schulteTable.faq');
  const standardsT = useTranslations('games.schulteTable.speedStandards');
  
  return (
      <GamePageTemplate
          gameId="schulte-table"
          title={t("schulteTable.title")}
          subtitle={t("schulteTable.subtitle")}
          gameComponent={<SchulteGame />}
          howToPlay={
              <>
                  <p>{t("schulteTable.howToPlay")}</p>
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">{standardsT("title")}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{standardsT("intro")}</p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                          {/* 儿童标准 */}
                          <div className="space-y-1">
                              <p className="text-sm font-medium">{standardsT("children.title")}</p>
                              <ul className="text-sm space-y-1 list-disc pl-5">
                                  <li>{standardsT("children.brilliant")}</li>
                                  <li>{standardsT("children.optimal")}</li>
                                  <li>{standardsT("children.mediocre")}</li>
                              </ul>
                          </div>
                          
                          {/* 成人标准 */}
                          <div className="space-y-1">
                              <p className="text-sm font-medium">{standardsT("adults.title")}</p>
                              <ul className="text-sm space-y-1 list-disc pl-5">
                                  <li>{standardsT("adults.beginner")}</li>
                                  <li>{standardsT("adults.average")}</li>
                                  <li>{standardsT("adults.advanced")}</li>
                                  <li>{standardsT("adults.elite")}</li>
                              </ul>
                          </div>
                      </div>
                  </div>
                  
                  <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="outline" className="mt-4">
                              {t("schulteTable.watchDemo")}
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogTitle>{t("schulteTable.demo")}</DialogTitle>
                          <GamePreview />
                      </DialogContent>
                  </Dialog>
              </>
          }
          benefits={[
              {
                  icon: <Eye className="w-10 h-10" />,
                  title: benefitsT("visualProcessing.title"),
                  description: benefitsT("visualProcessing.description"),
              },
              {
                  icon: <Brain className="w-10 h-10" />,
                  title: benefitsT("focusTraining.title"),
                  description: benefitsT("focusTraining.description"),
              },
              {
                  icon: <BookOpen className="w-10 h-10" />,
                  title: benefitsT("readingSpeed.title"),
                  description: benefitsT("readingSpeed.description"),
              },
          ]}
          faq={[
              {
                  question: faqT("peripheralVision.question"),
                  answer: faqT("peripheralVision.answer"),
              },
              {
                  question: faqT("howItWorks.question"),
                  answer: faqT("howItWorks.answer"),
              },
              {
                  question: faqT("bestPractice.question"),
                  answer: faqT("bestPractice.answer"),
              },
              {
                  question: faqT("readingHelp.question"),
                  answer: faqT("readingHelp.answer"),
              },
              {
                  question: faqT("research.question"),
                  answer: faqT("research.answer"),
              },
          ]}
          relatedGames={["fish-trace", "block-memory-challenge"]}
      />
  );
}

export const runtime = "edge";
