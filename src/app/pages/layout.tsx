import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}