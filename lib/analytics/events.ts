export type AnalyticsEventName =
  | 'page_view'
  | 'cleaning_started'
  | 'cleaning_complete'
  | 'payment_initiated'
  | 'payment_complete'
  | 'sign_up'
  | 'sign_in'
  | 'sign_out';

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;
