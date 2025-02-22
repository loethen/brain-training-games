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
          <section className="max-w-7xl mx-auto mb-24 p-6 md:p-12 rounded-3xl flex justify-between items-center bg-gradient-to-r from-[#4ADE80] to-[#06B6D4]">
              <div className="w-full md:w-2/3">
                  <h1 className="font-outfit text-2xl sm:text-4xl font-bold mb-6 text-white">
                      Free Focus and Concentration Games
                  </h1>
                  <p className="sm:text-xl text-white">
                      Fun Brain Games to Boost Your Mind Power
                  </p>
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
                      title="Simon Says"
                      description="Strengthen focus & pattern recognition"
                      slug="simonsays"
                      preview={<SimonGamePreview />}
                  />
                  <GameCard
                      title="Schulte Table"
                      description="Enhance your attention and peripheral vision"
                      slug="schulte"
                      preview={<SchulteGamePreview />}
                  />
                  <GameCard
                      title="Glowing Fish Trace"
                      description="Don't Let Them Glow Away!"
                      slug="fishtrace"
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
