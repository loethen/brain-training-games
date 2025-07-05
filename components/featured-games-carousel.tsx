'use client';

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { getFeaturedGamesForCarousel, getLatestGames } from "@/data/games";
import GameCard from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeaturedGamesCarousel() {
    const t = useTranslations("buttons");
    const homeT = useTranslations("home");
    const [currentPage, setCurrentPage] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    
    const featuredPages = getFeaturedGamesForCarousel(4); // 每页4个游戏（一行）
    const latestGames = getLatestGames(3); // 只展示3个最新游戏
    
    // 自动轮播
    useEffect(() => {
        if (!isAutoPlay || featuredPages.length <= 1 || isHovered) return;
        
        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % featuredPages.length);
        }, 5000); // 5秒切换一次
        
        return () => clearInterval(interval);
    }, [isAutoPlay, featuredPages.length, isHovered]);
    
    const goToPage = (page: number) => {
        setCurrentPage(page);
        setIsAutoPlay(false); // 手动操作后停止自动播放
    };
    
    const goToPrevious = () => {
        setCurrentPage((prev) => (prev - 1 + featuredPages.length) % featuredPages.length);
        setIsAutoPlay(false);
    };
    
    const goToNext = () => {
        setCurrentPage((prev) => (prev + 1) % featuredPages.length);
        setIsAutoPlay(false);
    };

    return (
        <div className="space-y-16">
            {/* 热门游戏轮播区域 */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-orange-500" />
                        {homeT("featuredGames")}
                    </h3>
                    <div className="flex items-center gap-2">
                        {/* 轮播导航按钮 */}
                        {featuredPages.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToPrevious}
                                    className="h-8 w-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToNext}
                                    className="h-8 w-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                
                {/* 轮播内容 */}
                <div 
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentPage * 100}%)` }}
                    >
                        {featuredPages.map((page, pageIndex) => (
                            <div
                                key={pageIndex}
                                className="w-full flex-shrink-0"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {page.map((game) => (
                                        <GameCard
                                            key={game.id}
                                            game={game}
                                            preview={game.preview}
                                            className="h-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 轮播指示器 */}
                {featuredPages.length > 1 && (
                    <div className="flex justify-center gap-2">
                        {featuredPages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    currentPage === index 
                                        ? "bg-primary" 
                                        : "bg-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 最新游戏区域 */}
            {latestGames.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-500" />
                            {homeT("latestGames")}
                        </h3>
                        <Link href="/games">
                            <Button variant="outline" size="sm">
                                {t("viewAll")} →
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
                </div>
            )}
        </div>
    );
} 