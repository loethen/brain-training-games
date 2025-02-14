import { Metadata } from 'next'
import { GamePreview } from './components/GamePreview'
import Link from 'next/link'
import { MemoryBlocksGame } from './components/MemoryBlocksGame'

export const metadata: Metadata = {
  title: 'Memory Blocks Game - Free Online Brain Training | YourSite',
  description: 'Boost your working memory with Memory Blocks! Scientifically-designed spatial memory game improves cognitive skills, focus and mental agility. Track progress and challenge friends!',
  keywords: [
    'memory game online free',
    'brain training games',
    'cognitive skills improvement',
    'spatial memory challenge',
    'working memory exercise',
    'mental focus training',
    'neuroplasticity games',
    'memory retention practice'
  ].join(', '),
  openGraph: {
    images: [{ url: '/og/memory-blocks.jpg', width: 1200, height: 630 }]
  }
}

export default function MemoryBlocksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* 面包屑导航 */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex gap-2 text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li><Link href="/games" className="hover:text-foreground">Games</Link></li>
          <li>/</li>
          <li className="text-foreground">Memory Blocks</li>
        </ol>
      </nav>

      {/* 头部信息 */}
      <header className="text-center mb-12">
        <h1 className="text-5xl mb-4">Memory Blocks</h1>
        <p className="text-xl text-muted-foreground">
          A brain training game to improve spatial memory and concentration
        </p>
      </header>

      {/* 游戏预览和规则说明 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <GamePreview />
        
        {/* 游戏规则说明 */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🎯 How to Play</h3>
            <p className="text-lg text-muted-foreground">Watch the pattern, then repeat it. Each level adds one more block to remember!</p>
          </div>
          
          <div className="p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">💯 Scoring System</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Base Score: 10 points per block</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Streak Bonus: (Level - 1) × 5 points</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Speed Bonus: +10 points (under 3s)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 游戏特性介绍 */}
      <section className="prose prose-lg mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Why Play Memory Blocks?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">🧠 Memory Enhancement</h3>
            <p>Improve your short-term memory retention through pattern recognition challenges.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🎯 Focus Training</h3>
            <p>Develop laser-sharp concentration by tracking multiple moving elements.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">📈 Progress Tracking</h3>
            <p>Monitor your cognitive improvement with detailed performance analytics.</p>
          </div>
        </div>
      </section>

      {/* 游戏组件 */}
      <section className="bg-muted/50 rounded-xl p-6 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Play Memory Blocks</h2>
        <MemoryBlocksGame />
      </section>

      {/* FAQ部分 */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Memory Blocks FAQ</h2>
        <div className="space-y-4">
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How does this game improve memory?</summary>
            <p className="mt-2">Memory Blocks uses spatial pattern recognition exercises that challenge your working memory, helping you improve pattern recognition and spatial awareness skills.</p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How often should I practice?</summary>
            <p className="mt-2">For optimal results, we recommend playing 2-3 sessions daily, each lasting about 10-15 minutes. Regular practice helps build and maintain cognitive improvements.</p>
          </details>
        </div>
      </section>

      {/* 在页面底部添加标签部分 */}
      <section className="mt-16 border-t pt-8">
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground mb-4">Game Categories</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Memory Improvement Games
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Cognitive Enhancement Exercises
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Short-Term Memory Training
            </span>
          </div>
        </div>
      </section>
    </div>
  )
} 