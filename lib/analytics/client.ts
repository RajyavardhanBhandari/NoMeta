import type { AnalyticsEventName, AnalyticsProperties } from './events';

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsProperties) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({ name, path: window.location.pathname, properties });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
    return;
  }
  void fetch('/api/analytics', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true,
  }).catch(() => undefined);
}
