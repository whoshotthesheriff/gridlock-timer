import seedrandom from 'seedrandom';

export interface PuzzleCell {
  value: number;
  isActive: boolean;
  isSolution: boolean;
}

export interface Puzzle {
  grid: PuzzleCell[][];
  rowTargets: number[];
  colTargets: number[];
}

export function getTodaysSeed(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayNumber(): number {
  const startDate = new Date('2024-01-01');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function generatePuzzle(seed?: string): Puzzle {
  const rng = seedrandom(seed || getTodaysSeed());
  
  // Generate 16 random numbers between 0 and 15
  const values: number[] = [];
  for (let i = 0; i < 16; i++) {
    values.push(Math.floor(rng() * 16));
  }
  
  // Randomly pick a hidden solution (each cell has ~40% chance of being active)
  const solution: boolean[] = [];
  for (let i = 0; i < 16; i++) {
    solution.push(rng() < 0.4);
  }
  
  // Ensure at least some cells are in solution (minimum 3, maximum 10)
  let activeCount = solution.filter(Boolean).length;
  while (activeCount < 3) {
    const idx = Math.floor(rng() * 16);
    if (!solution[idx]) {
      solution[idx] = true;
      activeCount++;
    }
  }
  while (activeCount > 10) {
    const idx = Math.floor(rng() * 16);
    if (solution[idx]) {
      solution[idx] = false;
      activeCount--;
    }
  }
  
  // Create 4x4 grid
  const grid: PuzzleCell[][] = [];
  for (let row = 0; row < 4; row++) {
    const gridRow: PuzzleCell[] = [];
    for (let col = 0; col < 4; col++) {
      const idx = row * 4 + col;
      gridRow.push({
        value: values[idx],
        isActive: false,
        isSolution: solution[idx],
      });
    }
    grid.push(gridRow);
  }
  
  // Calculate row targets based on solution
  const rowTargets: number[] = [];
  for (let row = 0; row < 4; row++) {
    let sum = 0;
    for (let col = 0; col < 4; col++) {
      if (grid[row][col].isSolution) {
        sum += grid[row][col].value;
      }
    }
    rowTargets.push(sum);
  }
  
  // Calculate column targets based on solution
  const colTargets: number[] = [];
  for (let col = 0; col < 4; col++) {
    let sum = 0;
    for (let row = 0; row < 4; row++) {
      if (grid[row][col].isSolution) {
        sum += grid[row][col].value;
      }
    }
    colTargets.push(sum);
  }
  
  return { grid, rowTargets, colTargets };
}

export function calculateCurrentSums(grid: PuzzleCell[][]): { rowSums: number[]; colSums: number[] } {
  const rowSums: number[] = [0, 0, 0, 0];
  const colSums: number[] = [0, 0, 0, 0];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col].isActive) {
        rowSums[row] += grid[row][col].value;
        colSums[col] += grid[row][col].value;
      }
    }
  }
  
  return { rowSums, colSums };
}

export function checkWin(grid: PuzzleCell[][], rowTargets: number[], colTargets: number[]): boolean {
  const { rowSums, colSums } = calculateCurrentSums(grid);
  
  for (let i = 0; i < 4; i++) {
    if (rowSums[i] !== rowTargets[i] || colSums[i] !== colTargets[i]) {
      return false;
    }
  }
  
  return true;
}
