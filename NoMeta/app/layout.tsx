import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoMeta — Remove hidden metadata from your photos',
  description:
    'Scan and remove hidden photo metadata locally in your browser. Find location, device, timestamp and other privacy-sensitive data before you share.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
