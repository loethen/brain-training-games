'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import ReactionTimeGame from './ReactionTimeGame';

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ReactionTimeGame />
        </NextIntlClientProvider>
    );
} 