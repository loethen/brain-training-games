import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/magicui/marquee";
import { cn, generateAlternates } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from "next";
import { getBlogPosts, type BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import FeaturedBentoGrid from "@/components/featured-bento-grid";
import LatestGames from "@/components/latest-games";
import Image from "next/image";
import { games } from "@/data/games";

// 为首页定义特定的元数据
export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await params;
    setRequestLocale(locale);
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
    setRequestLocale(locale);
    const t = await getTranslations({ locale });
    const testimonials = await getTranslations({ locale, namespace: 'home.testimonials' });
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
        <>
            <div>
                {/* Hero Section */}
                <section className="max-w-[1600px] mx-auto rounded-3xl sm:p-6 md:p-12 mb-16 dark:from-transparent dark:to-transparent">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-8">
                        <div className="w-full md:w-3/5 text-center md:text-left flex flex-col justify-center">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
                                {t("home.title")}
                            </h1>
                            <p className="sm:text-xl lg:text-2xl mb-8">
                                {t("home.subtitle")}
                            </p>
                            <div className="mb-4">
                                <Link href="/get-started">
                                    <InteractiveHoverButton>
                                        {t("home.ctaButton")}
                                    </InteractiveHoverButton>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full md:w-2/5 flex items-center justify-center py-4">
                            <Image
                                src="/herocat.png"
                                alt="Hero Cat"
                                width={400}
                                height={400}
                                style={{
                                    maxWidth: "400px",
                                    width: "100%",
                                    height: "auto",
                                }}
                                priority
                                className="floating-image rounded-full overflow-hidden"
                            />
                        </div>
                    </div>
                </section>

                {/* Spring Festival Special */}
                {games.filter(g => g.categories.includes('spring-festival')).length > 0 && (
                    <section className="mb-16 max-w-[1600px] mx-auto px-6">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-3xl">🧧</span>
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400">
                                {t("home.springFestivalSpecial")}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {games.filter(g => g.categories.includes('spring-festival')).map(game => (
                                <Link key={game.id} href={`/games/${game.slug}`} className="group block">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-red-200 dark:border-red-900 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] bg-red-50/50 dark:bg-red-950/20">
                                        <div className="w-full h-full flex items-center justify-center">
                                            {game.preview}
                                        </div>
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
                                            HOT
                                        </div>
                                    </div>
                                    <h3 className="mt-3 font-bold text-lg group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {/* Custom title override for Chinese locale */}
                                        {(locale === 'zh' && game.slug === 'challenge-10-seconds')
                                            ? "10秒挑战练习--下一个免单的就是你"
                                            : game.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Games Section - Bento Grid Display */}
                <section className="mb-24 max-w-[1600px] mx-auto px-6">
                    <FeaturedBentoGrid />
                    <div className="mt-24">
                        <LatestGames />
                    </div>
                </section>

                {/* Types of Brain Training */}
                <section className="mb-24 max-w-[1600px] mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t("typesOfGames.title")}</h2>
                        <p className="text-xl text-muted-foreground">{t("typesOfGames.subtitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { id: 'nback', icon: '🧠', color: 'bg-indigo-50 text-indigo-700' },
                            { id: 'schulte', icon: '⚡', color: 'bg-amber-50 text-amber-700' },
                            { id: 'stroop', icon: '🛑', color: 'bg-red-50 text-red-700' },
                            { id: 'memory', icon: '🧩', color: 'bg-emerald-50 text-emerald-700' }
                        ].map(type => (
                            <div key={type.id} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4", type.color)}>
                                    {type.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t(`typesOfGames.${type.id}.title`)}</h3>
                                <p className="text-muted-foreground">{t(`typesOfGames.${type.id}.description`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Blog Posts */}
                <section className="mb-24 max-w-[1600px] mx-auto px-0 sm:px-6">
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
                            <article
                                key={post.slug}
                                className="border rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr] md:h-48">
                                        {post.coverImage && (
                                            <div
                                                className="h-48 md:h-full bg-cover bg-center bg-no-repeat"
                                                style={{
                                                    backgroundImage: `url(${post.coverImage})`,
                                                }}
                                                role="img"
                                                aria-label={post.title}
                                            />
                                        )}
                                        <div className="p-6 flex flex-col justify-center">
                                            <h3 className="text-xl font-semibold mb-3">
                                                {post.title}
                                            </h3>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(post.date, locale)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="mb-24 max-w-3xl mx-auto px-0 sm:px-6">
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


                {/* Science Behind Section */}
                <section className="mb-24 max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-muted/30 dark:bg-muted/10 p-8 sm:p-12 rounded-3xl border border-border">
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-foreground uppercase bg-muted rounded-full">
                            {t("home.scienceBehind.tag")}
                        </span>
                        <h2 className="text-3xl font-bold mb-4 text-foreground">
                            {t("home.scienceBehind.title")}
                        </h2>
                        <p className="text-xl font-medium text-foreground mb-4">
                            {t("home.scienceBehind.subtitle")}
                        </p>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                            {t("home.scienceBehind.description")}
                        </p>
                        <Link href="/working-memory-guide">
                            <InteractiveHoverButton className="w-full sm:w-auto">
                                {t("home.scienceBehind.cta")}
                            </InteractiveHoverButton>
                        </Link>
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
        </>
    );
}
