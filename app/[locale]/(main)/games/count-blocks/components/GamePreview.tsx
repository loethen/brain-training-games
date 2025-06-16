import React from 'react';

export const GamePreview: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* 简化的3D网格预览 */}
      <div className="relative">

        <div className="preview-scene">
          {/* 网格 */}
          <div className="preview-grid">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="preview-cell" />
            ))}
            
            {/* 几个示例方块 */}
            <div className="preview-cube cube-1">
              <div className="preview-face preview-front" />
              <div className="preview-face preview-back" />
              <div className="preview-face preview-right" />
              <div className="preview-face preview-left" />
              <div className="preview-face preview-top preview-top" />
              <div className="preview-face preview-bottom" />
            </div>
            
            <div className="preview-cube cube-2">
              <div className="preview-face preview-front" />
              <div className="preview-face preview-back" />
              <div className="preview-face preview-right" />
              <div className="preview-face preview-left" />
              <div className="preview-face preview-top preview-top" />
              <div className="preview-face preview-bottom" />
            </div>
            
            <div className="preview-cube cube-3">
              <div className="preview-face preview-front" />
              <div className="preview-face preview-back" />
              <div className="preview-face preview-right" />
              <div className="preview-face preview-left" />
              <div className="preview-face preview-top preview-top" />
              <div className="preview-face preview-bottom" />
            </div>
          </div>
        </div>
      </div>

      {/* 浮动的数字提示 */}
      <div className="absolute top-4 right-4 bg-black/50 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">
        Count: ?
      </div>
    </div>
  );
}; 