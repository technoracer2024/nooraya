import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Send, MapPin, X } from 'lucide-react'

const MESSAGES = [
  { icon: '🚶', text: 'A person is following me' },
  { icon: '✅', text: "I have reached safely, don't worry" },
  { icon: '🚗', text: "I'm in a cab, sharing my location" },
  { icon: '🏠', text: "I'm leaving now, will update when I arrive" },
  { icon: '⚠️', text: 'I feel unsafe, please call me' },
  { icon: '📍', text: 'Sharing my current location' },
  { icon: '🆘', text: "I need help but can't call right now" },
  { icon: '🔋', text: 'My phone battery is low, sharing last location' },
]

export default function QuickAlertPage() {
  const { sendQuickAlert, location, setLocation, userProfile } = useStore()
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null)
  const [customMsg, setCustomMsg] = useState('')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: Date.now() }),
        (err) => console.error(err)
      )
    }
  }, [setLocation])

  const handleSend = (msg: string) => {
    sendQuickAlert(msg)
    setSelectedMsg(null)
    setCustomMsg('')
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const contactCount = userProfile?.trustedContacts.filter(c => c.active).length || 0

  return (
    <div className="p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display text-nooraya-charcoal mb-2">Quick Alert</h1>
          <p className="text-nooraya-soft-grey">Send a quick update to your trusted contacts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MESSAGES.map((msg, i) => (
            <button
              key={i}
              onClick={() => setSelectedMsg(msg.text)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-nooraya-champagne-gold hover:shadow-md transition-all text-left group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{msg.icon}</span>
              <span className="font-medium text-sm md:text-base">{msg.text}</span>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-display text-lg mb-4 text-nooraya-antique-gold">Custom Message</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your message..."
              className="input-nooraya flex-1"
              onKeyDown={(e) => e.key === 'Enter' && customMsg && handleSend(customMsg)}
            />
            <button
              onClick={() => customMsg && handleSend(customMsg)}
              disabled={!customMsg}
              className="btn-gold p-3 px-6 flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-nooraya-soft-grey mt-4 bg-nooraya-ivory p-3 rounded-lg border border-nooraya-champagne-gold/20">
            Prototype: In production, these alerts will be sent via SMS to your trusted contacts.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-nooraya-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-6 shadow-2xl animate-in">
            <div>
              <h3 className="font-display text-xl mb-4">Send this alert to your contacts?</h3>
              <p className="bg-nooraya-ivory p-4 rounded-xl border border-nooraya-champagne-gold/30 font-medium">
                &ldquo;{selectedMsg}&rdquo;
              </p>
            </div>
            
            {location && (
              <div className="flex items-center gap-2 text-sm text-nooraya-soft-grey bg-gray-50 p-3 rounded-xl">
                <MapPin size={16} className="text-nooraya-antique-gold flex-shrink-0" />
                <span>Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMsg(null)}
                className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSend(selectedMsg)}
                className="flex-1 py-3.5 rounded-xl btn-gold"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-nooraya-charcoal/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 slide-up z-50">
          <Send size={16} className="text-nooraya-champagne-gold" />
          <span className="font-medium text-sm">Prototype notification sent to {contactCount} contact{contactCount !== 1 ? 's' : ''}</span>
          <button onClick={() => setToast(false)} className="ml-2 hover:text-nooraya-champagne-gold transition-colors p-1">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
