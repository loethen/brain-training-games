import { Metadata } from 'next'
import { SchulteGame } from './components/SchulteGame'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Eye, Brain, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GamePreview } from "./components/GamePreview"

export const metadata: Metadata = {
    title: "Schulte Table - Peripheral Vision & Attention Training Game",
    description:
        "Improve your peripheral vision, attention span, and reading speed with the Schulte Table exercise. Find numbers in sequence while training your brain to process visual information faster.",
    keywords: [
        "schulte table exercise",
        "peripheral vision training",
        "visual attention game",
        "speed reading practice",
        "number sequence game",
        "visual processing training",
        "attention span improvement",
        "cognitive speed exercise",
    ].join(", "),
    openGraph: {
        title: "Schulte Table - Train Your Peripheral Vision & Attention",
        description: "Challenge yourself to find numbers in sequence while developing faster visual processing. Scientifically proven to enhance reading speed and attention.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
};

export default function SchultePage() {
  return (
      <GamePageTemplate
          gameId="schulte-table"
          title="Schulte Table"
          subtitle="Enhance your attention and peripheral vision"
          gameComponent={<SchulteGame />}
          howToPlay={
              <>
                  <p>
                      Find and click numbers in ascending order (1-25) as
                      quickly as possible. Try to use your peripheral vision
                      instead of scanning each number!
                  </p>
                  <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="outline" className="mt-4">
                              Watch Demo
                          </Button>
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
                  icon: <Eye className="w-10 h-10" />,
                  title: "Visual Processing",
                  description:
                      "Improve your ability to quickly process visual information and expand your field of vision.",
              },
              {
                  icon: <Brain className="w-10 h-10" />,
                  title: "Focus Training",
                  description:
                      "Enhance concentration and attention span through systematic visual search exercises.",
              },
              {
                  icon: <BookOpen className="w-10 h-10" />,
                  title: "Reading Speed",
                  description:
                      "Develop faster reading skills by training your eyes to capture more information at once.",
              },
          ]}
          faq={[
              {
                  question: "How does the Schulte Table work?",
                  answer: "The Schulte Table trains your brain to process visual information more efficiently by forcing you to maintain focus while using peripheral vision to locate numbers quickly.",
              },
              {
                  question: "What is the best way to practice?",
                  answer: "Try to keep your eyes fixed on the center of the table and use your peripheral vision to spot numbers. Practice daily for 10-15 minutes for best results.",
              },
              {
                  question: "How does this help with reading speed?",
                  answer: "By training your peripheral vision, you can perceive more text at once while reading. This reduces the number of eye movements needed, allowing you to process information faster and read more efficiently.",
              },
              {
                  question: "Is this exercise backed by research?",
                  answer: "Yes, the Schulte Table has been used in cognitive psychology for decades. Research shows it effectively improves visual attention, processing speed, and can help with conditions like ADHD by strengthening attention networks.",
              },
          ]}
      />
  );
}

export const runtime = "edge";
