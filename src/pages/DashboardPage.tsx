import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { MapPin, Users, Map, Bell } from 'lucide-react';
import { StatusPulse } from '../components/StatusPulse';
import { MapView } from '../components/MapView';

export default function DashboardPage() {
  const {
    userProfile,
    alertLevel,
    trackingState,
    trackingStartTime,
    trackingRoute,
    location,
    setLocation,
    startTracking,
    addTrackingPoint,
    stopTracking
  } = useStore();

  const [elapsedTime, setElapsedTime] = useState('00:00');
  const trackingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Request geolocation on mount
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,

            timestamp: position.timestamp,
          });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }
  }, [setLocation]);

  useEffect(() => {
    let timerInterval: number;
    if (trackingState === 'tracking' && trackingStartTime) {
      // Setup tracking interval
      trackingIntervalRef.current = window.setInterval(() => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            addTrackingPoint({
              lat: position.coords.latitude,
              lng: position.coords.longitude,

              timestamp: position.timestamp,
            });
          });
        }
      }, 10000);

      // Setup elapsed time interval
      timerInterval = window.setInterval(() => {
        const diff = Date.now() - new Date(trackingStartTime).getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      if (trackingIntervalRef.current) {
        window.clearInterval(trackingIntervalRef.current);
      }
      setElapsedTime('00:00');
    }

    return () => {
      if (trackingIntervalRef.current) window.clearInterval(trackingIntervalRef.current);
      if (timerInterval) window.clearInterval(timerInterval);
    };
  }, [trackingState, trackingStartTime, addTrackingPoint]);

  const toggleTracking = () => {
    if (trackingState === 'idle') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const point = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,

            timestamp: position.timestamp,
          };
          setLocation(point);
          startTracking();
          addTrackingPoint(point);
        });
      } else {
        startTracking();
      }
    } else {
      stopTracking();
    }
  };

  const userName = userProfile?.name || 'User';
  const contactsCount = userProfile?.trustedContacts?.length || 0;
  // Fallbacks if these arrays aren't defined in the profile
  const savedRoutesCount = (userProfile as any)?.savedRoutes?.length || 0;
  const alertHistoryCount = (userProfile as any)?.alertHistory?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-nooraya-warm-white p-4 space-y-6">
      {/* 1. Greeting */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-3xl font-display text-nooraya-charcoal font-semibold">
          Hello, {userName}
        </h1>
        <div className="bg-white/50 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-nooraya-soft-grey">
          <span className="text-sm font-body text-nooraya-charcoal">Active</span>
        </div>
      </div>

      {/* 2. Alert level card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-nooraya-champagne-gold/30 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-nooraya-soft-grey font-body uppercase tracking-wider">Current Status</span>
          <span className="text-xl font-display font-medium text-nooraya-charcoal capitalize">{alertLevel}</span>
        </div>
        <StatusPulse status={alertLevel} />
      </div>

      {/* 3. Large tracking toggle button */}
      <button
        onClick={toggleTracking}
        className={cn(
          "w-full py-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-md",
          trackingState === 'idle'
            ? "bg-gradient-to-r from-nooraya-champagne-gold to-nooraya-antique-gold text-white"
            : "bg-white border-2 border-nooraya-emergency-red text-nooraya-emergency-red animate-pulse-slow"
        )}
      >
        <MapPin className={cn("w-8 h-8 mb-2", trackingState === 'idle' ? "text-white" : "text-nooraya-emergency-red")} />
        <span className="text-xl font-display font-semibold">
          {trackingState === 'idle' ? "Start Tracking" : "Stop Tracking"}
        </span>
        {trackingState === 'tracking' && (
          <span className="text-lg font-body mt-1 font-mono">{elapsedTime}</span>
        )}
      </button>

      {/* 4. Map section */}
      <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm border border-nooraya-soft-grey">
        <MapView 
          center={location ? [location.lat, location.lng] : undefined}
          routePoints={trackingState === 'tracking' ? trackingRoute : undefined} 
          markers={location ? [{lat: location.lat, lng: location.lng, color: 'gold'}] : []}
        />
      </div>

      {/* 5. Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-nooraya-soft-grey/50">
          <Users className="w-6 h-6 text-nooraya-antique-gold mb-1" />
          <span className="text-2xl font-display font-semibold text-nooraya-charcoal">{contactsCount}</span>
          <span className="text-xs text-nooraya-soft-grey font-body">Contacts</span>
        </div>
        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-nooraya-soft-grey/50">
          <Map className="w-6 h-6 text-nooraya-antique-gold mb-1" />
          <span className="text-2xl font-display font-semibold text-nooraya-charcoal">{savedRoutesCount}</span>
          <span className="text-xs text-nooraya-soft-grey font-body">Routes Saved</span>
        </div>
        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-nooraya-soft-grey/50">
          <Bell className="w-6 h-6 text-nooraya-antique-gold mb-1" />
          <span className="text-2xl font-display font-semibold text-nooraya-charcoal">{alertHistoryCount}</span>
          <span className="text-xs text-nooraya-soft-grey font-body">Alerts</span>
        </div>
      </div>
    </div>
  );
}
