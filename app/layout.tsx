import type { Metadata } from "next";
import { inter, outfit } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout"
import { ThemeProvider } from "next-themes"
import { headers } from "next/headers"
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Focus Training Games | Brain Exercises Online",
  description: "Improve concentration and cognitive skills with science-based brain games including Schulte Grid, Memory Matrix, Color Tracking, and Attention Challenges",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"
  ),
  keywords: [
    'focus training',
    'memory games',
    'card matching game', 
    'attention exercises',
    'cognitive training',
    'concentration games',
    'brain training',
    'working memory'
  ],
  openGraph: {
    images: '/og/oglogo.png',
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
              <meta property="og:title" content="Focus & Memory Training Games" />
              <meta
                  property="og:description"
                  content="Boost your brain power with our collection of attention-building games: Memory Challenges, Card Matching Exercises, and Focus Improvement Activities"
              />
              <meta property="og:site_name" content="Free Focus Games" />

              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="Brain Training Games - Memory & Focus Exercises" />
              <meta
                  name="twitter:description"
                  content="Improve concentration with our cognitive training games: Memory Matrix, Card Match Challenge, and Attention Building Activities"
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
              <meta name="author" content="Focus Games Team" />
              
              {/* 社交媒体优化 */}
              <meta property="og:site_name" content="Free Focus Games" />
              <meta property="og:title" content="Cognitive Training Games | Improve Focus & Attention" />
              <meta 
                property="og:description" 
                content="Free online brain training platform featuring professionally designed concentration games like Schulte Grid, Memory Matrix, and Color Tracking exercises" 
              />
              <meta property="og:image" content="https://freefocusgames.com/og/oglogo.png" />
              <meta property="og:url" content="https://freefocusgames.com" />
              
              {/* Twitter卡片优化 */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:creator" content="@freefocusgames" />
              <meta name="twitter:image:alt" content="Free Focus Games - Cognitive Training Platform with brain exercise games" />
              
              {/* 移动端优化 */}
              <meta name="apple-mobile-web-app-title" content="Focus Games" />
              <meta name="application-name" content="Focus Games" />
              <meta name="mobile-web-app-capable" content="yes" />
              
              {/* 结构化数据 */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Free Focus Games",
                  "url": "https://freefocusgames.com",
                  "description": "Professional online platform for cognitive training and focus improvement",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://freefocusgames.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
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
              </ThemeProvider>
          </body>
          <GoogleAnalytics gaId="G-93FVQFJCHE" />
      </html>
  );
}
