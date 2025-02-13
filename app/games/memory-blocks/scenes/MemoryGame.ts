import { Scene, GameObjects, Math as PhaserMath } from 'phaser'

export class MemoryGame extends Scene {
  private blocks: GameObjects.Rectangle[][] = []
  private pattern: boolean[][] = []
  private playerCanClick: boolean = false
  private gridSize: number = 3
  private blockSize: number = 80
  private spacing: number = 10
  private level: number = 1
  private blocksToRemember: number = 3
  private showDuration: number = 1500

  constructor() {
    super({ key: 'MemoryGame' })
  }

  create() {
    this.createGrid()
    this.time.delayedCall(1000, () => this.startNewRound(), [], this)
    
    // 添加分数文本
    this.add.text(16, 16, 'Level: 1', {
      fontSize: '24px',
      color: '#ffffff'
    })
  }

  private createGrid() {
    const startX = (800 - (this.gridSize * (this.blockSize + this.spacing))) / 2
    const startY = (600 - (this.gridSize * (this.blockSize + this.spacing))) / 2

    for (let row = 0; row < this.gridSize; row++) {
      this.blocks[row] = []
      this.pattern[row] = []
      
      for (let col = 0; col < this.gridSize; col++) {
        const x = startX + col * (this.blockSize + this.spacing)
        const y = startY + row * (this.blockSize + this.spacing)
        
        const block = this.add.rectangle(x, y, this.blockSize, this.blockSize, 0x666666)
        block.setInteractive()
        block.on('pointerdown', () => this.onBlockClick(row, col))
        
        this.blocks[row][col] = block
        this.pattern[row][col] = false
      }
    }
  }

  private startNewRound() {
    this.playerCanClick = false
    this.clearPattern()
    this.generatePattern()
    this.showPattern()
  }

  private clearPattern() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.pattern[row][col] = false
        this.blocks[row][col].setFillStyle(0x666666)
      }
    }
  }

  private generatePattern() {
    let blocksPlaced = 0
    while (blocksPlaced < this.blocksToRemember) {
      const row = PhaserMath.Between(0, this.gridSize - 1)
      const col = PhaserMath.Between(0, this.gridSize - 1)
      if (!this.pattern[row][col]) {
        this.pattern[row][col] = true
        blocksPlaced++
      }
    }
  }

  private showPattern() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.pattern[row][col]) {
          this.blocks[row][col].setFillStyle(0x00ff00)
        }
      }
    }

    this.time.delayedCall(this.showDuration, () => {
      this.hidePattern()
      this.playerCanClick = true
    }, [], this)
  }

  private hidePattern() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.blocks[row][col].setFillStyle(0x666666)
      }
    }
  }

  private onBlockClick(row: number, col: number) {
    if (!this.playerCanClick) return

    if (this.pattern[row][col]) {
      this.blocks[row][col].setFillStyle(0x00ff00)
      this.pattern[row][col] = false
      
      if (this.isRoundComplete()) {
        this.level++
        this.blocksToRemember = Math.min(this.level + 2, this.gridSize * this.gridSize)
        this.showDuration = Math.max(1500 - (this.level * 100), 800)
        
        this.time.delayedCall(1000, () => this.startNewRound(), [], this)
      }
    } else {
      this.blocks[row][col].setFillStyle(0xff0000)
      this.playerCanClick = false
      this.time.delayedCall(1000, () => this.gameOver(), [], this)
    }
  }

  private isRoundComplete(): boolean {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.pattern[row][col]) return false
      }
    }
    return true
  }

  private gameOver() {
    this.scene.restart()
    this.level = 1
    this.blocksToRemember = 3
    this.showDuration = 1500
  }
} 