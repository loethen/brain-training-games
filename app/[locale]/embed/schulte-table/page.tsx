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
    <div className="embedded-game-container p-2 max-w-lg mx-auto">
      {/* Use game component directly */}
      <SchulteGameComponent />
    </div>
  )
} 