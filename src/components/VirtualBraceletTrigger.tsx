import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

export default function VirtualBraceletTrigger() {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const triggerSOS = useStore(state => state.triggerSOS);
  
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const HOLD_DURATION = 3000; // 3 seconds

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);
    
    // Simulate vibration
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    const startTime = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(percent);
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(500); // Long vibration on trigger
      triggerSOS();
      cleanup();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    cleanup();
    setProgress(0);
    setIsHolding(false);
  };

  const cleanup = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="48" 
            className="stroke-nooraya-soft-grey/20 fill-transparent" 
            strokeWidth="4" 
          />
          <circle 
            cx="50" cy="50" r="48" 
            className="stroke-nooraya-champagne-gold fill-transparent transition-all duration-75" 
            strokeWidth="4"
            strokeDasharray="301.59"
            strokeDashoffset={301.59 - (progress / 100) * 301.59}
            strokeLinecap="round"
          />
        </svg>

        {/* Physical Bracelet Simulation Button */}
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className={cn(
            "w-56 h-56 rounded-full bg-gradient-to-br from-[#E8D081] to-[#B58A2A] shadow-2xl flex flex-col items-center justify-center transition-transform duration-300 relative overflow-hidden outline-none select-none",
            isHolding ? "scale-95" : "hover:scale-105"
          )}
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
          
          <img src="/nooraya-hallmark-exact.png" alt="Nooraya Charm" className="w-16 mb-2 opacity-90 drop-shadow-md" />
          <span className="text-white/90 font-display text-lg tracking-widest uppercase">
            {isHolding ? "Holding..." : "Hold to Send SOS"}
          </span>
        </button>
      </div>
      <p className="mt-8 text-nooraya-soft-grey text-sm font-body text-center max-w-xs">
        Press and hold the virtual charm for 3 seconds to activate discreet emergency SOS.
      </p>
    </div>
  );
}
