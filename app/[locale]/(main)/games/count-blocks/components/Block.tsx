import React from 'react';
import { GAME_CONFIG } from '../config';

interface BlockProps {
  row: number;
  col: number;
  stackIndex: number; // 在堆叠中的位置 (0=底部, 1=中间, 2=顶部)
  isVisible: boolean;
  isCorrect?: boolean; // 验证状态
}

export const Block: React.FC<BlockProps> = ({ row, col, stackIndex, isVisible, isCorrect = false }) => {
  const zPosition = (stackIndex * GAME_CONFIG.CUBE_SIZE) + (GAME_CONFIG.CUBE_SIZE / 2);
  
  return (
    <div
      className={`cube ${isVisible ? 'visible' : 'hidden'} ${isCorrect ? 'correct' : ''}`}
      style={{
        gridRow: `${row + 1}`,
        gridColumn: `${col + 1}`,
        transform: `translateZ(${zPosition}px)`,
        transition: 'opacity 0.3s ease-out',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="face front" />
      <div className="face back" />
      <div className="face right" />
      <div className="face left" />
      <div className="face top" />
      <div className="face bottom" />
    </div>
  );
};

// 为一个位置渲染所有堆叠的方块
interface BlockStackProps {
  row: number;
  col: number;
  height: number;
  isVisible: boolean;
  isCorrect?: boolean;
}

export const BlockStack: React.FC<BlockStackProps> = ({ row, col, height, isVisible, isCorrect = false }) => {
  return (
    <>
      {Array.from({ length: height }, (_, index) => (
        <Block
          key={`${row}-${col}-${index}`}
          row={row}
          col={col}
          stackIndex={index}
          isVisible={isVisible}
          isCorrect={isCorrect}
        />
      ))}
    </>
  );
}; 