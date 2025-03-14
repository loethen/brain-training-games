import { PanelLeft, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Link, usePathname } from "@/i18n/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header({ onToggleSidebar }: { 
  onToggleSidebar: () => void 
}) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // 语言切换下拉菜单组件
  const LanguageSwitcher = () => (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{pathname.startsWith('/zh') ? '中文' : 'English'}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={pathname} locale="en">
            English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={pathname} locale="zh">
            中文
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky z-50 top-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="freeFocusGames" 
              width={32} 
              height={32}
              priority={true}
            />
            <h1 className="font-semibold text-foreground">
                FreeFocusGames
            </h1>
          </Link>
          <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hidden md:inline-flex"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
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
          
          {/* 桌面端语言切换 */}
          <LanguageSwitcher />
        </div>
        
        {/* 移动端控件 */}
        <div className="flex md:hidden items-center gap-2">
          {/* 移动端语言切换 */}
          <LanguageSwitcher />
          
          {/* 移动端主题切换 */}
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
          
          {/* 移动端侧边栏切换 */}
          <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
          >
              <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
} 