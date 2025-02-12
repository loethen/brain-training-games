import type { Metadata } from "next";
import { inter, outfit } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout"

export const metadata: Metadata = {
  title: "Focus Games",
  description: "Improve your concentration with our free focus training games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="A collection of classic games including Chess, Sudoku, Crossword, Memory, and Puzzle games" />
        
        {/* PWA primary color */}
        <meta name="theme-color" content="#ffffff" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Classic Games Collection" />
        <meta property="og:description" content="Play classic games online including Chess, Sudoku, Crossword and more" />
        <meta property="og:site_name" content="Classic Games" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Classic Games Collection" />
        <meta name="twitter:description" content="Play classic games online including Chess, Sudoku, Crossword and more" />
        
        {/* iOS meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Classic Games" />
        
        {/* Windows */}
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        outfit.variable
      )}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
