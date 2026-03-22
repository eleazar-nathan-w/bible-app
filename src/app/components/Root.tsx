import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { OfflineIndicator } from './OfflineIndicator';
import { WelcomeDialog } from './WelcomeDialog';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './ui/sonner';
import { useEffect } from 'react';

export function Root() {
  useEffect(() => {
    // Register service worker for offline functionality (mock implementation)
    if ('serviceWorker' in navigator) {
      // In a real app, this would register a service worker for offline caching
      console.log('Service worker support detected - offline mode available');
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <OfflineIndicator />
        <WelcomeDialog />
        <Outlet />
        <BottomNav />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}