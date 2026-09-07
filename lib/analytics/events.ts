export const ANALYTICS_EVENTS = [
  'page_view',
  'upload_started',
  'scan_completed',
  'cleaning_started',
  'cleaning_completed',
  'cleaning_failed',
  'download_clicked',
  'pricing_viewed',
  'checkout_started',
  'payment_verified',
  'payment_failed',
  'founder_nation_clicked',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProperties = Record<string, string | number | boolean | null>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  path?: string;
  properties?: AnalyticsProperties;
}

const BLOCKED_PROPERTY_NAMES = new Set([
  'file', 'filename', 'file_name', 'image', 'image_data', 'image_url', 'thumbnail',
  'metadata', 'exif', 'gps', 'latitude', 'longitude', 'location', 'device',
  'model', 'serial', 'email', 'name', 'phone', 'address', 'ip', 'user_id', 'session_id',
]);

export function sanitizeAnalyticsProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) => !BLOCKED_PROPERTY_NAMES.has(key.toLowerCase())),
  );
}
