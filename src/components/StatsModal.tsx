import { memo, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Stats {
  gamesPlayed: number;
  bestTime: number | null;
  averageTime: number | null;
  currentStreak: number;
}

function getStats(): Stats {
  try {
    const stored = localStorage.getItem('timeracer-stats');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return {
    gamesPlayed: 0,
    bestTime: null,
    averageTime: null,
    currentStreak: 0,
  };
}

export const StatsModal = memo(function StatsModal({ open, onOpenChange }: StatsModalProps) {
  const stats = useMemo(() => getStats(), [open]);

  const formatTime = (ms: number | null): string => {
    if (ms === null) return '--';
    return (ms / 1000).toFixed(2) + 's';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Played</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold timer-display">{formatTime(stats.bestTime)}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Best</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold timer-display">{formatTime(stats.averageTime)}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Average</p>
          </div>
        </div>

        {stats.gamesPlayed === 0 && (
          <p className="text-sm text-center text-muted-foreground pb-2">
            Complete a puzzle to see your stats!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
});
