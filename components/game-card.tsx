import { Link } from "@/i18n/navigation";
import React from "react";
import { Game } from "@/data/games";
import GameCategories from "@/components/game-categories";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface GameCardProps {
    game: Game;
    preview?: React.ReactNode;
    className?: string;
}

export default function GameCard({ game, preview, className }: GameCardProps) {
    const t = useTranslations("games");
    const camelCaseId = game.id
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase())
        .replace(/-/g, "");

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-lg p-2 bg-secondary transition-all hover:shadow-lg",
                className
            )}
        >
            {/* 预览区域 - 如果提供了预览组件则显示 */}
            {preview && (
                <Link
                    href={`/games/${game.slug}`}
                    aria-label={`${t('play')} ${t(`${camelCaseId}.title`)}`}
                >
                    <div className="w-full aspect-4/3 overflow-hidden bg-muted/20 flex items-center justify-center rounded-lg">
                        {preview}
                    </div>
                </Link>
            )}
            <div className="block p-4">
                <Link
                    href={`/games/${game.slug}`}
                    aria-label={`${t('play')} ${t(`${camelCaseId}.title`)}`}
                >
                    <h2 className="text-xl font-semibold text-primary">
                        {t(`${camelCaseId}.title`)}
                    </h2>
                </Link>

                <p className="mt-2 text-sm line-clamp-2">
                    {t(`${camelCaseId}.description`)}
                </p>

                <GameCategories gameId={game.id} className="mt-4" />
            </div>
        </div>
    );
}
