import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { Bell, MapPin, Mic, ShieldCheck, Activity, PhoneOff, ArrowRight } from 'lucide-react';
import VirtualBraceletTrigger from '../components/VirtualBraceletTrigger';

export default function EmergencySOSPage() {
  const navigate = useNavigate();
  const {
    sosState,
    activateSOS,
    cancelSOS,
    resolveSOS,
    sendTapMessage,
    setContextRecording,
    setLocation
  } = useStore();

  const [countdown, setCountdown] = useState(15);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (sosState === 'countdown') {
      // Vibration simulation
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      const timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.clearInterval(timer);
            activateSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => window.clearInterval(timer);
    }
  }, [sosState, activateSOS]);

  useEffect(() => {
    if (sosState === 'active') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,

            timestamp: position.timestamp,
          });
        });
      }
    }
  }, [sosState, setLocation]);

  const handleSimulateRecording = () => {
    setIsRecording(true);
    setContextRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setContextRecording(false);
    }, 5000);
  };

  const handleResolve = () => {
    resolveSOS();
  };

  const handleReturnToDashboard = () => {
    cancelSOS();
    navigate('/user');
  };

  if (sosState === 'countdown') {
    return (
      <div className="min-h-screen bg-nooraya-charcoal text-white flex flex-col items-center justify-center p-6 space-y-12">
        <h1 className="text-4xl font-display font-bold text-nooraya-emergency-red text-center">
          SOS ACTIVATION
        </h1>
        
        <div className="relative flex items-center justify-center w-64 h-64">
          <div className="absolute inset-0 border-8 border-nooraya-champagne-gold rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 border-4 border-nooraya-champagne-gold rounded-full animate-pulse"></div>
          <span className="text-8xl font-display font-bold text-white z-10">{countdown}</span>
        </div>
        
        <p className="text-xl font-body text-center text-nooraya-soft-grey">
          Alert will be sent in {countdown} seconds
        </p>

        <div className="w-full max-w-md space-y-4 flex flex-col">
          <button 
            onClick={activateSOS}
            className="w-full py-4 rounded-xl bg-nooraya-emergency-red text-white font-display font-bold text-xl shadow-lg"
          >
            Send Immediately
          </button>
          <button 
            onClick={cancelSOS}
            className="w-full py-4 rounded-xl bg-transparent border-2 border-nooraya-soft-grey text-white font-display font-bold text-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (sosState === 'active') {
    return (
      <div className="min-h-screen bg-nooraya-emergency-red flex flex-col p-6 space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col items-center mt-8 space-y-4 text-white">
          <Bell className="w-16 h-16 animate-bounce" />
          <h1 className="text-4xl font-display font-bold text-center uppercase tracking-widest">
            Emergency Active
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-display font-semibold text-lg">Location Shared</p>
            <p className="text-white/80 font-body text-sm">Live tracking is on for trusted contacts</p>
          </div>
        </div>

        <button 
          onClick={handleSimulateRecording}
          disabled={isRecording}
          className={cn(
            "w-full py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all",
            isRecording 
              ? "bg-white/30 text-white cursor-wait" 
              : "bg-nooraya-charcoal text-white hover:bg-nooraya-charcoal/90"
          )}
        >
          <Mic className={cn("w-6 h-6", isRecording && "animate-pulse text-nooraya-emergency-red")} />
          <span className="font-display font-semibold text-lg">
            {isRecording ? "Recording Audio Context (5s)..." : "Record Audio Context"}
          </span>
        </button>

        <div className="flex-1 bg-white rounded-t-3xl -mx-6 -mb-6 p-6 mt-8 flex flex-col">
          <h2 className="text-2xl font-display font-semibold text-nooraya-charcoal mb-4">Silent Tap Communication</h2>
          <div className="space-y-3 flex-1">
            <button 
              onClick={() => sendTapMessage('I cannot talk')}
              className="w-full py-4 px-4 bg-nooraya-warm-white border border-nooraya-soft-grey/30 rounded-xl flex items-center space-x-4 active:bg-nooraya-soft-grey/20"
            >
              <div className="bg-nooraya-charcoal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <span className="font-body text-nooraya-charcoal font-medium text-lg flex-1 text-left">I cannot talk</span>
              <PhoneOff className="w-5 h-5 text-nooraya-soft-grey" />
            </button>
            <button 
              onClick={() => sendTapMessage('I am moving')}
              className="w-full py-4 px-4 bg-nooraya-warm-white border border-nooraya-soft-grey/30 rounded-xl flex items-center space-x-4 active:bg-nooraya-soft-grey/20"
            >
              <div className="bg-nooraya-charcoal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <span className="font-body text-nooraya-charcoal font-medium text-lg flex-1 text-left">I am moving</span>
              <Activity className="w-5 h-5 text-nooraya-soft-grey" />
            </button>
            <button 
              onClick={() => sendTapMessage('I need medical help')}
              className="w-full py-4 px-4 bg-nooraya-warm-white border border-nooraya-soft-grey/30 rounded-xl flex items-center space-x-4 active:bg-nooraya-soft-grey/20"
            >
              <div className="bg-nooraya-charcoal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <span className="font-body text-nooraya-charcoal font-medium text-lg flex-1 text-left">I need medical help</span>
              <Activity className="w-5 h-5 text-nooraya-emergency-red" />
            </button>
          </div>
          
          <button 
            onClick={handleResolve}
            className="w-full py-4 mt-6 bg-nooraya-charcoal text-white rounded-xl font-display font-semibold text-lg flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-6 h-6 text-green-400" />
            <span>Resolve Emergency</span>
          </button>
        </div>
      </div>
    );
  }

  if (sosState === 'resolved') {
    return (
      <div className="min-h-screen bg-nooraya-warm-white flex flex-col items-center justify-center p-6 space-y-8">
        <div className="bg-green-100 p-6 rounded-full">
          <ShieldCheck className="w-20 h-20 text-green-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-nooraya-charcoal text-center">
          Emergency Resolved
        </h1>
        <p className="text-center font-body text-nooraya-soft-grey">
          Your emergency contacts have been notified that you are safe.
        </p>
        <button 
          onClick={handleReturnToDashboard}
          className="w-full max-w-sm py-4 bg-gradient-to-r from-nooraya-champagne-gold to-nooraya-antique-gold text-white rounded-xl font-display font-semibold text-lg flex items-center justify-center space-x-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Idle state
  return (
    <div className="min-h-screen bg-nooraya-warm-white flex flex-col items-center p-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <VirtualBraceletTrigger />
        
        <div className="mt-8 flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-body text-sm font-medium">Connected - Simulated</span>
        </div>
      </div>
      
      <div className="w-full mt-12 space-y-4">
        <h3 className="font-display font-semibold text-nooraya-charcoal text-lg">Safety Tips</h3>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-nooraya-soft-grey/30">
          <p className="font-body text-sm text-nooraya-soft-grey">
            Double tap your bracelet or the button above to quickly trigger an SOS alert.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-nooraya-soft-grey/30">
          <p className="font-body text-sm text-nooraya-soft-grey">
            Ensure your phone's Bluetooth is turned on to stay connected to your jewellery.
          </p>
        </div>
      </div>
    </div>
  );
}
