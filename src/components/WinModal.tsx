import { memo } from 'react';
import { Share2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface WinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  time: string;
  dayNumber: number;
}

export const WinModal = memo(function WinModal({ 
  open, 
  onOpenChange, 
  time,
  dayNumber 
}: WinModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `TimeRacer #${dayNumber} ⏱️ ${time}s\ntimeracer.xyz`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs text-center animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-center">
            Solved!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Your Time
            </p>
            <p className="timer-display text-4xl font-bold text-foreground">
              {time}s
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            TimeRacer #{dayNumber}
          </p>

          <Button 
            onClick={handleShare}
            className="w-full gap-2 h-12 text-base font-medium"
            variant={copied ? "secondary" : "default"}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share Result
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
