'use client'

import { Button } from '@/components/ui/button'
import { X, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EmbedCodeModalProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameTitle: string
}

export function EmbedCodeModal({ 
  isOpen, 
  onClose, 
  gameName,
  gameTitle
}: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false)
  
  // 复制后重置状态
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])
  
  if (!isOpen) return null

  const embedCode = `<!-- Free Focus Games - ${gameTitle} 嵌入代码 -->
<div id="ffg-game-container" style="width:100%; max-width:600px; height:600px; margin:0 auto;"></div>
<a href="https://freefocusgames.com/games/${gameName}" target="_blank">由 Free Focus Games 提供的${gameTitle}</a>
<script src="https://freefocusgames.com/embed.js"></script>
<script>
  FreeFocusGamesEmbed.init({
    game: '${gameName}',
    container: 'ffg-game-container'
  });
</script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">在您的网站上嵌入{gameTitle}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            复制下面的代码并粘贴到您网站的HTML中即可嵌入此游戏：
          </p>
        </div>
        
        <div className="relative bg-muted p-4 rounded-md overflow-auto max-h-60 mb-4">
          <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all">
            {embedCode}
          </pre>
        </div>
        
        <Button 
          variant="default"
          className="gap-2"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              复制代码
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 