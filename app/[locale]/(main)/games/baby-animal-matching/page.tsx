import { Metadata } from "next";
import BabyAnimalMatchingGame from "./components/Game";
import { GamePageTemplate } from '@/components/GamePageTemplate';
import { Brain, Eye, Search } from 'lucide-react'; // Example icons
// import { useTranslations } from 'next-intl';
// import { getTranslations } from "next-intl/server";

// Define types for placeholders
interface Benefit {
    icon: React.ReactNode;
    title: string;
    description: string;
}
interface FAQItem {
    question: string;
    answer: string;
}

// Simplified metadata generation without translations
export async function generateMetadata(): Promise<Metadata> {
    // Placeholder metadata
    const title = "Baby Animal Matching Game";
    const description = "Test your visual memory by matching pairs of cute baby animals.";
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            // images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }], // Add specific image later
        },
    }
}

export default function BabyAnimalMatchingPageContainer() {
    // Using direct English strings
    const title = "Baby Animal Matching";
    const subtitle = "Test your visual memory!";
    const howToPlayIntro = "Find all the matching pairs of baby animals!";
    const howToPlaySteps = [
        "Click 'Easy' or 'Medium' to start.",
        "Click on a card to flip it over.",
        "Click on a second card.",
        "If the animals match, the cards stay face up.",
        "If they don't match, they flip back over after a second.",
        "Match all pairs to win!"
    ];
    const benefits: Benefit[] = [
        { icon: <Brain className="w-10 h-10" />, title: "Working Memory", description: "Challenges your ability to hold and manipulate visual information." },
        { icon: <Eye className="w-10 h-10" />, title: "Visual Recognition", description: "Improves speed and accuracy in recognizing visual patterns." },
        { icon: <Search className="w-10 h-10" />, title: "Concentration", description: "Requires focus to remember card locations." }
    ];
    const faq: FAQItem[] = [
        { question: "Is this game suitable for young children?", answer: "Yes, the simple rules and cute visuals make it great for kids."}, 
        { question: "How does difficulty affect the game?", answer: "'Easy' has 12 cards (6 pairs) and 'Medium' has 16 cards (8 pairs)."}
    ];

    return (
        <GamePageTemplate
            gameId="baby-animal-matching"
            title={title} // Direct string
            subtitle={subtitle} // Direct string
            gameComponent={<BabyAnimalMatchingGame />}
            howToPlay={
                <>
                    <p>{howToPlayIntro}</p> 
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {howToPlaySteps.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </>
            }
            // Map directly from placeholder arrays
            benefits={benefits.map((b) => ({ 
                icon: b.icon, 
                title: b.title,
                description: b.description
            }))}
            faq={faq.map((f) => ({ 
                question: f.question,
                answer: f.answer
            }))}
            relatedGames={["block-memory-challenge", "frog-memory-leap"]} 
        />
    );
} 