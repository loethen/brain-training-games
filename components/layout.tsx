"use client";

import { Link } from "@/i18n/navigation";
import { Header } from "./header"
import { useState, useEffect, useCallback } from "react"
import { Footer } from "./Footer"
import { useTranslations } from 'next-intl';

export function Layout({
    children,
    initialIsMobile,
}: {
    children: React.ReactNode;
    initialIsMobile: boolean;
}) {
    const t = useTranslations('common');
    const [isSidebarOpen, setIsSidebarOpen] = useState(!initialIsMobile);
    const [isMobile, setIsMobile] = useState(initialIsMobile);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            const isDesktop = e.matches;
            setIsSidebarOpen(isDesktop);
            setIsMobile(!isDesktop); // 直接取反即可
        };

        // 初始化状态
        const initialIsDesktop = mediaQuery.matches;
        setIsSidebarOpen(initialIsDesktop);
        setIsMobile(!initialIsDesktop);

        mediaQuery.addEventListener("change", handleMediaChange);
        return () =>
            mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    // 在导航链接中添加移动端点击关闭侧边栏的逻辑
    const navLinkClick = useCallback(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile]);

    // 将NavItem移动到Layout组件内部
    const NavItem = ({
        href,
        children,
    }: {
        href: string;
        children: React.ReactNode;
    }) => (
        <Link
            href={href}
            onClick={navLinkClick}
            className="block hover:bg-accent p-2 rounded text-foreground font-semibold relative hover:pl-3 transition-all duration-200
               after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 
               after:opacity-0 hover:after:opacity-100 after:transition-opacity"
        >
            {children}
        </Link>
    );

    return (
        <div className="min-h-screen">
            <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Sidebar */}
            <div
                className={`
          fixed top-0 h-screen
          w-full md:w-[180px]
          flex pt-40
          transform transition-all duration-300 ease-in-out
          shadow-lg md:shadow-none
          bg-background/50 backdrop-blur-lg z-30 md:bg-transparent
          ${
              isSidebarOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0 pointer-events-none"
          }
        `}
            >
                <nav className="w-full space-y-1 pl-4 text-sm">
                    <NavItem href="/">{t('home')}</NavItem>
                    <NavItem href="/categories">{t('categories')}</NavItem>
                    <NavItem href="/games">{t('games')}</NavItem>
                    <NavItem href="/blog">{t('blog')}</NavItem>
                    <NavItem href="/about">{t('about')}</NavItem>

                    {/* Guides Section */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('guides')}</h3>
                        <NavItem href="/working-memory-guide">{t('workingMemoryGuide')}</NavItem>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex">
                <aside
                    className={`transition-all duration-300 ease-in-out ${
                        isSidebarOpen ? (isMobile ? "w-0" : "w-[180px]") : "w-0"
                    }`}
                />
                <main
                    className={`transition-all duration-300 ease-in-out flex-1 pl-4 pr-4 md:pl-8 md:pr-8 bg-background ${
                        isSidebarOpen && !isMobile
                            ? "md:w-[calc(100%-180px)]"
                            : "w-full"
                    }`}
                >
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
} 