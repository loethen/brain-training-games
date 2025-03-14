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

export default function Home() {
    const t = useTranslations();
    
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
                    <h2 className="text-3xl font-bold">{t('home.popularGames', 'Popular Games')}</h2>
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
                    {t('home.benefitsTitle', 'Focus: Your Secret Superpower')}
                </h2>

                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                    <p>
                        {t('home.benefitsIntro', 'Imagine: Your child stays on task without constant reminders, you nail meeting priorities effortlessly, and finally get lost in that book you\'ve been meaning to read. That\'s the power of trained focus.')}
                    </p>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">👨👧</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.familyLifeTitle', 'Family Life')}
                            </h3>
                            <p>
                                {t('home.familyLifeDesc', 'Help kids complete homework faster with fewer distractions. Be fully present during family time without mental clutter.')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">💼</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.workPerformanceTitle', 'Work Performance')}
                            </h3>
                            <p>
                                {t('home.workPerformanceDesc', 'Say goodbye to zoning out in meetings. Achieve flow state faster and handle complex tasks with crystal-clear thinking.')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                        <div className="shrink-0 text-2xl">🎯</div>
                        <div>
                            <h3 className="font-medium mb-2 text-foreground">
                                {t('home.personalGrowthTitle', 'Personal Growth')}
                            </h3>
                            <p>
                                {t('home.personalGrowthDesc', 'Whether learning new skills or pursuing hobbies, strong focus helps you make progress twice as fast.')}
                            </p>
                        </div>
                    </div>

                    <p className="text-center mt-8">
                        {t('home.dailyPractice', 'Just 10 minutes daily - it\'s like weightlifting for your brain.')}
                        <br />
                        <span className="text-primary font-medium">
                            {t('home.benefitsConclusion', 'Sharper focus, better life.')}
                        </span>
                    </p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-24 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    {t('home.testimonialsTitle', 'Real People, Real Results')}
                </h2>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6">
                    <Marquee pauseOnHover className="[--duration:20s] mb-8">
                        {[
                            {
                                name: "Sarah",
                                username: "@sarah_writes",
                                body: "Finally finished my novel draft after 3 years of procrastination!",
                                gradient: "from-blue-400 to-cyan-500",
                            },
                            {
                                name: "Mike",
                                username: "@chef_mike",
                                body: "Can now follow complex baking recipes without getting distracted",
                                gradient: "from-purple-400 to-pink-500",
                            },
                            {
                                name: "Emma",
                                username: "@nature_em",
                                body: "Remember every turn on our mountain hikes - no more getting lost!",
                                gradient: "from-green-400 to-emerald-500",
                            },
                            {
                                name: "Sophia",
                                username: "@math_mom",
                                body: "My son's math scores improved 2 grades after 3 months!",
                                gradient: "from-rose-400 to-pink-500",
                            },
                            {
                                name: "Liam",
                                username: "@adhd_dad",
                                body: "15 mins/day helped my daughter sit through homework time",
                                gradient: "from-sky-400 to-blue-500",
                            },
                        ].map((review) => (
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
                        {[
                            {
                                name: "Tom",
                                username: "@movie_tom",
                                body: "Actually catch plot twists in movies now - no more confusion!",
                                gradient: "from-orange-400 to-red-500",
                            },
                            {
                                name: "Lisa",
                                username: "@organized_lisa",
                                body: "Spot my keys instantly in messy rooms - lifesaver!",
                                gradient: "from-yellow-400 to-amber-500",
                            },
                            {
                                name: "David",
                                username: "@dad_athlete",
                                body: "Never miss my kid's soccer goals anymore",
                                gradient: "from-indigo-400 to-violet-500",
                            },
                            {
                                name: "Olivia",
                                username: "@homeschool_olivia",
                                body: "Cut learning time by 40% with focused practice",
                                gradient: "from-teal-400 to-cyan-500",
                            },
                            {
                                name: "Ethan",
                                username: "@gaming_dad",
                                body: "Now balance game time and study time effortlessly",
                                gradient: "from-amber-400 to-orange-500",
                            },
                        ].map((review) => (
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
