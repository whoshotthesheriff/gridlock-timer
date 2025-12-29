import { memo } from 'react';
import { cn } from '@/lib/utils';

interface TargetCellProps {
  target: number;
  current: number;
  isRow?: boolean;
}

export const TargetCell = memo(function TargetCell({ 
  target, 
  current,
  isRow = true 
}: TargetCellProps) {
  const isMatch = current === target;
  const isOver = current > target;

  return (
    <div
      className={cn(
        'target-cell aspect-square',
        isMatch && 'target-match',
        isOver && 'text-target-mismatch'
      )}
      aria-label={`${isRow ? 'Row' : 'Column'} target: ${target}, current: ${current}`}
    >
      {target}
    </div>
  );
});
