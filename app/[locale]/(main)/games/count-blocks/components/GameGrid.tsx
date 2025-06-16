import React from 'react';
import { GAME_CONFIG } from '../config';
import { BlockStack } from './Block';
import { BlockPosition } from '../config';

interface GameGridProps {
  blocks: BlockPosition[];
  showBlocks: boolean;
  showResult?: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({ blocks, showBlocks, showResult = false }) => {
  return (
    <div className="count-blocks-scene">
      {/* 网格平面 */}
      <div className="grid iso-container">
        {Array.from({ length: GAME_CONFIG.GRID_SIZE * GAME_CONFIG.GRID_SIZE }, (_, i) => (
          <div key={i} className="grid-cell" />
        ))}
      </div>

      {/* 方块容器 */}
      <div className="cubes-wrapper iso-container">
        {blocks.map((block, index) => (
          <BlockStack
            key={`${block.row}-${block.col}-${index}`}
            row={block.row}
            col={block.col}
            height={block.height}
            isVisible={showBlocks}
            isCorrect={showResult}
          />
        ))}
      </div>
    </div>
  );
}; 