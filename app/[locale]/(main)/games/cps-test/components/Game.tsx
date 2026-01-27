'use client';

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import CPSTestGame from './CPSTestGame';

export default function Game() {
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <CPSTestGame />
        </NextIntlClientProvider>
    );
}
