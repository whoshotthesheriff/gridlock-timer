import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = memo(function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">How to Play</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-foreground/80">
          <p>
            <strong>Goal:</strong> Select numbers in the grid so that the sum of each row 
            matches its target on the right, and the sum of each column matches its target 
            at the bottom.
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">Rules:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Tap a number to activate or deactivate it</li>
              <li>Active numbers count toward both row and column sums</li>
              <li>Green targets mean you've matched the sum</li>
              <li>Red targets mean you've gone over</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Every day features a new puzzle. Race against the clock and share your time!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
});
