import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function GlobalSOSButton() {
  const { sosState, triggerSOS } = useStore();
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdDuration = 3000; // 3 seconds
  const intervalDuration = 50; // Update progress every 50ms

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  // Don't show if SOS is already active or in countdown
  if (sosState === 'active' || sosState === 'countdown') {
    return null;
  }

  const handleStartHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / holdDuration) * 100, 100);
      setHoldProgress(progress);

      if (elapsed >= holdDuration) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        triggerSOS();
        setIsHolding(false);
        setHoldProgress(0);
      }
    }, intervalDuration);
  };

  const handleEndHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
  };


  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onMouseDown={handleStartHold}
        onMouseUp={handleEndHold}
        onMouseLeave={handleEndHold}
        onTouchStart={handleStartHold}
        onTouchEnd={handleEndHold}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-nooraya-champagne-gold to-nooraya-antique-gold shadow-lg flex items-center justify-center overflow-hidden transition-transform transform hover:scale-105 active:scale-95 group focus:outline-none"
      >
        {!isHolding && (
          <div className="absolute inset-0 rounded-full border-2 border-nooraya-champagne-gold/30 animate-ping opacity-50" />
        )}
        
        {/* Progress Ring */}
        {isHolding && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="4"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="163.36" // 2 * pi * 26
              strokeDashoffset={163.36 - (163.36 * holdProgress) / 100}
              className="transition-all duration-75 ease-linear"
            />
          </svg>
        )}

        <img 
          src="/nooraya-hallmark-exact.png" 
          alt="SOS" 
          className={cn(
            "h-6 z-10 transition-transform duration-300",
            isHolding ? "scale-90" : "scale-100"
          )} 
        />
      </button>
    </div>
  );
}
