import Link from "next/link"
import { Brain, PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ onToggleSidebar }: { 
  onToggleSidebar: () => void 
}) {
  return (
    <header className="sticky z-50 top-0 bg-white">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Brain className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-lg font-semibold text-black">
              FocusGames
          </h1>
          <Button
              variant="ghost"
              size="icon"
              className="text-black/50 hidden md:inline-flex"
              onClick={onToggleSidebar}
          >
              <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-black">
              <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="text-black font-semibold">
              Login
          </Button>
        </div>
        <Button
            variant="ghost"
            size="icon"
            className="text-black/50 md:hidden mr-2"
            onClick={onToggleSidebar}
        >
            <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
} 