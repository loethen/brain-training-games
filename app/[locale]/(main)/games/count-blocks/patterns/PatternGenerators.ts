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
    },
    
    tower: {
        name: 'tower',
        generate: (gridSize: number, targetBlocks: number) => {
            // 边缘格子索引
            const getEdgeIndices = () => {
                const indices = new Set<number>();
                for (let i = 0; i < gridSize; i++) {
                    indices.add(i); // top row
                    indices.add(gridSize * (gridSize - 1) + i); // bottom row
                    indices.add(i * gridSize); // left col
                    indices.add(i * gridSize + (gridSize - 1)); // right col
                }
                return Array.from(indices);
            };

            // 曼哈顿距离
            const manhattan = (a: number, b: number) => {
                const ax = a % gridSize, ay = Math.floor(a / gridSize);
                const bx = b % gridSize, by = Math.floor(b / gridSize);
                return Math.abs(ax - bx) + Math.abs(ay - by);
            };

            // 计算阴影区（摄像机 x=10,z=10 斜上方，阴影为 x>i 且 z>k）
            const getShadowIndices = (idx: number) => {
                const x = idx % gridSize;
                const z = Math.floor(idx / gridSize);
                const shadow: number[] = [];
                for (let zz = z + 1; zz < gridSize; zz++) {
                    for (let xx = x + 1; xx < gridSize; xx++) {
                        shadow.push(zz * gridSize + xx);
                    }
                }
                return shadow;
            };

            // 获取相邻格子（前后左右）
            const getAdjacentIndices = (idx: number) => {
                const x = idx % gridSize;
                const z = Math.floor(idx / gridSize);
                const adj: number[] = [];
                if (x > 0) adj.push(z * gridSize + (x - 1));
                if (x < gridSize - 1) adj.push(z * gridSize + (x + 1));
                if (z > 0) adj.push((z - 1) * gridSize + x);
                if (z < gridSize - 1) adj.push((z + 1) * gridSize + x);
                return adj;
            };

            // 尝试生成，极端情况重试
            for (let attempt = 0; attempt < 10; attempt++) {
                const heightMap = Array(gridSize * gridSize).fill(0);
                const edgeIndices = getEdgeIndices();
                // 随机打乱边缘格子
                const shuffledEdges = [...edgeIndices];
                for (let i = shuffledEdges.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledEdges[i], shuffledEdges[j]] = [shuffledEdges[j], shuffledEdges[i]];
                }
                // 随机决定塔数量（最多边缘格子数/2，且塔总方块数不超过targetBlocks-1）
                const maxTowers = Math.min(Math.floor(edgeIndices.length / 2), Math.floor(targetBlocks / 2));
                const numTowers = Math.max(1, Math.floor(Math.random() * (maxTowers + 1)));
                const towerIndices: number[] = [];
                // 依次选塔，保证间隔≥2
                for (let i = 0; i < shuffledEdges.length && towerIndices.length < numTowers; i++) {
                    const idx = shuffledEdges[i];
                    if (towerIndices.every(ti => manhattan(ti, idx) >= 2)) {
                        towerIndices.push(idx);
                    }
                }
                // 塔高度2~4
                const towerHeights = towerIndices.map(() => 2 + Math.floor(Math.random() * 3));
                const totalTowerBlocks = towerHeights.reduce((a, b) => a + b, 0);
                if (totalTowerBlocks > targetBlocks - 1) continue; // 塔太多，重试
                // 标记塔和阴影区
                const forbidden = new Set<number>();
                towerIndices.forEach((idx, i) => {
                    heightMap[idx] = towerHeights[i];
                    forbidden.add(idx);
                    getShadowIndices(idx).forEach(sidx => forbidden.add(sidx));
                    getAdjacentIndices(idx).forEach(adjIdx => forbidden.add(adjIdx));
                });
                // 剩余方块
                const leftBlocks = targetBlocks - totalTowerBlocks;
                // 可用格子
                const available: number[] = [];
                for (let i = 0; i < gridSize * gridSize; i++) {
                    if (!forbidden.has(i) && heightMap[i] === 0) available.push(i);
                }
                if (leftBlocks > available.length) continue; // 放不下，重试
                // 打乱 available 顺序
                for (let i = available.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [available[i], available[j]] = [available[j], available[i]];
                }
                // 随机分配单层方块
                for (let i = 0; i < leftBlocks; i++) {
                    const idx = available[i];
                    heightMap[idx] = 1;
                }
                return heightMap;
            }
            // 兜底：全单层
            const fallback = Array(gridSize * gridSize).fill(0);
            for (let i = 0; i < Math.min(targetBlocks, fallback.length); i++) {
                fallback[i] = 1;
            }
            return fallback;
        }
    }
};