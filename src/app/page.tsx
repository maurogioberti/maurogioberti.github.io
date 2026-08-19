import { Metadata } from "next";
import Link from "next/link";

import homeMetadata from "@/core/crosscutting/seo/home";

const DESTINATION = "/pages/home";

export const metadata: Metadata = {
  ...homeMetadata,
  alternates: {
    canonical: DESTINATION,
  },
};

/**
 * The site root forwards to the portfolio home.
 *
 * `redirect()` cannot be used here: with `output: "export"` there is no server
 * to answer with a 307, so Next prerenders the route as an error shell whose
 * body is empty until the framework bundle boots. Crawlers, link previewers and
 * anyone without JavaScript would see nothing at all.
 *
 * A meta refresh forwards without a server, and the markup below is real content
 * for whoever reads the document before that happens.
 */
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${DESTINATION}`} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground font-sans px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Mauro Gioberti</h1>
        <p className="mt-2 text-lg">Tech Lead | AI Architect | Mentor</p>
        <p className="mt-6 text-lg">
          <Link href={DESTINATION} className="text-vs-primary underline hover:text-vs-primary-light">
            Continue to the portfolio
          </Link>
        </p>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-4 text-lg" aria-label="Sections">
          <Link href="/pages/resume" className="text-vs-primary hover:text-vs-primary-light">Resume</Link>
          <Link href="/pages/services" className="text-vs-primary hover:text-vs-primary-light">Services</Link>
          <Link href="/pages/talks" className="text-vs-primary hover:text-vs-primary-light">Talks</Link>
          <Link href="/pages/blog" className="text-vs-primary hover:text-vs-primary-light">Blog</Link>
        </nav>
      </div>
    </>
  );
}
