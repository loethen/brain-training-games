'use client';

interface BaddeleyModelDiagramProps {
  className?: string;
}

export function BaddeleyModelDiagram({ className = "" }: BaddeleyModelDiagramProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <svg viewBox="0 0 800 450" className="w-full h-auto border rounded-lg bg-background">
        {/* Central Executive - Top center */}
        <g>
          <rect
            x="300"
            y="50"
            width="200"
            height="70"
            rx="10"
            fill="rgb(59, 130, 246)"
            stroke="rgb(29, 78, 216)"
            strokeWidth="2"
          />
          <text
            x="400"
            y="80"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            中央执行器
          </text>
          <text
            x="400"
            y="100"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            Central Executive
          </text>
        </g>

        {/* Phonological Loop - Bottom left */}
        <g>
          <rect
            x="80"
            y="280"
            width="160"
            height="70"
            rx="10"
            fill="rgb(34, 197, 94)"
            stroke="rgb(21, 128, 61)"
            strokeWidth="2"
          />
          <text
            x="160"
            y="305"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            语音循环
          </text>
          <text
            x="160"
            y="320"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            Phonological Loop
          </text>
          <text
            x="160"
            y="335"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            (语言信息存储)
          </text>
        </g>

        {/* Visuospatial Sketchpad - Bottom right */}
        <g>
          <rect
            x="560"
            y="280"
            width="160"
            height="70"
            rx="10"
            fill="rgb(168, 85, 247)"
            stroke="rgb(124, 58, 237)"
            strokeWidth="2"
          />
          <text
            x="640"
            y="305"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            视觉空间画板
          </text>
          <text
            x="640"
            y="320"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            Visuospatial Sketchpad
          </text>
          <text
            x="640"
            y="335"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            (视觉空间信息)
          </text>
        </g>

        {/* Episodic Buffer - Bottom center */}
        <g>
          <rect
            x="320"
            y="280"
            width="160"
            height="70"
            rx="10"
            fill="rgb(245, 158, 11)"
            stroke="rgb(217, 119, 6)"
            strokeWidth="2"
          />
          <text
            x="400"
            y="305"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            情节缓冲器
          </text>
          <text
            x="400"
            y="320"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            Episodic Buffer
          </text>
          <text
            x="400"
            y="335"
            textAnchor="middle"
            className="fill-white text-xs"
          >
            (整合多种信息)
          </text>
        </g>

        {/* Long-term Memory - Bottom */}
        <g>
          <ellipse
            cx="400"
            cy="400"
            rx="140"
            ry="25"
            fill="rgb(107, 114, 128)"
            stroke="rgb(75, 85, 99)"
            strokeWidth="2"
          />
          <text
            x="400"
            y="405"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            长时记忆 (Long-term Memory)
          </text>
        </g>

        {/* Arrows from Central Executive to subsystems */}
        {/* To Phonological Loop */}
        <path
          d="M 340 120 Q 280 180 160 280"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        
        {/* To Visuospatial Sketchpad */}
        <path
          d="M 460 120 Q 520 180 640 280"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        
        {/* To Episodic Buffer */}
        <path
          d="M 400 120 L 400 280"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrows from subsystems to Long-term Memory */}
        {/* From Phonological Loop */}
        <path
          d="M 160 350 Q 200 370 260 390"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-small)"
        />
        
        {/* From Episodic Buffer */}
        <path
          d="M 400 350 L 400 375"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-small)"
        />
        
        {/* From Visuospatial Sketchpad */}
        <path
          d="M 640 350 Q 600 370 540 390"
          fill="none"
          stroke="rgb(75, 85, 99)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-small)"
        />

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgb(75, 85, 99)"
            />
          </marker>
          <marker
            id="arrowhead-small"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="rgb(75, 85, 99)"
            />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="25"
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
        >
          Baddeley工作记忆模型
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
        <h4 className="font-semibold mb-2">模型说明：</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>• <strong>中央执行器</strong>：控制和协调整个工作记忆系统</li>
          <li>• <strong>语音循环</strong>：处理和暂时存储语言信息</li>
          <li>• <strong>视觉空间画板</strong>：处理视觉和空间信息</li>
          <li>• <strong>情节缓冲器</strong>：整合来自不同来源的信息，连接长时记忆</li>
        </ul>
      </div>
    </div>
  );
}