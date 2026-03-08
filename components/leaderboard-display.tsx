"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, Users, TrendingUp, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { DEFAULT_LEADERBOARD_MODE } from "@/lib/leaderboard-config";

export type FormatterType = 'ms' | 'cps' | 'pts' | 'levels' | 'schulte' | 'default';

export interface LeaderboardDisplayProps {
    gameId: string;
    formatterType?: FormatterType;
    mode?: string;
}

type LeaderboardRecord = {
    playerName: string;
    score: number;
    createdAt: string;
};

export function LeaderboardDisplay({
    gameId,
    formatterType = 'default',
    mode = DEFAULT_LEADERBOARD_MODE,
}: LeaderboardDisplayProps) {
    const t = useTranslations('common.leaderboard');
    const [top20, setTop20] = useState<LeaderboardRecord[]>([]);
    const [averageScore, setAverageScore] = useState<number>(0);
    const [totalPlayers, setTotalPlayers] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [mySessionDetail, setMySessionDetail] = useState<{ playerName: string; score: number } | null>(null);

    const formatScore = useCallback((s: number) => {
        const rounded = Math.round(s);
        switch (formatterType) {
            case 'ms': return `${rounded} ${t('unitMs')}`;
            case 'cps': return `${Number(s.toFixed(1))} ${t('unitCps')}`;
            case 'pts': return `${rounded} ${t('unitPts')}`;
            case 'levels': return t('unitLevel', { score: rounded.toString() });
            case 'schulte': return `${(s / 1000).toFixed(1)} ${t('unitSec')}`;
            default: return rounded.toString();
        }
    }, [formatterType, t]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ gameId, mode });
            const res = await fetch(`/api/leaderboard?${params.toString()}`);
            if (res.ok) {
                const data = (await res.json()) as { top20: LeaderboardRecord[]; averageScore: number; totalPlayers: number };
                setTop20(data.top20);
                setAverageScore(data.averageScore);
                setTotalPlayers(data.totalPlayers);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [gameId, mode]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ gameId: string, playerName: string, score: number, mode?: string }>;
            if (customEvent.detail && customEvent.detail.gameId === gameId && (customEvent.detail.mode || DEFAULT_LEADERBOARD_MODE) === mode) {
                setMySessionDetail({
                    playerName: customEvent.detail.playerName,
                    score: customEvent.detail.score
                });
                fetchLeaderboard();
            }
        };

        window.addEventListener('leaderboardUpdated', handleUpdate);
        return () => window.removeEventListener('leaderboardUpdated', handleUpdate);
    }, [gameId, fetchLeaderboard, mode]);

    if (loading) {
        return (
            <div className="flex justify-center p-8 text-muted-foreground animate-pulse">
                {t('loading')}
            </div>
        );
    }

    return (
        <div className="w-full bg-background border rounded-xl overflow-hidden shadow-sm">
            {/* Header Stats */}
            <div className="bg-muted p-4 md:p-6 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">{t('title')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg border">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div className="text-sm">
                            <span className="font-semibold block">{totalPlayers}</span>
                            <span className="text-muted-foreground text-xs">{t('totalPlayers')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg border">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <div className="text-sm">
                            <span className="font-semibold block">{formatScore(averageScore)}</span>
                            <span className="text-muted-foreground text-xs">{t('averageScore')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Player Status */}
            {mySessionDetail && (
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <div>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                            {t('submittedTitle')} <strong className="font-bold text-emerald-900 dark:text-emerald-100">{mySessionDetail.playerName}</strong>.
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                            {t('submittedBody', {
                                score: formatScore(mySessionDetail.score),
                                average: formatScore(averageScore),
                            })}
                        </p>
                    </div>
                </div>
            )}

            {/* Leaderboard Table */}
            <div className="max-h-[400px] overflow-y-auto">
                {top20.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {t('empty')}
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm z-10">
                            <tr>
                                <th className="text-left font-medium p-4 text-muted-foreground">{t('rank')}</th>
                                <th className="text-left font-medium p-4 text-muted-foreground">{t('player')}</th>
                                <th className="text-right font-medium p-4 text-muted-foreground">{t('score')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {top20.map((record, index) => {
                                const isMe = mySessionDetail && record.playerName === mySessionDetail.playerName;
                                return (
                                    <tr
                                        key={index}
                                        className={`hover:bg-muted/50 transition-colors ${isMe ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold bg-muted text-muted-foreground text-xs">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium flex items-center gap-2">
                                            {record.playerName}
                                            {isMe && <span className="text-[10px] uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-bold">{t('you')}</span>}
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold">
                                            <div>{formatScore(record.score)}</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
