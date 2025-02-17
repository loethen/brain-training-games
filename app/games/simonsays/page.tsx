import { Metadata } from 'next'
import { GamePreview } from './components/GamePreview'
import { MemoryBlocksGame } from './components/MemoryBlocksGame'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
  title: 'Simon Memory Game - Free Online Brain Training | YourSite',
  description: 'Play the classic Simon memory game online! A digital version of the popular electronic memory game that improves cognitive skills and concentration.',
  keywords: [
    'simon game online',
    'simon says game',
    'memory sequence game',
    'pattern memory game',
    'brain training games',
    'cognitive skills improvement',
    'working memory exercise',
    'memory retention practice'
  ].join(', '),
  openGraph: {
    images: [{ url: '/og/memory-blocks.jpg', width: 1200, height: 630 }]
  }
}

export default function MemoryBlocksPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumbs currentPage="Simon Says" />
      <GameHeader 
        title="Simon Says Game" 
        subtitle="A digital version of the classic Simon Says game to improve memory and concentration" 
      />

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
        <h2 className="text-3xl font-bold mb-6">Why Play Simon Says?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">🧠 Memory Enhancement</h3>
            <p>Train your sequential memory by remembering and repeating increasingly complex patterns.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🎯 Focus Training</h3>
            <p>Sharpen your concentration by following and reproducing color and sound sequences.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">📈 Progress Tracking</h3>
            <p>Track your high scores and see how your memory capacity improves over time.</p>
          </div>
        </div>
      </section>

      {/* 游戏组件 */}
      <section className="bg-muted/50 rounded-xl p-6 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Play Simon Says</h2>
        <MemoryBlocksGame />
      </section>

      {/* FAQ部分 */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Simon Says FAQ</h2>
        <div className="space-y-4">
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How does Simon Says improve memory?</summary>
            <p className="mt-2">Simon challenges your sequential memory by requiring you to remember and reproduce increasingly complex patterns of colors and sounds, helping strengthen your working memory and pattern recognition abilities.</p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">How often should I practice?</summary>
            <p className="mt-2">For best results, try playing Simon for 15-20 minutes daily. The game naturally increases in difficulty as you improve, making it an excellent tool for continuous cognitive development.</p>
          </details>
        </div>
      </section>

      {/* 在页面底部添加标签部分 */}
      <section className="mt-16 border-t pt-8">
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground mb-4">Game Categories</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Simon Says Game
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Color Sequence Game
            </span>
            <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors">
              Pattern Memory Training
            </span>
          </div>
        </div>
      </section>
    </div>
  )
} 