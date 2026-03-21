import './globals.css';

import { PageLoadProgress } from '@/app/components/PageLoadProgress';
import { themeInitScript } from '@/app/components/theme/theme';
import layoutMetadata from '@/core/crosscutting/seo/layout';
import { Suspense } from 'react';

import { setupDependencies } from '../di';

setupDependencies();

export const metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <PageLoadProgress />
        </Suspense>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
