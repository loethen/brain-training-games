'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { ShareModal } from '@/components/ui/ShareModal'

interface ShareButtonProps {
  title?: string
  excerpt?: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const shareText = title || ''

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsShareModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        shareText={shareText}
      />
    </>
  )
} 