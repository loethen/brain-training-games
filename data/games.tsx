import { GamePreview as SimonGamePreview } from "@/app/[locale]/(main)/games/block-memory-challenge/components/GamePreview";
import { GamePreview as SchulteTableGamePreview } from "@/app/[locale]/(main)/games/schulte-table/components/GamePreview";
import { ImagePreview } from "@/components/image-preview";

export type Game = {
  id: string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  preview?: React.ReactNode;
  categories: string[];
};

export const games: Game[] = [
    {
        id: "dual-n-back",
        title: "Dual N-Back",
        description:
            "A challenging memory task that trains working memory by requiring you to remember both visual and auditory stimuli N steps back.",
        slug: "dual-n-back",
        preview: <ImagePreview src="/games/dual-n-back.png" />,
        categories: ["working-memory", "divided-attention"],
    },
    {
        id: "fish-trace",
        title: "Glowing Fish Trace",
        description:
            "Improve visual tracking abilities by following glowing fish in a dynamic underwater environment.",
        slug: "fish-trace",
        preview: <ImagePreview src="/games/fish-trace.png" />,
        categories: ["visual-tracking", "sustained-attention"],
    },
    {
        id: "frog-memory-leap",
        title: "Frog Memory Leap",
        description:
            "Challenge your sequential memory by remembering the order of frog jumps across lily pads.",
        slug: "frog-memory-leap",
        preview: <ImagePreview src="/games/frog-memory-leap.png" />,
        categories: ["working-memory", "visual-tracking"],
    },
    {
        id: "larger-number",
        title: "Larger Number",
        description:
            "Quickly identify the larger of two numbers to train processing speed and attention.",
        slug: "larger-number",
        preview: <ImagePreview src="/games/larger-number.png" />,
        categories: ["reaction-time", "selective-attention"],
    },
    {
        id: "mahjong-dual-n-back",
        title: "Mahjong Dual N-Back",
        description:
            "A variant of Dual N-Back using mahjong tiles and sounds to train working memory and cognitive skills.",
        slug: "mahjong-dual-n-back",
        preview: <ImagePreview src="/games/mahjong-dual-n-back.png" />,
        categories: ["working-memory", "divided-attention", "cognitive-flexibility"],
    },
    {
        id: "block-memory-challenge",
        title: "Block Memory Challenge",
        description:
            "Test your visual memory by recalling increasingly complex block sequences.",
        slug: "block-memory-challenge",
        preview: <SimonGamePreview />,
        categories: ["working-memory", "visual-tracking"],
    },
    {
        id: "schulte-table",
        title: "Schulte Table",
        description:
            "Enhance peripheral vision and attention by finding numbers in sequence on a grid as quickly as possible.",
        slug: "schulte-table",
        preview: <SchulteTableGamePreview />,
        categories: ["selective-attention", "visual-tracking", "reaction-time"],
    },
    {
        id: "reaction-time",
        title: "Reaction Time Test",
        description:
            "Measure your response speed to visual stimuli and understand your baseline reaction time.",
        slug: "reaction-time",
        preview: <ImagePreview src="/games/reaction-time.png" />,
        categories: ["reaction-time", "selective-attention", "sustained-attention"],
    },
    // Add more games as you create them
];

export function getGames(): Game[] {
  return games;
}

export function getGame(id: string): Game | undefined {
  return games.find(game => game.id === id);
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find(game => game.slug === slug);
}

export function getGamesByCategory(categoryId: string): Game[] {
  return games.filter(game => game.categories.includes(categoryId));
}

export function getGameCategories(gameId: string): string[] {
  const game = getGame(gameId);
  return game ? game.categories : [];
} 