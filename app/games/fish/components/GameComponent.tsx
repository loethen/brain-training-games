'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { SunfishScene } from '../scenes/SunfishScene';

export default function GameComponent() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1024,
                height: 768,
                orientation: Phaser.Scale.LANDSCAPE,
                expandParent: false,
                fullscreenTarget: gameContainerRef.current
            },
            physics: {
                default: "arcade",
                arcade: {},
            },
            scene: [StartScene, SunfishScene],
        };

        gameRef.current = new Phaser.Game(config);

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