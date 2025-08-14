'use client';

interface TrainingEffectChartProps {
  className?: string;
}

export function TrainingEffectChart({ className = "" }: TrainingEffectChartProps) {
  // Data based on Jaeggi et al. 2008 PNAS study
  const trainingData = [
    { day: 0, score: 0, improvement: 0 },
    { day: 1, score: 2.1, improvement: 5 },
    { day: 2, score: 2.3, improvement: 8 },
    { day: 3, score: 2.5, improvement: 12 },
    { day: 4, score: 2.7, improvement: 15 },
    { day: 5, score: 2.9, improvement: 18 },
    { day: 8, score: 3.2, improvement: 25 },
    { day: 12, score: 3.6, improvement: 30 },
    { day: 17, score: 4.1, improvement: 35 },
    { day: 19, score: 4.3, improvement: 40 }
  ];

  const controlData = [
    { day: 0, score: 0, improvement: 0 },
    { day: 19, score: 0.2, improvement: 2 }
  ];

  const maxDay = 20;
  const maxImprovement = 45;
  
  // SVG dimensions
  const width = 700;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (day: number) => (day / maxDay) * chartWidth + padding.left;
  const yScale = (improvement: number) => height - padding.bottom - (improvement / maxImprovement) * chartHeight;

  // Create path for training group
  const trainingPath = trainingData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.improvement)}`)
    .join(' ');

  const controlPath = controlData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.improvement)}`)
    .join(' ');

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto border rounded-lg bg-background">
        {/* Grid lines */}
        <g className="opacity-20">
          {/* Vertical grid lines */}
          {[0, 5, 10, 15, 20].map(day => (
            <line
              key={`v-${day}`}
              x1={xScale(day)}
              y1={padding.top}
              x2={xScale(day)}
              y2={height - padding.bottom}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {/* Horizontal grid lines */}
          {[0, 10, 20, 30, 40].map(improvement => (
            <line
              key={`h-${improvement}`}
              x1={padding.left}
              y1={yScale(improvement)}
              x2={width - padding.right}
              y2={yScale(improvement)}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Axes */}
        <g>
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>

        {/* X-axis labels */}
        <g>
          {[0, 5, 10, 15, 20].map(day => (
            <text
              key={`x-label-${day}`}
              x={xScale(day)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="fill-foreground text-sm"
            >
              {day}
            </text>
          ))}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="fill-foreground text-sm font-semibold"
          >
            训练天数 (Training Days)
          </text>
        </g>

        {/* Y-axis labels */}
        <g>
          {[0, 10, 20, 30, 40].map(improvement => (
            <text
              key={`y-label-${improvement}`}
              x={padding.left - 15}
              y={yScale(improvement) + 5}
              textAnchor="middle"
              className="fill-foreground text-sm"
            >
              {improvement}%
            </text>
          ))}
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            className="fill-foreground text-sm font-semibold"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            流体智力提升 (Fluid Intelligence Improvement)
          </text>
        </g>

        {/* Training group line */}
        <path
          d={trainingPath}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Control group line */}
        <path
          d={controlPath}
          fill="none"
          stroke="rgb(239, 68, 68)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,5"
        />

        {/* Data points for training group */}
        {trainingData.map((d, i) => (
          <circle
            key={`training-${i}`}
            cx={xScale(d.day)}
            cy={yScale(d.improvement)}
            r="5"
            fill="rgb(59, 130, 246)"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Data points for control group */}
        {controlData.map((d, i) => (
          <circle
            key={`control-${i}`}
            cx={xScale(d.day)}
            cy={yScale(d.improvement)}
            r="5"
            fill="rgb(239, 68, 68)"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Legend */}
        <g transform={`translate(${width - 200}, ${padding.top + 20})`}>
          <rect
            x="0"
            y="0"
            width="180"
            height="60"
            fill="rgba(255, 255, 255, 0.9)"
            stroke="currentColor"
            strokeWidth="1"
            rx="5"
          />
          
          {/* Training group legend */}
          <line
            x1="10"
            y1="20"
            x2="30"
            y2="20"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="3"
            fill="rgb(59, 130, 246)"
          />
          <text
            x="35"
            y="25"
            className="fill-foreground text-xs"
          >
            训练组 (Training Group)
          </text>
          
          {/* Control group legend */}
          <line
            x1="10"
            y1="45"
            x2="30"
            y2="45"
            stroke="rgb(239, 68, 68)"
            strokeWidth="3"
            strokeDasharray="3,3"
          />
          <circle
            cx="20"
            cy="45"
            r="3"
            fill="rgb(239, 68, 68)"
          />
          <text
            x="35"
            y="50"
            className="fill-foreground text-xs"
          >
            对照组 (Control Group)
          </text>
        </g>

        {/* Title */}
        <text
          x={width / 2}
          y={25}
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
        >
          Dual N-Back训练效果 (Jaeggi et al. 2008)
        </text>
      </svg>
      
      {/* Chart description */}
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
        <h4 className="font-semibold mb-2">研究数据说明：</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>• <strong>研究来源</strong>：Jaeggi et al. (2008) PNAS - 首个证明工作记忆训练可转移的突破性研究</li>
          <li>• <strong>训练内容</strong>：19天Dual N-Back训练，每天约25分钟</li>
          <li>• <strong>测量指标</strong>：Raven渐进矩阵测试（流体智力标准测试）</li>
          <li>• <strong>关键发现</strong>：训练组流体智力提升约40%，对照组几乎无变化</li>
        </ul>
      </div>
    </div>
  );
}