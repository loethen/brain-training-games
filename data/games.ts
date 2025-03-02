export type Game = {
  id: string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

export const games: Game[] = [
  {
    id: "dual-n-back",
    title: "Dual N-Back",
    description: "A challenging memory task that trains working memory by requiring you to remember both visual and auditory stimuli N steps back.",
    slug: "dual-n-back",
    difficulty: "hard"
  },
  {
    id: "fish-trace",
    title: "Glowing Fish Trace",
    description: "Improve visual tracking abilities by following glowing fish in a dynamic underwater environment.",
    slug: "fish-trace",
    difficulty: "medium"
  },
  {
    id: "frog-memory-leap",
    title: "Frog Memory Leap",
    description: "Challenge your sequential memory by remembering the order of frog jumps across lily pads.",
    slug: "frog-memory-leap",
    difficulty: "medium"
  },
  {
    id: "larger-number",
    title: "Larger Number",
    description: "Quickly identify the larger of two numbers to train processing speed and attention.",
    slug: "larger-number",
    difficulty: "easy"
  },
  {
    id: "mahjong-dual-n-back",
    title: "Mahjong Dual N-Back",
    description: "A variant of Dual N-Back using mahjong tiles and sounds to train working memory and fluid intelligence.",
    slug: "mahjong-dual-n-back",
    difficulty: "hard"
  },
  {
    id: "pattern-recall-challenge",
    title: "Pattern Recall Challenge",
    description: "Test your visual memory by recalling patterns of increasing complexity.",
    slug: "pattern-recall-challenge",
    difficulty: "medium"
  },
  {
    id: "schulte-table",
    title: "Schulte Table",
    description: "Enhance peripheral vision and attention by finding numbers in sequence on a grid as quickly as possible.",
    slug: "schulte-table",
    difficulty: "medium"
  }
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