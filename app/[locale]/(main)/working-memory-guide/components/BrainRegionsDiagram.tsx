'use client';
import { useTranslations } from 'next-intl';

interface BrainRegionsDiagramProps {
  className?: string;
}

export function BrainRegionsDiagram({ className = "" }: BrainRegionsDiagramProps) {
  const t = useTranslations('workingMemoryGuide.brainDiagram');
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <svg viewBox="0 0 800 500" className="w-full h-auto border rounded-lg bg-background">
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
          fill="rgb(243, 244, 246)"
          stroke="rgb(107, 114, 128)"
          strokeWidth="2"
        />

        {/* Prefrontal Cortex */}
        <ellipse
          cx="200"
          cy="200"
          rx="45"
          ry="60"
          fill="rgb(59, 130, 246)"
          fillOpacity="0.7"
          stroke="rgb(29, 78, 216)"
          strokeWidth="2"
        />
        
        {/* Dorsolateral Prefrontal Cortex (DLPFC) */}
        <ellipse
          cx="220"
          cy="170"
          rx="25"
          ry="35"
          fill="rgb(29, 78, 216)"
          fillOpacity="0.8"
          stroke="rgb(30, 64, 175)"
          strokeWidth="2"
        />

        {/* Anterior Cingulate Cortex */}
        <ellipse
          cx="380"
          cy="220"
          rx="30"
          ry="20"
          fill="rgb(34, 197, 94)"
          fillOpacity="0.7"
          stroke="rgb(21, 128, 61)"
          strokeWidth="2"
        />

        {/* Parietal Cortex */}
        <ellipse
          cx="500"
          cy="180"
          rx="40"
          ry="50"
          fill="rgb(168, 85, 247)"
          fillOpacity="0.7"
          stroke="rgb(124, 58, 237)"
          strokeWidth="2"
        />

        {/* Posterior Parietal Cortex */}
        <ellipse
          cx="520"
          cy="160"
          rx="25"
          ry="30"
          fill="rgb(124, 58, 237)"
          fillOpacity="0.8"
          stroke="rgb(109, 40, 217)"
          strokeWidth="2"
        />

        {/* Basal Ganglia */}
        <ellipse
          cx="350"
          cy="280"
          rx="25"
          ry="20"
          fill="rgb(245, 158, 11)"
          fillOpacity="0.7"
          stroke="rgb(217, 119, 6)"
          strokeWidth="2"
        />

        {/* Hippocampus */}
        <path
          d="M 400 320 C 420 310, 440 315, 450 325 C 460 335, 455 345, 445 350 C 430 355, 410 350, 400 340 Z"
          fill="rgb(239, 68, 68)"
          fillOpacity="0.7"
          stroke="rgb(220, 38, 38)"
          strokeWidth="2"
        />

        {/* Labels and lines */}
        
        {/* DLPFC Label */}
        <g>
          <line x1="220" y1="135" x2="100" y2="80" stroke="rgb(75, 85, 99)" strokeWidth="1"/>
          <rect x="20" y="60" width="120" height="40" rx="5" fill="white" stroke="rgb(75, 85, 99)"/>
          <text x="80" y="75" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('dlpfc.name')}
          </text>
          <text x="80" y="90" textAnchor="middle" className="fill-muted-foreground text-xs">
            DLPFC
          </text>
        </g>

        {/* ACC Label */}
        <g>
          <line x1="380" y1="200" x2="380" y2="120" stroke="rgb(75, 85, 99)" strokeWidth="1"/>
          <rect x="320" y="80" width="120" height="40" rx="5" fill="white" stroke="rgb(75, 85, 99)"/>
          <text x="380" y="95" textAnchor="middle" className="fill-foreground text-xs font-semibold">
{t('acc.name')}
          </text>
          <text x="380" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
            ACC
          </text>
        </g>

        {/* PPC Label */}
        <g>
          <line x1="540" y1="130" x2="650" y2="80" stroke="rgb(75, 85, 99)" strokeWidth="1"/>
          <rect x="590" y="60" width="120" height="40" rx="5" fill="white" stroke="rgb(75, 85, 99)"/>
          <text x="650" y="75" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('ppc.name')}
          </text>
          <text x="650" y="90" textAnchor="middle" className="fill-muted-foreground text-xs">
            PPC
          </text>
        </g>

        {/* Basal Ganglia Label */}
        <g>
          <line x1="350" y1="300" x2="250" y2="380" stroke="rgb(75, 85, 99)" strokeWidth="1"/>
          <rect x="170" y="380" width="100" height="40" rx="5" fill="white" stroke="rgb(75, 85, 99)"/>
          <text x="220" y="395" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('basalGanglia.name')}
          </text>
          <text x="220" y="410" textAnchor="middle" className="fill-muted-foreground text-xs">
            Basal Ganglia
          </text>
        </g>

        {/* Hippocampus Label */}
        <g>
          <line x1="450" y1="325" x2="550" y2="380" stroke="rgb(75, 85, 99)" strokeWidth="1"/>
          <rect x="490" y="380" width="100" height="40" rx="5" fill="white" stroke="rgb(75, 85, 99)"/>
          <text x="540" y="395" textAnchor="middle" className="fill-foreground text-xs font-semibold">
            {t('hippocampus.name')}
          </text>
          <text x="540" y="410" textAnchor="middle" className="fill-muted-foreground text-xs">
            Hippocampus
          </text>
        </g>

        {/* Network connections */}
        <g className="opacity-40">
          {/* DLPFC to ACC */}
          <line x1="245" y1="185" x2="350" y2="210" stroke="rgb(59, 130, 246)" strokeWidth="2" strokeDasharray="3,3"/>
          
          {/* ACC to PPC */}
          <line x1="410" y1="215" x2="475" y2="175" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="3,3"/>
          
          {/* DLPFC to PPC */}
          <path d="M 245 155 Q 350 120 495 155" fill="none" stroke="rgb(168, 85, 247)" strokeWidth="2" strokeDasharray="3,3"/>
          
          {/* DLPFC to Basal Ganglia */}
          <path d="M 230 235 Q 280 250 325 275" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="2" strokeDasharray="3,3"/>
        </g>

        {/* Title */}
        <text
          x="400"
          y="30"
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
        >
          {t('title')}
        </text>
        <text
          x="400"
          y="50"
          textAnchor="middle"
          className="fill-muted-foreground text-sm"
        >
          {t('subtitle')}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
        <h4 className="font-semibold mb-3">{t('legend.title')}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span><strong>{t('dlpfc.fullName')}</strong>：{t('dlpfc.description')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span><strong>{t('acc.fullName')}</strong>：{t('acc.description')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span><strong>{t('ppc.fullName')}</strong>：{t('ppc.description')}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span><strong>{t('basalGanglia.name')}</strong>：{t('basalGanglia.description')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span><strong>{t('hippocampus.name')}</strong>：{t('hippocampus.description')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-gray-400 rounded-full"></div>
              <span><strong>{t('legend.connections')}</strong>：{t('legend.connectionsDesc')}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {t('legend.note')}
        </p>
      </div>
    </div>
  );
}