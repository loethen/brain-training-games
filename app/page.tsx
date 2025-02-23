import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameCard } from "@/components/game-card"
import { GamePreview as SimonGamePreview } from "./games/simonsays/components/GamePreview"
import { GamePreview as SchulteGamePreview } from "./games/schulte_table/components/GamePreview"
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
          <section className="max-w-7xl mx-auto mb-24 p-6 md:p-12 rounded-3xl text-center">
              <div className="">
                  <h1 className="font-outfit text-2xl sm:text-4xl font-bold mb-6 inline-flex flex-wrap items-center justify-center gap-x-4">
                      Free
                      <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                          Focus
                      </span>
                      <span>and</span>
                      <span className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-500 bg-clip-text text-transparent">
                          Concentration
                      </span>
                      Games
                  </h1>
                  <p className="sm:text-xl ">
                      Fun Brain Games to Boost Your Mind Power
                  </p>
              </div>
          </section>

          {/* Games Section */}
          <section className="mb-24 max-w-[1400px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Popular Games</h2>
                  <Button variant="ghost">View All →</Button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
                  <GameCard
                      title="Simon Says"
                      description="Strengthen focus & pattern recognition"
                      slug="simonsays"
                      preview={<SimonGamePreview />}
                  />
                  <GameCard
                      title="Schulte Table"
                      description="Enhance your attention and peripheral vision"
                      slug="schulte_table"
                      preview={<SchulteGamePreview />}
                  />
                  <GameCard
                      title="Glowing Fish Trace"
                      description="Master visual tracking by following glowing fish patterns"
                      slug="fishtrace"
                      preview={<ImagePreview src="/games/fish-trace.png" />}
                  />
                  <GameCard
                      title="Frog Memory Leap"
                      description="Enhance Sequential Memory & Spatial Recall Through Progressive Challenges"
                      slug="frog_memory_leap"
                      preview={<ImagePreview src="/games/frog-path.png" />}
                  />
              </div>
          </section>

          {/* Features Section */}
          <section className="mb-24 max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                  Focus for a Fuller Life
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                  <div className="group relative p-8 bg-gradient-to-b from-background to-muted/5 rounded-2xl border hover:border-primary transition-all">
                      <div className="absolute top-6 right-6 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="lucide lucide-rocket text-primary">
                              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Your Daily Superpower</h3>
                      <div className="text-muted-foreground leading-relaxed">
                          Imagine being able to:
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                              <li>Catch every subtle flavor in your morning coffee</li>
                              <li>Learn guitar chords 2x faster</li>
                              <li>Never miss your kid's soccer game goal</li>
                              <li>Remember family birthdays effortlessly</li>
                              <li>Spot wildlife details on nature walks</li>
                          </ul>
                      </div>
                  </div>

                  <div className="group relative p-8 bg-gradient-to-b from-background to-muted/5 rounded-2xl border hover:border-primary transition-all">
                      <div className="absolute top-6 right-6 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="lucide lucide-sparkles text-primary">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                              <path d="M5 3v4"/>
                              <path d="M19 17v4"/>
                              <path d="M3 5h4"/>
                              <path d="M17 19h4"/>
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Why It Matters</h3>
                      <div className="text-muted-foreground leading-relaxed">
                          Our users tell us:
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                              <li>"Finally finished my novel draft after years"</li>
                              <li>"Can follow complex baking recipes now"</li>
                              <li>"Remember every turn on mountain hikes"</li>
                              <li>"Actually catch plot twists in movies"</li>
                              <li>"Spot my keys in messy rooms instantly"</li>
                          </ul>
                      </div>
                  </div>

                  <div className="group relative p-8 bg-gradient-to-b from-background to-muted/5 rounded-2xl border hover:border-primary transition-all">
                      <div className="absolute top-6 right-6 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="lucide lucide-heart-pulse text-primary">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                              <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Life Upgrade</h3>
                      <div className="text-muted-foreground leading-relaxed">
                          With just 10 mins/day:
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                              <li>83% feel more present with family</li>
                              <li>77% enjoy hobbies more deeply</li>
                              <li>68% report better sleep quality</li>
                              <li>62% improved sports performance</li>
                              <li>55% reduced "where did I put..." moments</li>
                          </ul>
                      </div>
                  </div>
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
