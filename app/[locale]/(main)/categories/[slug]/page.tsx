import { getCategoryBySlug } from "@/data/categories";
import { getGamesByCategory } from "@/data/games";
import GameCard from "@/components/game-card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const category = getCategoryBySlug(slug);
  
  // Load translations once with a merged namespace
  const t = await getTranslations({ locale, namespace: 'categories' });
  
  if (!category) {
    return {
      title: t('categoryNotFound'),
      description: t('categoryNotFoundDesc')
    };
  }
  
  const categoryName = t(`categoryNames.${category.id}`, { defaultMessage: category.name });
  const categoryDescription = t(`categoryDescriptions.${category.id}`, { defaultMessage: category.description });
  
  // 翻译关键词
  let translatedKeywords = '';
  if (category.keywords && category.keywords.length > 0) {
    try {
      // Use the same translation function by adjusting the path structure in translation files
      const translatedKeywordsArray = category.keywords.map(keyword => 
        t(`keywords.${category.id}.${keyword}`, { defaultMessage: keyword })
      );
      translatedKeywords = translatedKeywordsArray.join(", ");
    } catch {
      // 如果翻译失败，使用原始关键词
      translatedKeywords = category.keywords.join(", ");
    }
  } else {
    translatedKeywords = `${categoryName.toLowerCase()} games, brain training, cognitive enhancement`;
  }
  
  return {
    title: t('categoryMetaTitle', { 
      categoryName: categoryName 
    }),
    description: t('categoryMetaDescription', { 
      categoryName: categoryName.toLowerCase(),
      categoryDescription: categoryDescription
    }),
    keywords: translatedKeywords,
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

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return <div>Category not found</div>;
  }
  
  const games = getGamesByCategory(category.id);
  
  // 获取服务器端翻译
  const t = await getTranslations({ locale, namespace: 'categories' });
  const categoryName = t(`categoryNames.${category.id}`, { defaultMessage: category.name });
  const categoryDescription = t(`categoryDescriptions.${category.id}`, { defaultMessage: category.description });
  const categoryGamesHeading = t('categoryGamesHeading', { categoryName: categoryName });
  const categoriesTitle = t('title');
  
  return (
    <div className="max-w-7xl mx-auto py-8">
      <Breadcrumbs
        items={[
          { label: categoriesTitle, href: "/categories" },
          { label: categoryName },
        ]}
      />

      <h1 className="text-3xl font-bold mt-12 mb-8 text-center">
        {categoryGamesHeading}
      </h1>
      <p className="text-semibold mb-12 max-w-4xl mx-auto text-center leading-8">{categoryDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} preview={game.preview} />
        ))}
      </div>
    </div>
  );
} 