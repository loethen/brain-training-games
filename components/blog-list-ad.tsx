'use client';

import { useEffect } from 'react';

interface BlogListAdProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function BlogListAd({ className = '' }: BlogListAdProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`w-full my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{
          display: 'block'
        }}
        data-ad-format="fluid"
        data-ad-layout-key="-5j+c7-1q-7g+v1"
        data-ad-client="ca-pub-2676017781507774"
        data-ad-slot="2342520821"
      />
    </div>
  );
}