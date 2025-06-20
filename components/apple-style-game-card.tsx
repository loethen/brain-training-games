import { Link } from "@/i18n/navigation";
import React from "react";
import { Game } from "@/data/games";
import CompactGameCategories from "@/components/compact-game-categories";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AppleStyleGameCardProps {
    game: Game;
    preview?: React.ReactNode;
    className?: string;
}

// 移除渐变主题，使用统一的浅灰色背景

export default function AppleStyleGameCard({ 
    game, 
    preview, 
    className 
}: AppleStyleGameCardProps) {
    const t = useTranslations("games");
    const camelCaseId = game.id
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase())
        .replace(/-/g, "");

    return (
        <div
            className={cn(
                "group relative rounded-2xl transition-all duration-300 ease-out",
                "min-w-[350px] w-[350px] h-[600px] md:min-w-[400px] md:w-[400px]", // Apple风格的响应式尺寸
                "bg-card border border-border hover:shadow", // 支持dark主题的背景
                className
            )}
        >
            {/* 内容容器 */}
            <div className="relative h-full flex flex-col p-8 text-foreground">
                {/* 标题和描述 */}
                <Link href={`/games/${game.slug}`}>
                    <div className="mb-2 cursor-pointer">
                        <h2 className="text-2xl font-bold mb-2 leading-tight text-foreground hover:text-foreground/80 transition-colors duration-200">
                            {t(`${camelCaseId}.title`)}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 hover:text-foreground/80 transition-colors duration-200">
                            {t(`${camelCaseId}.description`)}
                        </p>
                    </div>
                </Link>

                {/* 游戏预览区域 */}
                <div className="flex-1 flex items-center justify-center mb-2 mt-4">
                    {preview && (
                        <Link href={`/games/${game.slug}`} className="w-full h-full block">
                            <div className="w-full aspect-square overflow-hidden rounded-xl bg-muted/50 border border-border flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200">
                                <div className="w-full h-full flex items-center justify-center">
                                    {preview}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* 游戏类别标签 */}
                <div className="mb-0">
                    <CompactGameCategories
                        gameId={game.id}
                        maxDisplay={2}
                    />
                </div>

            </div>
        </div>
    );
} 