import { getCategoryBySlug, categories, Category } from "@/data/categories";
import { getCategoryGames } from "@/data/game-categories";
import { getGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const category = getCategoryBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'categories' });
  
  if (!category) {
    return {
      title: t('categoryNotFound'),
      description: t('categoryNotFoundDesc')
    };
  }
  
  const categoryName = t(`categoryNames.${category.id}`, { defaultMessage: category.name });
  const categoryDescription = t(`categoryDescriptions.${category.id}`, { defaultMessage: category.description });
  
  return {
    title: t('categoryMetaTitle', { 
      categoryName: categoryName 
    }),
    description: t('categoryMetaDescription', { 
      categoryName: categoryName.toLowerCase(),
      categoryDescription: categoryDescription
    }),
    keywords: category.keywords?.join(", ") || `${categoryName.toLowerCase()} games, brain training, cognitive enhancement`,
    openGraph: {
      title: t('categoryOgTitle', { 
        categoryName: categoryName 
      }),
      description: t('categoryOgDescription', { 
        categoryName: categoryName.toLowerCase() 
      }),
      images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// 定义游戏类型
interface Game {
  id: string;
  title: string;
  description: string;
  slug: string;
  preview?: React.ReactNode;
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return <div>Category not found</div>;
  }
  
  const categoryGames = getCategoryGames(category.id);
  const games = getGames().filter(game => categoryGames.includes(game.id));
  
  return (
      <div className="max-w-7xl mx-auto py-8">
          <ClientContent category={category} games={games} />
      </div>
  );
}

// 客户端组件，用于处理翻译
function ClientContent({ category, games }: { category: Category, games: Game[] }) {
  const t = useTranslations('categories');
  const categoryName = t(`categoryNames.${category.id}`, { defaultMessage: category.name });
  const categoryDescription = t(`categoryDescriptions.${category.id}`, { defaultMessage: category.description });
  
  return (
    <>
      <Breadcrumbs
          items={[
              { label: t('title'), href: "/categories" },
              { label: categoryName },
          ]}
      />

      <h1 className="text-3xl font-bold mt-12 mb-8 text-center">
          {t('categoryGamesHeading', { categoryName: categoryName })}
      </h1>
      <p className="text-semibold mb-12 max-w-4xl mx-auto text-center leading-8">{categoryDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
              <GameCard key={game.id} game={game} preview={game.preview} />
          ))}
      </div>
    </>
  );
} 