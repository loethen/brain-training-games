import type { Metadata } from "next";
import { inter, outfit } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-white">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
