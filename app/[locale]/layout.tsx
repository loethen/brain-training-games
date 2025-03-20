import type { Metadata, Viewport } from "next";
import { inter } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from 'next-intl/server';

// 定义默认元数据，可以被页面级元数据覆盖
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  // 确保 params 是已解析的对象
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    // 网站级别的默认元数据
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"
    ),
    // 默认标题模板，页面可以提供具体标题
    title: {
      template: '%s | FreeFocusGames',
      default: t('title'),
    },
    // 默认描述，页面可以提供更具体的描述
    description: t('description'),
    // 通用关键词，页面可以添加特定关键词
    keywords: t('keywords').split(',').map(keyword => keyword.trim()),
    // 默认 Open Graph 配置
    openGraph: {
        images: "/og/oglogo.png",
        siteName: "FreeFocusGames",
        type: "website",
    },
    // 默认 Twitter 配置
    twitter: {
      card: 'summary_large_image',
    },
    // 其他通用配置
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: 'FreeFocusGames Team' }],
    applicationName: 'Focus Games',
    appleWebApp: {
      capable: true,
      title: 'Focus Games',
      statusBarStyle: 'default',
    },
  };
}

// 单独的 viewport 配置
export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const initialIsMobile = /Mobile|Android|webOS|iPhone|iPad|iPod/i.test(
        userAgent
    );
    
    // 确保 params 是已解析的对象
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) notFound();

    // 获取当前语言的消息
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                {/* PWA primary color */}
                <meta name="theme-color" content="#ffffff" />
                {/* Windows */}
                <meta name="msapplication-TileColor" content="#ffffff" />
                
                {/* 结构化数据 */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "FreeFocusGames",
                        url: "https://www.freefocusgames.com",
                        description:
                            "Free online platform with science-based games to improve focus, memory and concentration for kids, adults, and seniors",
                        keywords:
                            "free focus games, memory games, brain training, concentration games, focus games for kids, memory games for seniors",
                        potentialAction: {
                            "@type": "SearchAction",
                            target: "https://www.freefocusgames.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string",
                        },
                    })}
                </script>
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    inter.variable
                )}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <Layout initialIsMobile={initialIsMobile}>
                            {children}
                        </Layout>
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
            <GoogleAnalytics gaId="G-93FVQFJCHE" />
        </html>
    );
}
