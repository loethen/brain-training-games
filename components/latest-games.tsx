'use client';

import { Link } from "@/i18n/navigation";
import { getLatestGames } from "@/data/games";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";

export default function LatestGames() {
    const t = useTranslations("home");
    const buttonsT = useTranslations("buttons");
    const latestGames = getLatestGames(3);

    if (latestGames.length === 0) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                    {t("latestGames")}
                </h3>
                <Link href="/games">
                    <Button variant="ghost" className="gap-2">
                        {buttonsT("viewAll")} <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {latestGames.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        preview={game.preview}
                        className="h-full"
                    />
                ))}
            </div>
        </section>
    );
}
