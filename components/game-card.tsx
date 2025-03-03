import Link from "next/link"
import React from "react"
import { Game } from "@/data/games"
import GameCategories from "@/components/game-categories"
import { cn } from "@/lib/utils"

interface GameCardProps {
  game: Game;
  preview?: React.ReactNode;
  className?: string;
}

export default function GameCard({ game, preview, className }: GameCardProps) {
  return (
      <div
          className={cn(
              "group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md",
              className
          )}
      >
          {/* 预览区域 - 如果提供了预览组件则显示 */}
          {preview && (
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted/20">
                  {preview}
              </div>
          )}
          <div className="block p-4">
              <Link href={`/games/${game.slug}`}>
                  <h3 className="text-lg font-semibold">{game.title}</h3>
              </Link>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {game.description}
              </p>

              <GameCategories gameId={game.id} className="mt-4" />
          </div>
      </div>
  );
} 