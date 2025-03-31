import React from 'react'
import { Inter } from 'next/font/google'
import '../../../globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="embedded-content">
          {children}
        </div>
      </body>
    </html>
  )
} 