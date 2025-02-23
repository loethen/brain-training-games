import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import React from "react"

interface GameCardProps {
  title: string
  description: string
  slug: string
  preview: React.ReactNode  // 只接受React组件
}

export function GameCard({ title, description, slug, preview }: GameCardProps) {
  return (
      <Link href={`/games/${slug}`}>
          <Card className="overflow-hidden transition-all shadow-none p-4 2xl:p-6 hover:shadow-lg">
              <div className="flex flex-col lg:flex-row-reverse h-full items-center">
                  {/* 预览区域 */}
                  <div className="w-full lg:w-[340px]">{preview}</div>

                  {/* 内容区域 */}
                  <div className=" flex-1 p-4">
                      <div>
                          <CardTitle className="text-2xl mb-2">
                              {title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-md">
                              {description}
                          </CardDescription>
                      </div>
                      <Button
                          variant="outline"
                          className="mt-12 self-start md:self-end hover:bg-primary/5"
                      >
                          Play Now →
                      </Button>
                  </div>
              </div>
          </Card>
      </Link>
  );
} 