import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Layers, Zap } from 'lucide-react'

export const metadata: Metadata = {
    title: "Dual N-Back - Working Memory Training Game",
    description:
        "Boost your brainpower with our free online Dual N-Back game, designed to enhance working memory and cognitive skills. This science-backed memory training tool offers dynamic challenges and real-time feedback to improve focus, intelligence, and mental agility. Perfect for students, professionals, and brain training enthusiasts, it adapts to your level for a fun, effective way to unlock your cognitive potential. Play now and level up your mind!",
    keywords: [
        "dual n-back training",
        "working memory exercise",
        "fluid intelligence game",
        "cognitive training",
        "brain training game",
        "attention control practice",
        "n-back task",
        "memory improvement game",
        "free online Dual N-Back",
        "improve working memory",
    ].join(", "),
    openGraph: {
        title: "Dual N-Back - Advanced Working Memory Training",
        description:
            "Train your working memory and fluid intelligence with the scientifically-backed Dual N-Back cognitive exercise.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function DualNBackPage() {
  return (
    <GamePageTemplate
      gameId="dual-n-back"
      title="Dual N-Back"
      subtitle="Advanced working memory training for cognitive enhancement"
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>In this challenging memory task, you&apos;ll need to remember both visual and auditory stimuli from N steps back in the sequence:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Watch the grid and listen to the letters</li>
            <li>Press &quot;Position&quot; when the current position matches the position from N steps back</li>
            <li>Press &quot;Sound&quot; when the current letter matches the letter from N steps back</li>
            <li>As you improve, the N-back level will increase, making the task more difficult</li>
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
          question: "How often should I practice?",
          answer: "For optimal results, aim for 20-30 minutes of training, 3-4 times per week. Consistency is more important than duration."
        },
        {
          question: "Why is this task so challenging?",
          answer: "Dual N-Back is deliberately difficult because it forces your brain to simultaneously track two types of information (visual and auditory) while continuously updating your working memory. This cognitive load is what makes it effective for brain training."
        },
        {
          question: "Will I see improvements in my daily life?",
          answer: "Many users report improvements in concentration, multitasking ability, and information retention after regular practice. These skills can transfer to academic, professional, and everyday activities."
        }
      ]}
      relatedGames={["mahjong-dual-n-back", "pattern-recall-challenge"]}
    />
  );
} 