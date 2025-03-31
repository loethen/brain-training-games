'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 动态导入舒尔特表游戏组件
const SchulteGameComponent = dynamic(
  () => import('../../games/schulte-table/components/SchulteGame'),
  { ssr: false }
)

export default function SchulteTableEmbedPage() {
  const [mounted, setMounted] = useState(false)
  
  // 确保客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <div className="embedded-game-container p-2 max-w-lg mx-auto">
      {/* 直接使用游戏组件，不传递isEmbedded参数 */}
      <SchulteGameComponent />
    </div>
  )
} 