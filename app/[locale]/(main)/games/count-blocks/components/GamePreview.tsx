'use client';

// 简单的预览组件，按照Three.js白色主题风格
export function GamePreview() {
    return (
        <div style={{ 
            position: 'relative',
            width: '100%',
            aspectRatio: '1',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #d9d9d9'
        }}>
            {/* 网格背景 */}
            <div style={{
                position: 'absolute',
                inset: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                opacity: 0.6
            }}>
                {Array.from({ length: 9 }).map((_, index) => (
                    <div
                        key={`grid-${index}`}
                        style={{
                            border: '1px solid #d9d9d9',
                            backgroundColor: '#f0f2f5'
                        }}
                    />
                ))}
            </div>
            
            {/* 示例方块 - 模拟Three.js风格 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '500px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    transform: 'rotateX(45deg) rotateY(35deg) scale(0.8)',
                    transformStyle: 'preserve-3d'
                }}>
                    {/* 几个示例立方体 - 白色主题 */}
                    {[
                        { row: 1, col: 1, height: 1 },
                        { row: 1, col: 3, height: 2 },
                        { row: 2, col: 2, height: 1 },
                        { row: 3, col: 1, height: 1 },
                        { row: 3, col: 3, height: 1 }
                    ].map((cube, index) => (
                        <div
                            key={index}
                            style={{
                                gridRow: cube.row,
                                gridColumn: cube.col,
                                width: '20px',
                                height: '20px',
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                                transform: `translateZ(${cube.height * 10}px)`
                            }}
                        >
                            {/* 方块面 - Three.js风格 */}
                            <div style={{
                                position: 'absolute',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #434343',
                                transform: 'translateZ(10px)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #434343',
                                transform: 'rotateY(90deg) translateZ(10px)'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#e8e8e8',
                                border: '1px solid #434343',
                                transform: 'rotateX(90deg) translateZ(10px)'
                            }} />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 标题 */}
            <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                textAlign: 'center'
            }}>
                <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#333333',
                    border: '1px solid #e0e0e0'
                }}>
                    Count Blocks
                </span>
            </div>
        </div>
    );
} 