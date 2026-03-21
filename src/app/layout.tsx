import './globals.css';

import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import { PageLoadProgress } from '@/app/components/PageLoadProgress';
import { extensionHydrationCleanupScript, themeInitScript } from '@/app/components/theme/theme';
import layoutMetadata from '@/core/crosscutting/seo/layout';

import { setupDependencies } from '../di';

setupDependencies();

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="extension-hydration-cleanup"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: extensionHydrationCleanupScript }}
        />
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <PageLoadProgress />
        </Suspense>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}