'use client';

import { useEffect, useRef } from 'react';

interface FooterAdProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function FooterAd({ className = '' }: FooterAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || !adRef.current) return;
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`w-full my-8 ${className}`}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block'
        }}
        data-ad-client="ca-pub-2676017781507774"
        data-ad-slot="2942152599"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}