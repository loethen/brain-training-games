'use client';
import "../styles.css";
// 完全按用户 HTML 方案实现的静态等角 4x4 网格 + 2 个立体方块

export function GamePreview() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="aspect-square relative rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 flex items-center justify-center">
        {/* 主容器，用来定位场景 */}
        <div className="relative w-[240px] h-[240px] flex items-center justify-center">
          {/* 3D 场景容器 */}
          <div className="scene">
            {/* 4x4 网格平面 */}
            <div className="grid grid-cols-4 w-[240px] h-[240px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-[60px] h-[60px] border border-gray-300"></div>
              ))}
            </div>
            {/* 第一立方体 (0,2) */}
            <div className="cube" style={{ bottom: 0, left: 120, transform: 'translateZ(30px)' }}>
              <div className="face face-front"></div>
              <div className="face face-back"></div>
              <div className="face face-left"></div>
              <div className="face face-right"></div>
              <div className="face face-top"></div>
              <div className="face face-bottom"></div>
            </div>
            {/* 第二立方体 (3,1) */}
            <div className="cube" style={{ bottom: 180, left: 60, transform: 'translateZ(30px)' }}>
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