"use client"

import { createContext, useContext, useState } from "react"

type SidebarContextType = {
  isSidebarVisible: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
} 