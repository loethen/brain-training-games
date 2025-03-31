import { Metadata } from "next";
import GameCategories from "@/components/game-categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// 使用动态生成元数据替代静态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords').split(',').map(keyword => keyword.trim()),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
  };
}

export default function CategoriesPage() {
  const t = useTranslations('categories');
  
  return (
      <div className="container mx-auto py-8">
        <Breadcrumbs items={[
          { label: t('title') },
        ]} />
          <h1 className="text-3xl font-bold mt-12 mb-8 text-center">
            {t('heading')}
          </h1>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
            {t('description')}
          </p>
          <div className="max-w-2xl mx-auto">
            <GameCategories gameId="all" displayAll={true} />
          </div>
      </div>
  );
} 