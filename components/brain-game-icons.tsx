"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { 
  Brain, 
  Grid3x3, 
  Target, 
  LayoutGrid, 
  Calculator, 
  Eye, 
  Zap
} from "lucide-react";

const GameIcon = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; icon: React.ElementType; color: string }
>(({ className, children, icon: Icon, color }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-full bg-white p-1 shadow-[0_0_15px_-10px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      <Icon size={20} className="size-24" color={color} strokeWidth={1.5} />
      {children}
    </div>
  );
});

GameIcon.displayName = "GameIcon";

export function BrainGameIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const memoryRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

  return (
    <div 
        className="relative w-full aspect-[4/3] max-w-md mx-auto opacity-85" 
        ref={containerRef}
    >
        <div className="absolute inset-0 flex flex-col items-stretch justify-between p-3 sm:p-4 md:p-6">
            <div className="flex flex-row items-center justify-between">
                <GameIcon ref={memoryRef} icon={Grid3x3} color="#ec4899" />
                <GameIcon ref={focusRef} icon={Target} color="#10b981" />
            </div>
            <div className="flex flex-row items-center justify-between">
                <GameIcon ref={patternRef} icon={LayoutGrid} color="#a855f7" />
                <div
                    ref={brainRef}
                    className="z-10 flex size-12 sm:size-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1.5 sm:p-2 shadow-[0_0_15px_-10px_rgba(0,0,0,0.6)]"
                >
                    <Brain size={24} className="size-24" color="white" strokeWidth={1.5} />
                </div>
                <GameIcon ref={numberRef} icon={Calculator} color="#f59e0b" />
            </div>
            <div className="flex flex-row items-center justify-between">
                <GameIcon ref={trackingRef} icon={Eye} color="#3b82f6" />
                <GameIcon ref={reactionRef} icon={Zap} color="#ef4444" />
            </div>
        </div>

        <AnimatedBeam
            containerRef={containerRef}
            fromRef={memoryRef}
            toRef={brainRef}
            curvature={-75}
            endYOffset={-10}
            gradientStartColor="#ec4899"
            gradientStopColor="#db2777"
            className="opacity-60"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={patternRef}
            toRef={brainRef}
            gradientStartColor="#a855f7"
            gradientStopColor="#8b5cf6"
            className="opacity-60"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={trackingRef}
            toRef={brainRef}
            curvature={75}
            endYOffset={10}
            gradientStartColor="#3b82f6"
            gradientStopColor="#2563eb"
            className="opacity-60"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={focusRef}
            toRef={brainRef}
            curvature={-75}
            endYOffset={-10}
            reverse
            gradientStartColor="#10b981"
            gradientStopColor="#059669"
            className="opacity-60"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={numberRef}
            toRef={brainRef}
            reverse
            gradientStartColor="#f59e0b"
            gradientStopColor="#d97706"
            className="opacity-60"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={reactionRef}
            toRef={brainRef}
            curvature={75}
            endYOffset={10}
            reverse
            gradientStartColor="#ef4444"
            gradientStopColor="#dc2626"
            className="opacity-60"
        />
    </div>
  );
} 