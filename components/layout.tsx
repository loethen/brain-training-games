"use client";

import Link from "next/link"
import { Header } from "./header"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`
        fixed top-0 w-[160px] h-screen
        flex items-center
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen 
          ? 'translate-x-0 opacity-100' 
          : '-translate-x-8 opacity-0 pointer-events-none'
        }
      `}>
        <nav className="w-full space-y-1 pl-4 text-sm">
          <Link href="/" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Games
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/chess" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Chess
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/sudoku" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Sudoku
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/crossword" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Crossword
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/memory" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Memory
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/puzzle" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            Puzzle
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
          <Link href="/about" className="group block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all">
            About
            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
          </Link>
        </nav>
      </div>

      <div className="grid transition-all duration-400 ease-in-out" 
           style={{ gridTemplateColumns: isSidebarOpen ? '160px 1fr' : '0 1fr' }}>
        <aside className="min-h-[calc(100vh-4rem)]" />
        <main className="pl-8 pr-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
} 