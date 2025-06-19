'use client';

// 5x5 等角网格 + 3 个立体方块，纯 CSS 3D 静态预览

export function GamePreview() {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="aspect-square relative rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 flex items-center justify-center">
        {/* 主容器，用来定位场景 */}
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          {/* 3D 场景容器 */}
          <div className="scene">
            {/* 4x4 网格平面 */}
            <div className="grid grid-cols-4 w-[320px] h-[320px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-20 h-20 border border-gray-300"></div>
              ))}
            </div>
            {/* 第一立方体 (0,2) */}
            <div className="cube" style={{ bottom: 0, left: 160, transform: 'translateZ(40px)' }}>
              <div className="face face-front"></div>
              <div className="face face-back"></div>
              <div className="face face-left"></div>
              <div className="face face-right"></div>
              <div className="face face-top"></div>
              <div className="face face-bottom"></div>
            </div>
            {/* 第二立方体 (3,1) */}
            <div className="cube" style={{ bottom: 240, left: 80, transform: 'translateZ(40px)' }}>
              <div className="face face-front"></div>
              <div className="face face-back"></div>
              <div className="face face-left"></div>
              <div className="face face-right"></div>
              <div className="face face-top"></div>
              <div className="face face-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 