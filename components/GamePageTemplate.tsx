import React from 'react';
import { GameHeader } from '@/components/GameHeader';
import GameCategories from '@/components/game-categories';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface GamePageTemplateProps {
  gameId: string;
  title: string;
  subtitle: string;
  gameComponent: React.ReactNode;
  howToPlay: React.ReactNode;
  benefits?: BenefitItem[];
  faq?: FaqItem[];
}

export function GamePageTemplate({
  gameId,
  title,
  subtitle,
  gameComponent,
  howToPlay,
  benefits,
  faq
}: GamePageTemplateProps) {
  return (
      <>
          <Breadcrumbs items={[
              { label: "Games", href: "/games" },
              { label: title },
          ]} />
          {/* 游戏标题和描述 */}
          <div className="container mx-auto pt-8">
            <GameHeader title={title} subtitle={subtitle} />
          </div>

          {/* 游戏组件 */}
          <section className="mb-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8">
              {gameComponent}
          </section>

          {/* 游戏玩法说明 */}
          <section className="max-w-6xl mx-auto mb-16 space-y-6">
              <div className="p-6 rounded-lg bg-muted/50">
                  <h3 className="text-xl font-semibold mb-3">🎯 How to Play</h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      {howToPlay}
                  </div>
              </div>
          </section>

          {/* 认知益处 - 可选 */}
          {benefits && benefits.length > 0 && (
              <section className="max-w-6xl mx-auto mb-16 py-16">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      Cognitive Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {benefits.map((benefit, index) => (
                          <div
                              key={index}
                              className={cn(
                                  "relative overflow-hidden rounded-xl p-6 border transition-all duration-300",
                                  "hover:shadow-md hover:border-primary/50 hover:-translate-y-1",
                                  "bg-gradient-to-br from-background to-muted/30"
                              )}
                          >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                              <div className="mb-4 text-primary">
                                  {benefit.icon}
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                  {benefit.title}
                              </h3>
                              <p className="text-muted-foreground">
                                  {benefit.description}
                              </p>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          {/* FAQ部分 - 可选 */}
          {faq && faq.length > 0 && (
              <section className="max-w-6xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      Frequently Asked Questions
                  </h2>
                  <Accordion  type="single" collapsible className="max-w-2xl mx-auto">
                      {faq.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                              <AccordionTrigger className="text-lg">
                                  {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground text-lg">
                                  {item.answer}
                              </AccordionContent>
                          </AccordionItem>
                      ))}
                  </Accordion>
              </section>
          )}

          {/* 训练类别标签 */}
          <section className="mt-16 pt-8">
              <div className="text-center">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      Training Categories
                  </h2>
                  <div className="flex justify-center"> 
                      <GameCategories gameId={gameId} />
                  </div>
              </div>
          </section>
      </>
  );
} 