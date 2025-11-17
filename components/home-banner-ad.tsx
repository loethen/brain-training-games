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
    <div className={`w-full my-8 transition-opacity duration-500 hover:opacity-90 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle block rounded-lg overflow-hidden shadow-sm"
        style={{
          display: 'block',
          minHeight: '90px', // 避免布局跳动
          background: 'rgba(var(--muted-rgb), 0.1)', // 加载时的占位背景
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