'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code } from 'lucide-react'
import { EmbedCodeModal } from '@/components/EmbedCodeModal'
import { useTranslations } from 'next-intl'

interface EmbedButtonProps {
  gameName: string;
  gameTitle: string;
  className?: string;
}

export function EmbedButton({ gameName, gameTitle, className }: EmbedButtonProps) {
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const t = useTranslations('games.template')
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${className || ''}`}
        onClick={() => setShowEmbedModal(true)}
      >
        <Code className="h-4 w-4" />
        {t('embedGame')}
      </Button>
      
      {showEmbedModal && (
        <EmbedCodeModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          gameName={gameName}
          gameTitle={gameTitle}
        />
      )}
    </>
  )
} 