import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>(callback);
    
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    
    useEffect(() => {
        if (delay === null) return;
        
        const timeoutId = setTimeout(() => {
            savedCallback.current();
        }, delay);
        
        return () => clearTimeout(timeoutId);
    }, [delay]);
} 