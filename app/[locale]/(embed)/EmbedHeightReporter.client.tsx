'use client';

import { useEffect, useRef } from 'react';

// Function component to handle resizing and posting messages
export function EmbedHeightReporter({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we are in an iframe and ResizeObserver is available
    if (typeof window !== 'undefined' && window.parent !== window && 'ResizeObserver' in window) {
      // Allow sending to any parent origin since embed location is unknown
      const targetOrigin = '*'; 

      const observer = new ResizeObserver(entries => {
        for (const entry of entries) { 
          const height = entry.target.scrollHeight;
          // Send message to parent window
          // console.log('[Embed Reporter] Posting height:', height, 'to target:', targetOrigin); // Optional debug
          window.parent.postMessage({ type: 'ffg-resize', height: height }, targetOrigin);
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // Cleanup function
      return () => {
        observer.disconnect();
      };
    }
  }, []); 

  return <div ref={containerRef}>{children}</div>;
} 