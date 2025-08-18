'use client';

import { useEffect, useRef } from 'react';

interface HomeBannerAdProps {
  className?: string;
  adKey?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function HomeBannerAd({ className = '', adKey = 'default' }: HomeBannerAdProps) {
  const adRef = useRef<HTMLElement>(null);
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
        data-ad-slot="8563511916"
        data-ad-format="auto"
        data-full-width-responsive="true"
        key={adKey}
      />
    </div>
  );
}