"use client";

import Link from "next/link"
import { Header } from "./header"
import { useState } from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 h-screen
          w-full md:w-[180px]
          flex pt-40
          transform transition-all duration-300 ease-in-out
          shadow-lg md:shadow-none
          bg-white/50 backdrop-blur-lg z-30 md:bg-transparent md:z-auto md:backdrop-blur-none
          ${isSidebarOpen 
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
          }
        `}
      >
        <nav className="w-full space-y-1 pl-4 text-sm">
          <Link
            href="/"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Games
          </Link>
          <Link
            href="/chess"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Chess
          </Link>
          <Link
            href="/sudoku"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Sudoku
          </Link>
          <Link
            href="/crossword"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Crossword
          </Link>
          <Link
            href="/memory"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Memory
          </Link>
          <Link
            href="/puzzle"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            Puzzle
          </Link>
          <Link
            href="/about"
            className="block hover:bg-gray-100 p-2 rounded text-black font-semibold relative hover:pl-3 transition-all 
            after:content-['→'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          >
            About
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`
          grid transition-all duration-400 ease-in-out
          ${isSidebarOpen
            ? "md:grid-cols-[180px_1fr] grid-cols-[0_1fr]"
            : "grid-cols-[0_1fr]"
          }
        `}
      >
        <aside className="min-h-[calc(100vh-4rem)]" />
        <main className="pl-4 pr-4 md:pl-8 md:pr-8 bg-white">{children}</main>
      </div>
    </div>
  );
} 