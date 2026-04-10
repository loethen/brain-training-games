'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_LIBRARY } from '../data';
import { EN_TYPE_COPY } from '../copy';

type Entry = {
    mode: string;
    totalSubmissions: number;
};

type ResponseData = {
    entries: Entry[];
    totalSubmissions: number;
};

export default function SbtiTypeLeaderboard() {
    const locale = useLocale();
    const t = useTranslations('sbtiTest.leaderboard');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDistribution = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/leaderboard?gameId=sbti-test&aggregate=modeCounts', {
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch leaderboard');
            }

            const data = await res.json() as ResponseData;
            setEntries(data.entries);
        } catch (error) {
            console.error(error);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDistribution();
    }, [fetchDistribution]);

    useEffect(() => {
        const handleUpdate = (event: Event) => {
            const customEvent = event as CustomEvent<{ gameId: string }>;
            if (customEvent.detail?.gameId === 'sbti-test') {
                void fetchDistribution();
            }
        };

        window.addEventListener('leaderboardUpdated', handleUpdate);
        return () => window.removeEventListener('leaderboardUpdated', handleUpdate);
    }, [fetchDistribution]);

    const localizedName = useCallback((code: string) => {
        if (locale === 'en') {
            return EN_TYPE_COPY[code]?.name || TYPE_LIBRARY[code as keyof typeof TYPE_LIBRARY]?.cn || code;
        }

        return TYPE_LIBRARY[code as keyof typeof TYPE_LIBRARY]?.cn || code;
    }, [locale]);

    const rankedEntries = useMemo(() => entries.map((entry) => ({
        ...entry,
        name: localizedName(entry.mode),
    })), [entries, localizedName]);

    if (loading) {
        return (
            <div className="w-full bg-background border rounded-xl overflow-hidden shadow-sm">
                <div className="flex justify-center p-8 text-muted-foreground animate-pulse">
                    {t('loading')}
                </div>
            </div>
        );
    }

    if (rankedEntries.length === 0) {
        return (
            <div className="w-full bg-background border rounded-xl overflow-hidden shadow-sm">
                <div className="p-8 text-center text-muted-foreground">
                    {t('empty')}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background border rounded-xl overflow-hidden shadow-sm">
            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            <th className="text-left font-medium p-4 text-muted-foreground">{t('rank')}</th>
                            <th className="text-left font-medium p-4 text-muted-foreground">{t('type')}</th>
                            <th className="text-right font-medium p-4 text-muted-foreground">{t('count')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rankedEntries.map((entry, index) => (
                            <tr key={entry.mode} className="hover:bg-muted/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold bg-muted text-muted-foreground text-xs">
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-foreground">
                                    {entry.name}
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-foreground">
                                    {entry.totalSubmissions}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
