'use client'

import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Dynamically import the Schulte table game component
const SchulteGameComponent = dynamic(
  () => import('@/app/[locale]/(main)/games/schulte-table/components/SchulteGame').then(mod => mod.SchulteGame),
  { ssr: false } // Important: Render this component only on the client side
)

export default function SchulteTableEmbedPage() {
  return (
    <div className={`flex items-center justify-center ${inter.className}`}>
      <div className="embedded-game-container p-2 w-full max-w-lg mx-auto">
        <SchulteGameComponent />
        {/* The sr-only link has been removed as requested */}
      </div>
    </div>
  )
}