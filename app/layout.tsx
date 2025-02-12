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
