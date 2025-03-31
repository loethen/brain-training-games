import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Focus Games Embed',
  description: 'Focus training game embedded version',
  robots: 'noindex'
}

export default function EmbedGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col justify-center items-center p-2">
          {children}
        </main>
      </body>
    </html>
  )
} 