import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { User, Shield, Watch, LogOut, Trash2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsPage() {
  const { userProfile, updateProfile, logout } = useStore();
  
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const [routeTracking, setRouteTracking] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [vibration, setVibration] = useState(true);

  useEffect(() => {
    const settings = localStorage.getItem('nooraya-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        setRouteTracking(parsed.routeTracking ?? true);
        setNightMode(parsed.nightMode ?? false);
        setVibration(parsed.vibration ?? true);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const savePreferences = (key: string, value: boolean) => {
    const current = { routeTracking, nightMode, vibration, [key]: value };
    localStorage.setItem('nooraya-settings', JSON.stringify(current));
  };

  const handleSaveProfile = () => {
    updateProfile({ name, email, phone });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
      localStorage.clear();
      logout();
      window.location.href = '/';
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative",
        checked ? "bg-nooraya-antique-gold" : "bg-nooraya-soft-grey"
      )}
    >
      <div className={cn(
        "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
        checked ? "translate-x-6.5 left-0.5" : "translate-x-0.5"
      )} style={{ transform: checked ? 'translateX(26px)' : 'translateX(2px)' }} />
    </button>
  );

  return (
    <div className="min-h-screen bg-nooraya-warm-white pb-20 pt-6 px-4 font-body">
      <header className="mb-6">
        <h1 className="text-2xl font-display text-nooraya-charcoal">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-nooraya-soft-grey/20">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-nooraya-antique-gold" />
            <h2 className="font-display text-lg font-medium text-nooraya-charcoal">Profile</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-nooraya-charcoal/60 ml-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-nooraya-antique-gold"
              />
            </div>
            <div>
              <label className="text-xs text-nooraya-charcoal/60 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-nooraya-antique-gold"
              />
            </div>
            <div>
              <label className="text-xs text-nooraya-charcoal/60 ml-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-nooraya-antique-gold"
              />
            </div>
            
            <button
              onClick={handleSaveProfile}
              className="w-full bg-nooraya-charcoal text-white rounded-xl py-2.5 text-sm font-medium hover:bg-nooraya-charcoal/90 transition-colors shadow-md mt-2 flex justify-center items-center gap-2"
            >
              {savedMessage ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Safety Preferences Section */}
        <section className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-nooraya-soft-grey/20">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-nooraya-antique-gold" />
            <h2 className="font-display text-lg font-medium text-nooraya-charcoal">Safety Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nooraya-charcoal">Route Tracking Alerts</p>
                <p className="text-xs text-nooraya-charcoal/60">Notify contacts on deviation</p>
              </div>
              <Toggle 
                checked={routeTracking} 
                onChange={(v) => { setRouteTracking(v); savePreferences('routeTracking', v); }} 
              />
            </div>
            <div className="h-px w-full bg-nooraya-soft-grey/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nooraya-charcoal">Night Mode</p>
                <p className="text-xs text-nooraya-charcoal/60">Faster SOS triggering</p>
              </div>
              <Toggle 
                checked={nightMode} 
                onChange={(v) => { setNightMode(v); savePreferences('nightMode', v); }} 
              />
            </div>
            <div className="h-px w-full bg-nooraya-soft-grey/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nooraya-charcoal">Vibration Feedback</p>
                <p className="text-xs text-nooraya-charcoal/60">Haptic confirmation for alerts</p>
              </div>
              <Toggle 
                checked={vibration} 
                onChange={(v) => { setVibration(v); savePreferences('vibration', v); }} 
              />
            </div>
          </div>
        </section>

        {/* Bracelet Section */}
        <section className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-nooraya-soft-grey/20">
          <div className="flex items-center gap-2 mb-3">
            <Watch className="w-5 h-5 text-nooraya-antique-gold" />
            <h2 className="font-display text-lg font-medium text-nooraya-charcoal">Bracelet</h2>
          </div>
          
          <div className="bg-nooraya-soft-grey/10 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-nooraya-charcoal mb-1">Not Connected (MVP Simulation)</p>
            <p className="text-xs text-nooraya-charcoal/60">
              When your Nooraya bracelet is paired, it will appear here.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="px-2 text-center text-nooraya-charcoal/50 text-xs">
          <p className="font-display font-medium text-nooraya-antique-gold mb-1 text-sm">Safe in Silence</p>
          <p>Nooraya MVP v1.0</p>
        </section>

        {/* Danger Zone */}
        <section className="space-y-3 pt-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-white/80 border border-nooraya-emergency-red/30 text-nooraya-emergency-red rounded-xl py-3 text-sm font-medium hover:bg-red-50 transition-colors flex justify-center items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
          
          <button 
            onClick={handleClearData}
            className="w-full text-nooraya-charcoal/50 hover:text-nooraya-emergency-red rounded-xl py-2 text-xs font-medium transition-colors flex justify-center items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Data
          </button>
        </section>
      </div>
    </div>
  );
}
