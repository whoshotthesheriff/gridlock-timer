import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = performance.now() - startTimeRef.current;
      setTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, []);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = performance.now() - time;
      setIsRunning(true);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isRunning, time, updateTimer]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTime(0);
    startTimeRef.current = null;
  }, [stop]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = seconds.toFixed(4).padStart(7, '0');
    
    return `${minutesStr}:${secondsStr}`;
  }, []);

  const formatTimeShort = useCallback((ms: number): string => {
    const totalSeconds = ms / 1000;
    return totalSeconds.toFixed(4);
  }, []);

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    formattedTime: formatTime(time),
    formattedTimeShort: formatTimeShort(time),
  };
}
