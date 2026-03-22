import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', {
        description: 'You are back online',
        icon: <Wifi className="w-4 h-4" />,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('No internet connection', {
        description: 'Your saved content is still available offline',
        icon: <WifiOff className="w-4 h-4" />,
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 dark:bg-amber-700 text-white py-2 px-4 text-center text-sm md:left-64">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>Offline - Your saved content is still available</span>
      </div>
    </div>
  );
}
