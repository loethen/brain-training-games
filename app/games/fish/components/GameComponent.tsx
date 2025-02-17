'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { SunfishScene } from '../scenes/SunfishScene';

export default function GameComponent() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            scale: {
                mode: Phaser.Scale.EXPAND,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1024,
                height: 768,
                parent: gameContainerRef.current,
            },
            physics: {
                default: "arcade",
                arcade: {},
            },
            scene: [StartScene, SunfishScene],
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return <div ref={gameContainerRef} />;
} 