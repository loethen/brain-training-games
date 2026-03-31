'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const sequence = [
    { count: 0, pressed: false, status: 'idle' as const },
    { count: 12, pressed: true, status: 'active' as const },
    { count: 24, pressed: false, status: 'active' as const },
    { count: 36, pressed: true, status: 'done' as const },
]

export function GamePreview() {
    const t = useTranslations('games.spacebarClicker.preview')
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setIndex((current) => (current + 1) % sequence.length)
        }, 850)

        return () => window.clearTimeout(timeoutId)
    }, [index])

    const frame = sequence[index]
    const statusLabel = frame.status === 'idle'
        ? t('statusIdle')
        : frame.status === 'active'
            ? t('statusActive')
            : t('statusDone')

    return (
        <div className="h-full w-full overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
            <div className="relative flex h-full flex-col bg-linear-to-br from-background via-background to-muted/30 p-2.5">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/8 blur-2xl" />

                <div className="relative mb-2 flex items-start justify-between gap-2">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            {t('eyebrow')}
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-foreground">
                            {t('title')}
                        </div>
                    </div>
                    <div className="rounded-full border border-border bg-background/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
                        {statusLabel}
                    </div>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center rounded-[18px] border border-border/80 bg-background/80 px-3 py-3">
                    <div className="w-full max-w-[164px] space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                            <span>{t('counterLabel')}</span>
                            <span className="tabular-nums text-foreground">{frame.count}</span>
                        </div>
                        <div
                            className={cn(
                                'rounded-[24px] border border-border bg-card px-4 py-4 text-center shadow-[inset_0_-4px_0_rgba(15,23,42,0.06)] transition-transform duration-200',
                                frame.pressed && 'translate-y-[3px] shadow-[inset_0_2px_0_rgba(15,23,42,0.08)]'
                            )}
                        >
                            <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
                                {t('keyLabel')}
                            </div>
                            <div className="mt-2 text-xl font-semibold tracking-[0.35em] text-foreground">
                                SPACE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
