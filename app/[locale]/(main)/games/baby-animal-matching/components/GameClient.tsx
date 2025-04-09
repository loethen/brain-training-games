'use client';

import React, { useState } from 'react';
import FlipCard from './FlipCard';

// CardData interface, animals array, shuffleArray function...
interface CardData {
  id: number;
  animalId: number;
  animalName: string;
  imageUrl: string;
  isFlipped: boolean;
}

const animals = [
  { id: 0, name: "Fawn", url: "https://images.unsplash.com/photo-1675203921970-982a980e614f?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 1, name: "Lamb", url: "https://images.unsplash.com/photo-1675203921916-1f64b9424793?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHwyfHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 2, name: "Chick", url: "https://images.unsplash.com/photo-1535979863199-3c77338429a0?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHwzfHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 3, name: "Duckling", url: "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHw0fHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 4, name: "Bunny", url: "https://images.unsplash.com/photo-1502899845910-573a1d1c390d?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHw1fHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 5, name: "Quokka", url: "https://images.unsplash.com/photo-1516703995331-215d1188db0c?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHw2fHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 6, name: "Fox", url: "https://images.unsplash.com/photo-1525869916826-972885c91c1e?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHw3fHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
  { id: 7, name: "Cub", url: "https://images.unsplash.com/photo-1541330661065-b31855a1f31e?ixid=M3w3Mjc2NjN8MHwxfHNlYXJjaHw4fHxjdXRlJTIwYmFieSUyMGFuaW1hbHxlbnwwfHx8fDE3NDQwOTU3Mzh8MA&ixlib=rb-4.0.3&w=200" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const createInitialCards = (numPairs: number): CardData[] => {
  const selectedAnimals = animals.slice(0, numPairs);
  const gameCards: CardData[] = selectedAnimals.flatMap((animal, index) => [
    {
      id: index * 2,
      animalId: animal.id,
      animalName: animal.name,
      imageUrl: animal.url,
      isFlipped: false,
    },
    {
      id: index * 2 + 1,
      animalId: animal.id,
      animalName: animal.name,
      imageUrl: animal.url,
      isFlipped: false,
    },
  ]);
  return shuffleArray(gameCards);
};

// Renamed component
export default function GameClient() { 
  // Use the simplified logic from previous step (state initialized directly OR with useEffect)
  // Using the direct initialization here as ssr:false handles the hydration mismatch
  const [cards, setCards] = useState<CardData[]>(() => createInitialCards(8)); 

  const handleCardClick = (index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], isFlipped: !newCards[index].isFlipped };
      return newCards;
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6">Flip Cards Demo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {cards.map((card, index) => (
          <FlipCard
            key={card.id}
            card={card}
            index={index}
            isFlipped={card.isFlipped}
            matched={false}
            isGameOver={false}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
} 