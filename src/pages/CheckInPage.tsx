import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Clock, AlertTriangle, Phone, Plus } from 'lucide-react';

export function CheckInPage() {
  const { checkInState, checkInEndTime, startCheckIn, missCheckIn, resolveCheckIn, triggerSOS } = useStore();
  const [customMinutes, setCustomMinutes] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (checkInState === 'active' && checkInEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, checkInEndTime - Date.now());
        setTimeLeft(remaining);
        if (remaining === 0) {
          missCheckIn();
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [checkInState, checkInEndTime, missCheckIn]);

  const formatTime = (ms: number | null) => {
    if (ms === null) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-nooraya-warm-white p-6 font-body text-nooraya-charcoal">
      <div className="max-w-md mx-auto space-y-8 pb-20 pt-8">
        {checkInState === 'idle' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-gradient-to-br from-nooraya-champagne-gold/30 to-nooraya-champagne-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-nooraya-champagne-gold/20">
                <Shield className="text-nooraya-antique-gold w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display text-nooraya-antique-gold">Safety Check-In</h1>
              <p className="text-nooraya-soft-grey text-sm md:text-base px-4 leading-relaxed">
                Set a timer. If you don't confirm you're safe, your contacts will be notified.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => startCheckIn(mins)}
                  className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-nooraya-champagne-gold hover:shadow-md hover:bg-nooraya-warm-white/30 transition-all group"
                >
                  <Clock className="text-nooraya-soft-grey group-hover:text-nooraya-antique-gold transition-colors w-6 h-6" />
                  <span className="font-medium text-nooraya-charcoal">{mins >= 60 ? `${mins / 60} hour${mins > 60 ? 's' : ''}` : `${mins} min`}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2 items-center">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Custom (min)"
                className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-nooraya-charcoal placeholder:text-gray-400"
              />
              <button
                onClick={() => customMinutes && startCheckIn(Number(customMinutes))}
                disabled={!customMinutes}
                className="bg-nooraya-antique-gold text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all shadow-md shadow-nooraya-champagne-gold/20 mr-1"
              >
                Start
              </button>
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="font-display text-sm text-nooraya-soft-grey uppercase tracking-wider pl-2 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-200"></span>
                Suggested Activities
                <span className="flex-1 h-[1px] bg-gray-200"></span>
              </h3>
              {['Walking home alone', 'Late night commute', 'Meeting someone new', 'Travelling alone'].map((activity, i) => (
                <button
                  key={i}
                  onClick={() => startCheckIn(30)}
                  className="w-full text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-nooraya-champagne-gold hover:shadow-md transition-all group"
                >
                  <span className="font-medium text-nooraya-charcoal">{activity}</span>
                  <div className="w-8 h-8 rounded-full bg-nooraya-warm-white flex items-center justify-center group-hover:bg-nooraya-champagne-gold/20 transition-colors">
                    <Plus className="text-nooraya-soft-grey group-hover:text-nooraya-antique-gold w-4 h-4 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {checkInState === 'active' && (
          <div className="flex flex-col items-center justify-center space-y-12 animate-in slide-in-from-bottom-8 duration-500 pt-10">
            <h1 className="text-2xl font-display text-nooraya-charcoal tracking-wide">Check-In Active</h1>
            
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-nooraya-champagne-gold/30 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-4 rounded-full border-[6px] border-nooraya-antique-gold/20"></div>
              <div className="absolute inset-8 rounded-full border-[8px] border-nooraya-champagne-gold shadow-[0_0_40px_rgba(212,175,55,0.3)]"></div>
              <div className="text-7xl font-display font-light text-nooraya-antique-gold tracking-tighter">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="w-full space-y-4 pt-8">
              <button
                onClick={resolveCheckIn}
                className="w-full bg-[#2E8B57] text-white py-5 rounded-2xl font-medium text-xl hover:bg-[#236b43] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-6 h-6" />
                I'm Safe
              </button>
              <button
                onClick={() => startCheckIn(15)}
                className="w-full bg-white border-2 border-nooraya-champagne-gold/50 text-nooraya-antique-gold py-5 rounded-2xl font-medium text-lg hover:bg-nooraya-champagne-gold/10 transition-all"
              >
                Extend Time (+15m)
              </button>
            </div>
          </div>
        )}

        {checkInState === 'yellow' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-300 pt-10">
            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-400 animate-pulse"></div>
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-inner border border-amber-200">
                <AlertTriangle size={48} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-4xl font-display text-amber-900 mb-4 tracking-tight">Check-In Missed</h2>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                  Prototype: Contacts have been notified
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={resolveCheckIn}
                className="w-full bg-[#2E8B57] text-white py-5 rounded-2xl font-medium text-lg hover:bg-[#236b43] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                I'm Safe Now
              </button>
              <button
                onClick={() => triggerSOS()}
                className="w-full bg-nooraya-emergency-red text-white py-5 rounded-2xl font-medium text-lg hover:bg-red-700 shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-5 h-5" />
                Activate SOS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
