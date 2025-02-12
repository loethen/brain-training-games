import { Brain, PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ onToggleSidebar }: { 
  onToggleSidebar: () => void 
}) {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-black" />
          <h1 className="text-lg font-semibold text-black">
              FocusGames
          </h1>
          <Button
              variant="ghost"
              size="icon"
              className="text-black/50"
              onClick={onToggleSidebar}
          >
              <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-black">
              <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="text-black font-semibold">
              Login
          </Button>
        </div>
      </div>
    </header>
  );
} 