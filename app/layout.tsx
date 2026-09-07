import type { Metadata } from 'next';
import './globals.css';
import { PageViewTracker } from '../components/analytics/PageViewTracker';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { BRAND } from '../lib/brand';

export const metadata: Metadata = {
  title: 'NoMeta — Remove hidden metadata from your photos',
  authors: [{ name: BRAND.owner }],
  creator: BRAND.owner,
  publisher: BRAND.owner,
  description:
    'Scan and remove hidden photo metadata locally in your browser. Find location, device, timestamp and other privacy-sensitive data before you share.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nometa.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NoMeta — Remove hidden metadata from your photos',
  authors: [{ name: BRAND.owner }],
  creator: BRAND.owner,
  publisher: BRAND.owner,
    description: 'Find hidden metadata. Remove it. Share safely.',
    type: 'website',
    url: '/',
    siteName: 'NoMeta',
  },
  twitter: {
    card: 'summary',
    title: 'NoMeta — Photo metadata cleaner',
    description: 'Scan and remove hidden photo metadata locally in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PageViewTracker /><ErrorBoundary>{children}</ErrorBoundary></body>
    </html>
  );
}
