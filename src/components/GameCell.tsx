import { memo, useState } from 'react';
import { cn } from '@/lib/utils';

interface GameCellProps {
  value: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const GameCell = memo(function GameCell({ 
  value, 
  isActive, 
  onClick,
  disabled = false 
}: GameCellProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={cn(
        'cell-base',
        isActive && 'cell-active',
        isPressed && 'scale-95',
        disabled && 'cursor-default opacity-80'
      )}
      aria-pressed={isActive}
      aria-label={`Number ${value}, ${isActive ? 'active' : 'inactive'}`}
    >
      {value}
    </button>
  );
});
