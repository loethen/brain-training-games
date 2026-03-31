'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import SpacebarClickerGame from './SpacebarClickerGame';

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <SpacebarClickerGame />
        </NextIntlClientProvider>
    );
}
