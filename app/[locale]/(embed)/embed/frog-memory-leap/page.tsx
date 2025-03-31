'use client'

import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Simple loading component
const LoadingComponent = () => (
  <div className="text-center text-muted-foreground">
    Loading game...
  </div>
);

// Dynamically import the Frog Memory Leap game component (assuming default export)
const FrogMemoryLeapGameComponent = dynamic(
  () => import('@/app/[locale]/(main)/games/frog-memory-leap/components/GameComponent'),
  {
    ssr: false, // Important: Render this component only on the client side
    loading: () => <LoadingComponent />, // Add the loading component here
  }
)

export default function FrogMemoryLeapEmbedPage() {
  return (
    // Using a simpler container, adjust if needed based on the game's styling requirements
    <div className={`flex items-center justify-center ${inter.className}`}>
      <div className="embedded-game-container p-2 w-full max-w-lg mx-auto">
        <FrogMemoryLeapGameComponent />
      </div>
    </div>
  )
}
