import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Shuffle, Layers } from 'lucide-react'

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
    <GamePageTemplate
      gameId="mahjong-dual-n-back"
      title="Mahjong Dual N-Back"
      subtitle="Advanced working memory training with mahjong tiles"
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>Train your working memory with this mahjong-themed dual n-back challenge:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Watch the mahjong tiles appear and listen to the sounds</li>
            <li>Press "Position" when the current tile matches the position from N steps back</li>
            <li>Press "Sound" when the current sound matches the sound from N steps back</li>
            <li>As you improve, the N-back level will increase, making the task more challenging</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Brain className="w-10 h-10" />,
          title: "Working Memory",
          description: "Strengthen your ability to hold and manipulate multiple pieces of information simultaneously."
        },
        {
          icon: <Shuffle className="w-10 h-10" />,
          title: "Cognitive Flexibility",
          description: "Enhance your ability to switch between different mental tasks and adapt to changing rules."
        },
        {
          icon: <Layers className="w-10 h-10" />,
          title: "Fluid Intelligence",
          description: "Improve your capacity for abstract reasoning and problem-solving in novel situations."
        }
      ]}
      faq={[
        {
          question: "How is this different from regular Dual N-Back?",
          answer: "This version uses mahjong tiles and sounds instead of grid positions and letters, adding cultural elements while maintaining the core cognitive challenge. The visual complexity of mahjong tiles may provide additional visual processing benefits."
        },
        {
          question: "Do I need to know how to play mahjong?",
          answer: "No, you don't need any knowledge of mahjong to benefit from this training. The game simply uses the distinctive visual elements of mahjong tiles as stimuli."
        },
        {
          question: "How difficult is this compared to standard Dual N-Back?",
          answer: "The core challenge is similar, but some users find the distinctive mahjong tiles easier to differentiate visually than grid positions, while others find the unique sounds more challenging to distinguish than letters."
        },
        {
          question: "What's the optimal training schedule?",
          answer: "Research suggests 20-30 minutes of training, 3-4 times per week for optimal benefits. Start at a comfortable level and allow the adaptive difficulty to increase as your skills improve."
        }
      ]}
    />
  );
} 