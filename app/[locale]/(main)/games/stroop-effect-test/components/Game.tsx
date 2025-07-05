'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import StroopGame from './StroopGame';

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <StroopGame />
        </NextIntlClientProvider>
    );
} 