import { Metadata } from 'next'
import Game from './components/Game'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "Frog Memory Leap - Sequential Memory Training Game",
    description:
        "Challenge your spatial memory by remembering the sequence of frog jumps across lily pads. A fun brain training game to improve working memory and attention span.",
    keywords: [
        "sequential memory game",
        "spatial recall training",
        "frog jump memory game",
        "pattern recognition game",
        "working memory exercise",
        "brain training for kids and adults",
        "cognitive skills improvement",
        "attention span game",
    ].join(", "),
    openGraph: {
        title: "Frog Memory Leap - Train Your Sequential Memory",
        description: "Watch the frog jump across lily pads and remember the exact sequence to advance through increasingly challenging levels.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function FrogPage() {
  return (
      <div className="max-w-7xl mx-auto">
          <GameHeader
              title="Frog Memory Leap"
              subtitle="Enhance Sequential Memory & Spatial Recall Through Progressive Challenges"
          />

          <section className="mb-16">
              <div className="max-w-3xl mx-auto bg-muted/50 rounded-xl aspect-[4/3]">
                  <Game />
              </div>
          </section>

          <section className="max-w-3xl mx-auto mb-16 space-y-6">
              <div className="p-6 rounded-lg bg-muted/50">
                  <h3 className="text-xl font-semibold mb-3">🎯 How to Play</h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      <p>🐸 Watch the frog jump between lily pads</p>
                      <p>🧠 Remember the sequence of jumps</p>
                      <p>🎯 Identify the numbered lily pads in order</p>
                      <p>⭐ Complete levels to increase difficulty</p>
                      
                      <div className="mt-6 pt-4 border-t border-muted-foreground/20">
                          <p className="font-semibold mb-2">Cognitive Benefits:</p>
                          <ul className="list-disc pl-5 space-y-2">
                              <li>Strengthens sequential memory capacity</li>
                              <li>Improves spatial pattern recognition</li>
                              <li>Enhances working memory duration</li>
                              <li>Develops visual-spatial processing</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          <section className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  Benefits of Playing Frog Memory Leap
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🧠 Sequential Memory
                      </h3>
                      <p>
                          Enhance your ability to remember ordered information - 
                          crucial for learning languages, mathematics, and music
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          👀 Visual Tracking
                      </h3>
                      <p>
                          Improve your ability to track moving objects and
                          remember spatial positions - helpful for reading and navigation
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎮 Adaptive Challenge
                      </h3>
                      <p>
                          Progressive difficulty levels keep your brain engaged
                          while building stronger neural pathways for memory
                      </p>
                  </div>
              </div>
          </section>
          
          <section className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Memory Training FAQ</h2>
              <div className="space-y-4">
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How does sequential memory training help in daily life?
                      </summary>
                      <p className="mt-2">
                          Sequential memory is essential for remembering directions, following instructions, 
                          learning new skills, and recalling ordered information like phone numbers or passwords.
                          Regular training strengthens these abilities for everyday tasks.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          How often should I practice for best results?
                      </summary>
                      <p className="mt-2">
                          For optimal memory improvement, aim for 10-15 minute sessions 3-5 times per week. 
                          Consistency is more important than duration, as regular practice helps build and 
                          maintain neural connections related to memory function.
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          Is this game suitable for children?
                      </summary>
                      <p className="mt-2">
                          Yes! Frog Memory Leap is designed for all ages. For children, it helps develop 
                          fundamental memory skills during critical developmental periods. The game&apos;s 
                          playful design and progressive difficulty make it engaging for young learners.
                      </p>
                  </details>
              </div>
          </section>
          
          <section className="mt-16 border-t pt-8">
              <div className="text-center">
                  <h3 className="text-sm text-muted-foreground mb-4">
                      Training Categories
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Sequential Memory
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Spatial Recall
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Working Memory
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          Pattern Recognition
                      </span>
                  </div>
              </div>
          </section>
      </div>
  );
} 