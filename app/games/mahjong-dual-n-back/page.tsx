import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Layers, Zap } from 'lucide-react'

export const metadata: Metadata = {
    title: "Mahjong Dual N-Back - Working Memory Training Game",
    description: "Challenge your working memory with this mahjong-themed cognitive training exercise that improves fluid intelligence using the dual n-back paradigm.",
    keywords: [
        "mahjong n-back training",
        "working memory exercise",
        "fluid intelligence game",
        "cognitive training",
        "brain training game",
        "attention control practice",
        "n-back task",
        "memory improvement game",
    ].join(", "),
    openGraph: {
        title: "Mahjong Dual N-Back - Advanced Working Memory Training",
        description: "Train your working memory and fluid intelligence with the scientifically-backed Mahjong Dual N-Back cognitive exercise.",
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
          <p>In this challenging memory task, you&apos;ll need to remember both symbols and colors from N steps back in the sequence:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Watch the mahjong tiles as they appear in sequence</li>
            <li>Press &quot;Symbol&quot; when the current symbol matches the symbol from N steps back</li>
            <li>Press &quot;Color&quot; when the current color matches the color from N steps back</li>
            <li>Use keyboard shortcuts: &apos;A&apos; for Symbol match, &apos;L&apos; for Color match</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Brain className="w-10 h-10" />,
          title: "Working Memory",
          description: "Strengthen your ability to hold and manipulate information in your mind temporarily."
        },
        {
          icon: <Layers className="w-10 h-10" />,
          title: "Fluid Intelligence",
          description: "Improve your capacity to solve novel problems and adapt to new situations."
        },
        {
          icon: <Zap className="w-10 h-10" />,
          title: "Attention Control",
          description: "Enhance your ability to focus on relevant information while ignoring distractions."
        }
      ]}
      faq={[
        {
          question: "What is the science behind Dual N-Back?",
          answer: "Dual N-Back has been studied extensively in cognitive neuroscience. Research published in PNAS (2008) suggested that training with this task can improve fluid intelligence, which is the ability to solve novel problems and adapt to new situations."
        },
        {
          question: "How is this different from the regular Dual N-Back?",
          answer: "This version uses mahjong tiles with symbols and colors instead of positions and letters, providing a fresh visual approach to the same cognitive challenge. The horizontal card format also creates a different visual tracking experience."
        },
        {
          question: "How often should I practice?",
          answer: "For optimal results, aim for 20-30 minutes of training, 3-4 times per week. Consistency is more important than duration."
        },
        {
          question: "Will I see improvements in my daily life?",
          answer: "Many users report improvements in concentration, multitasking ability, and information retention after regular practice. These skills can transfer to academic, professional, and everyday activities."
        }
      ]}
    />
  );
} 