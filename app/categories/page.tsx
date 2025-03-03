import { Metadata } from "next";
import GameCategories from "@/components/game-categories";

export const metadata: Metadata = {
  title: "Game Categories | Brain Training",
  description: "Browse our brain training games by cognitive skill category.",
};


export default function CategoriesPage() {
  return (
      <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Game Categories</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
              Browse our collection of brain training games by cognitive skill
              category. Each category focuses on a different aspect of mental
              performance.
          </p>
          <GameCategories gameId="all" displayAll={true} />
      </div>
  );
} 