'use client';
import { useTranslations } from 'next-intl';

interface BrainRegionsDiagramProps {
  className?: string;
}

export function BrainRegionsDiagram({ className = "" }: BrainRegionsDiagramProps) {
  const t = useTranslations('workingMemoryGuide.brainDiagram');
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <svg viewBox="0 0 800 500" className="w-full h-auto rounded-lg">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Brain outline (sagittal view) */}
        <path
          d="M 150 350 
             C 120 320, 120 280, 130 240
             C 140 200, 160 160, 200 130
             C 250 90, 320 80, 400 90
             C 480 100, 550 120, 600 150
             C 640 180, 660 220, 670 260
             C 680 300, 675 340, 650 370
             C 620 400, 580 420, 540 430
             C 500 440, 460 445, 420 440
             C 380 435, 340 425, 300 410
             C 260 395, 220 375, 150 350 Z"
          fill="url(#brainGradient)"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />

        {/* Prefrontal Cortex */}
        <ellipse
          cx="200"
          cy="200"
          rx="45"
          ry="60"
          className="fill-primary/20 stroke-primary"
          strokeWidth="2"
        />

        {/* Dorsolateral Prefrontal Cortex (DLPFC) */}
        <ellipse
          cx="220"
          cy="170"
          rx="25"
          ry="35"
          className="fill-primary/40 stroke-primary"
          strokeWidth="2"
        />

        {/* Anterior Cingulate Cortex */}
        <ellipse
          cx="380"
          cy="220"
          rx="30"
          ry="20"
          className="fill-indigo-500/30 stroke-indigo-500"
          strokeWidth="2"
        />

        {/* Parietal Cortex */}
        <ellipse
          cx="500"
          cy="180"
          rx="40"
          ry="50"
          className="fill-violet-500/20 stroke-violet-500"
          strokeWidth="2"
        />

        {/* Posterior Parietal Cortex */}
        <ellipse
          cx="520"
          cy="160"
          rx="25"
          ry="30"
          className="fill-violet-500/40 stroke-violet-500"
          strokeWidth="2"
        />

        {/* Basal Ganglia */}
        <ellipse
          cx="350"
          cy="280"
          rx="25"
          ry="20"
          className="fill-amber-500/30 stroke-amber-500"
          strokeWidth="2"
        />

        {/* Hippocampus */}
        <path
          d="M 400 320 C 420 310, 440 315, 450 325 C 460 335, 455 345, 445 350 C 430 355, 410 350, 400 340 Z"
          className="fill-rose-500/40 stroke-rose-500"
          strokeWidth="2"
        />

        {/* Labels and lines - Updated to use theme colors and cleaner lines */}

        {/* DLPFC Label */}
        <g>
          <line x1="220" y1="135" x2="100" y2="80" className="stroke-muted-foreground" strokeWidth="1" />
          <text x="80" y="75" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('dlpfc.name')}
          </text>
          <text x="80" y="90" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-wider uppercase">
            DLPFC
          </text>
        </g>

        {/* ACC Label */}
        <g>
          <line x1="380" y1="200" x2="380" y2="120" className="stroke-muted-foreground" strokeWidth="1" />
          <text x="380" y="95" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('acc.name')}
          </text>
          <text x="380" y="110" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-wider uppercase">
            ACC
          </text>
        </g>

        {/* PPC Label */}
        <g>
          <line x1="540" y1="130" x2="650" y2="80" className="stroke-muted-foreground" strokeWidth="1" />
          <text x="650" y="75" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('ppc.name')}
          </text>
          <text x="650" y="90" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-wider uppercase">
            PPC
          </text>
        </g>

        {/* Basal Ganglia Label */}
        <g>
          <line x1="350" y1="300" x2="250" y2="380" className="stroke-muted-foreground" strokeWidth="1" />
          <text x="220" y="395" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('basalGanglia.name')}
          </text>
          <text x="220" y="410" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-wider uppercase">
            Basal Ganglia
          </text>
        </g>

        {/* Hippocampus Label */}
        <g>
          <line x1="450" y1="325" x2="550" y2="380" className="stroke-muted-foreground" strokeWidth="1" />
          <text x="540" y="395" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('hippocampus.name')}
          </text>
          <text x="540" y="410" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-wider uppercase">
            Hippocampus
          </text>
        </g>

        {/* Network connections - Dashed lines */}
        <g className="opacity-40">
          <line x1="245" y1="185" x2="350" y2="210" className="stroke-primary" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="215" x2="475" y2="175" className="stroke-indigo-500" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 245 155 Q 350 120 495 155" fill="none" className="stroke-violet-500" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 230 235 Q 280 250 325 275" fill="none" className="stroke-amber-500" strokeWidth="2" strokeDasharray="4,4" />
        </g>

      </svg>

      {/* Legend */}
      <div className="mt-6 p-6 bg-muted/20 border border-border rounded-xl text-sm">
        <h4 className="font-semibold mb-4 text-center text-muted-foreground uppercase tracking-widest text-xs">{t('legend.title')}</h4>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-primary/40 ring-2 ring-primary/20"></span>
            <span className="text-muted-foreground"><strong>{t('dlpfc.fullName')}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-indigo-500/40 ring-2 ring-indigo-500/20"></span>
            <span className="text-muted-foreground"><strong>{t('acc.fullName')}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-violet-500/40 ring-2 ring-violet-500/20"></span>
            <span className="text-muted-foreground"><strong>{t('ppc.fullName')}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-500/40 ring-2 ring-amber-500/20"></span>
            <span className="text-muted-foreground"><strong>{t('basalGanglia.name')}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500/40 ring-2 ring-rose-500/20"></span>
            <span className="text-muted-foreground"><strong>{t('hippocampus.name')}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}