import { memo } from 'react';
import { GameCell } from './GameCell';
import { TargetCell } from './TargetCell';
import type { PuzzleCell } from '@/lib/puzzleGenerator';

interface GameGridProps {
  grid: PuzzleCell[][];
  rowTargets: number[];
  colTargets: number[];
  rowSums: number[];
  colSums: number[];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

export const GameGrid = memo(function GameGrid({
  grid,
  rowTargets,
  colTargets,
  rowSums,
  colSums,
  onCellClick,
  disabled = false,
}: GameGridProps) {
  return (
    <div className="w-full max-w-[320px] sm:max-w-[380px] mx-auto">
      {/* Main grid with row targets */}
      <div className="flex gap-2 sm:gap-3">
        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 flex-1">
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <GameCell
                key={`${rowIdx}-${colIdx}`}
                value={cell.value}
                isActive={cell.isActive}
                onClick={() => onCellClick(rowIdx, colIdx)}
                disabled={disabled}
              />
            ))
          )}
        </div>

        {/* Row targets */}
        <div className="flex flex-col gap-1.5 sm:gap-2 w-10 sm:w-12">
          {rowTargets.map((target, idx) => (
            <TargetCell
              key={`row-${idx}`}
              target={target}
              current={rowSums[idx]}
              isRow
            />
          ))}
        </div>
      </div>

      {/* Column targets */}
      <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 flex-1">
          {colTargets.map((target, idx) => (
            <TargetCell
              key={`col-${idx}`}
              target={target}
              current={colSums[idx]}
              isRow={false}
            />
          ))}
        </div>
        {/* Empty corner */}
        <div className="w-10 sm:w-12" />
      </div>
    </div>
  );
});
