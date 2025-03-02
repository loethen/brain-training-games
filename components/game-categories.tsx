import Link from "next/link";
import { getGameCategories } from "@/app/data/categories";
import { Brain, Focus, Zap, PuzzlePiece, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-4 w-4" />,
  Focus: <Focus className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  PuzzlePiece: <PuzzlePiece className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />
};

export default function GameCategories({ 
  gameId, 
  className 
}: { 
  gameId: string;
  className?: string;
}) {
  const categories = getGameCategories(gameId);
  
  if (categories.length === 0) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <span className="text-sm text-muted-foreground">Trains:</span>
      {categories.map(category => (
        <Link 
          key={category.id}
          href={`/categories/${category.slug}`}
          className="text-sm px-2 py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors flex items-center gap-1"
        >
          {category.icon && iconMap[category.icon]}
          {category.name}
        </Link>
      ))}
    </div>
  );
} 