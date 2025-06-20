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
            // 检查从摄像机位置(10,10,10)观看时，某个位置是否会被另一个位置的高塔遮挡
            const isBlockedByTower = (checkIdx: number, checkHeight: number, towerIdx: number, towerHeight: number) => {
                const cx = checkIdx % gridSize;
                const cz = Math.floor(checkIdx / gridSize);
                const tx = towerIdx % gridSize;
                const tz = Math.floor(towerIdx / gridSize);
                
                // 摄像机位置（标准化到网格坐标系）
                const cameraX = 10;
                const cameraY = 10;
                const cameraZ = 10;
                
                // 将网格坐标转换为实际3D坐标（网格中心为原点）
                const gridOffset = gridSize / 2 - 0.5;
                const checkX = cx - gridOffset;
                const checkZ = cz - gridOffset;
                const towerX = tx - gridOffset;
                const towerZ = tz - gridOffset;
                
                // 计算从摄像机到检查点的射线
                const checkY = checkHeight - 0.5; // 方块中心高度
                const dirX = checkX - cameraX;
                const dirY = checkY - cameraY;
                const dirZ = checkZ - cameraZ;
                
                // 检查射线是否经过塔的任何一层
                for (let h = 1; h <= towerHeight; h++) {
                    const towerY = h - 0.5; // 塔的每一层中心高度
                    
                    // 计算射线与塔这一层的交点参数t
                    // 射线方程: P = camera + t * dir
                    // 要检查是否经过塔的位置(towerX, towerY, towerZ)
                    
                    // 检查X和Z坐标是否匹配（允许一定误差）
                    const t = (towerX - cameraX) / dirX;
                    if (t > 0 && t < 1) { // t在0和1之间表示在摄像机和检查点之间
                        const intersectY = cameraY + t * dirY;
                        const intersectZ = cameraZ + t * dirZ;
                        
                        // 检查交点是否在塔的范围内
                        if (Math.abs(intersectZ - towerZ) < 0.5 && 
                            intersectY >= towerY - 0.5 && intersectY <= towerY + 0.5) {
                            return true;
                        }
                    }
                }
                
                return false;
            };
            
            // 检查一个高度图是否有隐藏方块
            const hasHiddenBlocks = (heightMap: number[]) => {
                for (let i = 0; i < heightMap.length; i++) {
                    if (heightMap[i] === 0) continue;
                    
                    for (let h = 1; h <= heightMap[i]; h++) {
                        // 检查这个方块是否被其他方块遮挡
                        for (let j = 0; j < heightMap.length; j++) {
                            if (i === j || heightMap[j] === 0) continue;
                            
                            if (isBlockedByTower(i, h, j, heightMap[j])) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            };

            // 生成简化的塔模式：避免复杂的阴影计算
            // 策略：在特定的"安全"位置放置塔，确保不会相互遮挡
            const generateSafeTowers = () => {
                const heightMap = Array(gridSize * gridSize).fill(0);
                
                // 定义安全的塔位置（避免相互遮挡的角落位置）
                const safeTowerPositions = [
                    0,  // 左上角
                    gridSize - 1,  // 右上角
                    gridSize * (gridSize - 1),  // 左下角
                    gridSize * gridSize - 1,  // 右下角
                ];
                
                // 随机选择1-2个塔位置
                const numTowers = Math.min(2, Math.floor(Math.random() * 2) + 1);
                const selectedPositions = [];
                
                // 随机打乱安全位置
                const shuffledSafe = [...safeTowerPositions];
                for (let i = shuffledSafe.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledSafe[i], shuffledSafe[j]] = [shuffledSafe[j], shuffledSafe[i]];
                }
                
                // 选择塔位置
                for (let i = 0; i < numTowers && i < shuffledSafe.length; i++) {
                    selectedPositions.push(shuffledSafe[i]);
                }
                
                // 为每个塔分配高度
                const towerHeights = selectedPositions.map(() => 2 + Math.floor(Math.random() * 2)); // 2-3层
                const totalTowerBlocks = towerHeights.reduce((a, b) => a + b, 0);
                
                if (totalTowerBlocks >= targetBlocks) {
                    // 如果塔的方块数已经足够，只保留塔
                    selectedPositions.forEach((pos, i) => {
                        heightMap[pos] = towerHeights[i];
                    });
                    return heightMap;
                }
                
                // 设置塔
                selectedPositions.forEach((pos, i) => {
                    heightMap[pos] = towerHeights[i];
                });
                
                // 剩余方块数
                const remainingBlocks = targetBlocks - totalTowerBlocks;
                
                // 寻找安全的单层方块位置（不会被塔遮挡的位置）
                const safePositions = [];
                for (let i = 0; i < gridSize * gridSize; i++) {
                    if (heightMap[i] > 0) continue; // 已有塔
                    
                    // 检查这个位置是否会被现有的塔遮挡
                    let isBlocked = false;
                    for (let j = 0; j < selectedPositions.length; j++) {
                        if (isBlockedByTower(i, 1, selectedPositions[j], towerHeights[j])) {
                            isBlocked = true;
                            break;
                        }
                    }
                    
                    if (!isBlocked) {
                        safePositions.push(i);
                    }
                }
                
                // 随机选择安全位置放置单层方块
                const shuffledSafePos = [...safePositions];
                for (let i = shuffledSafePos.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledSafePos[i], shuffledSafePos[j]] = [shuffledSafePos[j], shuffledSafePos[i]];
                }
                
                for (let i = 0; i < Math.min(remainingBlocks, shuffledSafePos.length); i++) {
                    heightMap[shuffledSafePos[i]] = 1;
                }
                
                return heightMap;
            };

            // 尝试生成，确保没有隐藏方块
            for (let attempt = 0; attempt < 10; attempt++) {
                const heightMap = generateSafeTowers();
                
                // 验证没有隐藏方块
                if (!hasHiddenBlocks(heightMap)) {
                    return heightMap;
                }
            }
            
            // 兜底：生成简单的单层模式
            const fallback = Array(gridSize * gridSize).fill(0);
            const positions = [];
            for (let i = 0; i < gridSize * gridSize; i++) {
                positions.push(i);
            }
            // 随机打乱
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }
            // 放置单层方块
            for (let i = 0; i < Math.min(targetBlocks, positions.length); i++) {
                fallback[positions[i]] = 1;
            }
            return fallback;
        }
    }
};