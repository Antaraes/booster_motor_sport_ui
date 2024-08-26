import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from './provider';
import { CookiesProvider } from 'next-client-cookies/server';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E Commerce',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <Provider>{children}</Provider>
        </CookiesProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
