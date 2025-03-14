import type { Metadata } from "next";
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

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: t('metadata.title', 'Free Focus & Memory Games | Brain Training | FreeFocusGames'),
    description: t('metadata.description', 'Improve memory, concentration and cognitive skills with free science-based brain games for all ages. Perfect for kids, adults, and seniors looking to boost focus and attention.'),
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"
    ),
    keywords: t('metadata.keywords', 'free focus games, memory games, brain training games, concentration games, attention improvement games, cognitive games online, focus games for kids, memory games for children, concentration games for adults, brain games for elderly, attention games for ADHD, memory games for seniors, focus training online, memory exercises, focus exercises online, educational games for kids, cognitive training, free matching games, working memory games').split(',').map(keyword => keyword.trim()),
    openGraph: {
        images: "/og/oglogo.png",
        title: t('metadata.ogTitle', 'Free Focus & Memory Games | Brain Training for All Ages'),
        description: t('metadata.ogDescription', 'Enhance focus, memory and concentration with free science-based cognitive games. Featuring Schulte Table, Pattern Recall Challenge, and more brain-boosting activities.'),
        siteName: "FreeFocusGames",
        type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.ogTitle', 'Free Focus & Memory Games | Brain Training for All Ages'),
      description: t('metadata.ogDescription', 'Improve memory and concentration with our free cognitive training games for all ages including Schulte Table, Pattern Recall Challenge, and more.'),
    },
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
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const initialIsMobile = /Mobile|Android|webOS|iPhone|iPad|iPod/i.test(
        userAgent
    );
    const { locale } = params;

    if (!hasLocale(routing.locales, locale)) notFound();

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
                <NextIntlClientProvider>
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
