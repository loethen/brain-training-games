import { Metadata } from "next";
import { PatternRecallGame } from "./components/PatternRecallGame";
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Grid, Brain, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GamePreview } from "./components/GamePreview"

export const metadata: Metadata = {
    title: "Pattern Recall Challenge - Visual Memory Training Game",
    description:
        "Test your visual memory by recalling patterns of increasing complexity. This pattern recall game helps improve concentration, attention span, and cognitive flexibility.",
    keywords: [
        "pattern recall game",
        "visual sequence memory",
        "working memory training",
        "cognitive flexibility exercise",
        "attention span improvement",
        "sequence memorization game",
        "visual pattern recognition",
        "short-term memory practice",
    ].join(", "),
    openGraph: {
        title: "Pattern Recall Challenge - Train Your Visual Memory",
        description:
            "Remember and repeat increasingly complex visual sequences to enhance your working memory and cognitive flexibility.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function PatternRecallPage() {
    return (
        <GamePageTemplate
            gameId="pattern-recall-challenge"
            title="Pattern Recall Challenge"
            subtitle="Train your visual memory and pattern recognition"
            gameComponent={<PatternRecallGame />}
            howToPlay={
                <>
                    <p>Memorize and recreate visual patterns in this challenging memory game:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>A pattern of highlighted squares will appear briefly on the grid</li>
                        <li>Memorize the pattern before it disappears</li>
                        <li>Recreate the pattern by clicking on the correct squares</li>
                        <li>Patterns become more complex as you advance through levels</li>
                    </ul>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4">Watch Demo</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle>Demo</DialogTitle>
                            <GamePreview />
                        </DialogContent>
                    </Dialog>
                </>
            }
            benefits={[
                {
                    icon: <Brain className="w-10 h-10" />,
                    title: "Working Memory",
                    description: "Enhance your ability to temporarily hold and manipulate visual information in your mind."
                },
                {
                    icon: <Eye className="w-10 h-10" />,
                    title: "Visual Processing",
                    description: "Improve how quickly and accurately your brain processes and interprets visual patterns."
                },
                {
                    icon: <Grid className="w-10 h-10" />,
                    title: "Pattern Recognition",
                    description: "Strengthen your ability to identify and remember visual patterns, a key skill for learning and problem-solving."
                }
            ]}
            faq={[
                {
                    question: "How does visual pattern memory help in daily life?",
                    answer: "Visual pattern memory is essential for navigation, recognizing faces, learning new information through diagrams or charts, and many professional skills from reading X-rays to architectural design."
                },
                {
                    question: "Can this improve my ability to learn new things?",
                    answer: "Yes! Strong visual memory helps you retain information presented in visual formats, which is how much of our learning occurs. This skill transfers to academic learning, professional development, and acquiring new hobbies."
                },
                {
                    question: "How often should I practice?",
                    answer: "For best results, practice for 10-15 minutes daily. Consistent, regular practice is more effective than occasional longer sessions."
                },
                {
                    question: "Is this game suitable for children?",
                    answer: "Absolutely! This game is excellent for developing minds. Visual memory is crucial for reading, mathematics, and many other academic skills. The progressive difficulty ensures it remains challenging as skills improve."
                }
            ]}
        />
    );
}
