'use client';

import dynamic from 'next/dynamic'
import { NextIntlClientProvider, useMessages, useLocale } from 'next-intl';

// Dynamically import the game component and its dependencies
const GameComponent = dynamic(() => 
    Promise.all([
        import('three'),
        import('./GameComponent')
    ]).then(([, gameModule]) => gameModule), 
    {
        ssr: false, // Disable server-side rendering
        loading: () => (
            <div className="w-full h-full flex items-center justify-center">
                <div>Loading game...</div>
            </div>
        )
    }
);

export default function Game() {
    // 获取当前语言和消息
    const locale = useLocale();
    const messages = useMessages();
    
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <GameComponent />
        </NextIntlClientProvider>
    );
} 