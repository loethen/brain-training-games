import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react"
import { GameCard } from "@/components/game-card"

export const metadata: Metadata = {
  title: 'Focus Games | Free Brain Training Games',
  description: 'Improve your concentration with our free focus training games. Perfect for all ages, designed to enhance attention span.',
  keywords: 'focus games, concentration games, brain training, attention games',
}

export default function Home() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="text-center mb-24 pt-10">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
          <h1 className="font-outfit text-5xl sm:text-6xl font-bold mb-6 text-gradient">
            Train Your Focus
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Free brain training games to sharpen your mind
          </p>
          <Button size="lg" className="gap-2">
            <Zap className="w-4 h-4" />
            Start Playing
          </Button>
        </div>
      </section>

      {/* Games Section */}
      <section className="mb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Games</h2>
          <Button variant="ghost">View All →</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            title="Simon Says"
            description="Test your memory and concentration"
            image="/games/simonsays.jpg"
            slug="simonsays"
            difficulty="Easy"
            duration="5 min"
          />
          <GameCard
            title="fish"
            description="Train your attention to detail"
            image="/games/sunfish.jpg"
            slug="fish"
            difficulty="Medium"
            duration="10 min"
          />
          <GameCard
            title="Speed Focus"
            description="Enhance your reaction time"
            image="/games/speed-focus.jpg"
            slug="speed-focus"
            difficulty="Hard"
            duration="15 min"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why Train With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Scientifically Designed",
              description: "Games based on cognitive science principles"
            },
            {
              title: "Progress Tracking",
              description: "Monitor your improvement over time"
            },
            {
              title: "Adaptive Difficulty",
              description: "Games that grow with your skills"
            }
          ].map((feature, i) => (
            <Card key={i} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">About Concentration Games</h2>
        <p className="text-muted-foreground mb-8">
          Our brain training games are designed to improve focus, memory, and cognitive abilities. 
          Just 10-15 minutes of daily practice can help enhance your mental performance.
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
