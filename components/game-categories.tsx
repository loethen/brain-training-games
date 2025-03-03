import Link from "next/link";
import { getGameCategories } from "@/data/game-categories";
import { Brain, Focus, Zap, Puzzle, Eye, Target, Split, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-4 w-4" />,
  Focus: <Focus className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  PuzzlePiece: <Puzzle className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
  Target: <Target className="h-4 w-4" />,
  Split: <Split className="h-4 w-4" />,
  Shuffle: <Shuffle className="h-4 w-4" />
};

interface GameCategoriesProps {
  gameId: string;
  className?: string;
  displayAll?: boolean;
  showDescription?: boolean;
}

export default function GameCategories({ 
  gameId, 
  className,
  displayAll = false,
  showDescription = false
}: GameCategoriesProps) {
  const displayCategories = gameId === "all" || displayAll 
    ? categories 
    : getGameCategories(gameId);
  
  if (displayCategories.length === 0) return null;
  
  if (gameId === "all" || displayAll) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayCategories.map(category => (
          <Link 
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block p-6 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              {category.icon && (
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {iconMap[category.icon] || <div className="w-6 h-6" />}
                </div>
              )}
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            {showDescription && (
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayCategories.map(category => (
        <Link 
          key={category.id}
          href={`/categories/${category.slug}`}
          className="text-primary px-2 py-1 bg-muted rounded-md hover:bg-muted transition-colors flex items-center gap-1"
        >
          {category.icon && iconMap[category.icon]}
          {category.name}
        </Link>
      ))}
    </div>
  );
} 