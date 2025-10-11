'use client';

import { Timer, Target, Coffee } from "lucide-react";

export function GamePreview() {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-4">
          <Target className="w-12 h-12 text-red-500" />
          <Timer className="w-16 h-16 text-orange-500" />
          <Coffee className="w-12 h-12 text-yellow-600" />
        </div>
        <div className="font-mono text-4xl font-bold">25:00</div>
        <div className="text-sm text-muted-foreground">Focus · Break · Repeat</div>
      </div>
    </div>
  );
}
