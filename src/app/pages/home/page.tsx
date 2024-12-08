import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import homeMetadata from '@/core/crosscutting/seo/home';

import { homeViewModel } from './homeViewModel';

export const metadata: Metadata = {
  ...homeMetadata,
};

export default async function HomePage() {
  const { message, profile } = await homeViewModel();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground font-sans p-10">
        <section className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start mb-8">
          <Image src="../assets/profile/maurogioberti-avatar.png" alt={`Avatar of ${profile?.fullname}`} width={150} height={150} className="rounded-full" />
          <div className="sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left">
            <h1 className="text-3xl font-bold">Hi, I&apos;m {profile?.fullname}!</h1>
            <p className="text-lg">
              {profile?.position} {profile?.additionalPositions && `| ${profile?.additionalPositions.join(" | ")}`}
            </p>
          </div>
        </section>
        <h1 className="text-4xl font-bold text-vs-primary text-center mb-4">{message}</h1>
        <div className="mt-6 text-lg text-center">
          <p>➡️{" "} <Link href="/pages/resume" className="text-blue-500 underline">Resume:</Link> {" "} Dive into my professional journey.</p>
          <p>➡️{" "} <Link href="/pages/services" className="text-blue-500 underline"> Services:</Link> {" "} Explore the ways I can help your business grow.</p>
          <p>➡️{" "} <Link href="/pages/blog" className="text-blue-500 underline">Blog:</Link> {" "} Check out my latest thoughts on software engineering and beyond.</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/pages/contact" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center">
              📧 Contact Me!
            </Link>
            <Link href={`${profile.linkedinUrl}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center">
              👨‍💻 Let&apos;s Connect!
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="font-bold text-vs-foreground/70 text-sm">🔎 Feeling Curious? 😍</p>
          <p className="text-lg text-vs-foreground/70 text-sm">Dive into the source 📂 straight from the ❤️ of my code!</p>
          <p className="text-lg font-semibold">
            <Link
              href="https://github.com/maurogioberti/maurogioberti.github.io" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200 flex items-center justify-center" aria-label="Discover the source code of this website on GitHub">
              <span className="mr-2">Discover the magic inside</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.388.6.113.793-.26.793-.577v-2.2c-3.338.725-4.037-1.61-4.037-1.61-.547-1.388-1.334-1.757-1.334-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.24 1.838 1.24 1.07 1.834 2.809 1.305 3.495.997.11-.775.419-1.305.763-1.605-2.665-.303-5.467-1.332-5.467-5.931 0-1.31.468-2.381 1.235-3.221-.123-.303-.534-1.523.118-3.176 0 0 1.007-.322 3.3 1.233.96-.267 1.99-.4 3.013-.405 1.024.005 2.053.138 3.013.405 2.292-1.556 3.3-1.233 3.3-1.233.652 1.653.241 2.873.118 3.176.768.84 1.234 1.911 1.234 3.221 0 4.61-2.807 5.624-5.479 5.922.43.373.812 1.103.812 2.222v3.293c0 .32.19.694.8.576C20.565 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}