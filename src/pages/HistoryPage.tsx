import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, Clock, MessageSquare, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export function HistoryPage() {
  const { alertHistory } = useStore();
  const [filter, setFilter] = useState<'all' | 'sos' | 'checkin_missed' | 'quick_alert' | 'route_overdue'>('all');

  const filteredHistory = filter === 'all' 
    ? alertHistory 
    : alertHistory.filter(alert => alert.type === filter);

  // Sort newest first
  const sortedHistory = [...filteredHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'sos': return <ShieldAlert className="w-5 h-5 text-nooraya-emergency-red" />;
      case 'checkin_missed': return <Clock className="w-5 h-5 text-green-600" />;
      case 'quick_alert': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'route_overdue': return <MapPin className="w-5 h-5 text-nooraya-antique-gold" />;
      default: return <ShieldAlert className="w-5 h-5 text-nooraya-charcoal" />;
    }
  };

  const getLabelForType = (type: string) => {
    switch (type) {
      case 'sos': return 'SOS Alert';
      case 'checkin_missed': return 'Check-In Missed';
      case 'quick_alert': return 'Quick Alert';
      case 'route_overdue': return 'Route Overdue';
      default: return 'Alert';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Active</span>;
      case 'resolved':
        return <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Resolved</span>;
      case 'test':
        return <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Test</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nooraya-warm-white pb-24 pt-6 px-4 font-body">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-display text-nooraya-charcoal">Alert History</h1>
        <div className="bg-nooraya-soft-grey/20 text-nooraya-charcoal/80 px-3 py-1 rounded-full text-sm font-medium">
          {alertHistory.length} total
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide">
        {[
          { id: 'all', label: 'All' },
          { id: 'sos', label: 'SOS' },
          { id: 'checkin_missed', label: 'Check-In' },
          { id: 'quick_alert', label: 'Quick Alert' },
          { id: 'route_overdue', label: 'Route' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filter === tab.id 
                ? "bg-nooraya-charcoal text-white border-nooraya-charcoal" 
                : "bg-white text-nooraya-charcoal/70 border-nooraya-soft-grey/30 hover:bg-nooraya-soft-grey/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-3">
        {/* Left connecting line */}
        <div className="absolute left-[21px] top-4 bottom-4 w-px bg-nooraya-soft-grey/30" />

        <div className="space-y-6 relative">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/50 rounded-2xl border border-dashed border-nooraya-soft-grey/40">
              <ShieldAlert className="w-10 h-10 text-nooraya-soft-grey mx-auto mb-3 opacity-50" />
              <p className="text-nooraya-charcoal/60 font-medium">No alerts yet.</p>
              <p className="text-sm text-nooraya-charcoal/50">Your safety history will appear here.</p>
            </div>
          ) : (
            sortedHistory.map((alert) => {
              const dateObj = new Date(alert.timestamp);
              
              return (
                <div key={alert.id} className="relative pl-10">
                  {/* Timeline node */}
                  <div className="absolute left-[-3px] top-5 w-7 h-7 rounded-full bg-nooraya-warm-white border-2 border-white shadow-sm flex items-center justify-center z-10">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      alert.type === 'sos' ? "bg-nooraya-emergency-red" :
                      alert.type === 'checkin_missed' ? "bg-green-500" :
                      alert.type === 'route_overdue' ? "bg-nooraya-antique-gold" : "bg-blue-500"
                    )} />
                  </div>

                  {/* Card */}
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-nooraya-soft-grey/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-nooraya-soft-grey/10 rounded-lg">
                          {getIconForType(alert.type)}
                        </div>
                        <div>
                          <h3 className="font-display font-medium text-nooraya-charcoal">
                            {getLabelForType(alert.type)}
                          </h3>
                          <p className="text-[11px] text-nooraya-charcoal/50 font-medium uppercase tracking-wider">
                            {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(alert.status)}
                    </div>
                    
                    {alert.message && (
                      <p className="text-sm text-nooraya-charcoal/80 mb-3 bg-nooraya-soft-grey/5 p-2.5 rounded-xl border border-nooraya-soft-grey/10">
                        "{alert.message}"
                      </p>
                    )}

                    {alert.location && (
                      <a 
                        href={`https://maps.google.com/?q=${alert.location.lat},${alert.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-nooraya-antique-gold hover:text-nooraya-champagne-gold transition-colors font-medium bg-nooraya-champagne-gold/10 px-3 py-1.5 rounded-lg"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        View Location
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
