import { memo } from 'react';

interface TimerProps {
  formattedTime: string;
}

export const Timer = memo(function Timer({ formattedTime }: TimerProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
        Time
      </span>
      <span className="timer-display text-2xl sm:text-3xl font-semibold text-timer-text">
        {formattedTime}
      </span>
    </div>
  );
});
