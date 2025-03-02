import { getCategoryBySlug, categories } from "@/data/categories";
import { getCategoryGames } from "@/data/game-categories";
import { getGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    };
  }
  
  return {
    title: `${category.name} Games - Brain Training`,
    description: `Explore our collection of brain training games that focus on ${category.name.toLowerCase()}. ${category.description}`
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  
  if (!category) {
    return <div>Category not found</div>;
  }
  
  const categoryGames = getCategoryGames(category.id);
  const games = getGames().filter(game => categoryGames.includes(game.id));
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name} Games</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        {category.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
} 