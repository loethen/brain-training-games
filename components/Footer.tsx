"use client";

import { useTranslations } from 'next-intl';
import { XLogo } from './ui/XLogo';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('common');
  
  return (
      <footer className="text-center text-sm text-muted-foreground mt-12 pb-8">
          <p>{new Date().getFullYear()} © {t('allRightsReserved')} - FreeFocusGames</p>
          
          {/* Legal Links */}
          <div className="mt-3 flex items-center justify-center space-x-4 flex-wrap">
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t('about')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/privacy-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t('privacyPolicy')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/terms-of-service" 
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t('termsOfService')}
            </Link>
            <span className="text-muted-foreground">•</span>
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