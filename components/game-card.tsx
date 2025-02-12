import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  title: string
  description: string
  image: string
  slug: string
  difficulty: string
  duration: string
}

export function GameCard({ title, description, slug, difficulty, duration }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`}>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] shadow-none">
        <div className="relative h-48">
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant={
              difficulty === 'Easy' ? 'default' :
              difficulty === 'Medium' ? 'secondary' : 'destructive'
            }>
              {difficulty}
            </Badge>
            <Badge variant="outline">{duration}</Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" className="w-full">Play Now →</Button>
        </CardFooter>
      </Card>
    </Link>
  )
} 