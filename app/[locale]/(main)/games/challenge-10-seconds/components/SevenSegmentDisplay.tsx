import React from 'react';
import { cn } from "@/lib/utils";

// Standard 7-segment geometry
// ViewBox: 0 0 52 88 (Matches width/height ratio roughly)
// Thickness: 8
// Gap: 1

const POINTS = {
    A: "4,4 10,0 42,0 48,4 42,8 10,8", // Top horizontal
    B: "48,5 52,9 52,39 48,43 44,39 44,9", // Top right vertical
    C: "48,45 52,49 52,79 48,83 44,79 44,49", // Bottom right vertical
    D: "4,84 10,80 42,80 48,84 42,88 10,88", // Bottom horizontal
    E: "4,45 8,49 8,79 4,83 0,79 0,49", // Bottom left vertical
    F: "4,5 8,9 8,39 4,43 0,39 0,9", // Top left vertical
    G: "4,44 10,40 42,40 48,44 42,48 10,48" // Middle horizontal
};

interface SegmentProps {
    points: string;
    active: boolean;
    color: string;
}

const SVGSegment = ({ points, active, color }: SegmentProps) => (
    <polygon
        points={points}
        className={cn(
            "transition-opacity duration-100",
            active ? "opacity-100" : "opacity-10"
        )}
        style={{
            fill: active ? color : '#330000', // Very dark red for 'off' segments like real LED
            filter: active ? `drop-shadow(0 0 2px ${color})` : 'none' // Re-add subtle glow for visibility
        }}
    />
);

const digitMap: Record<string, number[]> = {
    '0': [1, 1, 1, 1, 1, 1, 0],
    '1': [0, 1, 1, 0, 0, 0, 0],
    '2': [1, 1, 0, 1, 1, 0, 1],
    '3': [1, 1, 1, 1, 0, 0, 1],
    '4': [0, 1, 1, 0, 0, 1, 1],
    '5': [1, 0, 1, 1, 0, 1, 1],
    '6': [1, 0, 1, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
};

interface SevenSegmentDigitProps {
    value: string;
    className?: string;
    color?: string;
}

export const SevenSegmentDigit = ({ value, className, color = "#dc2626" }: SevenSegmentDigitProps) => {
    const segments = digitMap[value] || [0, 0, 0, 0, 0, 0, 0];

    return (
        <div className={cn("relative mx-[1px]", className)}>
            <svg viewBox="0 0 52 88" className="w-full h-full skew-x-[-6deg] overflow-visible">
                {/* Segments: A, B, C, D, E, F, G */}
                <SVGSegment points={POINTS.A} active={!!segments[0]} color={color} />
                <SVGSegment points={POINTS.B} active={!!segments[1]} color={color} />
                <SVGSegment points={POINTS.C} active={!!segments[2]} color={color} />
                <SVGSegment points={POINTS.D} active={!!segments[3]} color={color} />
                <SVGSegment points={POINTS.E} active={!!segments[4]} color={color} />
                <SVGSegment points={POINTS.F} active={!!segments[5]} color={color} />
                <SVGSegment points={POINTS.G} active={!!segments[6]} color={color} />
            </svg>
        </div>
    );
};

export const SevenSegmentDot = ({ active = true, className, color = "#dc2626" }: { active?: boolean, className?: string, color?: string }) => {
    return (
        <div className={cn("relative mx-[1px] flex items-end justify-center pb-2", className)}>
            <svg viewBox="0 0 12 12" className="w-[10px] h-[10px] sm:w-[16px] sm:h-[16px] skew-x-[-6deg] overflow-visible">
                <circle cx="6" cy="6" r="6"
                    className={cn(
                        active ? "opacity-100" : "opacity-10"
                    )}
                    style={{
                        fill: active ? color : '#330000',
                        filter: active ? `drop-shadow(0 0 2px ${color})` : 'none'
                    }}
                />
            </svg>
        </div>
    );
};
