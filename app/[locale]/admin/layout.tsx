import type { Metadata, Viewport } from "next";
import { inter } from "../fonts";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Admin - FreeFocusGames',
    description: 'Admin Dashboard',
    robots: 'noindex, nofollow',
};

export const generateViewport = (): Viewport => {
    return {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    };
};

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // 确保 params 是已解析的对象
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) notFound();

    // Directly get messages
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
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
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
