import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";
import { GamePreview as SimonGamePreview } from "./games/pattern-recall-challenge/components/GamePreview";
import { GamePreview as SchulteGamePreview } from "./games/schulte-table/components/GamePreview";
import { ImagePreview } from "@/components/image-preview";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BrainGameIcons } from "@/components/brain-game-icons";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";

// 为首页定义特定的元数据
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
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
  };
}

export default function Home() {
    const t = useTranslations();
    const testimonials = useTranslations('home.testimonials');
    
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
                            {t('home.title')}
                        </h1>
                        <p className="sm:text-xl lg:text-2xl mb-8">
                            {t('home.subtitle')}
                        </p>
                        <div className="mb-4">
                            <Link href="/games">
                                <InteractiveHoverButton>
                                    {t('buttons.startPlaying')}
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
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">{t('home.popularGames')}</h2>
                    <Link href="/games">
                        <Button variant="ghost">{t('buttons.viewAll')} →</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
                    <GameCard
                        game={{
                            id: "mahjong-dual-n-back",
                            title: "Mahjong Dual N-Back",
                            description:
                                "Boost memory and focus with Mahjong-inspired Dual N-Back challenges!",
                            slug: "mahjong-dual-n-back",
                        }}
                        preview={
                            <ImagePreview src="/games/mahjong-dual-n-back.png" />
                        }
                    />
                    <GameCard
                        game={{
                            id: "dual-n-back",
                            title: "Dual N-Back",
                            description:
                                "Sharpen your mind with classic Dual N-Back memory training!",
                            slug: "dual-n-back",
                        }}
                        preview={<ImagePreview src="/games/dual-n-back.png" />}
                    />
                    <GameCard
                        game={{
                            id: "larger-number",
                            title: "Larger Number",
                            description:
                                "Click the bigger number fast to sharpen your focus!",
                            slug: "larger-number",
                        }}
                        preview={
                            <ImagePreview src="/games/larger-number.png" />
                        }
                    />
                    <GameCard
                        game={{
                            id: "pattern-recall-challenge",
                            title: "Pattern Recall Challenge",
                            description:
                                "Strengthen your working memory by remembering and repeating visual sequences.",
                            slug: "pattern-recall-challenge",
                        }}
                        preview={<SimonGamePreview />}
                    />
                    <GameCard
                        game={{
                            id: "schulte-table",
                            title: "Schulte Table",
                            description:
                                "Enhance your attention and peripheral vision",
                            slug: "schulte-table",
                        }}
                        preview={<SchulteGamePreview />}
                    />
                    <GameCard
                        game={{
                            id: "fish-trace",
                            title: "Glowing Fish Trace",
                            description:
                                "Master visual tracking by following glowing fish patterns",
                            slug: "fish-trace",
                        }}
                        preview={<ImagePreview src="/games/fish-trace.png" />}
                    />
                    <GameCard
                        game={{
                            id: "frog-memory-leap",
                            title: "Frog Memory Leap",
                            description:
                                "Enhance Sequential Memory & Spatial Recall Through Progressive Challenges",
                            slug: "frog-memory-leap",
                        }}
                        preview={
                            <ImagePreview src="/games/frog-memory-leap.png" />
                        }
                    />
                </div>
            </section>

            {/* Benefits Section */}
            <section className="mb-24 max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-8">
                    {t('home.benefitsTitle')}
                </h2>

                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                    <p>
                        {t('home.benefitsIntro')}
                    </p>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">👨👧</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.familyLifeTitle')}
                            </h3>
                            <p>
                                {t('home.familyLifeDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">💼</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.workPerformanceTitle')}
                            </h3>
                            <p>
                                {t('home.workPerformanceDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">🎯</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.personalGrowthTitle')}
                            </h3>
                            <p>
                                {t('home.personalGrowthDesc')}
                            </p>
                        </div>
                    </div>

                    <p className="text-center mt-8">
                        {t('home.dailyPractice')}
                        <br />
                        <span className="text-primary font-medium">
                            {t('home.benefitsConclusion')}
                        </span>
                    </p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-24 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    {t('home.testimonialsTitle')}
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
                                                className={`h-16 w-16 rounded-full bg-gradient-to-r ${review.gradient}`}
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
                                                className={`h-16 w-16 rounded-full bg-gradient-to-r ${review.gradient}`}
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

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
                </div>
            </section>
        </div>
    );
}
