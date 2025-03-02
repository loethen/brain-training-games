import { Category, categories } from "./categories";

export type GameCategory = {
  gameId: string;
  categoryIds: string[];
};

// Map games to their categories
export const gameCategoryMappings: GameCategory[] = [
  {
    gameId: "dual-n-back",
    categoryIds: ["working-memory", "divided-attention"]
  },
  {
    gameId: "fish-trace",
    categoryIds: ["visual-tracking", "sustained-attention"]
  },
  {
    gameId: "frog-memory-leap",
    categoryIds: ["working-memory", "visual-tracking"]
  },
  {
    gameId: "larger-number",
    categoryIds: ["reaction-time", "selective-attention"]
  },
  {
    gameId: "mahjong-dual-n-back",
    categoryIds: ["working-memory", "divided-attention", "cognitive-flexibility"]
  },
  {
    gameId: "pattern-recall-challenge",
    categoryIds: ["working-memory", "visual-tracking"]
  },
  {
    gameId: "schulte-table",
    categoryIds: ["selective-attention", "visual-tracking", "reaction-time"]
  },
  // Add more game-category mappings as you create more games
];

// Helper functions
export function getGameCategories(gameId: string): Category[] {
  const mapping = gameCategoryMappings.find(m => m.gameId === gameId);
  if (!mapping) return [];
  
  return categories.filter(category => mapping.categoryIds.includes(category.id));
}

export function getCategoryGames(categoryId: string): string[] {
  return gameCategoryMappings
    .filter(mapping => mapping.categoryIds.includes(categoryId))
    .map(mapping => mapping.gameId);
} 