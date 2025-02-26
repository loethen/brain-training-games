import { Metadata } from 'next'
import Game from './components/Game'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "Dual N-Back - Working Memory & Fluid Intelligence Training",
    description:
        "Challenge your working memory and fluid intelligence with the Dual N-Back task. Track both visual and auditory stimuli to improve cognitive performance and attention control.",
    keywords: [
        "dual n-back training",
        "working memory exercise",
        "fluid intelligence game",
        "cognitive training",
        "brain training game",
        "attention control practice",
        "n-back task",
        "memory improvement game",
    ].join(", "),
    openGraph: {
        title: "Dual N-Back - Advanced Working Memory Training",
        description: "Train your working memory and fluid intelligence with the scientifically-backed Dual N-Back cognitive exercise.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function DualNBackPage() {
  return (
      <div className="max-w-7xl mx-auto">
          <GameHeader
              title="Dual N-Back Challenge"
              subtitle="Train working memory and fluid intelligence with this advanced cognitive exercise"
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
                      🎯 How to Play
                  </h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      <p>1. You&apos;ll see squares light up in a grid and hear letters</p>
                      <p>2. Your task is to identify when the current position or sound matches what appeared N steps back</p>
                      <p>3. Press &quot;Position Match&quot; when the position matches N steps back</p>
                      <p>4. Press &quot;Sound Match&quot; when the letter matches N steps back</p>
                      <p>5. As you improve, the N value increases, making the task more challenging</p>

                      <div className="mt-6 pt-4 border-t border-muted-foreground/20">
                          <p className="font-semibold mb-2">
                              Cognitive Benefits:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                              <li>Strengthens working memory capacity</li>
                              <li>Improves fluid intelligence</li>
                              <li>Enhances attention control</li>
                              <li>Develops multitasking abilities</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          {/* Features introduction */}
          <section className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  Why Train with Dual N-Back?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🧠 Working Memory
                      </h3>
                      <p>
                          Strengthen your ability to temporarily hold and manipulate information - essential for problem-solving and learning
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          💡 Fluid Intelligence
                      </h3>
                      <p>
                          Research suggests regular Dual N-Back training may improve your ability to reason and solve novel problems
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎯 Attention Control
                      </h3>
                      <p>
                          Develop superior focus by training your brain to maintain and manipulate multiple pieces of information simultaneously
                      </p>
                  </div>
              </div>
          </section>

          {/* Scientific background */}
          <section className="max-w-3xl mx-auto mb-16 bg-muted/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Scientific Background</h2>
              <p className="mb-4">
                  The Dual N-Back task was popularized by a 2008 study published in the Proceedings of the National Academy of Sciences, which suggested it could improve fluid intelligence - a finding that generated significant interest in the scientific community.
              </p>
              <p>
                  While subsequent research has shown mixed results regarding far transfer effects (improvements in general intelligence), there is strong evidence that regular practice leads to improvements in working memory capacity and attention control.
              </p>
          </section>

          {/* FAQ section */}
          <section className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How often should I practice Dual N-Back?
                      </summary>
                      <p className="mt-2">
                          For optimal results, research suggests practicing 20-30 minutes per day, 4-5 days per week. Consistency is more important than duration, as regular practice helps build and strengthen neural pathways related to working memory.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How quickly will I see improvements?
                      </summary>
                      <p className="mt-2">
                          Most users notice improvements in their Dual N-Back performance within 1-2 weeks of consistent practice. However, transfer effects to other cognitive tasks may take longer to develop, typically 3-4 weeks of regular training.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          What makes Dual N-Back more effective than other memory games?
                      </summary>
                      <p className="mt-2">
                          The Dual N-Back is particularly challenging because it requires you to:
                      </p>
                      <ul className="list-disc pl-5 mt-2">
                          <li>Track two types of information simultaneously (visual and auditory)</li>
                          <li>Continuously update your working memory as new information arrives</li>
                          <li>Inhibit responses to similar but non-matching stimuli</li>
                          <li>Adapt to increasing difficulty as your performance improves</li>
                      </ul>
                      <p className="mt-2">
                          This combination of demands creates a comprehensive cognitive workout that engages multiple brain regions and processes.
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
                          Working Memory
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Fluid Intelligence
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Attention Control
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Cognitive Training
                      </span>
                  </div>
              </div>
          </section>
      </div>
  );
} 