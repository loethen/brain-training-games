'use client';

import { useEffect, useRef } from 'react';

interface BlogAdProps {
  className?: string;
  adKey?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function BlogAd({ className = '', adKey = 'default' }: BlogAdProps) {
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
          display: 'block',
          textAlign: 'center'
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-2676017781507774"
        data-ad-slot="8875305437"
        key={adKey}
      />
    </div>
  );
}