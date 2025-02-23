import { Metadata } from 'next'
import Game from './components/Game'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
  title: 'Memory Frog - Fun Memory Training Game | YourSite',
  description: 'Train your memory with our Memory Frog game! Watch the frog jump and remember its path. A fun way to enhance memory and attention.',
  keywords: [
    'memory training game',
    'memory game',
    'attention training',
    'memory frog game',
    'brain training',
    'memory span',
    'memory improvement',
    'cognitive training'
  ].join(', '),
  openGraph: {
    images: [{ url: '/og/memory-frog.jpg', width: 1200, height: 630 }]
  }
}

export default function FrogPage() {
  return (
      <div className="max-w-7xl mx-auto">
          <Breadcrumbs currentPage="Memory Frog" />
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
                  </div>
              </div>
          </section>

          <section className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  Benefits of Playing Memory Frog
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🧠 Memory Training
                      </h3>
                      <p>
                          Enhance your sequential memory by remembering the
                          order of frog jumps.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          👀 Visual Tracking
                      </h3>
                      <p>
                          Improve your ability to track moving objects and
                          remember spatial positions.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎮 Fun Learning
                      </h3>
                      <p>
                          Enjoy a relaxing game while training your cognitive
                          abilities.
                      </p>
                  </div>
              </div>
          </section>
      </div>
  );
} 