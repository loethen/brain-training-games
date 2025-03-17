import { getCategory, type Category } from "./categories";

// 游戏和类别之间的关系映射
const gameCategoryMap: Record<string, string[]> = {
  "schulte-table": ["selective-attention", "visual-tracking", "reaction-time"],
  "dual-n-back": ["working-memory", "divided-attention"],
  "fish-trace": ["visual-tracking", "sustained-attention"],
  "frog-memory-leap": ["working-memory", "visual-tracking"],
  "larger-number": ["reaction-time", "selective-attention"],
  "mahjong-dual-n-back": ["working-memory", "divided-attention", "cognitive-flexibility"],
  "block-memory-challenge": ["working-memory", "visual-tracking"],
  // 其他游戏...
};

// 获取特定游戏的所有类别
export function getGameCategories(gameId: string): Category[] {
  const categoryIds = gameCategoryMap[gameId] || [];
  return categoryIds.map(id => getCategory(id)).filter(Boolean) as Category[];
}

// 获取特定类别的所有游戏
export function getCategoryGames(categoryId: string): string[] {
  return Object.entries(gameCategoryMap)
    .filter(([, categories]) => categories.includes(categoryId))
    .map(([gameId]) => gameId);
} 