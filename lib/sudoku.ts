export type Board = (number | null)[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

const BLANK = null;

// Validates if placing num at board[row][col] is valid
export function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check col
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

// Solves the board using backtracking. Returns true if solvable.
export function solveSudoku(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generates a fully solved valid 9x9 board
export function generateSolvedBoard(): Board {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));

  // Fill diagonal 3x3 boxes first (independent of each other) to speed up solving
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }

  // Solve the rest
  solveSudoku(board);
  return board;
}

function fillBox(board: Board, row: number, col: number) {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
}

function isSafeInBox(board: Board, row: number, col: number, num: number) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[row + i][col + j] === num) return false;
    }
  }
  return true;
}

// Removes numbers to create a puzzle
export function generatePuzzle(difficulty: Difficulty): { initialBoard: Board, solvedBoard: Board } {
  const solvedBoard = generateSolvedBoard();
  // Deep copy for the puzzle
  const puzzleBoard = JSON.parse(JSON.stringify(solvedBoard));

  let attempts = difficulty === 'easy' ? 30
    : difficulty === 'medium' ? 40
      : difficulty === 'hard' ? 50
        : 60; // Approximate number of holes

  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzleBoard[row][col] !== BLANK) {
      puzzleBoard[row][col] = BLANK;
      attempts--;
    }
  }

  return { initialBoard: puzzleBoard, solvedBoard };
}
