import './globals.css';

import layoutMetadata from '@/core/crosscutting/seo/layout';

import { setupDependencies } from '../di';

setupDependencies();

export const metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}