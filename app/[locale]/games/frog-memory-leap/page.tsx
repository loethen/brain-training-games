import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Brain, Eye, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
    title: "Frog Memory Leap - Sequential Memory Training Game",
    description:
        "Challenge your spatial memory by remembering the sequence of frog jumps across lily pads. A fun brain training game to improve working memory and attention span.",
    keywords: [
        "sequential memory game",
        "spatial recall training",
        "frog jump memory game",
        "pattern recognition game",
        "working memory exercise",
        "brain training for kids and adults",
        "cognitive skills improvement",
        "attention span game",
    ].join(", "),
    openGraph: {
        title: "Frog Memory Leap - Train Your Sequential Memory",
        description: "Watch the frog jump across lily pads and remember the exact sequence to advance through increasingly challenging levels.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function FrogMemoryLeapPage() {
  return (
    <GamePageTemplate
      gameId="frog-memory-leap"
      title="Frog Memory Leap"
      subtitle="Train your sequential memory and pattern recognition"
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>Watch and remember the sequence of frog jumps, then repeat it:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Observe carefully as the frog jumps from lily pad to lily pad</li>
            <li>After the demonstration, recreate the exact sequence by clicking on the lily pads in the correct order</li>
            <li>Each level adds more jumps to the sequence</li>
            <li>Try to reach the highest level possible!</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Brain className="w-10 h-10" />,
          title: "Working Memory",
          description: "Strengthen your ability to hold and recall sequences of information in the correct order."
        },
        {
          icon: <Eye className="w-10 h-10" />,
          title: "Visual-Spatial Memory",
          description: "Enhance your capacity to remember locations and spatial relationships between objects."
        },
        {
          icon: <Lightbulb className="w-10 h-10" />,
          title: "Pattern Recognition",
          description: "Develop your ability to identify and remember patterns, an essential skill for learning and problem-solving."
        }
      ]}
      faq={[
        {
          question: "How does sequential memory help in daily life?",
          answer: "Sequential memory is crucial for following directions, learning new skills, remembering phone numbers, and executing multi-step tasks. It's fundamental to many aspects of learning and daily functioning."
        },
        {
          question: "Is this game suitable for all ages?",
          answer: "Yes! This game is designed to be engaging for children and challenging for adults. The progressive difficulty ensures that players of all ages and abilities can benefit."
        },
        {
          question: "How often should I practice?",
          answer: "For best results, practice for 10-15 minutes daily. Consistent, regular practice is more effective than occasional longer sessions."
        },
        {
          question: "Can this help with learning difficulties?",
          answer: "Yes, many learning difficulties involve challenges with sequential processing and working memory. Regular practice with this game may help strengthen these cognitive skills."
        }
      ]}
    />
  );
} 