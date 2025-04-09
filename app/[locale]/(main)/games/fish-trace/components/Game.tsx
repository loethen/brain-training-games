'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import dynamic from 'next/dynamic'

// 动态导入 Phaser 相关内容
const GameComponent = dynamic(() => import('./GameComponent'), {
    ssr: false, // 禁用服务器端渲染
    loading: () => {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }
});

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="max-w-3xl mx-auto aspect-4/3">
                <GameComponent />
            </div>
        </NextIntlClientProvider>
    );
} 