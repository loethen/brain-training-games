import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Zap, Target, Calculator } from 'lucide-react'

export const metadata: Metadata = {
    title: "Larger Number Challenge - Number Comparison Training Game",
    description:
        "Improve your numerical processing speed and decision-making with this fast-paced number comparison game. Train your brain to quickly identify larger numbers.",
    keywords: [
        "number comparison game",
        "numerical processing training",
        "decision speed exercise",
        "math brain training",
        "cognitive speed game",
        "number magnitude comparison",
        "reaction time training",
        "educational math game",
    ].join(", "),
    openGraph: {
        title: "Larger Number Challenge - Train Your Numerical Processing Speed",
        description: "Quickly identify which number is larger in this fast-paced brain training game. Improve your decision-making speed and numerical processing.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function LargerNumberPage() {
  return (
    <GamePageTemplate
      gameId="larger-number"
      title="Larger Number Challenge"
      subtitle="Train your processing speed and numerical comparison skills"
      gameComponent={<Game />}
      howToPlay={
        <>
          <p>Quickly identify which number is larger in this fast-paced challenge:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Two numbers will appear on the screen</li>
            <li>Tap or click on the larger number as quickly as possible</li>
            <li>Try to be both fast and accurate</li>
            <li>See how many correct answers you can get in 30 seconds</li>
          </ul>
        </>
      }
      benefits={[
        {
          icon: <Zap className="w-10 h-10" />,
          title: "Processing Speed",
          description: "Enhance how quickly your brain can process and respond to numerical information."
        },
        {
          icon: <Target className="w-10 h-10" />,
          title: "Selective Attention",
          description: "Improve your ability to focus on relevant information and make quick decisions."
        },
        {
          icon: <Calculator className="w-10 h-10" />,
          title: "Numerical Cognition",
          description: "Strengthen the brain pathways involved in understanding and comparing quantities."
        }
      ]}
      faq={[
        {
          question: "How does this help with math skills?",
          answer: "This game trains the fundamental cognitive processes that underlie mathematical thinking: quick number recognition, magnitude comparison, and decision-making. These skills form the foundation for more complex math abilities."
        },
        {
          question: "Is this good for children learning math?",
          answer: "Yes! This game helps develop number sense, which is crucial for early math development. It's especially helpful for children who are learning to compare quantities and understand numerical relationships."
        },
        {
          question: "How does processing speed affect learning?",
          answer: "Processing speed affects how quickly you can take in, understand, and respond to information. Faster processing allows you to handle more complex tasks efficiently and reduces cognitive load during learning activities."
        },
        {
          question: "Can adults benefit from this training?",
          answer: "Absolutely. Processing speed can decline with age, and regular training can help maintain or improve this cognitive function. This game provides a quick, engaging way to exercise these neural pathways."
        }
      ]}
    />
  );
} 