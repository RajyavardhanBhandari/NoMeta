import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'NoMeta — Privacy-first image cleaning', template: '%s | NoMeta' },
  description: 'Remove EXIF and metadata from your photos before you share them. Free daily allowance, no sign-up required for one clean per day.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nometa.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
