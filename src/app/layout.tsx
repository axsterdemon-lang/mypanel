import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'FirePanels — Free Fire Panels for Android, iOS & PC',
  description: 'Buy verified Free Fire game panels for Android, iOS, and PC. Instant delivery, secure payments, and competitive prices for every player.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
