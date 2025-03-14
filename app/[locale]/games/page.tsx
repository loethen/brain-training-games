import { Metadata } from "next";
import { getGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brain Training Games | Improve Focus, Memory & Cognitive Skills",
  description: "Explore our collection of free brain training games designed to enhance cognitive abilities including memory, attention, processing speed and more.",
  keywords: "brain games, cognitive training, memory games, focus games, attention games, brain training, free brain games, mental exercises, cognitive enhancement, brain fitness",
  openGraph: {
    title: "Free Brain Training Games | Improve Your Cognitive Skills",
    description: "Discover scientifically-informed games to enhance your memory, focus, attention, and other cognitive abilities. Train your brain for free.",
    images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
  },
};

export default function GamesPage() {
  const games = getGames();
  
  return (
      <div className="mx-auto">
          <Breadcrumbs items={[{ label: "Games" }]} />

          <h1 className="text-3xl font-bold mt-12 mb-4 text-center">
              Focus Training Games
          </h1>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
              Discover our free focus-enhancing games, crafted to sharpen your
              attention and concentration with fun, targeted challenges.
          </p>

          {/* 类别筛选 */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" size="sm" className="rounded-full">
                  <Filter className="h-4 w-4 mr-2" />
                  All Games
              </Button>

              {categories.slice(0, 6).map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                      <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                      >
                          {category.name}
                      </Button>
                  </Link>
              ))}

              <Link href="/categories">
                  <Button variant="outline" size="sm" className="rounded-full">
                      More Categories...
                  </Button>
              </Link>
          </div>

          {/* 游戏网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game) => (
                  <GameCard key={game.id} game={game} preview={game.preview} />
              ))}
          </div>

          {/* 关于认知训练的信息 */}
          <section className="my-16 p-8 bg-muted rounded-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">
                  About Brain Training
              </h2>
              <div className="space-y-4 text-muted-foreground">
                  <p>
                      Cognitive training, often called brain training, involves
                      regular mental exercises designed to improve specific
                      cognitive functions like memory, attention, processing
                      speed, and problem-solving abilities.
                  </p>
                  <p>
                      Our games are designed based on principles from cognitive
                      psychology and neuroscience. Each game targets specific
                      cognitive skills that are important for everyday
                      functioning, academic success, and professional
                      performance.
                  </p>
                  <p>
                      For best results, we recommend regular practice across
                      different cognitive domains. Training for just 15-20
                      minutes a day, 3-4 times per week can lead to noticeable
                      improvements in your cognitive abilities over time.
                  </p>
              </div>
          </section>

          {/* 推荐训练计划 */}
          <section className="mt-16 mb-16">
              <h2 className="text-2xl font-bold mb-8 text-center">
                  Recommended Training Plans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                      <h3 className="text-xl font-semibold mb-2">
                          Focus Enhancement
                      </h3>
                      <p className="text-muted-foreground mb-4">
                          Improve your ability to concentrate and resist
                          distractions.
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Schulte Table (10 min)</li>
                          <li>Fish Trace (5 min)</li>
                          <li>Larger Number (5 min)</li>
                      </ul>
                  </div>

                  <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                      <h3 className="text-xl font-semibold mb-2">
                          Memory Boost
                      </h3>
                      <p className="text-muted-foreground mb-4">
                          Strengthen your working memory and recall abilities.
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Dual N-Back (10 min)</li>
                          <li>Pattern Recall Challenge (5 min)</li>
                          <li>Frog Memory Leap (5 min)</li>
                      </ul>
                  </div>

                  <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                      <h3 className="text-xl font-semibold mb-2">
                          Cognitive Flexibility
                      </h3>
                      <p className="text-muted-foreground mb-4">
                          Enhance your ability to adapt to changing tasks and
                          rules.
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Mahjong Dual N-Back (10 min)</li>
                          <li>Larger Number (5 min)</li>
                          <li>Schulte Table (5 min)</li>
                      </ul>
                  </div>
              </div>
          </section>
      </div>
  );
} 