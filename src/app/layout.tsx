import { setupDependencies } from "../di";
import layoutMetadata from "@/core/crosscutting/seo/layout";
import "./globals.css";

setupDependencies();

export const metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}