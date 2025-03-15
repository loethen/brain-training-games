"use client";

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('common');
  
  return (
      <footer className="text-center text-sm text-muted-foreground mt-12 pb-8">
          <p>{new Date().getFullYear()} © {t('allRightsReserved')} - FreeFocusGames</p>
      </footer>
  );
}