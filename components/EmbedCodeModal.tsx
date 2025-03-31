'use client'

import { Button } from '@/components/ui/button'
import { X, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface EmbedCodeModalProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameTitle: string
}

type CodeType = 'html' | 'react' | 'vue';

export function EmbedCodeModal({ 
  isOpen, 
  onClose, 
  gameName,
  gameTitle
}: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [codeType, setCodeType] = useState<CodeType>('html')
  const t = useTranslations('games.embed')
  const locale = useLocale()
  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])
  
  if (!isOpen) return null

  const standardCode = `<!-- HTML Example -->
<div id="ffg-game-container" style="width:100%; max-width:600px; margin:0 auto;"></div>
<a href="https://www.freefocusgames.com/games/${gameName}" target="_blank" rel="noopener" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">Powered by Free Focus Games ${gameTitle}</a>
<script src="https://www.freefocusgames.com/embed.js"></script>
<script>
  FreeFocusGamesEmbed.init({
    game: '${gameName}',
    container: 'ffg-game-container',
    locale: '${locale}'
  });
</script>`;

  const reactCode = `{/* React Example */}
import Script from 'next/script'  // For Next.js
// For other React apps, you can use a regular script tag

export function ${gameTitle.replace(/\s+/g, '')}Game() {
  // Define the styles as an object for React's style prop
  const srOnlyStyle: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0 // Use borderWidth for React
  };

  return (
    <>
      <div id="ffg-game-container" style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }} />
      <a 
        href="https://www.freefocusgames.com/games/${gameName}"
        target="_blank"
        rel="noopener"
        style={srOnlyStyle} // Apply the style object
      >
        Powered by Free Focus Games ${gameTitle}
      </a>
      
      {/* For Next.js */}
      <Script 
        src="https://www.freefocusgames.com/embed.js"
        onLoad={() => {
          window.FreeFocusGamesEmbed?.init({
            game: '${gameName}',
            container: 'ffg-game-container',
            locale: '${locale}'
          });
        }}
      />
      
      {/* For other React apps
      <script 
        src="https://www.freefocusgames.com/embed.js" 
        async 
        onLoad={() => {
          window.FreeFocusGamesEmbed?.init({
            game: '${gameName}',
            container: 'ffg-game-container',
            locale: '${locale}'
          });
        }}
      />
      */}
    </>
  );
}`;

  const vueCode = `<!-- Vue Example -->
<template>
  <div class="game-container">
    <div ref="gameContainer" />
    <a
      :href="gameUrl"
      target="_blank"
      rel="noopener"
      style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;" 
    >
      Powered by Free Focus Games ${gameTitle}
    </a>
  </div>
</template>

<script>
export default {
  name: '${gameTitle.replace(/\s+/g, '')}Game',
  data() {
    return {
      gameUrl: 'https://www.freefocusgames.com/games/${gameName}'
    }
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://www.freefocusgames.com/embed.js';
    script.async = true;
    
    script.onload = () => {
      if (window.FreeFocusGamesEmbed && this.$refs.gameContainer) {
        this.cleanup = window.FreeFocusGamesEmbed.init({
          game: '${gameName}',
          container: this.$refs.gameContainer,
          locale: '${locale}'
        });
      }
    };
    
    document.body.appendChild(script);
    this.script = script;
  },
  beforeDestroy() {
    if (this.cleanup) this.cleanup();
    if (this.script && document.body.contains(this.script)) {
      document.body.removeChild(this.script);
    }
  }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Remove .sr-only as it's now inline */
</style>`;

  const codeMap = {
    html: standardCode,
    react: reactCode,
    vue: vueCode
  };

  const embedCode = codeMap[codeType];

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
          <h3 className="text-lg font-bold">{t('embedTitle', { gameTitle })}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            {t('instructions')}
          </p>
          <div className="flex gap-2">
            <Button 
              variant={codeType === 'html' ? "default" : "outline"}
              size="sm"
              onClick={() => setCodeType('html')}
            >
              HTML
            </Button>
            <Button 
              variant={codeType === 'react' ? "default" : "outline"}
              size="sm"
              onClick={() => setCodeType('react')}
            >
              React
            </Button>
            <Button 
              variant={codeType === 'vue' ? "default" : "outline"}
              size="sm"
              onClick={() => setCodeType('vue')}
            >
              Vue
            </Button>
          </div>
        </div>
        
        <div className="relative bg-muted p-4 rounded-md overflow-auto max-h-[60vh] mb-4">
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
              {t('copied')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t('copyCode')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 