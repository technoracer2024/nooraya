import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { GlobalSOSButton } from './GlobalSOSButton';
import { useStore } from '../store/useStore';
import { StatusPulse } from './StatusPulse';

interface LayoutProps {
  children: React.ReactNode;
  mode: 'user' | 'guardian';
}

export function Layout({ children, mode }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { alertLevel } = useStore();

  const getStatusColor = () => {
    switch (alertLevel) {
      case 'red': return 'red';
      case 'yellow': return 'yellow';
      default: return 'green';
    }
  };

  const getStatusText = () => {
    switch (alertLevel) {
      case 'red': return 'Emergency Active';
      case 'yellow': return 'Caution';
      default: return 'Protected';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-nooraya-charcoal font-body flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-nooraya-antique-gold/20 h-16 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-2 md:hidden text-nooraya-charcoal hover:bg-nooraya-soft-grey/20 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
            <img src="/nooraya-wordmark-exact.png" alt="Nooraya" className="h-5 hidden md:block" />
            <img src="/nooraya-hallmark-exact.png" alt="Nooraya" className="h-6 md:hidden" />
          </div>

          <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-black/5">
            <StatusPulse status={getStatusColor()} size="sm" />
            <span className="ml-2 text-xs font-medium text-nooraya-charcoal">{getStatusText()}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

        {mode === 'user' && <GlobalSOSButton />}
      </div>
    </div>
  );
}
