import { Metadata } from "next";
import { getGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from 'next-intl/server';
// import { useTranslations } from 'next-intl'; // Removed
import { generateAlternates } from '@/lib/utils';

// 将静态元数据改为动态生成函数
export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'games' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        keywords: t('metaKeywords').split(',').map(keyword => keyword.trim()),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
        },
        // 多语言替代版本
        alternates: generateAlternates(locale, 'games'),
    };
}

export default async function GamesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const games = getGames();
    const t = await getTranslations({ locale, namespace: 'games' });
    const categoryT = await getTranslations({ locale, namespace: 'categories.categoryNames' });

    return (
        <div className="mx-auto">
            <Breadcrumbs items={[{ label: t('title') }]} />

            <h1 className="text-3xl font-bold mt-12 mb-4 text-center">
                {t('heading')}
            </h1>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
                {t('description')}
            </p>

            {/* 类别筛选 */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('filters.all')}
                </Button>

                {categories.slice(0, 6).map((category) => (
                    <Link key={category.id} href={`/categories/${category.slug}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                        >
                            {categoryT(category.slug)}
                        </Button>
                    </Link>
                ))}

                <Link href="/categories">
                    <Button variant="outline" size="sm" className="rounded-full">
                        {t('filters.more')}
                    </Button>
                </Link>
            </div>

            {/* 游戏网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} preview={game.preview} />
                ))}
            </div>

            {/* 关于认知训练的信息 */}
            <section className="my-16 p-8 bg-muted rounded-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {t('aboutBrainTraining.title')}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        {t('aboutBrainTraining.paragraph1')}
                    </p>
                    <p>
                        {t('aboutBrainTraining.paragraph2')}
                    </p>
                    <p>
                        {t('aboutBrainTraining.paragraph3')}
                    </p>
                </div>
            </section>

            {/* 推荐训练计划 */}
            <section className="mt-16 mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">
                    {t('trainingPlans.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-2">
                            {t('trainingPlans.focus.title')}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {t('trainingPlans.focus.description')}
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                                <Link href="/games/schulte-table" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.focus.item1')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/fish-trace" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.focus.item2')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/larger-number" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.focus.item3')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-2">
                            {t('trainingPlans.memory.title')}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {t('trainingPlans.memory.description')}
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                                <Link href="/games/dual-n-back" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.memory.item1')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/block-memory-challenge" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.memory.item2')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/frog-memory-leap" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.memory.item3')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-2">
                            {t('trainingPlans.flexibility.title')}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {t('trainingPlans.flexibility.description')}
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                                <Link href="/games/mahjong-dual-n-back" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.flexibility.item1')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/larger-number" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.flexibility.item2')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/games/stroop-effect-test" className="hover:text-primary hover:underline">
                                    {t('trainingPlans.flexibility.item3')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
} 