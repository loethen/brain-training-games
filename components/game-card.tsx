import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  title: string
  description: string
  image: string
  slug: string
  difficulty: string
  duration: string
}

export function GameCard({ title, description, image, slug, difficulty, duration }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
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