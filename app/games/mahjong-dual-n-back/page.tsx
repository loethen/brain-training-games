import { Metadata } from 'next'
import Game from './components/Game'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "麻将 Dual N-Back - 工作记忆与流体智力训练",
    description:
        "使用上海麻将元素的双重N-Back任务，同时训练视觉和听觉工作记忆，提升认知能力和注意力控制。",
    keywords: [
        "麻将 dual n-back",
        "工作记忆训练",
        "流体智力游戏",
        "认知训练",
        "大脑训练游戏",
        "注意力控制练习",
        "n-back 任务",
        "记忆力提升游戏",
    ].join(", "),
    openGraph: {
        title: "麻将 Dual N-Back - 高级工作记忆训练",
        description: "使用中国传统麻将元素，训练您的工作记忆和流体智力，科学支持的双重N-Back认知练习。",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function MahjongDualNBackPage() {
  return (
      <div className="max-w-7xl mx-auto">
          <GameHeader
              title="麻将 Dual N-Back 挑战"
              subtitle="使用传统麻将元素训练工作记忆和流体智力的高级认知练习"
          />

          {/* 游戏区域 */}
          <section className="mb-16">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Game />
              </div>
          </section>

          {/* 游戏规则说明 */}
          <section className="max-w-3xl mx-auto mb-16 space-y-6">
              <div className="p-6 rounded-lg bg-muted/50">
                  <h3 className="text-xl font-semibold mb-3">
                      🎯 如何游戏
                  </h3>
                  <div className="space-y-3 text-lg text-muted-foreground">
                      <p>1. 您将看到一系列麻将牌展示，同时听到麻将牌的读音</p>
                      <p>2. 您的任务是识别当前的麻将牌或读音是否与N步之前的相匹配</p>
                      <p>3. 当位置（麻将牌）与N步之前的相匹配时，按"位置匹配"按钮</p>
                      <p>4. 当声音与N步之前的相匹配时，按"声音匹配"按钮</p>
                      <p>5. 随着您的进步，N值会增加，使任务更具挑战性</p>

                      <div className="mt-6 pt-4 border-t border-muted-foreground/20">
                          <p className="font-semibold mb-2">
                              认知益处:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                              <li>增强工作记忆容量</li>
                              <li>提高流体智力</li>
                              <li>增强注意力控制</li>
                              <li>发展多任务处理能力</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          {/* 功能介绍 */}
          <section className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                  为什么选择麻将 Dual N-Back 训练?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🧠 工作记忆
                      </h3>
                      <p>
                          增强您暂时保持和操作信息的能力 - 这对问题解决和学习至关重要
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          💡 流体智力
                      </h3>
                      <p>
                          研究表明，定期的 Dual N-Back 训练可能会提高您推理和解决新问题的能力
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">
                          🎯 注意力控制
                      </h3>
                      <p>
                          通过训练大脑同时维护和操作多条信息，培养更好的专注力
                      </p>
                  </div>
              </div>
          </section>

          {/* 科学背景 */}
          <section className="max-w-3xl mx-auto mb-16 bg-muted/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">科学背景</h2>
              <p className="mb-4">
                  Dual N-Back 任务因 2008 年发表在《美国国家科学院院刊》上的一项研究而流行，该研究表明它可以提高流体智力 - 这一发现在科学界引起了极大的兴趣。
              </p>
              <p>
                  虽然后续研究对远距离迁移效应（一般智力的提高）显示出不同结果，但有强有力的证据表明，定期练习会导致工作记忆容量和注意力控制的提高。
              </p>
          </section>

          {/* FAQ 部分 */}
          <section className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">常见问题</h2>
              <div className="space-y-4">
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          我应该多久练习一次麻将 Dual N-Back?
                      </summary>
                      <p className="mt-2">
                          为了获得最佳效果，研究建议每天练习 20-30 分钟，每周 4-5 天。一致性比持续时间更重要，因为定期练习有助于建立和加强与工作记忆相关的神经通路。
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          我多快能看到改进?
                      </summary>
                      <p className="mt-2">
                          大多数用户在持续练习 1-2 周后会注意到他们的 Dual N-Back 表现有所改善。然而，对其他认知任务的迁移效应可能需要更长时间才能发展，通常需要 3-4 周的定期训练。
                      </p>
                  </details>
                  <details className="bg-muted/50 rounded-lg p-4">
                      <summary className="font-semibold cursor-pointer">
                          是什么让麻将 Dual N-Back 比其他记忆游戏更有效?
                      </summary>
                      <p className="mt-2">
                          麻将 Dual N-Back 特别具有挑战性，因为它要求您:
                      </p>
                      <ul className="list-disc pl-5 mt-2">
                          <li>同时跟踪两种类型的信息（视觉和听觉）</li>
                          <li>随着新信息的到来，不断更新您的工作记忆</li>
                          <li>抑制对相似但不匹配刺激的反应</li>
                          <li>随着表现的提高而适应不断增加的难度</li>
                      </ul>
                      <p className="mt-2">
                          这种需求的组合创造了一个全面的认知锻炼，涉及多个大脑区域和过程。
                      </p>
                  </details>
              </div>
          </section>

          {/* 标签部分 */}
          <section className="mt-16 border-t pt-8">
              <div className="text-center">
                  <h3 className="text-sm text-muted-foreground mb-4">
                      训练类别
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          工作记忆
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          流体智力
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          注意力控制
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                          认知训练
                      </span>
                  </div>
              </div>
          </section>
      </div>
  );
} 