import { getCategoryBySlug, categories } from "@/data/categories";
import { getCategoryGames } from "@/data/game-categories";
import { getGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    title: `${category.name} Games - Brain Training & Cognitive Enhancement`,
    description: `Explore our collection of brain training games that focus on ${category.name.toLowerCase()}. ${category.description}`,
    keywords: category.keywords?.join(", ") || `${category.name.toLowerCase()} games, brain training, cognitive enhancement`,
    openGraph: {
      title: `${category.name} Training Games - Improve Your Cognitive Skills`,
      description: `Enhance your ${category.name.toLowerCase()} with our specialized brain training games. Free, effective, and scientifically-informed exercises.`,
      images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
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
      <div className="max-w-7xl mx-auto py-8">
          <Breadcrumbs
              items={[
                  { label: "Categories", href: "/categories" },
                  { label: category.name },
              ]}
          />

          <h1 className="text-3xl font-bold mt-12 mb-8 text-center">
              {category.name} Games
          </h1>
          <p className="text-semibold mb-12 max-w-4xl mx-auto text-center leading-8">{category.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {games.map((game) => (
                  <GameCard key={game.id} game={game} />
              ))}
          </div>
      </div>
  );
} 