import { Metadata } from 'next';
import Image from 'next/image';

import homeMetadata from '@/core/crosscutting/seo/home';

import { useHomeViewModel } from './useHomeViewModel';

export const metadata: Metadata = {
  ...homeMetadata,
};

export default async function Home() {
  const { message } = await useHomeViewModel();

  return (
    <>
      <section className="flex items-center">
        <Image
          src="../assets/profile/maurogioberti-avatar.png"
          alt="Caricature of Mauro Gioberti"
          width={150}
          height={150}
          className="rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">Hi, I&apos;m Mauro Gioberti!</h1>
          <p>Software Engineer | .NET Mentor | Tech Interviewer</p>
        </div>
      </section>
      <div className="grid min-h-screen items-center justify-center bg-vs-background text-vs-foreground font-sans p-10">
        <h1 className="text-4xl font-bold text-vs-primary">{message}</h1>
        <p className="mt-4 text-vs-foreground">
          This is a demonstration of an early version of my personal website.
        </p>
      </div>
    </>
  );
}