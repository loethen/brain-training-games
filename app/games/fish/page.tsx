import { Metadata } from 'next'
import Link from 'next/link'
import Game from './components/Game'

export const metadata: Metadata = {
  title: 'Focus Fish - Fun Concentration Training Game | YourSite',
  description: 'Improve your concentration with our Focus Fish game! Track moving fish and identify the glowing ones. A fun way to enhance attention and focus.',
  keywords: [
    'focus training game',
    'concentration game',
    'attention training',
    'focus fish game',
    'brain training',
    'attention span',
    'focus improvement',
    'cognitive training'
  ].join(', '),
  openGraph: {
    images: [{ url: '/og/focus-fish.jpg', width: 1200, height: 630 }]
  }
}

export default function FishPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* 面包屑导航 */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex gap-2 text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li><Link href="/games" className="hover:text-foreground">Games</Link></li>
          <li>/</li>
          <li className="text-foreground">Focus Fish</li>
        </ol>
      </nav>

      {/* 头部信息 */}
      <header className="text-center mb-12">
        <h1 className="text-5xl mb-4">Focus Fish Game</h1>
        <p className="text-xl text-muted-foreground">
          Track moving fish and identify the glowing ones to enhance your concentration
        </p>
      </header>

      {/* 游戏区域 */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto bg-muted/50 rounded-xl p-6">
          <div className="aspect-[4/3] w-full">
            <Game />
          </div>
        </div>
      </section>

      {/* 游戏规则说明 */}
      <section className="max-w-3xl mx-auto mb-16 space-y-6">
        <div className="p-6 rounded-lg bg-muted/50">
          <h3 className="text-xl font-semibold mb-3">🎯 How to Play</h3>
          <p className="text-lg text-muted-foreground">
            Focus on the swimming fish and identify which ones glow. The game challenges your attention span and visual tracking abilities!
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-muted/50">
          <h3 className="text-xl font-semibold mb-3">🐠 Game Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>Dynamic fish movements for attention training</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Calming underwater environment</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Increasing challenge levels</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 游戏特性介绍 */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Benefits of Playing Focus Fish</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">🎯 Focus Training</h3>
            <p>Strengthen your attention span by tracking multiple moving objects in a dynamic environment.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">👀 Visual Attention</h3>
            <p>Improve your ability to maintain focus on multiple targets while filtering out distractions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🧘 Mindful Gaming</h3>
            <p>Practice mindfulness and concentration in a relaxing underwater setting.</p>
          </div>
        </div>
      </section>

      {/* FAQ部分 */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Focus Fish FAQ</h2>
        <div className="space-y-4">
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How does Focus Fish improve concentration?</summary>
            <p className="mt-2">The game challenges your sustained attention by requiring you to track multiple moving fish simultaneously, helping to build focus and concentration skills.</p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How often should I practice?</summary>
            <p className="mt-2">For best results, try playing Focus Fish for 10-15 minutes daily. Regular practice helps build lasting improvements in attention and concentration.</p>
          </details>
        </div>
      </section>

      {/* 标签部分 */}
      <section className="mt-16 border-t pt-8">
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground mb-4">Game Categories</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Focus Training
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Attention Game
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Concentration Training
            </span>
          </div>
        </div>
      </section>
    </div>
  )
} 