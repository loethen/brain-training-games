import { Metadata } from 'next'
import { SchulteGame } from './components/SchulteGame'
import { GamePageTemplate } from '@/components/GamePageTemplate'

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
          <p>Find and click numbers in ascending order (1-25) as quickly as possible. Try to use your peripheral vision instead of scanning each number!</p>
        </>
      }
      benefits={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              👁️ Visual Processing
            </h3>
            <p>
              Improve your ability to quickly process visual
              information and expand your field of vision.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              🎯 Focus Training
            </h3>
            <p>
              Enhance concentration and attention span through
              systematic visual search exercises.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              📚 Reading Speed
            </h3>
            <p>
              Develop faster reading skills by training your eyes to
              capture more information at once.
            </p>
          </div>
        </div>
      }
      faq={
        <>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              How does the Schulte Table work?
            </summary>
            <p className="mt-2">
              The Schulte Table trains your brain to process visual information more efficiently by forcing you to maintain focus while using peripheral vision to locate numbers quickly.
            </p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              What is the best way to practice?
            </summary>
            <p className="mt-2">
              Try to keep your eyes fixed on the center of the table
              and use your peripheral vision to spot numbers.
              Practice daily for 10-15 minutes for best results.
            </p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              How does this help with reading speed?
            </summary>
            <p className="mt-2">
              By training your peripheral vision, you can perceive
              more text at once while reading. This reduces the
              number of eye movements needed, allowing you to
              process information faster and read more efficiently.
            </p>
          </details>
          <details className="bg-muted/50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              Is this exercise backed by research?
            </summary>
            <p className="mt-2">
              Yes, the Schulte Table has been used in cognitive
              psychology for decades. Research shows it effectively
              improves visual attention, processing speed, and can
              help with conditions like ADHD by strengthening
              attention networks.
            </p>
          </details>
        </>
      }
    />
  );
}

export const runtime = "edge";
