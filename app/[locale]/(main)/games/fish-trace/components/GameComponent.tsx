'use client';

import { useEffect, useRef, useState } from 'react';
import { Game, Scale, AUTO, Types } from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { SunfishScene } from '../scenes/SunfishScene';
import { useTranslations } from 'next-intl';

export default function GameComponent() {
    const gameRef = useRef<Game | null>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const t = useTranslations('games.fishTrace');

    useEffect(() => {
        if (gameRef.current) return;

        const config: Types.Core.GameConfig = {
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
                preBoot: (game) => {
                    game.registry.set('t', (key: string, params?: Record<string, string | number>) => {
                        try {
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
        />
    );
} 