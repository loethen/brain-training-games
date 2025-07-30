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
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    } catch (err) {
      console.error('Error appending AdSense script:', err)
    }
  }, [adClient])

  return null
}