import { Metadata } from 'next'
import { GamePreview } from './components/GamePreview'
import { SchulteGame } from './components/SchulteGame'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "Schulte Table: Boost Attention & Speed Reading | freefocusgames",
    description:
        "Boost your attention and reading speed with the Schulte Table – a free, scientifically proven game to train peripheral vision and focus.",
    keywords:
        "schulte table game, games to improve memory and concentration, free brain games online, brain training memory game, speed reading memory game, free memory game online 2025, schulte table for brain training, improve attention with memory game, memory game for students 2025, top memory games 2025",
    openGraph: {
        title: "Schulte Table: Boost Attention & Speed Reading | freefocusgames",
        description:
            "Boost your attention and reading speed with the Schulte Table – a free, scientifically proven game to train peripheral vision and focus.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function SchultePage() {
  return (
      <div className="max-w-7xl mx-auto">
          <GameHeader
              title="Schulte Table"
              subtitle="Enhance your attention and peripheral vision"
          />

          {/* Game preview and rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <GamePreview />

              <div className="space-y-6">
                  <div className="p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-3">
                          🎯 How to Play
                      </h3>
                      <p className="text-lg text-muted-foreground">
                          Find and click numbers in ascending order (1-25) as
                          quickly as possible. Try to use your peripheral vision
                          instead of scanning each number!
                      </p>
                  </div>

                  <div className="p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-3">
                          💯 Scoring System
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                          <li className="flex gap-2">
                              <span>•</span>
                              <span>Base Score: 1000 points</span>
                          </li>
                          <li className="flex gap-2">
                              <span>•</span>
                              <span>
                                  Time Bonus: Complete faster for more points
                              </span>
                          </li>
                          <li className="flex gap-2">
                              <span>•</span>
                              <span>
                                  Perfect Bonus: +500 points for no mistakes
                              </span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>

          {/* Game component */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl px-8 py-16 mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">
                  Play Schulte Table
              </h2>
              <SchulteGame />
          </section>

          {/* Benefits section */}
          <section className="prose prose-lg mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  Benefits of Schulte Table
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          👁️ Visual Processing
                      </h3>
                      <p>
                          Improve your ability to quickly process visual
                          information and expand your field of vision.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎯 Focus Training
                      </h3>
                      <p>
                          Enhance concentration and attention span through
                          systematic visual search exercises.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          📚 Reading Speed
                      </h3>
                      <p>
                          Develop faster reading skills by training your eyes to
                          capture more information at once.
                      </p>
                  </div>
              </div>
          </section>

          {/* FAQ section */}
          <section className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Schulte Table FAQ</h2>
              <div className="space-y-4">
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How does Schulte Table improve attention?
                      </summary>
                      <p className="mt-2">
                          The Schulte Table trains your brain to process visual
                          information more efficiently by forcing you to
                          maintain focus while using peripheral vision to locate
                          numbers quickly.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          What is the best way to practice?
                      </summary>
                      <p className="mt-2">
                          Try to keep your eyes fixed on the center of the table
                          and use your peripheral vision to spot numbers.
                          Practice daily for 10-15 minutes for best results.
                      </p>
                  </details>
              </div>
          </section>

          {/* Tags section */}
          <section className="mt-16 border-t pt-8">
              <div className="text-center">
                  <h3 className="text-sm text-muted-foreground mb-4">
                      Game Categories
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
                          Attention Training
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
                          Visual Processing
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
                          Speed Reading
                      </span>
                  </div>
              </div>
          </section>
      </div>
  );
}

export const runtime = "edge";
