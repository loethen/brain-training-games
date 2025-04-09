'use client';

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardData {
    id: number;
    animalId: number;
    animalName: string;
    imageUrl: string;
}

interface FlipCardProps {
    card: CardData;
    index: number;
    isFlipped: boolean;
    matched: boolean;
    isGameOver: boolean;
    onClick: (index: number) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({
    card,
    index,
    isFlipped,
    matched,
    isGameOver,
    onClick,
}) => {
    const handleClick = () => {
        if (!isGameOver && !matched) {
            console.log(`Clicked card ${index}, isFlipped: ${isFlipped}`); // 调试用
            onClick(index);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="[perspective:1000px] cursor-pointer"
        >
            <div
                className={cn(
                    'relative w-full h-0 pb-[133%] transform-preserve-3d transition-transform duration-500',
                    'hover:scale-105 transition-all',
                    isFlipped && 'rotate-y-180',
                    isGameOver && 'opacity-70 cursor-default',
                    matched && 'ring-2 ring-green-400 rounded-xl'
                )}
            >
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">?</span>
                    </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="w-full h-full bg-white rounded-xl shadow-md p-2 flex flex-col items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full flex-grow">
                            <Image
                                src={card.imageUrl}
                                alt={card.animalName}
                                fill
                                sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                                style={{ objectFit: 'contain' }}
                                priority={index < 8}
                            />
                        </div>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700 text-center truncate w-full px-1">
                            {card.animalName}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
