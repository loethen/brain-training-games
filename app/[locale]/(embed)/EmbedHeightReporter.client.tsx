'use client';

import { useEffect, useRef } from 'react';

// Function component to handle resizing and posting messages
export function EmbedHeightReporter({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we are in an iframe and ResizeObserver is available
    if (typeof window !== 'undefined' && window.parent !== window && 'ResizeObserver' in window) {
      const targetOrigin = 'https://www.freefocusgames.com'; // IMPORTANT: Set this to your actual parent domain for security

      const observer = new ResizeObserver(entries => {
        for (const entry of entries) { // Use const instead of let
          // Use scrollHeight for potentially overflowing content
          const height = entry.target.scrollHeight;
          // Send message to parent window
          window.parent.postMessage({ type: 'ffg-resize', height: height }, targetOrigin);
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // Cleanup function: disconnect the observer when component unmounts
      return () => {
        observer.disconnect();
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return <div ref={containerRef}>{children}</div>;
} 