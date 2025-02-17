'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { SunfishScene } from '../scenes/SunfishScene';

export default function GameComponent() {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: 'game-container',
                width: '100%',
                height: '100%'
            },
            scene: [StartScene, SunfishScene],
            physics: {
                default: "arcade",
                arcade: {},
            },
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return <div id="game-container" className="w-full h-full" />;
} 