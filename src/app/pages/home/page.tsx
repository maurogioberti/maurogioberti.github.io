import { Metadata } from "next";
import Image from "next/image";

import homeMetadata from "@/core/crosscutting/seo/home";

import { useHomeViewModel } from "./useHomeViewModel";

export const metadata: Metadata = {
  ...homeMetadata,
};

export default async function Home() {
  const { message } = await useHomeViewModel();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground font-sans p-10">
        <section className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start mb-8">
          <Image
            src="../assets/profile/maurogioberti-avatar.png"
            alt="Caricature of Mauro Gioberti"
            width={150}
            height={150}
            className="rounded-full"
          />
          <div className="sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left">
            <h1 className="text-3xl font-bold">Hi, I&apos;m Mauro Gioberti!</h1>
            <p className="text-lg">
              Software Engineer | .NET Mentor | Tech Interviewer
            </p>
          </div>
        </section>
        <h1 className="text-4xl font-bold text-vs-primary text-center mb-4">
          {message}
        </h1>
        <p className="text-lg text-center">
          This is a demonstration of an early version of my personal website.
        </p>
      </div>
    </>
  );
}
