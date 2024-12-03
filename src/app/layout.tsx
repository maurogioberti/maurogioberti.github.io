import './globals.css';

import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import layoutMetadata from '@/core/crosscutting/seo/layout';

import { buildDependencies } from '../di';

buildDependencies();

export const metadata = layoutMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
