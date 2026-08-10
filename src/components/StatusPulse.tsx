import { cn } from '../lib/utils';

interface StatusPulseProps {
  status: 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusPulse({ status, size = 'md' }: StatusPulseProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-nooraya-emergency-red',
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
          colorClasses[status]
        )}
      ></span>
      <span
        className={cn(
          "relative inline-flex rounded-full",
          sizeClasses[size],
          colorClasses[status]
        )}
      ></span>
    </div>
  );
}
