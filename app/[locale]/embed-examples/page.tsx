'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { EmbedCodeModal } from '@/components/ui/EmbedCodeModal'
import Script from 'next/script'

// 扩展Window接口以包含嵌入脚本
declare global {
  interface Window {
    FreeFocusGamesEmbed?: {
      init: (options: {
        game: string;
        container: string;
        width?: string;
        height?: string;
        attribution?: boolean;
      }) => void;
    }
  }
}

export default function EmbedExamplesPage() {
  const [showSchulteModal, setShowSchulteModal] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  
  // 加载嵌入脚本后初始化游戏
  useEffect(() => {
    if (scriptsLoaded && typeof window !== 'undefined' && window.FreeFocusGamesEmbed) {
      window.FreeFocusGamesEmbed.init({
        game: 'schulte-table',
        container: 'ffg-game-container'
      });
    }
  }, [scriptsLoaded]);
  
  return (
    <div className="container mx-auto py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">游戏嵌入示例</h1>
        <p className="text-muted-foreground">
          本页面展示如何将Free Focus Games的游戏嵌入到您的网站中
        </p>
      </header>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">舒尔特表训练游戏</h2>
        
        <div className="flex gap-4 items-start">
          <div className="flex-1 border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">嵌入代码示例</h3>
            <Button 
              onClick={() => setShowSchulteModal(true)}
              className="gap-2"
            >
              获取嵌入代码
            </Button>
            
            {/* 嵌入代码模态框 */}
            {showSchulteModal && (
              <EmbedCodeModal 
                isOpen={showSchulteModal}
                onClose={() => setShowSchulteModal(false)}
                gameName="schulte-table"
                gameTitle="舒尔特表训练游戏"
              />
            )}
          </div>
          
          <div className="flex-1 border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">嵌入效果预览</h3>
            
            {/* 嵌入游戏实例 */}
            <div id="ffg-game-container" style={{width: '100%', maxWidth: '600px', height: '600px', margin: '0 auto'}}></div>
            <a href="https://freefocusgames.com/games/schulte-table" target="_blank" rel="noopener noreferrer">由 Free Focus Games 提供的舒尔特表训练游戏</a>
            
            {/* 使用Next.js的Script组件加载脚本 */}
            <Script 
              src="/embed.js"
              onLoad={() => setScriptsLoaded(true)}
              strategy="afterInteractive"
            />
          </div>
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">嵌入说明</h2>
        <div className="prose max-w-none">
          <h3>如何在您的网站上嵌入游戏</h3>
          <ol>
            <li>点击"获取嵌入代码"按钮</li>
            <li>复制提供的HTML代码</li>
            <li>将代码粘贴到您网站的HTML中</li>
          </ol>
          
          <h3>注意事项</h3>
          <ul>
            <li>归因链接（指向Free Focus Games的链接）是必须的</li>
            <li>您可以调整容器的宽度和高度以适应您的网站布局</li>
            <li>游戏内容会自动适应容器大小</li>
          </ul>
        </div>
      </section>
    </div>
  )
} 