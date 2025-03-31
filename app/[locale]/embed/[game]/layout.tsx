import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Focus Games Embed',
  description: '专注力训练游戏嵌入版本',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col justify-center items-center p-2">
          {children}
        </main>
      </body>
    </html>
  )
} 