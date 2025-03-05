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
              <Link href={`/games/${game.slug}`}>
                  <div className="w-full overflow-hidden bg-muted/20 flex items-center justify-center">
                      {preview}
                  </div>
              </Link>
          )}
          <div className="block px-6 py-4">
              <Link href={`/games/${game.slug}`}>
                  <h2 className="text-xl font-semibold text-primary">{game.title}</h2>
              </Link>

              <p className="mt-2 text-muted-foreground line-clamp-2">
                  {game.description}
              </p>

              <GameCategories gameId={game.id} className="mt-4" />
          </div>
      </div>
  );
} 