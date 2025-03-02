import { categories } from "@/app/data/categories";
import Link from "next/link";
import { Brain, Focus, Zap, PuzzlePiece, Eye } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Categories | Brain Training",
  description: "Browse our brain training games by cognitive skill category.",
};

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-6 w-6" />,
  Focus: <Focus className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  PuzzlePiece: <PuzzlePiece className="h-6 w-6" />,
  Eye: <Eye className="h-6 w-6" />
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Game Categories</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Browse our collection of brain training games by cognitive skill category. Each category focuses on a different aspect of mental performance.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Link 
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block p-6 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              {category.icon && (
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {iconMap[category.icon]}
                </div>
              )}
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 