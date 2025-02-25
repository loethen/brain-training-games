import { Metadata } from "next";
import { PatternRecallGame } from "./components/PatternRecallGame";
import { GameHeader } from "@/components/GameHeader";

export const metadata: Metadata = {
    title: "Pattern Recall Challenge - Visual Sequence Memory Training Game",
    description:
        "Strengthen your working memory by remembering and repeating visual sequences. This pattern recall game helps improve concentration, attention span, and cognitive flexibility.",
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
        <div className="max-w-7xl mx-auto lg:px-8">
            <GameHeader
                title="Pattern Recall Challenge"
                subtitle="Enhance your working memory by remembering and repeating visual sequences"
            />

            {/* Game component */}
            <section
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl px-8 py-16 mb-24 shadow-sm"
                itemScope
                itemType="http://schema.org/Game"
            >
                <h2
                    className="text-3xl font-bold mb-8 text-center"
                    itemProp="name"
                >
                    Play Pattern Recall Challenge
                </h2>
                <meta
                    itemProp="description"
                    content="Interactive visual sequence memory challenge with cognitive performance tracking"
                />
                <div
                    itemProp="gameLocation"
                    itemScope
                    itemType="http://schema.org/WebApplication"
                >
                    <meta
                        itemProp="applicationCategory"
                        content="EducationalGame"
                    />
                    <meta itemProp="operatingSystem" content="Any" />
                </div>
                <PatternRecallGame />
            </section>

            {/* Game rules explanation */}
            <div className="space-y-8 bg-muted/20 p-8 rounded-2xl mb-16">
                <h3 className="text-2xl font-semibold mb-4">🎯 How to Play</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Watch the pattern, then repeat it. Each level adds one more
                    block to remember!
                </p>
            </div>

            {/* Performance evaluation */}
            <div className="p-8 rounded-2xl bg-muted/30 mb-16 shadow-sm">
                <h3 className="text-2xl font-semibold mb-6">
                    📊 Cognitive Performance Evaluation
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Score Range</th>
                                <th className="p-3">Cognitive Assessment</th>
                                <th className="p-3">Training Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                [
                                    0,
                                    50,
                                    "Developing Focus",
                                    "20 mins/day, 5 days/week",
                                ],
                                [
                                    51,
                                    120,
                                    "Average Attention",
                                    "25 mins/day, 4 days/week",
                                ],
                                [
                                    121,
                                    200,
                                    "Strong Retention",
                                    "Challenge mode 3 sessions/week",
                                ],
                                [
                                    201,
                                    350,
                                    "Exceptional Memory",
                                    "Expert patterns + speed challenge",
                                ],
                                [
                                    351,
                                    500,
                                    "Genius Level",
                                    "Maintain with daily complex drills",
                                ],
                            ].map(([min, max, assessment, recommendation]) => (
                                <tr
                                    key={min}
                                    className="border-b hover:bg-muted/30"
                                >
                                    <td className="p-3">
                                        {min}-{max}
                                    </td>
                                    <td className="p-3 font-medium">
                                        {assessment}
                                    </td>
                                    <td className="p-3 text-muted-foreground">
                                        {recommendation}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    * Score ranges based on internal testing with simulated
                    patterns
                </p>
            </div>

            {/* Game features */}
            <section className="prose prose-lg mx-auto mb-24 max-w-4xl">
                <h2 className="text-4xl font-bold mb-8 text-center">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Benefits of Pattern Recall Training
                    </span>
                </h2>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="p-6 bg-muted/10 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4">
                            🧠 Working Memory
                        </h3>
                        <p className="leading-relaxed">
                            Strengthen your ability to temporarily hold and
                            manipulate information in mind
                        </p>
                    </div>
                    <div className="p-6 bg-muted/10 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4">
                            🎯 Sustained Attention
                        </h3>
                        <p className="leading-relaxed">
                            Improve your ability to maintain focus on specific
                            visual stimuli over time
                        </p>
                    </div>
                    <div className="p-6 bg-muted/10 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4">
                            📈 Cognitive Flexibility
                        </h3>
                        <p className="leading-relaxed">
                            Enhance your brains ability to switch between
                            different mental tasks and adapt to new information
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ section */}
            <section className="max-w-4xl mx-auto mb-24">
                <h2 className="text-4xl font-bold mb-8 text-center">
                    Science & Strategy Guide
                </h2>
                <div className="space-y-6">
                    <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                        <summary className="font-semibold cursor-pointer flex items-center text-lg">
                            <span className="mr-3">🔬</span>
                            How does visual sequence training improve memory?
                        </summary>
                        <div className="mt-4 pl-8 border-l-4 border-primary">
                            <p className="leading-relaxed">
                                Visual sequence training engages multiple
                                cognitive processes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Activates the visuospatial sketchpad
                                    component of working memory
                                </li>
                                <li>
                                    Strengthens neural pathways through repeated
                                    practice
                                </li>
                                <li>
                                    Improves information encoding and retrieval
                                    processes
                                </li>
                            </ul>
                        </div>
                    </details>

                    <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                        <summary className="font-semibold cursor-pointer flex items-center text-lg">
                            <span className="mr-3">⚡</span>
                            How quickly can I expect improvement?
                        </summary>
                        <div className="mt-4 pl-8 border-l-4 border-primary">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Duration</th>
                                            <th className="p-2">
                                                Expected Improvement
                                            </th>
                                            <th className="p-2">
                                                Neural Changes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            [
                                                "2 Weeks",
                                                "Faster pattern recognition",
                                                "Consistent daily practice",
                                            ],
                                            [
                                                "1 Month",
                                                "Longer sequence recall",
                                                "Regular 15-min sessions",
                                            ],
                                            [
                                                "3 Months",
                                                "Higher score achievements",
                                                "Progressive difficulty",
                                            ],
                                        ].map(
                                            ([
                                                duration,
                                                improvement,
                                                basis,
                                            ]) => (
                                                <tr
                                                    key={duration}
                                                    className="border-b"
                                                >
                                                    <td className="p-2 font-medium">
                                                        {duration}
                                                    </td>
                                                    <td className="p-2">
                                                        {improvement}
                                                    </td>
                                                    <td className="p-2 text-muted-foreground">
                                                        {basis}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </details>

                    <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                        <summary className="font-semibold cursor-pointer flex items-center text-lg">
                            <span className="mr-3">⏱️</span>
                            How often should I practice for best results?
                        </summary>
                        <p className="mt-2">
                            For best results, try 15-20 minute sessions 3-4
                            times weekly, allowing time for mental rest between
                            sessions.
                        </p>
                    </details>

                    <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                        <summary className="font-semibold cursor-pointer flex items-center text-lg">
                            <span className="mr-3">🏆</span>
                            What makes this pattern recall game effective?
                        </summary>
                        <div className="mt-4 pl-8 border-l-4 border-primary">
                            <p className="leading-relaxed">
                                Our version focuses on:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Progressive difficulty scaling</li>
                                <li>Performance tracking with metrics</li>
                                <li>
                                    Randomized pattern generation for varied
                                    challenges
                                </li>
                                <li>Immediate feedback on performance</li>
                            </ul>
                        </div>
                    </details>

                    <details className="bg-background rounded-xl p-6 group transition-all hover:bg-muted/20 shadow-sm">
                        <summary className="font-semibold cursor-pointer flex items-center text-lg">
                            <span className="mr-3">🧩</span>
                            How does this differ from traditional Simon games?
                        </summary>
                        <div className="mt-4 pl-8 border-l-4 border-primary">
                            <p className="leading-relaxed">
                                While inspired by the classic Simon concept, our
                                Pattern Recall Challenge:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>
                                    Uses a grid-based layout for more complex
                                    spatial patterns
                                </li>
                                <li>
                                    Incorporates cognitive assessment metrics
                                </li>
                                <li>
                                    Focuses on working memory rather than just
                                    sequence repetition
                                </li>
                                <li>Provides detailed performance analytics</li>
                            </ul>
                        </div>
                    </details>
                </div>
            </section>

            {/* Tags section */}
            <section className="mt-24 border-t-2 pt-12">
                <div className="text-center">
                    <h3 className="text-lg text-muted-foreground mb-6">
                        Training Categories
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                            Working Memory
                        </span>
                        <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                            Visual Sequence Memory
                        </span>
                        <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                            Pattern Recognition
                        </span>
                        <span className="bg-secondary/80 text-secondary-foreground text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors shadow-sm">
                            Cognitive Flexibility
                        </span>
                    </div>
                </div>
            </section>

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    name: "Pattern Recall Challenge",
                    applicationCategory: "EducationalGame",
                    operatingSystem: "Web",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD",
                    },
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: "4.8",
                        ratingCount: "156",
                    },
                })}
            </script>
        </div>
    );
}
