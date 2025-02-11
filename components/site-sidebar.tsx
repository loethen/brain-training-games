import Link from "next/link"
import { Brain, LayoutGrid, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SiteSidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">FocusGames</h2>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start"
              )}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Games
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start"
              )}
            >
              <Info className="mr-2 h-4 w-4" />
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 