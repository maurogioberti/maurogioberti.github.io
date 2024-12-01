import { setupDependencies } from "../di";
import layoutMetadata from "@/core/crosscutting/seo/layout";
import "./globals.css";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

setupDependencies();

export const metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
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