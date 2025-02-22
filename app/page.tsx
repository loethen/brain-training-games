import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameCard } from "@/components/game-card"
import { GamePreview as SimonGamePreview } from "./games/simonsays/components/GamePreview"
import { GamePreview as SchulteGamePreview } from "./games/schulte/components/GamePreview"
import { ImagePreview } from "@/components/image-preview"

export const metadata: Metadata = {
  title: 'Focus Games | Free Brain Training Games',
  description: 'Improve your concentration with our free focus training games. Perfect for all ages, designed to enhance attention span.',
  keywords: 'focus games, concentration games, brain training, attention games',
}

export default function Home() {
  return (
      <div className="md:py-12">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto mb-24 bg-[#252629] p-20 rounded-3xl flex justify-between items-center">
              <div className="w-1/2">
                  <h1 className="font-outfit text-4xl sm:text-5xl font-bold mb-6 text-white">
                      Free Focus and Concentration Games
                  </h1>
                  <p className="text-xl text-white/80">
                      Fun Brain Games to Boost Your Mind Power
                  </p>
              </div>
              <div>
                  {/* 战术瞄准镜效果 */}
                  <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-64 h-64"
                  >
                      {/* 新增黑色圆形背景 */}
                      <circle 
                          cx="100" 
                          cy="100" 
                          r="85" 
                          fill="#000000"  // 纯黑色
                      />

                      {/* 外环准星 */}
                      <circle 
                          cx="100" 
                          cy="100" 
                          r="80" 
                          fill="none" 
                          stroke="#fff"  // lime-300 颜色
                          strokeWidth="2" 
                          strokeOpacity="0.7"
                          strokeDasharray="4 6"  // 虚线样式
                      >
                          <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0 100 100"
                              to="360 100 100"
                              dur="60s"
                              repeatCount="indefinite"
                          />
                      </circle>

                      {/* 十字准线 */}
                      <line x1="100" y1="20" x2="100" y2="180" stroke="#fff" stroke-width="1" stroke-opacity="0.6"/>
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#fff" stroke-width="1" stroke-opacity="0.6"/>

                      {/* 刻度线 */}
                      <g stroke="#fff" stroke-width="1" stroke-opacity="0.5">
                          <line x1="100" y1="30" x2="100" y2="50"/>
                          <line x1="100" y1="150" x2="100" y2="170"/>
                          <line x1="30" y1="100" x2="50" y2="100"/>
                          <line x1="150" y1="100" x2="170" y2="100"/>
                      </g>

                      {/* 中心红点 */}
                      <circle cx="100" cy="100" r="3" fill="#ef4444">
                          <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0.6;1" dur="1.2s" repeatCount="indefinite" />
                      </circle>

                  </svg>
              </div>
          </section>

          {/* Games Section */}
          <section className="mb-24 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Popular Games</h2>
                  <Button variant="ghost">View All →</Button>
              </div>
              <div className="grid grid-cols-1 gap-20">
                  <GameCard
                      title="Simon's Challenge"
                      description="Strengthen focus & pattern recognition"
                      slug="simonsays"
                      preview={<SimonGamePreview />}
                  />
                  <GameCard
                      title="Speed Focus"
                      description="Train visual perception & processing speed"
                      slug="schulte"
                      preview={<SchulteGamePreview />}
                  />
                  <GameCard
                      title="Spot the Difference"
                      description="Enhance attention to detail"
                      slug="fish"
                      preview={<ImagePreview src="/games/sunfish.jpg" />}
                  />
                  <GameCard
                      title="frog"
                      description="Enhance your reaction time"
                      slug="frog"
                      preview="/games/speed-focus.jpg"
                  />
              </div>
          </section>

          {/* Features Section */}
          <section className="mb-24">
              <h2 className="text-3xl font-bold text-center mb-12">
                  Why Train With Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      {
                          title: "Scientifically Designed",
                          description:
                              "Games based on cognitive science principles",
                      },
                      {
                          title: "Progress Tracking",
                          description: "Monitor your improvement over time",
                      },
                      {
                          title: "Adaptive Difficulty",
                          description: "Games that grow with your skills",
                      },
                  ].map((feature, i) => (
                      <Card key={i} className="transition-all hover:shadow-lg">
                          <CardHeader>
                              <CardTitle>{feature.title}</CardTitle>
                              <CardDescription>
                                  {feature.description}
                              </CardDescription>
                          </CardHeader>
                      </Card>
                  ))}
              </div>
          </section>

          {/* Info Section */}
          <section className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">
                  About Concentration Games
              </h2>
              <p className="text-muted-foreground mb-8">
                  Our brain training games are designed to improve focus,
                  memory, and cognitive abilities. Just 10-15 minutes of daily
                  practice can help enhance your mental performance.
              </p>
              <div className="grid grid-cols-3 gap-8 text-sm">
                  <div className="space-y-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary font-bold">1</span>
                      </div>
                      <p>Choose a game</p>
                  </div>
                  <div className="space-y-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary font-bold">2</span>
                      </div>
                      <p>Practice daily</p>
                  </div>
                  <div className="space-y-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary font-bold">3</span>
                      </div>
                      <p>Track progress</p>
                  </div>
              </div>
          </section>
      </div>
  );
}
