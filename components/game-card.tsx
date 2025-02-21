import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import React from "react"
import Image from "next/image"

interface GameCardProps {
  title: string
  description: string
  slug: string
  preview: string | React.ReactNode
}

export function GameCard({ title, description, slug, preview }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`}>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] shadow-none">
        <div className="relative">
          {typeof preview === 'string' ? (
            <Image
              src={preview}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            preview
          )}
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