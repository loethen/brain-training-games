"use client"

import * as React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

type RippleProps = {
  x: number
  y: number
  size: number
  id: number
}

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  className?: string
  rippleColor?: string
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, onClick, rippleColor, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleProps[]>([])
    const buttonRef = useRef<HTMLButtonElement>(null)
    const rippleCounter = useRef(0)
    
    // 清理所有涟漪效果
    const clearRipples = useCallback(() => {
      setRipples([]);
    }, []);
    
    // 组件卸载时清理
    useEffect(() => {
      return () => {
        clearRipples();
      };
    }, [clearRipples]);
    
    const mergedRef = React.useMemo(() => {
      if (ref) {
        return typeof ref === 'function' 
          ? (node: HTMLButtonElement) => { ref(node); buttonRef.current = node }
          : Object.assign(ref, buttonRef)
      }
      return buttonRef
    }, [ref])

    const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      // Make size proportional to button size for better effect
      const size = Math.max(rect.width, rect.height) * 2
      
      // 获取点击/触摸位置
      let x, y;
      if ('clientX' in event) { // 鼠标事件
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else { // 触摸事件
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }
      
      // Add unique ID to each ripple for better tracking
      const id = rippleCounter.current
      rippleCounter.current += 1

      const newRipple = { x, y, size, id }

      setRipples(prev => [...prev, newRipple])
    }, [])

    // 处理动画结束事件
    const handleAnimationEnd = useCallback((id: number) => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, []);

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
      onClick?.(event)
    }, [onClick, createRipple])

    return (
      <button
        ref={mergedRef}
        className={cn(
          "relative overflow-hidden focus:outline-none",
          className
        )}
        onClick={handleClick}

        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={cn(
              "absolute rounded-full animate-ripple pointer-events-none z-0",
              // 默认提供适应亮色/暗色模式的涟漪颜色
              rippleColor || "bg-foreground/20 dark:bg-foreground/30"
            )}
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size
            }}
            onAnimationEnd={() => handleAnimationEnd(ripple.id)}
          />
        ))}
        {children}
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"

export { RippleButton } 