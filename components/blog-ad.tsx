'use client';

import { useEffect, useRef } from 'react';

interface BlogAdProps {
  className?: string;
  adKey?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function BlogAd({ className = '', adKey = 'default' }: BlogAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;

    // 检查该广告单元是否已经初始化（使用data属性标记）
    if (adElement.getAttribute('data-ad-status') === 'filled') {
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // 标记为已处理，防止重复push
        adElement.setAttribute('data-ad-status', 'filled');
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
      // 如果出错，移除标记允许重试
      adElement.removeAttribute('data-ad-status');
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