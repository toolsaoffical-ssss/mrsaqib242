import { useEffect } from 'react';
import { recordVisitToDB } from '../lib/analyticsService';

export function AnalyticsTracker() {
  useEffect(() => {
    let mounted = true;

    // Run passive tracking on mount (once per session/pageview)
    const trackCurrentVisit = async () => {
      if (!mounted) return;
      try {
        await recordVisitToDB({
          path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/',
          event_type: 'page_view'
        });
      } catch (e) {
        console.warn('Analytics tracking error:', e);
      }
    };

    trackCurrentVisit();

    return () => {
      mounted = false;
    };
  }, []);

  return null; // Purely background logic
}
