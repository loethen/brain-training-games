'use client'

import { Button } from '@/components/ui/button'
import { XLogo } from '@/components/ui/XLogo'
import { Facebook, Linkedin, Link as LinkIcon, X } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url?: string
  title?: string
}

export function ShareModal({ isOpen, onClose, url = window.location.href, title = 'Free Focus Games' }: ShareModalProps) {
  if (!isOpen) return null

  const shareOptions = [
    {
      name: "X",
      icon: <XLogo className="w-4 h-4" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Check out this focus training game! ${url}`
          )}`,
          "_blank"
        ),
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        ),
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(title)}`,
          "_blank"
        ),
    },
    {
      name: "Copy Link",
      icon: <LinkIcon className="w-4 h-4" />,
      onClick: () => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share this game</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="gap-2"
              onClick={option.onClick}
            >
              {option.icon}
              {option.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 