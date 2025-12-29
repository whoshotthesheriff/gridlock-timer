import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './Header';
import { Timer } from './Timer';
import { GameGrid } from './GameGrid';
import { HelpModal } from './HelpModal';
import { WinModal } from './WinModal';
import { StatsModal } from './StatsModal';
import { useTimer } from '@/hooks/useTimer';
import {
  generatePuzzle,
  calculateCurrentSums,
  checkWin,
  getDayNumber,
  getTodaysSeed,
  type Puzzle,
  type PuzzleCell,
} from '@/lib/puzzleGenerator';

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function saveStats(time: number) {
  try {
    const stored = localStorage.getItem('timeracer-stats');
    const stats = stored ? JSON.parse(stored) : {
      gamesPlayed: 0,
      bestTime: null,
      averageTime: null,
      currentStreak: 0,
      lastPlayedDate: null,
      times: [],
    };

    const today = getTodaysSeed();
    
    // Check if already played today
    if (stats.lastPlayedDate === today) {
      return;
    }

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPlayedDate === yesterdayStr) {
      stats.currentStreak += 1;
    } else if (stats.lastPlayedDate !== today) {
      stats.currentStreak = 1;
    }

    stats.gamesPlayed += 1;
    stats.lastPlayedDate = today;
    stats.times.push(time);
    
    // Keep only last 30 times
    if (stats.times.length > 30) {
      stats.times = stats.times.slice(-30);
    }
    
    stats.bestTime = Math.min(stats.bestTime ?? Infinity, time);
    stats.averageTime = stats.times.reduce((a: number, b: number) => a + b, 0) / stats.times.length;

    localStorage.setItem('timeracer-stats', JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

function hasPlayedToday(): boolean {
  try {
    const stored = localStorage.getItem('timeracer-stats');
    if (stored) {
      const stats = JSON.parse(stored);
      return stats.lastPlayedDate === getTodaysSeed();
    }
  } catch {
    // Ignore errors
  }
  return false;
}

export function TimeRacer() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle());
  const [grid, setGrid] = useState<PuzzleCell[][]>(() => puzzle.grid);
  const [hasWon, setHasWon] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [alreadyPlayed] = useState(() => hasPlayedToday());
  
  const timer = useTimer();
  const dayNumber = getDayNumber();

  const { rowSums, colSums } = calculateCurrentSums(grid);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (hasWon || alreadyPlayed) return;

    // Start timer on first click
    if (!timer.isRunning) {
      timer.start();
    }

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].isActive = !newGrid[row][col].isActive;
      
      // Check win condition
      if (checkWin(newGrid, puzzle.rowTargets, puzzle.colTargets)) {
        timer.stop();
        setHasWon(true);
        saveStats(timer.time);
        
        setTimeout(() => {
          triggerConfetti();
          setShowWin(true);
        }, 300);
      }
      
      return newGrid;
    });
  }, [hasWon, alreadyPlayed, timer, puzzle.rowTargets, puzzle.colTargets]);

  // Show first-time help
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('timeracer-seen-help');
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem('timeracer-seen-help', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-md space-y-8">
        <Header 
          dayNumber={dayNumber}
          onHelpClick={() => setShowHelp(true)}
          onStatsClick={() => setShowStats(true)}
        />

        <Timer formattedTime={timer.formattedTime} />

        {alreadyPlayed && !hasWon && (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-muted-foreground">
              You've already completed today's puzzle!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Come back tomorrow for a new challenge.
            </p>
          </div>
        )}

        <GameGrid
          grid={grid}
          rowTargets={puzzle.rowTargets}
          colTargets={puzzle.colTargets}
          rowSums={rowSums}
          colSums={colSums}
          onCellClick={handleCellClick}
          disabled={hasWon || alreadyPlayed}
        />

        {hasWon && (
          <div className="text-center animate-fade-in">
            <p className="text-success font-medium">
              Puzzle Solved! 🎉
            </p>
          </div>
        )}

        <footer className="text-center text-xs text-muted-foreground pt-8">
          <p>A new puzzle every day at midnight</p>
        </footer>
      </div>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
      <WinModal 
        open={showWin} 
        onOpenChange={setShowWin}
        time={timer.formattedTimeShort}
        dayNumber={dayNumber}
      />
      <StatsModal open={showStats} onOpenChange={setShowStats} />
    </div>
  );
}
