'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import the Schulte table game component
const SchulteGameComponent = dynamic(
  () => import('@/app/[locale]/games/schulte-table/components/SchulteGame').then(mod => mod.SchulteGame),
  { ssr: false }
)

export default function SchulteTableEmbedPage() {
  const [mounted, setMounted] = useState(false)
  
  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <>
      <div className="embedded-game-container p-2 max-w-lg mx-auto">
        <SchulteGameComponent />
      </div>
      {/* Hidden backlink for SEO */}
      <a 
        href="https://freefocusgames.com/games/schulte-table" 
        target="_blank" 
        rel="noopener noreferrer"
        className="sr-only"
      >
        Schulte Table Game by Free Focus Games
      </a>
    </>
  )
}

// Explicitly set that this page should not use layout
export const metadata = {
  // Empty metadata to avoid inheriting from parent
}

export const runtime = 'edge' 