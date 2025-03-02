import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import React from "react"
import { Game } from "@/data/games"
import GameCategories from "@/components/game-categories"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-2">
      <Link href={`/games/${game.slug}`} className="block p-4">
        <h3 className="text-lg font-semibold">{game.title}</h3>
        
        {game.difficulty && (
          <Badge variant={
            game.difficulty === "easy" ? "success" : 
            game.difficulty === "medium" ? "warning" : "destructive"
          } className="mt-1">
            {game.difficulty}
          </Badge>
        )}
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {game.description}
        </p>
        
        <GameCategories gameId={game.id} className="mt-4" />
      </Link>
    </div>
  );
} 