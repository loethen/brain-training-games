import { Metadata } from 'next'
import Game from './components/Game'
import { GameHeader } from '@/components/GameHeader'

export const metadata: Metadata = {
    title: "Glowing Fish Trace - Visual Tracking & Attention Training Game",
    description:
        "Improve visual tracking abilities by following glowing fish in a dynamic underwater environment. Train your attention, working memory, and focus through progressive challenges.",
    keywords: [
        "visual tracking exercise",
        "attention training game",
        "fish tracking game",
        "working memory practice",
        "visual focus training",
        "multiple object tracking",
        "cognitive enhancement game",
        "visual attention exercise",
    ].join(", "),
    openGraph: {
        title: "Glowing Fish Trace - Train Your Visual Tracking Skills",
        description: "Follow the glowing fish and remember which ones were highlighted. Enhance your visual attention and working memory through engaging underwater challenges.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    }
};

export default function FishPage() {
  return (
    <div className="max-w-7xl mx-auto">
        <GameHeader 
          title="Glowing Fish Challenge" 
          subtitle="Master visual tracking by following glowing fish patterns" 
        />

        {/* Game area */}
        <section className="mb-16">
            <div className="max-w-3xl mx-auto bg-muted/50 rounded-xl aspect-[4/3]">
                <Game />
            </div>
        </section>

        {/* Game rules explanation */}
        <section className="max-w-3xl mx-auto mb-16 space-y-6">
            <div className="p-6 rounded-lg bg-muted/50">
                <h3 className="text-xl font-semibold mb-3">🎯 Game Objective</h3>
                <div className="space-y-3 text-lg text-muted-foreground">
                    <p>🔍 Track multiple glowing fish simultaneously</p>
                    <p>🧠 Improve visual working memory capacity</p>
                    <p>⏱️ Enhance sustained attention duration</p>
                    <p>📈 Progressive difficulty levels</p>
                    
                    <div className="mt-6 pt-4 border-t border-muted-foreground/20">
                        <p className="font-semibold mb-2">Cognitive Benefits:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Strengthens visual tracking abilities</li>
                            <li>Develops divided attention skills</li>
                            <li>Improves reaction time accuracy</li>
                            <li>Enhances spatial awareness</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Features introduction */}
        <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">
                Why Play Glowing Fish Trace?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2">
                        👁️ Visual Tracking
                    </h3>
                    <p>
                        Train your eyes to follow multiple moving targets 
                        simultaneously - essential for reading and sports
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">
                        🧠 Cognitive Load
                    </h3>
                    <p>
                        Gradually increasing complexity challenges your 
                        working memory and attention control
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">
                        ⏱️ Reaction Time
                    </h3>
                    <p>
                        Improve decision-making speed while maintaining 
                        accuracy under time pressure
                    </p>
                </div>
            </div>
        </section>

        {/* FAQ section */}
        <section className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">Game Benefits FAQ</h2>
            <div className="space-y-4">
                <details className="bg-muted/50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                        How does visual tracking improve focus?
                    </summary>
                    <p className="mt-2">
                        Tracking moving objects activates the brain&apos;s 
                        attention networks, strengthening neural pathways 
                        responsible for sustained focus and information filtering.
                    </p>
                </details>
                <details className="bg-muted/50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                        Ideal play duration for best results?
                    </summary>
                    <p className="mt-2">
                        15-20 minute sessions 3-4 times weekly provide optimal 
                        cognitive stimulation while avoiding mental fatigue.
                    </p>
                </details>
            </div>
        </section>

        {/* Tags section */}
        <section className="mt-16 border-t pt-8">
            <div className="text-center">
                <h3 className="text-sm text-muted-foreground mb-4">
                    Training Categories
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                        Visual Tracking
                    </span>
                    <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                        Focus Training
                    </span>
                    <span className="bg-secondary/50 text-secondary-foreground text-sm px-3 py-1.5 rounded-full">
                        Cognitive Training
                    </span>
                </div>
            </div>
        </section>
    </div>
  );
} 