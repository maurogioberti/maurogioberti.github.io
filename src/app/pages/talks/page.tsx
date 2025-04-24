import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import talkMetadata from '@/core/crosscutting/seo/talks';
import { formatDate } from '@/core/crosscutting/utils/date';
import { PRESENTATION_STATUS } from '@/core/domain/model/Presentation';

import { talksViewModel } from './talksViewModel';

export const metadata: Metadata = {
  ...talkMetadata,
};

export default async function TalkPage() {
  const { talks } = await talksViewModel();
  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = 200;

  return (
    <div className="min-h-screen p-6 bg-vs-background text-vs-foreground font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-vs-primary mb-4">📝 Talks & Presentations</h1>
        <p className="text-lg">Discover talks on software engineering, best practices, and Clean Architecture.</p>
      </header>

      <section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {talks.map((talk) => (
            <div
              key={talk.id}
              className={`group relative bg-vs-background-light rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1
                ${talk.status === PRESENTATION_STATUS.UPCOMING || talk.status === PRESENTATION_STATUS.ONGOING ? "shadow-lg hover:shadow-xl border-2 border-vs-primary" : "shadow-md hover:shadow-lg border border-vs-foreground/10"}`}>
              <div className="absolute top-4 right-4 z-10">
                {talk.status === PRESENTATION_STATUS.ONGOING && (
                  <span className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md animate-pulse">Today! 🔴</span>
                )}
                {talk.status === PRESENTATION_STATUS.UPCOMING && (
                  <span className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md animate-pulse">Upcoming 🗓️</span>
                )}
                {talk.status === PRESENTATION_STATUS.PAST && (
                  <span className="bg-gray-600 text-white text-xs font-medium py-1 px-3 rounded-full">Past Event</span>
                )}
              </div>

              <Link href={`/pages/talks/${talk.slug}/${talk.sponsorSlug}`} className="block">
                <div className="relative">
                  <Image
                    src={`${talk.imageUrl}`}
                    alt={`Event image for ${talk.title}`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className={`w-full object-cover ${talk.status === PRESENTATION_STATUS.PAST ? "h-48 opacity-90" : "h-52"}`}
                    priority={talk.status !== PRESENTATION_STATUS.PAST}
                  />
                  <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{talk.sponsor}</span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-200 text-gray-800 dark:bg-gray-100/70 dark:text-vs-background-dark text-xs font-medium py-1 px-2 rounded">{formatDate(talk.date)}</span>
                      <span className="bg-orange-500 text-vs-background-dark text-xs font-medium py-1 px-2 rounded">{talk.type}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-vs-foreground group-hover:text-vs-primary transition-colors duration-300">{talk.title}</h2>
                  <p className="text-sm text-vs-foreground/70 mt-2">
                    <span className="font-medium">Where:</span> {talk.place}
                    {talk.location ? ` - ${talk.location}` : ""}
                  </p>
                  <p className="text-sm text-vs-foreground/80 mt-3 line-clamp-2">{talk.description}</p>

                  {talk.status === PRESENTATION_STATUS.PAST && (
                    <div className="flex justify-between items-center mt-4">
                      {talk.videoUrl && (
                        <span className="text-green-500 text-xs font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3.586l2.707-2.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Recording Available
                        </span>
                      )}

                      {talk.slidesUrl && (
                        <span className="text-blue-500 text-xs font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-3.535-4.419 3.535A1 1 0 014 16V4zm2-1h8a1 1 0 011 1v10.69l-3.419-2.735a1 1 0 00-1.162 0L7 14.69V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Slides Available
                        </span>
                      )}
                    </div>
                  )}

                  {talk.tags && talk.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {talk.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs py-0.5 px-2 rounded ${
                            talk.status === PRESENTATION_STATUS.PAST ? "bg-gray-200 text-gray-700" : "bg-blue-600/80 text-white font-semibold shadow"
                          }`}>
                          {tag}
                        </span>
                      ))}
                      {talk.tags.length > 3 && (
                        <span className={`text-xs py-0.5 px-2 rounded ${
                            talk.status === PRESENTATION_STATUS.PAST ? "bg-gray-200 text-gray-700" : "bg-blue-600/80 text-white font-semibold shadow"}`}>
                          +{talk.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex justify-between items-center">
                    <strong className="text-vs-primary text-sm font-semibold hover:underline flex items-center">
                      View Details <span className="ml-1">→</span>
                    </strong>
                    {talk.status === PRESENTATION_STATUS.ONGOING && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Live now!</span>}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}