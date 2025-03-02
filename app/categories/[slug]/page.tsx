import { categories, getCategoryGames } from "@/app/data/categories";
import { getGames, Game } from "@/app/data/games";
import GameCard from "@/components/game-card";
import { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = categories.find(c => c.slug === params.slug);
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }
  
  return {
    title: `${category.name} Games | Brain Training`,
    description: category.description,
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find(c => c.slug === params.slug);
  if (!category) return <div>Category not found</div>;
  
  const gameIds = getCategoryGames(category.id);
  const games = getGames().filter(game => gameIds.includes(game.id));
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-8">{category.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
} 