export type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string; // Optional icon name for visual representation
};

export type GameCategory = {
  gameId: string;
  categoryIds: string[];
};

// Define all categories
export const categories: Category[] = [
  {
    id: "working-memory",
    name: "Working Memory",
    description: "Games that train your ability to hold and manipulate information in your mind temporarily.",
    slug: "working-memory",
    icon: "Brain"
  },
  {
    id: "attention",
    name: "Attention",
    description: "Games that improve focus and the ability to concentrate on specific stimuli.",
    slug: "attention",
    icon: "Focus"
  },
  {
    id: "processing-speed",
    name: "Processing Speed",
    description: "Games that enhance how quickly you can process and respond to information.",
    slug: "processing-speed",
    icon: "Zap"
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    description: "Games that develop your ability to find solutions to complex problems.",
    slug: "problem-solving",
    icon: "PuzzlePiece"
  },
  {
    id: "visual-processing",
    name: "Visual Processing",
    description: "Games that improve your ability to interpret and understand visual information.",
    slug: "visual-processing",
    icon: "Eye"
  }
];

// Map games to their categories
export const gameCategoryMappings: GameCategory[] = [
  {
    gameId: "dual-n-back",
    categoryIds: ["working-memory", "attention"]
  },
  {
    gameId: "pattern-recall-challenge",
    categoryIds: ["working-memory", "visual-processing"]
  },
  {
    gameId: "larger-number",
    categoryIds: ["processing-speed", "attention"]
  }
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