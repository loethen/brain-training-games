"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

type RippleProps = {
  x: number
  y: number
  size: number
}

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  className?: string
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleProps[]>([])
    const buttonRef = useRef<HTMLButtonElement>(null)
    const mergedRef = React.useMemo(() => {
      if (ref) {
        return typeof ref === 'function' 
          ? (node: HTMLButtonElement) => { ref(node); buttonRef.current = node }
          : Object.assign(ref, buttonRef)
      }
      return buttonRef
    }, [ref])

    const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      
      // 计算鼠标相对于按钮的位置
      let x, y
      
      // 如果有鼠标事件并且坐标有效，使用鼠标坐标
      if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        x = event.clientX - rect.left
        y = event.clientY - rect.top
      } else {
        // 回退到按钮中心点
        x = rect.width / 2
        y = rect.height / 2
      }
      
      // 确保坐标在按钮内
      x = Math.max(0, Math.min(x, rect.width))
      y = Math.max(0, Math.min(y, rect.height))

      const newRipple = { x, y, size }

      setRipples(prev => [...prev, newRipple])

      // 移除波纹效果
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r !== newRipple))
      }, 600)
    }, [])

    // 也处理鼠标按下事件，这对PC端更可靠
    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
    }, [createRipple])

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // 由于已经在mousedown处理，这里不需要再次创建波纹
      // 只传递点击事件
      onClick?.(event)
    }, [onClick])

    return (
      <button
        ref={mergedRef}
        className={cn(
          "relative overflow-hidden",
          "transition-all duration-150 ease-out",
          className
        )}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {ripples.map((ripple, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-foreground/20 animate-ripple"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size
            }}
          />
        ))}
        {children}
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"

export { RippleButton } 