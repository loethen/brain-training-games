'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import MemoryTestGame from './MemoryTestGame';

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <MemoryTestGame />
        </NextIntlClientProvider>
    );
} 