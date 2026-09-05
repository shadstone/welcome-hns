import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://welcome.host.limo'),
  title: 'welcome/ — Your doorway to the Handshake web',
  description: 'A friendly, health-checked directory of useful Handshake-native websites.',
  openGraph: {
    title: 'welcome/ — Where would you like to go?',
    description: 'Your friendly doorway to the Handshake web.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'welcome/ — Where would you like to go?',
    description: 'Your friendly doorway to the Handshake web.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
