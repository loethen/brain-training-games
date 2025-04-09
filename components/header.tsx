import { PanelLeft, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 语言切换下拉菜单组件
function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const t = useTranslations('common')
  const router = useRouter()
  
  // 修改语言切换处理函数，在切换后刷新路由缓存
  const handleLocaleChange = (newLocale: string) => {
    setOpen(false)
    
    router.replace(pathname, { locale: newLocale })
    // startTransition(() => {
      // 先替换当前路径的语言
      // 然后刷新路由缓存，确保语言设置正确传播
      // router.refresh()
    // })
  }
  
  // 获取当前语言显示名称
  const getLanguageDisplay = () => {
    switch(locale) {
      case 'zh': return '中文';
      case 'de': return 'Deutsch';
      case 'ja': return '日本語';
      case 'es': return 'Español';
      case 'ko': return '한국어';
      case 'fr': return 'Français';
      default: return 'English';
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground" aria-label={t('language')}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getLanguageDisplay()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuItem onSelect={() => handleLocaleChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('zh')}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('de')}>
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('ja')}>
          日本語
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('es')}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('ko')}>
          한국어
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('fr')}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header({ onToggleSidebar }: { 
  onToggleSidebar: () => void 
}) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('common');

  return (
    <header className="sticky z-50 top-0 bg-background/80 backdrop-blur-xs">
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
              aria-label={t('toggleSidebar')}
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
            <span className="sr-only">{t('toggleTheme')}</span>
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
            <span className="sr-only">{t('toggleTheme')}</span>
          </Button>
          
          {/* 移动端侧边栏切换 */}
          <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={onToggleSidebar}
              aria-label={t('toggleSidebar')}
          >
              <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
} 