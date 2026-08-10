import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard,
  ShieldAlert,
  MessageSquareWarning,
  Clock,
  Users,
  History,
  Settings,
  MessageCircle,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { guardianUser, userProfile, logout } = useStore();
  const isGuardian = guardianUser !== null;

  const userRoutes = [
    { name: 'Dashboard', path: '/user', icon: LayoutDashboard },
    { name: 'Emergency SOS', path: '/user/sos', icon: ShieldAlert },
    { name: 'Quick Alert', path: '/user/quick-alert', icon: MessageSquareWarning },
    { name: 'Safety Check-In', path: '/user/checkin', icon: Clock },
    { name: 'Contacts', path: '/user/contacts', icon: Users },
    { name: 'History', path: '/user/history', icon: History },
    { name: 'Settings', path: '/user/settings', icon: Settings },
  ];

  const guardianRoutes = [
    { name: 'Dashboard', path: '/guardian', icon: LayoutDashboard },
    { name: 'Active Alerts', path: '/guardian/alerts', icon: ShieldAlert },
    { name: 'Communication', path: '/guardian/communication', icon: MessageCircle },
    { name: 'History', path: '/guardian/history', icon: History },
  ];

  const routes = isGuardian ? guardianRoutes : userRoutes;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-nooraya-charcoal text-nooraya-warm-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-white/10 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <img src="/nooraya-hallmark-exact.png" alt="Nooraya" className="h-8" />
          <button onClick={onClose} className="md:hidden text-nooraya-soft-grey hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {routes.map((route) => {
            const isActive = location.pathname === route.path || (route.path !== '/user' && route.path !== '/guardian' && location.pathname.startsWith(route.path));
            const Icon = route.icon;

            return (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "text-nooraya-champagne-gold bg-white/5"
                    : "text-nooraya-soft-grey hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nooraya-champagne-gold rounded-r" />
                )}
                <Icon size={20} className="mr-3" />
                <span className="font-body text-sm tracking-wide">{route.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-nooraya-champagne-gold uppercase font-display">
              {isGuardian ? guardianUser.name[0] : userProfile?.name[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {isGuardian ? guardianUser.name : userProfile?.name || 'User'}
              </p>
              <p className="text-xs text-nooraya-soft-grey truncate">
                {isGuardian ? `Monitoring ${userProfile?.name || 'User'}` : 'Premium Safety'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-nooraya-soft-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
