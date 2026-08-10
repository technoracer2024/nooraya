import { useEffect, useRef } from 'react';
import { Phone, MapPin, AlertTriangle, ShieldCheck, Activity, Map, Volume2, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { StatusPulse } from '../components/StatusPulse';
import { MapView } from '../components/MapView';

export default function GuardianDashboard() {
  const {
    guardianUser,
    sosState,
    location,
    latestMessage,
    latestMessageTimestamp,
    contextRecordingAvailable,
    checkInState,
    trackingState,
    trackingRoute,
    lastQuickAlert,
    alertHistory,
    alertLevel,
    resolveSOS
  } = useStore();

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (sosState === 'active') {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      
      const playBeep = () => {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      };

      const interval = setInterval(playBeep, 1000);
      return () => {
        clearInterval(interval);
        audioCtx.close();
      };
    }
  }, [sosState]);

  const isRecentQuickAlert = lastQuickAlert && (Date.now() - new Date(lastQuickAlert.timestamp).getTime()) < 5 * 60 * 1000;

  return (
    <div className="min-h-screen bg-nooraya-charcoal text-nooraya-ivory pb-24 font-body">
      {/* Header */}
      <header className="px-6 py-6 border-b border-white/5 bg-black/20 sticky top-0 z-50 backdrop-blur-md">
        <h1 className="text-2xl font-display text-nooraya-champagne-gold">Guardian Portal</h1>
        <p className="text-sm text-nooraya-soft-grey mt-1">Monitoring {guardianUser?.name}</p>
      </header>

      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* User Status Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-xl font-display">{guardianUser?.name}'s Status</h2>
              <div className="flex items-center gap-2 mt-2">
                <StatusPulse status={alertLevel === 'red' ? 'red' : alertLevel === 'yellow' ? 'yellow' : 'green'} />
                <span className={cn(
                  "font-medium",
                  alertLevel === 'red' ? 'text-nooraya-emergency-red' : 
                  alertLevel === 'yellow' ? 'text-nooraya-antique-gold' : 'text-green-400'
                )}>
                  {alertLevel === 'red' ? 'EMERGENCY ACTIVE' : 
                   checkInState === 'yellow' ? 'Check-In Missed' : 'Safe'}
                </span>
              </div>
            </div>
            {alertLevel === 'red' ? <ShieldAlert className="w-10 h-10 text-nooraya-emergency-red" /> : <ShieldCheck className="w-10 h-10 text-nooraya-champagne-gold" />}
          </div>
        </div>

        {/* RED ALERT BANNER */}
        {sosState === 'active' && (
          <div className="bg-nooraya-emergency-red/10 border-2 border-nooraya-emergency-red rounded-3xl p-6 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-nooraya-emergency-red shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-display text-nooraya-emergency-red font-bold uppercase mb-2">
                  {guardianUser?.name} has activated Nooraya SOS
                </h3>
                
                {location && (
                  <div className="bg-black/40 rounded-xl p-4 mt-4 border border-nooraya-emergency-red/30">
                    <div className="flex items-center gap-2 text-sm text-nooraya-ivory mb-2">
                      <MapPin className="w-4 h-4 text-nooraya-emergency-red" />
                      <span>Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`} 
                      target="_blank" rel="noreferrer"
                      className="text-blue-400 text-sm underline flex items-center gap-1"
                    >
                      <Map className="w-4 h-4" /> View on Google Maps
                    </a>
                  </div>
                )}

                {latestMessage && (
                  <div className="bg-black/40 rounded-xl p-4 mt-4 border border-nooraya-emergency-red/30">
                    <p className="text-sm font-medium text-nooraya-champagne-gold mb-1">Latest Communication</p>
                    <p className="text-nooraya-ivory">"{latestMessage}"</p>
                    <p className="text-xs text-nooraya-soft-grey mt-2">
                      {latestMessageTimestamp ? new Date(latestMessageTimestamp).toLocaleTimeString() : ''}
                    </p>
                  </div>
                )}

                {contextRecordingAvailable && (
                  <div className="bg-black/40 rounded-xl p-4 mt-4 border border-nooraya-emergency-red/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-nooraya-antique-gold" />
                      <span>Context Audio Available</span>
                    </div>
                    <button className="px-4 py-2 bg-nooraya-antique-gold/20 text-nooraya-antique-gold rounded-full text-sm font-medium border border-nooraya-antique-gold/50">
                      Play Audio
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a href={`tel:${guardianUser?.phone}`} className="flex-1 flex justify-center items-center gap-2 bg-nooraya-emergency-red hover:bg-red-700 text-white font-medium py-3 rounded-full transition-colors">
                    <Phone className="w-5 h-5" /> Call User
                  </a>
                  <button onClick={resolveSOS} className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-full transition-colors font-medium">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yellow Alerts */}
        {isRecentQuickAlert && (
          <div className="bg-nooraya-antique-gold/10 border border-nooraya-antique-gold rounded-3xl p-6">
            <h3 className="text-lg font-display text-nooraya-antique-gold mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Quick Alert Triggered
            </h3>
            <p className="text-nooraya-ivory mb-2">"{lastQuickAlert.message}"</p>
            <p className="text-xs text-nooraya-soft-grey">
              {new Date(lastQuickAlert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {checkInState === 'yellow' && alertLevel !== 'red' && (
          <div className="bg-nooraya-antique-gold/10 border border-nooraya-antique-gold rounded-3xl p-6">
            <h3 className="text-lg font-display text-nooraya-antique-gold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Safety Check-In Missed
            </h3>
            <p className="text-nooraya-ivory">{guardianUser?.name} did not respond to their scheduled check-in.</p>
          </div>
        )}

        {/* Map Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-64 flex flex-col">
          <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="font-medium text-nooraya-soft-grey text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Live Location
            </h3>
            {trackingState === 'tracking' && <span className="text-xs text-nooraya-antique-gold bg-nooraya-antique-gold/10 px-2 py-1 rounded-md">Live Tracking</span>}
          </div>
          <div className="flex-1 relative">
             <MapView 
                center={location ? [location.lat, location.lng] : undefined} 
                routePoints={trackingState === 'tracking' ? trackingRoute : undefined} 
                markers={location ? [{lat: location.lat, lng: location.lng, color: 'red'}] : []}
                className="pointer-events-none"
             />
          </div>
        </div>

        {/* Idle state */}
        {alertLevel === 'green' && checkInState !== 'yellow' && !isRecentQuickAlert && (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl text-center space-y-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mb-2"></div>
            <h3 className="font-display text-lg text-nooraya-champagne-gold">Monitoring Active</h3>
            <p className="text-sm text-nooraya-soft-grey">Listening for alerts from {guardianUser?.name}</p>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-display text-nooraya-champagne-gold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {alertHistory.length === 0 ? (
              <p className="text-sm text-nooraya-soft-grey">No recent alerts.</p>
            ) : (
              alertHistory.slice(0, 5).map(alert => (
                <div key={alert.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                  <div className="mt-1">
                    {alert.type === 'sos' ? <AlertTriangle className="w-5 h-5 text-nooraya-emergency-red" /> : 
                     alert.type === 'quick_alert' ? <Activity className="w-5 h-5 text-nooraya-antique-gold" /> :
                     <ShieldAlert className="w-5 h-5 text-nooraya-antique-gold" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nooraya-ivory">{alert.message}</p>
                    <p className="text-xs text-nooraya-soft-grey mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
