import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { recordVisitToDB } from '../lib/analyticsService';

export function AnalyticsTracker() {
  const router = useRouter();
  const lastTrackedPathRef = useRef<string>('');
  const lastTrackedTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      // Don't track admin panel visits so admin's own traffic doesn't distort real visitor analytics
      if (url.startsWith('/mradmin') || url.startsWith('/admin')) {
        return;
      }

      const now = Date.now();
      // Debounce: Avoid re-recording exact same path within 10 seconds (e.g. fast clicks or re-renders)
      if (lastTrackedPathRef.current === url && now - lastTrackedTimeRef.current < 10000) {
        return;
      }

      lastTrackedPathRef.current = url;
      lastTrackedTimeRef.current = now;

      try {
        await recordVisitToDB({
          path: url || '/',
          event_type: 'page_view'
        });
      } catch (e) {
        console.warn('Analytics tracking error:', e);
      }
    };

    // Track initial page load
    if (router.isReady) {
      handleRouteChange(router.asPath || '/');
    }

    // Track client-side route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.isReady, router.asPath, router.events]);

  return null; // Background observer component
}
