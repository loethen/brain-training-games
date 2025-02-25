import { Metadata } from 'next'
import Game from './components/Game'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "Larger Number Challenge - Number Comparison Training Game",
    description:
        "Improve your numerical processing speed and decision-making with this fast-paced number comparison game. Train your brain to quickly identify larger numbers.",
    keywords: [
        "number comparison game",
        "numerical processing training",
        "decision speed exercise",
        "math brain training",
        "cognitive speed game",
        "number magnitude comparison",
        "reaction time training",
        "educational math game",
    ].join(", "),
    openGraph: {
        title: "Larger Number Challenge - Train Your Numerical Processing Speed",
        description: "Quickly identify which number is larger in this fast-paced brain training game. Improve your decision-making speed and numerical processing.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function LargerNumberPage() {
  return (
      <div className="max-w-7xl mx-auto">
          <GameHeader
              title="Larger Number Challenge"
              subtitle="Boost your numerical processing speed and decision-making"
          />

          {/* Game area */}
          <section className="mb-16">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Game />
              </div>
          </section>

          {/* Game rules explanation */}
          <section className="max-w-3xl mx-auto mb-16 space-y-6">
              <div className="p-6 rounded-lg bg-muted/50">
                  <h3 className="text-xl font-semibold mb-3">
                      🎯 Game Objective
                  </h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      <p>🔢 Quickly identify which of two numbers is larger</p>
                      <p>⏱️ Respond as fast as possible for higher scores</p>
                      <p>🧠 Train numerical magnitude processing</p>
                      <p>📈 Progressive difficulty levels</p>

                      <div className="mt-6 pt-4 border-t border-muted-foreground/20">
                          <p className="font-semibold mb-2">
                              Cognitive Benefits:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                              <li>Improves numerical processing speed</li>
                              <li>Enhances decision-making abilities</li>
                              <li>
                                  Strengthens number sense and magnitude
                                  comparison
                              </li>
                              <li>Develops faster reaction times</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          {/* Features introduction */}
          <section className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  Why Play Larger Number Challenge?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🧮 Number Sense
                      </h3>
                      <p>
                          Strengthen your intuitive understanding of numerical
                          magnitude - a fundamental skill for mathematics
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          ⚡ Processing Speed
                      </h3>
                      <p>
                          Improve how quickly your brain processes and compares
                          numerical information
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎯 Decision Making
                      </h3>
                      <p>
                          Enhance your ability to make quick, accurate decisions
                          under time pressure
                      </p>
                  </div>
              </div>
          </section>

          {/* FAQ section */}
          <section className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Game Benefits FAQ</h2>
              <div className="space-y-4">
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How does number comparison improve math skills?
                      </summary>
                      <p className="mt-2">
                          Number comparison strengthens the brain&apos;s
                          &quot;number sense&quot; - our intuitive understanding
                          of quantity and magnitude. Research shows this
                          fundamental skill correlates strongly with overall
                          mathematical achievement and serves as a foundation
                          for more complex math operations.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          Who can benefit from this training?
                      </summary>
                      <p className="mt-2">
                          This game is beneficial for all ages, from elementary
                          students developing basic number sense to adults
                          maintaining cognitive sharpness. It&apos;s
                          particularly helpful for anyone who needs to make
                          quick numerical decisions, including students,
                          professionals in finance, and those wanting to improve
                          general cognitive processing speed.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How often should I practice for best results?
                      </summary>
                      <p className="mt-2">
                          For optimal improvement, aim for 10-15 minute sessions
                          3-4 times weekly. Consistency is more important than
                          duration, as regular practice helps build and
                          strengthen neural pathways related to numerical
                          processing.
                      </p>
                  </details>
              </div>
          </section>

          {/* Tags section */}
          <section className="mt-16 border-t pt-8">
              <div className="text-center">
                  <h3 className="text-sm text-muted-foreground mb-4">
                      Training Categories
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Number Comparison
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Processing Speed
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Decision Making
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Math Training
                      </span>
                  </div>
              </div>
          </section>
      </div>
  );
} 