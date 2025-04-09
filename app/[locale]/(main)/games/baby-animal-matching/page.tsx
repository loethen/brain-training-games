import { Metadata } from "next";
import BabyAnimalMatchingGame from "./components/Game";
import { GamePageTemplate } from '@/components/GamePageTemplate';
import { Brain, Eye, Search } from 'lucide-react'; // Example icons

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

// Enhanced metadata generation for better SEO
export async function generateMetadata(): Promise<Metadata> {
    // Primary keyword: Baby Animal Matching Game
    const title = "Baby Animal Matching Game | Memory Training for Kids & Adults";
    const description = "Play our free Baby Animal Matching Game online! Improve memory, focus and visual recognition skills with cute animal pairs. Fun brain training for all ages.";
    
    return {
        title,
        description,
        keywords: [
            "baby animal matching game",
            "memory game",
            "matching game",
            "kids memory game",
            "animal matching game",
            "brain training game",
            "concentration game",
            "focus training game",
        ],
        openGraph: {
            title: "Baby Animal Matching Game - Test Your Memory With Cute Animals",
            description:
                "Match pairs of adorable baby animals in this fun memory game. Perfect for improving concentration and visual memory in children and adults.",
            type: "website",
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Baby Animal Matching Game | Train Your Memory",
            description:
                "Test your memory skills by matching cute baby animal pairs in this free online game.",
        },
        alternates: {
            canonical: "/games/baby-animal-matching",
        },
    };
}

export default function BabyAnimalMatchingPageContainer() {
    // Using direct English strings
    const title = "Baby Animal Matching Game";
    const subtitle = "Test your memory with cute baby animals!";
    const howToPlayIntro = "Find all the matching pairs of baby animals in this memory card game!";
    const howToPlaySteps = [
        "Select your difficulty level to start",
        "Click on a card to flip it over and reveal a baby animal",
        "Click on a second card to find its matching pair",
        "If the animals match, the cards stay face up",
        "If they don't match, they flip back over after a moment",
        "Remember card positions to find matches faster",
        "Match all pairs in the fewest moves to win!"
    ];
    const benefits: Benefit[] = [
        { icon: <Brain className="w-10 h-10" />, title: "Working Memory", description: "Challenges your ability to hold and manipulate visual information in your mind." },
        { icon: <Eye className="w-10 h-10" />, title: "Visual Recognition", description: "Improves speed and accuracy in recognizing and differentiating visual patterns." },
        { icon: <Search className="w-10 h-10" />, title: "Concentration", description: "Strengthens your focus and attention span by requiring you to remember card locations." }
    ];
    const faq: FAQItem[] = [
        { question: "Is this baby animal matching game suitable for young children?", answer: "Yes! The simple rules, cute animal visuals, and adjustable difficulty levels make it perfect for children as young as 3-4 years old with parental guidance."}, 
        { question: "How does difficulty affect the baby animal matching game?", answer: "The game offers multiple difficulty levels: Easy (3×2 grid with 3 pairs), Medium (4×2 grid with 4 pairs), Hard (4×3 grid with 6 pairs), and Expert (4×4 grid with 8 pairs). Higher difficulties require remembering more card positions."},
        { question: "What cognitive benefits does this memory matching game provide?", answer: "This game enhances working memory, visual recognition, pattern matching skills, and concentration. Regular play can improve focus and attention to detail in both children and adults."}
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
            relatedGames={["schulte-table", "block-memory-challenge", "reaction-time"]} 
        />
    );
} 