'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function GoogleAdSense({ adClient }: { adClient: string }) {
  useEffect(() => {
    try {
      // 更严格的检测：检查DOM中是否已存在AdSense脚本
      const existingScript = document.querySelector(
        `script[src*="adsbygoogle.js"][src*="${adClient}"]`
      )

      if (existingScript) {
        // 脚本已存在，不再重复加载
        return
      }

      // 创建新脚本
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
      script.async = true
      script.crossOrigin = 'anonymous'
      // 添加唯一标识，便于后续检测
      script.setAttribute('data-ad-client', adClient)
      document.head.appendChild(script)
    } catch (err) {
      console.error('Error appending AdSense script:', err)
    }
  }, [adClient])

  return null
}