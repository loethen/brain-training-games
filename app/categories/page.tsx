import { Metadata } from "next";
import GameCategories from "@/components/game-categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
export const metadata: Metadata = {
  title: "Game Categories | Brain Training",
  description: "Browse our brain training games by cognitive skill category.",
};


export default function CategoriesPage() {
  return (
      <div className="container mx-auto py-8">
        <Breadcrumbs items={[
          { label: 'Categories' },
        ]} />
          <h1 className="text-3xl font-bold mt-12 mb-8 text-center">Game Categories</h1>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
              Browse our collection of brain training games by cognitive skill
              category. Each category focuses on a different aspect of mental
              performance.
          </p>
          <div className="max-w-2xl mx-auto">
            <GameCategories gameId="all" displayAll={true} />
          </div>
      </div>
  );
} 