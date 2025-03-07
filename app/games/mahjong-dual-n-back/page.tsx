import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Layers, Zap } from 'lucide-react'

export const metadata: Metadata = {
    title: "Mahjong Dual N-Back - Working Memory Training Game",
    description: "Challenge your working memory with this mahjong-themed cognitive training exercise that improves fluid intelligence using the dual n-back paradigm.",
    keywords: [
        "mahjong n-back training",
        "mahjong memory game",
        "working memory exercise",
        "fluid intelligence game",
        "cognitive training with mahjong",
        "brain training game",
        "attention control practice",
        "n-back task with mahjong tiles",
        "memory improvement game",
        "traditional mahjong brain training",
    ].join(", "),
    openGraph: {
        title: "Mahjong Dual N-Back - Advanced Working Memory Training",
        description: "Train your working memory and fluid intelligence with the scientifically-backed Mahjong Dual N-Back cognitive exercise featuring traditional mahjong tiles.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function MahjongDualNBackPage() {
  return (
      <GamePageTemplate
          gameBackground="bg-[linear-gradient(to_bottom_right,#f0fff4_0%,#c8e6c9_30%,#a5d6a7_70%,#81c784_100%)]"
          gameId="mahjong-dual-n-back"
          title="Mahjong Dual N-Back"
          subtitle="Advanced working memory training with traditional mahjong tiles"
          gameComponent={<Game />}
          howToPlay={
              <>
                  <p>
                      In this challenging memory task inspired by traditional Mahjong, you&apos;ll need to
                      remember both the position and audio stimuli from N steps back in the sequence:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>
                          Watch as mahjong tiles appear in sequence on the green felt table
                      </li>
                      <li>
                          Press &quot;Position&quot; when the current tile position
                          matches the position from N steps back
                      </li>
                      <li>
                          Press &quot;Audio&quot; when the current sound matches
                          the sound from N steps back
                      </li>
                      <li>
                          Use keyboard shortcuts: &apos;A&apos; for Position
                          match, &apos;L&apos; for Audio match
                      </li>
                      <li>
                          Start with 1-back (remembering the previous tile) and progress to higher levels as your memory improves
                      </li>
                      <li>
                          Adjust settings to customize your training experience with different N-back levels and stimulus types
                      </li>
                  </ul>
              </>
          }
          benefits={[
              {
                  icon: <Brain className="w-10 h-10" />,
                  title: "Working Memory",
                  description:
                      "Strengthen your ability to hold and manipulate multiple pieces of information in mind while tracking mahjong tile positions and sounds.",
              },
              {
                  icon: <Layers className="w-10 h-10" />,
                  title: "Fluid Intelligence",
                  description:
                      "Improve your problem-solving abilities and cognitive flexibility through the challenging dual-task nature of the mahjong n-back exercise.",
              },
              {
                  icon: <Zap className="w-10 h-10" />,
                  title: "Attention Control",
                  description:
                      "Enhance your focus and ability to filter out distractions while monitoring both visual and auditory mahjong stimuli simultaneously.",
              },
          ]}
          faq={[
              {
                  question: "What is the science behind Mahjong Dual N-Back?",
                  answer: "Dual N-Back has been studied extensively in cognitive neuroscience. Research published in PNAS (2008) suggested that training with this task can improve fluid intelligence. Our mahjong-themed version combines position and audio matching with traditional mahjong aesthetics to create an engaging cognitive workout.",
              },
              {
                  question:
                      "How is this different from the regular Dual N-Back?",
                  answer: "While maintaining the core dual n-back mechanics of tracking position and audio stimuli, our version incorporates authentic mahjong tiles and a traditional green felt background. This cultural theming makes the exercise more visually engaging while preserving the cognitive challenge that makes dual n-back effective.",
              },
              {
                  question: "How often should I practice with the mahjong tiles?",
                  answer: "For optimal results, aim for 20-30 minutes of mahjong dual n-back training, 3-4 times per week. Consistency is more important than duration. Regular practice helps your brain build stronger neural pathways for working memory tasks involving both visual position and auditory processing.",
              },
              {
                  question: "Will I see improvements in my daily life from mahjong memory training?",
                  answer: "Many users report improvements in concentration, multitasking ability, and information retention after regular practice with dual n-back exercises. The position and audio tracking skills developed here can transfer to academic, professional, and everyday activities requiring attention to multiple streams of information.",
              },
              {
                  question: "Do I need to know how to play mahjong to use this training game?",
                  answer: "No prior knowledge of mahjong is required. While we use the beautiful visual elements of traditional mahjong tiles, the cognitive task focuses on remembering positions and sounds rather than mahjong gameplay. The exercise is designed to be accessible to everyone regardless of their familiarity with mahjong.",
              },
          ]}
      />
  );
} 