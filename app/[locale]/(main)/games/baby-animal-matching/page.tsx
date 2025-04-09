import { Metadata } from "next";
import BabyAnimalMatchingGame from "./components/Game";
import { GamePageTemplate } from '@/components/GamePageTemplate';
import { Brain, Eye, Search } from 'lucide-react'; // Example icons
import { useTranslations } from 'next-intl';

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
    // Initialize translations for the 'games.babyAnimalMatching' namespace
    const t = useTranslations('games.babyAnimalMatching');

    // Use translation keys
    const title = t('title');
    const subtitle = t('subtitle');
    const howToPlayIntro = t('howToPlayIntro');
    // Construct the steps array using translation keys
    const howToPlaySteps = [
        t('howToPlayStep1'),
        t('howToPlayStep2'),
        t('howToPlayStep3'),
        t('howToPlayStep4'),
        t('howToPlayStep5'),
        t('howToPlayStep6'),
        t('howToPlayStep7')
    ];
    // Construct the benefits array using translation keys
    const benefits: Benefit[] = [
        { icon: <Brain className="w-10 h-10" />, title: t('benefit1_title'), description: t('benefit1_desc') },
        { icon: <Eye className="w-10 h-10" />, title: t('benefit2_title'), description: t('benefit2_desc') },
        { icon: <Search className="w-10 h-10" />, title: t('benefit3_title'), description: t('benefit3_desc') }
    ];
    // Construct the FAQ array using translation keys
    const faq: FAQItem[] = [
        { question: t('faq1_question'), answer: t('faq1_answer') },
        { question: t('faq2_question'), answer: t('faq2_answer') },
        { question: t('faq3_question'), answer: t('faq3_answer') }
    ];

    return (
        <GamePageTemplate
            gameId="baby-animal-matching"
            title={title} // Use translated title
            subtitle={subtitle} // Use translated subtitle
            gameComponent={<BabyAnimalMatchingGame />}
            howToPlay={
                <>
                    <p>{howToPlayIntro}</p> {/* Use translated intro */}
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {howToPlaySteps.map((step: string, index: number) => (
                            <li key={index}>{step}</li> // Use translated steps
                        ))}
                    </ul>
                </>
            }
            // Map directly from the constructed arrays
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