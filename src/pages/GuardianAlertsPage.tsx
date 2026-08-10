import { useStore } from '../store/useStore';
import { AlertTriangle, Activity, ShieldAlert, ChevronDown, MapPin } from 'lucide-react';

export default function GuardianAlertsPage() {
  const { alertHistory, guardianUser } = useStore();

  return (
    <div className="min-h-screen bg-nooraya-charcoal text-nooraya-ivory pb-24 font-body">
      <header className="px-6 py-6 border-b border-white/5 bg-black/20 sticky top-0 z-50 backdrop-blur-md">
        <h1 className="text-2xl font-display text-nooraya-champagne-gold">Alerts History</h1>
        <p className="text-sm text-nooraya-soft-grey mt-1">Tracking for {guardianUser?.name}</p>
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {alertHistory.length === 0 ? (
          <div className="text-center py-12 text-nooraya-soft-grey">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts recorded for this user.</p>
          </div>
        ) : (
          alertHistory.map((alert) => (
            <div key={alert.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
              <div className="p-5 flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  {alert.type === 'sos' ? <AlertTriangle className="w-6 h-6 text-nooraya-emergency-red" /> : 
                   alert.type === 'quick_alert' ? <Activity className="w-6 h-6 text-nooraya-antique-gold" /> :
                   <ShieldAlert className="w-6 h-6 text-nooraya-antique-gold" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-lg">
                      {alert.type === 'sos' ? 'SOS Activated' :
                       alert.type === 'quick_alert' ? 'Quick Alert' : 'Missed Check-In'}
                    </h3>
                    <span className="text-xs text-nooraya-soft-grey whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-nooraya-soft-grey mt-1">{alert.message}</p>
                  
                  {alert.location && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-nooraya-champagne-gold">
                      <MapPin className="w-3 h-3" />
                      <span>Lat: {alert.location.lat.toFixed(4)}, Lng: {alert.location.lng.toFixed(4)}</span>
                    </div>
                  )}
                </div>
                <button className="text-nooraya-soft-grey hover:text-nooraya-ivory self-center">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
