import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";
import { Marquee } from "@/components/magicui/marquee";
import { cn, generateAlternates } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { BrainGameIcons } from "@/components/brain-game-icons";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { getGames } from "@/data/games";
import { getBlogPosts, type BlogPost } from "@/lib/blog";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { GamesScrollButtons } from "@/components/games-scroll-buttons";

// 为首页定义特定的元数据
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    // 首页特定标题
    title: t('metaTitle'),
    // 首页特定描述
    description: t('metaDescription'),
    // 首页特定关键词
    keywords: t('metaKeywords').split(',').map(keyword => keyword.trim()),
    // 首页特定 Open Graph 数据
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    // 多语言替代版本
    alternates: generateAlternates(locale),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const testimonials = await getTranslations({ locale, namespace: 'home.testimonials' });
    const games = getGames();
    const posts = await getBlogPosts(locale);
    
    // 第一组评价
    const firstRowReviews = [
        {
            name: testimonials('sarah.name'),
            username: testimonials('sarah.username'),
            body: testimonials('sarah.body'),
            gradient: "from-blue-400 to-cyan-500",
        },
        {
            name: testimonials('mike.name'),
            username: testimonials('mike.username'),
            body: testimonials('mike.body'),
            gradient: "from-purple-400 to-pink-500",
        },
        {
            name: testimonials('emma.name'),
            username: testimonials('emma.username'),
            body: testimonials('emma.body'),
            gradient: "from-green-400 to-emerald-500",
        },
        {
            name: testimonials('sophia.name'),
            username: testimonials('sophia.username'),
            body: testimonials('sophia.body'),
            gradient: "from-rose-400 to-pink-500",
        },
        {
            name: testimonials('liam.name'),
            username: testimonials('liam.username'),
            body: testimonials('liam.body'),
            gradient: "from-sky-400 to-blue-500",
        },
    ];
    
    // 第二组评价
    const secondRowReviews = [
        {
            name: testimonials('tom.name'),
            username: testimonials('tom.username'),
            body: testimonials('tom.body'),
            gradient: "from-orange-400 to-red-500",
        },
        {
            name: testimonials('lisa.name'),
            username: testimonials('lisa.username'),
            body: testimonials('lisa.body'),
            gradient: "from-yellow-400 to-amber-500",
        },
        {
            name: testimonials('david.name'),
            username: testimonials('david.username'),
            body: testimonials('david.body'),
            gradient: "from-indigo-400 to-violet-500",
        },
        {
            name: testimonials('olivia.name'),
            username: testimonials('olivia.username'),
            body: testimonials('olivia.body'),
            gradient: "from-teal-400 to-cyan-500",
        },
        {
            name: testimonials('ethan.name'),
            username: testimonials('ethan.username'),
            body: testimonials('ethan.body'),
            gradient: "from-amber-400 to-orange-500",
        },
    ];
    
    return (
        <div>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto p-6 md:p-12 md:mb-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-3/5 text-center md:text-left flex flex-col justify-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            {t("home.title")}
                        </h1>
                        <p className="sm:text-xl lg:text-2xl mb-8">
                            {t("home.subtitle")}
                        </p>
                        <div className="mb-4">
                            <Link href="/games">
                                <InteractiveHoverButton>
                                    {t("buttons.startPlaying")}
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-2/5 flex items-center justify-center py-4">
                        <BrainGameIcons />
                    </div>
                </div>
            </section>

            {/* Games Section */}
            <section className="mb-24 max-w-[1400px] mx-auto">
                <div className="px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">
                            {t("home.popularGames")}
                        </h2>
                        <Link href="/games">
                            <Button variant="ghost">
                                {t("buttons.viewAll")} →
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative group">
                    <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide px-6" id="games-container">
                        {games.map((game) => (
                            <div key={game.id} className="min-w-[300px] md:min-w-[400px] snap-start">
                                <GameCard game={game} preview={game.preview} />
                            </div>
                        ))}
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-background to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-background to-transparent pointer-events-none"></div>
                    <GamesScrollButtons />
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="mb-24 max-w-[1400px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">
                        {t("home.latestPosts")}
                    </h2>
                    <Link href="/blog">
                        <Button variant="ghost">
                            {t("buttons.viewAll")} →
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.slice(0, 2).map((post: BlogPost) => (
                        <article key={post.slug} className="border rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                            <Link href={`/blog/${post.slug}`}>
                                <div className="grid md:grid-cols-[1fr_1.5fr]">
                                    {post.coverImage && (
                                        <div className="relative h-48 md:h-full">
                                            <Image 
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                        <div className="text-sm text-muted-foreground mb-3">
                                            {formatDate(post.date, locale)}
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="mb-24 max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-8">
                    {t("home.benefitsTitle")}
                </h2>

                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                    <p>{t("home.benefitsIntro")}</p>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">👨👧</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t("home.familyLifeTitle")}
                            </h3>
                            <p>{t("home.familyLifeDesc")}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">💼</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t("home.workPerformanceTitle")}
                            </h3>
                            <p>{t("home.workPerformanceDesc")}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">🎯</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t("home.personalGrowthTitle")}
                            </h3>
                            <p>{t("home.personalGrowthDesc")}</p>
                        </div>
                    </div>

                    <p className="text-center mt-8">
                        {t("home.dailyPractice")}
                        <br />
                        <span className="text-primary font-medium">
                            {t("home.benefitsConclusion")}
                        </span>
                    </p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-24 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    {t("home.testimonialsTitle")}
                </h2>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6">
                    <Marquee pauseOnHover className="[--duration:20s] mb-8">
                        {firstRowReviews.map((review) => (
                            <div key={review.username} className="mx-4 w-72">
                                <div
                                    className={cn(
                                        "relative h-full cursor-pointer overflow-hidden rounded-xl border p-6",
                                        "bg-background/80 hover:bg-border/10",
                                        "border"
                                    )}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-16 w-16 rounded-full bg-linear-to-r ${review.gradient}`}
                                            />
                                            <div className="">
                                                <h3 className="text-lg font-semibold">
                                                    {review.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {review.username}
                                                </p>
                                            </div>
                                        </div>
                                        <blockquote className="mt-2 text-sm">
                                            {review.body}
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Marquee>

                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRowReviews.map((review) => (
                            <div key={review.username} className="mx-4 w-72">
                                <div
                                    className={cn(
                                        "relative h-full cursor-pointer overflow-hidden rounded-xl border p-6",
                                        "bg-background/80 hover:bg-border/10",
                                        "border"
                                    )}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-16 w-16 rounded-full bg-linear-to-r ${review.gradient}`}
                                            />
                                            <div className="">
                                                <h3 className="text-lg font-semibold">
                                                    {review.name}
                                                </h3>
                                                <h4 className="text-sm text-muted-foreground">
                                                    {review.username}
                                                </h4>
                                            </div>
                                        </div>
                                        <blockquote className="mt-2 text-sm">
                                            {review.body}
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Marquee>

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div>
                </div>
            </section>
        </div>
    );
}
