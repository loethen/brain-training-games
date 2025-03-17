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
import GameCard from '@/components/game-card';
import { getGame } from '@/data/games';
import { useTranslations } from 'next-intl';
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
  gameBackground?: string;
  gameId: string;
  title: string;
  subtitle: string;
  gameComponent: React.ReactNode;
  howToPlay: React.ReactNode;
  benefits?: BenefitItem[];
  faq?: FaqItem[];
  relatedGames?: string[];
}

export function GamePageTemplate({
  gameBackground,
  gameId,
  title,
  subtitle,
  gameComponent,
  howToPlay,
  benefits,
  faq,
  relatedGames
}: GamePageTemplateProps) {
  const t = useTranslations('common');
  const gameT = useTranslations('games.template');
  
  return (
      <>
          <Breadcrumbs items={[
              { label: t('games'), href: "/games" },
              { label: title },
          ]} />
          {/* 游戏标题和描述 */}
          <div className="container mx-auto pt-8">
            <GameHeader title={title} subtitle={subtitle} />
          </div>

          {/* 游戏组件 */}
          <section className={cn(
            "mb-16 rounded-xl p-2 md:p-4 border border-border", 
            gameBackground
          )}>
              {gameComponent}
          </section>

          {/* 游戏玩法说明 */}
          <section className="max-w-6xl mx-auto mb-16 space-y-6">
              <div className="p-6 rounded-lg bg-muted/50">
                  <h3 className="text-xl font-semibold mb-3">🎯 {gameT('howToPlay')}</h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      {howToPlay}
                  </div>
              </div>
          </section>

          {/* 认知益处 - 可选 */}
          {benefits && benefits.length > 0 && (
              <section className="max-w-6xl mx-auto mb-16 py-16">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      {gameT('cognitiveBenefits')}
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
                      {gameT('faq')}
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

          {/* 相关游戏推荐 - 可选 */}
          {relatedGames && relatedGames.length > 0 && (
              <section className="max-w-6xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      {gameT('relatedGames')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedGames.map((gameId) => {
                          const game = getGame(gameId);
                          if (!game) return null;
                          
                          return (
                              <GameCard 
                                  key={gameId} 
                                  game={game} 
                                  preview={game.preview}
                              />
                          );
                      })}
                  </div>
              </section>
          )}

          {/* 训练类别标签 */}
          <section className="mt-16 pt-8">
              <div className="text-center">
                  <h2 className="text-3xl font-bold mb-12 text-center">
                      {gameT('trainingCategories')}
                  </h2>
                  <div className="flex justify-center"> 
                      <GameCategories gameId={gameId} />
                  </div>
              </div>
          </section>
      </>
  );
} 