'use client';

import { useEffect, useRef } from 'react';

interface BlogListAdProps {
  className?: string;
  adKey?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function BlogListAd({ className = '', adKey = 'blog-list' }: BlogListAdProps) {
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
        data-ad-format="fluid"
        data-ad-layout-key="-5j+c7-1q-7g+v1"
        data-ad-client="ca-pub-2676017781507774"
        data-ad-slot="2342520821"
        key={adKey}
      />
    </div>
  );
}