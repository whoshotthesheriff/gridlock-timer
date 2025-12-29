import { memo } from 'react';
import { HelpCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  dayNumber: number;
  onHelpClick: () => void;
  onStatsClick: () => void;
}

export const Header = memo(function Header({ 
  dayNumber, 
  onHelpClick,
  onStatsClick 
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between w-full max-w-md mx-auto px-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onHelpClick}
        aria-label="How to play"
        className="text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      <div className="text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
          TimeRacer
        </h1>
        <p className="text-xs text-muted-foreground tracking-wide">
          Daily Puzzle #{dayNumber}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onStatsClick}
        aria-label="Statistics"
        className="text-muted-foreground hover:text-foreground"
      >
        <BarChart3 className="w-6 h-6" />
      </Button>
    </header>
  );
});
