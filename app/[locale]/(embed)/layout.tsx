import '../globals.css';
import './embed.css';
import { inter } from '../fonts';
import { cn } from '@/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { useEffect, useRef } from 'react';

export const metadata = {
  title: 'Embedded Game',
  description: 'Embedded game from Free Focus Games'
}

// 使用下面这个字段来告诉 Next.js 不要继承父级布局
// export const layoutSegments = []; // Commented out or remove if not needed for this structure

// Function component to handle resizing and posting messages
function EmbedHeightReporter({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we are in an iframe and ResizeObserver is available
    if (typeof window !== 'undefined' && window.parent !== window && 'ResizeObserver' in window) {
      const targetOrigin = 'https://www.freefocusgames.com'; // IMPORTANT: Set this to your actual parent domain for security

      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Use scrollHeight for potentially overflowing content
          const height = entry.target.scrollHeight;
          // Send message to parent window
          window.parent.postMessage({ type: 'ffg-resize', height: height }, targetOrigin);
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // Cleanup function: disconnect the observer when component unmounts
      return () => {
        observer.disconnect();
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return <div ref={containerRef}>{children}</div>;
}

// 避免继承 RootLayout 的语言和样式
export default async function EmbedLayout({ 
  children,
  params
}: { 
  children: React.ReactNode;
  params: { locale: string }
}) {
  // 获取当前语言的消息
  const messages = await getMessages();
  
  return (
    <html lang={params.locale} className={cn(inter.variable)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background font-sans antialiased min-h-screen">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {/* Wrap children with the reporter component */}
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