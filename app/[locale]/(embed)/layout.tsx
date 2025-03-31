import '../globals.css';
import './embed.css';
import { inter } from '../fonts';
import { cn } from '@/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { EmbedHeightReporter } from './EmbedHeightReporter.client';

export const metadata = {
  title: 'Embedded Game',
  description: 'Embedded game from Free Focus Games'
}

// 使用下面这个字段来告诉 Next.js 不要继承父级布局
// export const layoutSegments = []; // Commented out or remove if not needed for this structure

// Layout is now an async Server Component again
export default async function EmbedLayout({ 
  children,
  params
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}) {
  // 获取当前语言的消息
  const messages = await getMessages();
  const { locale } = await params;
  
  return (
    <html lang={locale} className={cn(inter.variable)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background font-sans antialiased min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Use the imported client component */}
          <EmbedHeightReporter>
            <div className="embed-container flex flex-col h-auto">
              <div className="flex-grow">{children}</div>
              <footer className="text-center text-xs text-muted-foreground py-2">
                <a 
                  href="https://www.freefocusgames.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Powered by Free Focus Games
                </a>
              </footer>
            </div>
          </EmbedHeightReporter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 