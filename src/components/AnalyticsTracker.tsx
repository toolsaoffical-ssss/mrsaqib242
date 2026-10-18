import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { recordVisitToDB, isBotUser } from '../lib/analyticsService';

export function AnalyticsTracker() {
  const router = useRouter();
  const lastTrackedPathRef = useRef<string>('');
  const lastTrackedTimeRef = useRef<number>(0);

  useEffect(() => {
    // 0. Skip tracking completely if the client is an automated crawler, bot, or headless browser
    if (isBotUser()) {
      return;
    }

    const handleRouteChange = (url: string) => {
      // Don't track admin panel visits so admin's own traffic doesn't distort real visitor analytics
      if (
        url.startsWith('/mradmin') ||
        url.startsWith('/admin') ||
        url.startsWith('/yourareadmin') ||
        url.startsWith('/api')
      ) {
        return;
      }

      const now = Date.now();
      // Debounce: Avoid re-recording exact same path within 60 seconds (prevents rapid re-renders or tab switches from hitting the API)
      if (lastTrackedPathRef.current === url && now - lastTrackedTimeRef.current < 60000) {
        return;
      }

      lastTrackedPathRef.current = url;
      lastTrackedTimeRef.current = now;

      // Defer analytics dispatch to browser idle time to ensure 0% impact on main UI thread & page load
      const dispatchAnalytics = () => {
        recordVisitToDB({
          path: url || '/',
          event_type: 'page_view'
        }).catch(() => {
          // Silent catch to prevent any client runtime errors
        });
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(dispatchAnalytics, { timeout: 2000 });
      } else {
        setTimeout(dispatchAnalytics, 300);
      }
    };

    // Track initial page load once router is ready
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
