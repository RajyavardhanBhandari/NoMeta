import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import './nometa-ux.css';
import './workflow-polish.css';
import { PageViewTracker } from '../components/analytics/PageViewTracker';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Footer } from '../components/ui/Footer';
import { SupportWidget } from '../components/ui/SupportWidget';
import { BRAND } from '../lib/brand';

export const metadata: Metadata = {
  title: { default: 'NoMeta | Remove hidden metadata from your photos', template: '%s | NoMeta' },
  description: 'Scan and remove hidden photo metadata locally in your browser. Find location, device, timestamp and other privacy-sensitive data before you share.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nometa.app'),
  authors: [{ name: BRAND.owner }],
  creator: BRAND.owner,
  publisher: BRAND.owner,
  alternates: { canonical: '/' },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/logo-mark.svg', type: 'image/svg+xml', sizes: 'any' }], shortcut: '/favicon.svg', apple: '/favicon.svg' },
  manifest: '/manifest.webmanifest',
  openGraph: { title: 'NoMeta | Remove hidden metadata from your photos', description: 'Find hidden metadata. Remove it. Share safely.', type: 'website', url: '/', siteName: 'NoMeta' },
  twitter: { card: 'summary', title: 'NoMeta | Photo metadata cleaner', description: 'Scan and remove hidden photo metadata locally in your browser.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><PageViewTracker /><ErrorBoundary>{children}</ErrorBoundary><SupportWidget /><Footer /></body></html>;
}
