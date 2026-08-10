import { useStore } from '../store/useStore';
import { MessageSquare, Phone, Send, Volume2, ShieldAlert } from 'lucide-react';

export default function GuardianCommunicationPage() {
  const { guardianUser, latestMessage, latestMessageTimestamp, lastQuickAlert, contextRecordingAvailable } = useStore();

  return (
    <div className="min-h-screen bg-nooraya-charcoal text-nooraya-ivory pb-24 font-body">
      <header className="px-6 py-6 border-b border-white/5 bg-black/20 sticky top-0 z-50 backdrop-blur-md">
        <h1 className="text-2xl font-display text-nooraya-champagne-gold">Communication</h1>
        <p className="text-sm text-nooraya-soft-grey mt-1">Connect with {guardianUser?.name}</p>
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <a href={`tel:${guardianUser?.phone}`} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors gap-3">
            <div className="w-12 h-12 rounded-full bg-nooraya-champagne-gold/20 flex items-center justify-center text-nooraya-champagne-gold">
              <Phone className="w-6 h-6" />
            </div>
            <span className="font-medium">Call User</span>
          </a>
          <button className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors gap-3">
            <div className="w-12 h-12 rounded-full bg-nooraya-antique-gold/20 flex items-center justify-center text-nooraya-antique-gold">
              <Send className="w-6 h-6" />
            </div>
            <span className="font-medium">Send SMS</span>
          </button>
        </div>

        {/* Latest Communications */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-display text-nooraya-champagne-gold">Recent Messages</h2>

          {latestMessage && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 relative">
              <div className="absolute top-5 right-5 text-nooraya-soft-grey">
                <MessageSquare className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-xs text-nooraya-soft-grey mb-2">
                Tap Message • {latestMessageTimestamp ? new Date(latestMessageTimestamp).toLocaleTimeString() : 'Just now'}
              </p>
              <p className="text-nooraya-ivory text-lg">{latestMessage}</p>
            </div>
          )}

          {lastQuickAlert && (
            <div className="bg-nooraya-antique-gold/10 border border-nooraya-antique-gold/30 rounded-3xl p-5 relative">
              <div className="absolute top-5 right-5 text-nooraya-antique-gold">
                <ShieldAlert className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-xs text-nooraya-soft-grey mb-2">
                Quick Alert • {new Date(lastQuickAlert.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-nooraya-ivory text-lg">{lastQuickAlert.message}</p>
            </div>
          )}

          {!latestMessage && !lastQuickAlert && (
             <div className="text-center py-12 text-nooraya-soft-grey border border-dashed border-white/10 rounded-3xl">
                <p>No recent messages from {guardianUser?.name}</p>
             </div>
          )}
        </div>

        {/* Context Audio */}
        {contextRecordingAvailable && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-display text-nooraya-champagne-gold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" /> Context Audio
            </h2>
            <p className="text-sm text-nooraya-soft-grey mb-4">
              Ambient audio recorded during the recent alert sequence is available for playback.
            </p>
            <button className="w-full py-3 bg-nooraya-antique-gold/20 text-nooraya-antique-gold rounded-xl font-medium border border-nooraya-antique-gold/50 flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5" /> Play Latest Recording
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
