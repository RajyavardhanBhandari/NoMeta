import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoMeta — Remove hidden metadata from your photos',
  description:
    'Scan and remove hidden photo metadata locally in your browser. Find location, device, timestamp and other privacy-sensitive data before you share.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nometa.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NoMeta — Remove hidden metadata from your photos',
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
      <body>{children}</body>
    </html>
  );
}
