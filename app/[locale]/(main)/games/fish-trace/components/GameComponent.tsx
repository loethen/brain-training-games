'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GameComponent() {
    const gameRef = useRef<InstanceType<typeof import('phaser').Game> | null>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const t = useTranslations('games.fishTrace');

    useEffect(() => {
        if (gameRef.current) return;

        const initGame = async () => {
            try {
                setIsLoading(true);
                const [
                    { Game, Scale, AUTO },
                    { StartScene },
                    { SunfishScene }
                ] = await Promise.all([
                    import('phaser'),
                    import('../scenes/StartScene'),
                    import('../scenes/SunfishScene')
                ]);

                const config = {
                    type: AUTO,
                    parent: gameContainerRef.current,
                    backgroundColor: 'transparent',
                    transparent: true,
                    scale: {
                        mode: Scale.FIT,
                        autoCenter: Scale.CENTER_BOTH,
                        width: 1024,
                        height: 768,
                        expandParent: false,
                        fullscreenTarget: gameContainerRef.current
                    },
                    physics: {
                        default: "arcade",
                        arcade: {},
                    },
                    scene: [StartScene, SunfishScene],
                    callbacks: {
                        preBoot: (game: { registry: { set: (key: string, value: unknown) => void } }) => {
                            game.registry.set('t', (key: string, params?: Record<string, string | number>) => {
                                try {
                                    // 特殊处理title和其他非gameUI下的翻译键
                                    if (key === 'title') {
                                        return t.raw(key);
                                    }
                                    
                                    // 处理内部嵌套的levelDesc
                                    if (key.startsWith('levelDesc.')) {
                                        return t.raw(`gameUI.${key}`);
                                    }
                                    
                                    if (params) {
                                        return t(`gameUI.${key}`, params);
                                    }
                                    return t(`gameUI.${key}`);
                                } catch (error) {
                                    console.warn(`Translation error for ${key}:`, error);
                                    return key;
                                }
                            });
                        }
                    }
                };

                gameRef.current = new Game(config);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load game:', error);
                setIsLoading(false);
            }
        };

        initGame();

        // 监听全屏变化
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [t]);

    return (
        <div 
            ref={gameContainerRef} 
            className={`w-full h-full ${isFullscreen ? 'flex items-center justify-center bg-black' : ''}`}
        >
            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading game...</div>
                </div>
            )}
        </div>
    );
} 