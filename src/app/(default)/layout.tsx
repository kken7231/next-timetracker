import type { Metadata } from 'next';

import '@/app/globals.css';
import Header from '@/app/components/Header';
import { Inter, Roboto_Mono } from 'next/font/google';
import { AuthProvider } from '@/app/context/AuthProvider';
import { PagingProvider } from '@/app/context/PagingProvider';
import { NextUIProvider } from '@nextui-org/react';
import { SpacesProvider } from '../context/SpacesProvider';

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Next.js on Firebase App Hosting',
  description: '',
};

// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>{/* eslint-disable-next-line @next/next/no-page-custom-font */}</head>
      <body>
        <NextUIProvider>
          <AuthProvider>
            <PagingProvider>
              <SpacesProvider>
                <Header />
                {children}
              </SpacesProvider>
            </PagingProvider>
          </AuthProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
