'use client';

import { useEffect, useRef, useState } from 'react';
import { Game, Scale, AUTO, Types } from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { FrogScene } from '../scenes/FrogScene';

export default function GameComponent() {
    const gameRef = useRef<Game | null>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
                width: 800,
                height: 600,
                expandParent: false,
                fullscreenTarget: gameContainerRef.current
            },
            physics: {
                default: "arcade",
                arcade: {},
            },
            scene: [StartScene, FrogScene],
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
    }, []);

    return (
        <div 
            ref={gameContainerRef} 
            className={`w-full h-full ${isFullscreen ? 'flex items-center justify-center bg-black' : ''}`}
        />
    );
} 