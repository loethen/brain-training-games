import type { Metadata } from "next";
import { inter, outfit } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout"
import { ThemeProvider } from "next-themes"
import { headers } from "next/headers"
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Free Focus & Memory Games | Brain Training | FreeFocusGames",
  description: "Improve memory, concentration and cognitive skills with free science-based brain games for all ages. Perfect for kids, adults, and seniors looking to boost focus and attention.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"
  ),
  keywords: [
    'free focus games',
    'memory games',
    'brain training games',
    'concentration games',
    'attention improvement games',
    'cognitive games online',
    'focus games for kids',
    'memory games for children',
    'concentration games for adults',
    'brain games for elderly',
    'attention games for ADHD',
    'memory games for seniors',
    'focus training online',
    'memory exercises',
    'focus exercises online',
    'educational games for kids',
    'cognitive training',
    'free matching games',
    'working memory games'
  ],
  openGraph: {
    images: '/og/oglogo.png',
    title: 'Free Focus & Memory Games | Brain Training for All Ages',
    description: 'Enhance focus, memory and concentration with free science-based cognitive games. Featuring Schulte Table, Pattern Recall Challenge, and more brain-boosting activities.',
    siteName: 'FreeFocusGames',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const initialIsMobile = /Mobile|Android|webOS|iPhone|iPad|iPod/i.test(userAgent);
  
  return (
      <html lang="en" suppressHydrationWarning>
          <head>
              <meta charSet="utf-8" />
              <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
              />
              <meta
                  name="description"
                  content="Enhance cognitive skills with science-based focus games including Memory Matrix, Card Matching, Attention Training, and Concentration Challenges"
              />

              {/* PWA primary color */}
              <meta name="theme-color" content="#ffffff" />

              {/* Open Graph / Facebook */}
              <meta property="og:type" content="website" />
              <meta
                  property="og:title"
                  content="Free Focus & Memory Games | Brain Training for All Ages"
              />
              <meta
                  property="og:description"
                  content="Enhance focus, memory and concentration with free science-based cognitive games. Perfect for kids, adults, and seniors looking to improve mental performance."
              />
              <meta property="og:site_name" content="FreeFocusGames" />

              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta
                  name="twitter:title"
                  content="Free Focus & Memory Games | Brain Training for All Ages"
              />
              <meta
                  name="twitter:description"
                  content="Improve memory and concentration with our free cognitive training games for all ages including Schulte Table, Pattern Recall Challenge, and more."
              />

              {/* iOS meta tags */}
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta
                  name="apple-mobile-web-app-status-bar-style"
                  content="default"
              />
              <meta name="apple-mobile-web-app-title" content="Focus Games" />

              {/* Windows */}
              <meta name="msapplication-TileColor" content="#ffffff" />

              {/* 基础SEO优化 */}
              <link rel="canonical" href="https://freefocusgames.com" />
              <meta name="robots" content="index, follow" />
              <meta name="revisit-after" content="7 days" />
              <meta name="author" content="FreeFocusGames Team" />

              {/* 社交媒体优化 */}
              <meta property="og:site_name" content="FreeFocusGames" />
              <meta
                  property="og:title"
                  content="Free Brain Games to Improve Focus, Memory & Concentration"
              />
              <meta
                  property="og:description"
                  content="Free online brain training platform with games designed for all ages. Improve cognitive skills with Schulte Table, Pattern Recall Challenge, and more focus-enhancing activities."
              />
              <meta
                  property="og:image"
                  content="https://freefocusgames.com/og/oglogo.png"
              />
              <meta property="og:url" content="https://freefocusgames.com" />

              {/* Twitter卡片优化 */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:creator" content="@freefocusgames" />
              <meta
                  name="twitter:image:alt"
                  content="FreeFocusGames - Free brain games to improve memory and concentration"
              />

              {/* 移动端优化 */}
              <meta name="apple-mobile-web-app-title" content="Focus Games" />
              <meta name="application-name" content="Focus Games" />
              <meta name="mobile-web-app-capable" content="yes" />

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
                  inter.variable,
                  outfit.variable
              )}
          >
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
              >
                  <Layout initialIsMobile={initialIsMobile}>{children}</Layout>
                  <Toaster />
              </ThemeProvider>
          </body>
          <GoogleAnalytics gaId="G-93FVQFJCHE" />
      </html>
  );
}
