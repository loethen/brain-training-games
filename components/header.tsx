import Link from "next/link"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Header({ onToggleSidebar }: { 
  onToggleSidebar: () => void 
}) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky z-50 top-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="freeFocusGames" width={32} height={32} />
            <h1 className="font-semibold text-foreground">
                FreeFocusGames
            </h1>
          </Link>
          <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hidden md:inline-flex"
              onClick={onToggleSidebar}
          >
              <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 block dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground md:hidden mr-2"
            onClick={onToggleSidebar}
        >
            <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
} 