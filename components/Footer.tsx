"use client";

import { useTranslations } from 'next-intl';
import { XLogo } from './ui/XLogo';

export function Footer() {
  const t = useTranslations('common');
  
  return (
      <footer className="text-center text-sm text-muted-foreground mt-12 pb-8">
          <p>{new Date().getFullYear()} © {t('allRightsReserved')} - FreeFocusGames</p>
          <div className="mt-2 flex items-center justify-center">
            <a 
              href="https://x.com/2also397879" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow on X"
            >
              <XLogo className="w-4 h-4" />
            </a>
          </div>
      </footer>
  );
}