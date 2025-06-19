// 模式生成器接口
export interface PatternGenerator {
    name: string;
    generate: (gridSize: number, targetBlocks: number) => number[];
}

// 模式生成器实现
export const PatternGenerators: Record<string, PatternGenerator> = {
    corner: {
        name: 'corner',
        generate: (gridSize: number, targetBlocks: number) => {
            const heightMap = Array(gridSize * gridSize).fill(0);
            const validPositions = [];
            
            for (let i = 0; i < gridSize * gridSize; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                if ((row <= 1 || row >= 3) && (col <= 1 || col >= 3)) {
                    validPositions.push(i);
                }
            }
            
            // 随机打乱并选择
            for (let i = validPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
            }
            
            for (let i = 0; i < Math.min(targetBlocks, validPositions.length); i++) {
                heightMap[validPositions[i]] = 1;
            }
            
            return heightMap;
        }
    },
    
    line: {
        name: 'line',
        generate: (gridSize: number, targetBlocks: number) => {
            const heightMap = Array(gridSize * gridSize).fill(0);
            const validPositions = [];
            
            for (let i = 0; i < gridSize * gridSize; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                if (row === 2 || col === 2) {
                    validPositions.push(i);
                }
            }
            
            for (let i = validPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
            }
            
            for (let i = 0; i < Math.min(targetBlocks, validPositions.length); i++) {
                heightMap[validPositions[i]] = 1;
            }
            
            return heightMap;
        }
    },
    
    cross: {
        name: 'cross',
        generate: (gridSize: number, targetBlocks: number) => {
            const heightMap = Array(gridSize * gridSize).fill(0);
            const validPositions = [];
            
            for (let i = 0; i < gridSize * gridSize; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                if (row === 2 || col === 2) {
                    validPositions.push(i);
                }
            }
            
            for (let i = validPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
            }
            
            for (let i = 0; i < Math.min(targetBlocks, validPositions.length); i++) {
                heightMap[validPositions[i]] = 1;
            }
            
            return heightMap;
        }
    },
    
    scattered: {
        name: 'scattered',
        generate: (gridSize: number, targetBlocks: number) => {
            const heightMap = Array(gridSize * gridSize).fill(0);
            const allPositions = [];
            
            for (let i = 0; i < gridSize * gridSize; i++) {
                allPositions.push(i);
            }
            
            for (let i = allPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
            }
            
            for (let i = 0; i < Math.min(targetBlocks, allPositions.length); i++) {
                heightMap[allPositions[i]] = 1;
            }
            
            return heightMap;
        }
    },
    
    random_fill: {
        name: 'random_fill',
        generate: (gridSize: number, targetBlocks: number) => {
            const heightMap = Array(gridSize * gridSize).fill(0);
            const allPositions = [];
            
            for (let i = 0; i < gridSize * gridSize; i++) {
                allPositions.push(i);
            }
            
            // 随机打乱位置数组
            for (let i = allPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
            }
            
            // 选择前targetBlocks个位置放置方块
            for (let i = 0; i < Math.min(targetBlocks, allPositions.length); i++) {
                heightMap[allPositions[i]] = 1;
            }
            
            return heightMap;
        }
    }
};