'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function GoogleAdSense({ adClient }: { adClient: string }) {
  useEffect(() => {
    // Skip AdSense in development - it doesn't work on localhost
    if (process.env.NODE_ENV === 'development') {
      return
    }

    try {
      // 防止重复加载脚本 - 检查脚本是否已加载
      if (!window.adsbygoogle) {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    } catch (err) {
      console.error('Error appending AdSense script:', err)
    }
  }, [adClient])

  return null
}