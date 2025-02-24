import { Metadata } from 'next'
import { GamePreview } from './components/GamePreview'
import { SimonsaysGame } from './components/SimonsaysGame'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
  title: 'Simon Says Memory Game: Pattern Recall Training | FreeFocusGames',
  description: 'Enhance your short-term memory with our adaptive Simon-style game. Track your progress through increasing difficulty levels.',
  keywords: [
    'simon says online',
    'free memory game',
    'brain training for adults',
    'cognitive flexibility exercise',
    'neuroscience memory game',
    'pattern recognition challenge',
    'working memory improvement',
    'brain plasticity exercises',
    'attention span training',
    'neuroplasticity games'
  ].join(', '),
  openGraph: {
    title: 'Simon Says Memory Game | FreeFocusGames',
    description: 'Classic pattern recall training game',
    images: [{ url: '/og/basic-logo.jpg' }],
    siteName: 'FreeFocusGames',
  }
}

export default function MemoryBlocksPage() {
  return (
      <div className="max-w-7xl mx-auto lg:px-8">
          <GameHeader
              title="Simon Says Game"
              subtitle="A digital version of the classic Simon Says game to improve memory and concentration"
          />

          {/* 游戏预览和规则说明 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              <GamePreview />

              {/* 游戏规则说明 */}
              <div className="space-y-8 bg-background p-8 rounded-2xl shadow-sm">
                  <div className="p-6 rounded-lg bg-muted/10">
                      <h3 className="text-2xl font-semibold mb-4">
                          🎯 How to Play
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                          Watch the pattern, then repeat it. Each level adds one
                          more block to remember!
                      </p>
                  </div>

                  <div className="p-6 rounded-lg bg-muted/10">
                      <h3 className="text-2xl font-semibold mb-4">
                          💯 Scoring System
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
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

          {/* 游戏组件 */}
          <section 
            className="bg-muted/30 rounded-2xl px-8 py-16 mb-24 shadow-sm"
            itemScope
            itemType="http://schema.org/Game"
          >
            <h2 className="text-3xl font-bold mb-8 text-center" itemProp="name">
              Play Simon Says
            </h2>
            <meta itemProp="description" content="Interactive Simon Says memory challenge with cognitive performance tracking" />
            <div itemProp="gameLocation" itemScope itemType="http://schema.org/WebApplication">
              <meta itemProp="name" content="freefocusgames.com" />
              <meta itemProp="applicationCategory" content="EducationalGame" />
              <meta itemProp="operatingSystem" content="Any" />
            </div>
            <SimonsaysGame />
          </section>

          {/* 修改后的评分系统（添加表格） */}
          <div className="p-8 rounded-2xl bg-muted/30 mb-16 shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">📊 Cognitive Performance Evaluation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Score Range</th>
                    <th className="p-3">Cognitive Assessment</th>
                    <th className="p-3">Training Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [0, 50, 'Developing Focus', '20 mins/day, 5 days/week'],
                    [51, 120, 'Average Attention', '25 mins/day, 4 days/week'],
                    [121, 200, 'Strong Retention', 'Challenge mode 3 sessions/week'],
                    [201, 350, 'Exceptional Memory', 'Expert patterns + speed challenge'],
                    [351, 500, 'Genius Level', 'Maintain with daily complex drills']
                  ].map(([min, max, assessment, recommendation]) => (
                    <tr key={min} className="border-b hover:bg-muted/30">
                      <td className="p-3">{min}-{max}</td>
                      <td className="p-3 font-medium">{assessment}</td>
                      <td className="p-3 text-muted-foreground">{recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              * Score ranges based on internal testing with simulated patterns
            </p>
          </div>

          {/* 游戏特性介绍 */}
          <section className="prose prose-lg mx-auto mb-24 max-w-4xl">
              <h2 className="text-4xl font-bold mb-8 text-center">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Why Play Simon Says?
                  </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-12">
                  <div className="p-6 bg-muted/10 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">
                          🧠 Pattern Recall
                      </h3>
                      <p className="leading-relaxed">
                          Practice remembering and repeating color sequences
                          of increasing complexity
                      </p>
                  </div>
                  <div className="p-6 bg-muted/10 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">
                          🎯 Focus Training
                      </h3>
                      <p className="leading-relaxed">
                          Sharpen your concentration by following and
                          reproducing color sequences.
                      </p>
                  </div>
                  <div className="p-6 bg-muted/10 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">
                          📈 Progress Tracking
                      </h3>
                      <p className="leading-relaxed">
                          Track your high scores and see how your memory
                          capacity improves over time.
                      </p>
                  </div>
              </div>
          </section>

          {/* 优化后的FAQ部分 */}
          <section className="max-w-4xl mx-auto mb-24">
              <h2 className="text-4xl font-bold mb-8 text-center">Science & Strategy Guide</h2>
              <div className="space-y-6">
                  <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                      <summary className="font-semibold cursor-pointer flex items-center text-lg">
                          <span className="mr-3">🔬</span>
                          How does this game help improve memory?
                      </summary>
                      <div className="mt-4 pl-8 border-l-4 border-primary">
                          <p className="leading-relaxed">
                              While individual results may vary, regular practice with pattern recall:
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                              <li>May strengthen short-term memory through repetition</li>
                              <li>Encourages focused attention during gameplay</li>
                              <li>Provides measurable progress through score tracking</li>
                          </ul>
                      </div>
                  </details>

                  <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                      <summary className="font-semibold cursor-pointer flex items-center text-lg">
                          <span className="mr-3">⚡</span>
                          How quickly can I expect improvement?
                      </summary>
                      <div className="mt-4 pl-8 border-l-4 border-primary">
                          <div className="overflow-x-auto">
                              <table className="w-full">
                                  <thead>
                                      <tr className="border-b">
                                          <th className="p-2">Duration</th>
                                          <th className="p-2">Expected Improvement</th>
                                          <th className="p-2">Neural Changes</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {[
                                          ['2 Weeks', 'Faster pattern recognition', 'Consistent daily practice'],
                                          ['1 Month', 'Longer sequence recall', 'Regular 15-min sessions'],
                                          ['3 Months', 'Higher score achievements', 'Progressive difficulty']
                                      ].map(([duration, improvement, basis]) => (
                                          <tr key={duration} className="border-b">
                                              <td className="p-2 font-medium">{duration}</td>
                                              <td className="p-2">{improvement}</td>
                                              <td className="p-2 text-muted-foreground">{basis}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </details>

                  {/* 保持原有FAQ问题 */}
                  <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                      <summary className="font-semibold cursor-pointer flex items-center text-lg">
                          <span className="mr-3">⏱️</span>
                          How often should I practice for best results?
                      </summary>
                      <p className="mt-2">
                          For best results, try 15-20 minute sessions 3-4 times weekly,
                          allowing time for mental rest between sessions.
                      </p>
                  </details>

                  {/* 在FAQ部分添加结构化问题 */}
                  <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                    <summary className="font-semibold cursor-pointer flex items-center text-lg">
                      <span className="mr-3">🏆</span>
                      What makes this Simon Says unique?
                    </summary>
                    <div className="mt-4 pl-8 border-l-4 border-primary">
                      <p className="leading-relaxed">
                        Our version focuses on:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Progressive difficulty scaling</li>
                        <li>Basic performance tracking</li>
                        <li>Adaptive pattern generation</li>
                      </ul>
                    </div>
                  </details>
              </div>
          </section>

          {/* 在页面底部添加标签部分 */}
          <section className="mt-24 border-t-2 pt-12">
              <div className="text-center">
                  <h3 className="text-lg text-muted-foreground mb-6">
                      Game Categories
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                      <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                          Simon Says Game
                      </span>
                      <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                          Color Sequence Game
                      </span>
                      <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                          Pattern Memory Training
                      </span>
                  </div>
              </div>
          </section>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simon Says Memory Challenge",
              "applicationCategory": "EducationalGame",
              "operatingSystem": "Web",
            })}
          </script>
      </div>
  );
} 