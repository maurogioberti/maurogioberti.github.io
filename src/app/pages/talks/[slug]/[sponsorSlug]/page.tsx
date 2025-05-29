import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TalkMetadata } from '@/core/crosscutting/seo/talk';
import { formatDate } from '@/core/crosscutting/utils/date';
import { PRESENTATION_STATUS, PRESENTATION_TYPE } from '@/core/domain/model/Presentation';

import { talkParamsViewModel } from './talkParamsViewModel';
import { talkViewModel } from './talkViewModel';

type TalksPageProps = {
  params: { slug: string; sponsorSlug: string };
};

export async function generateMetadata({ params }: TalksPageProps): Promise<Metadata> {
  const { talk } = await talkViewModel(params.slug, params.sponsorSlug);
  return TalkMetadata.generate(talk);
}

export default async function TalkPage({ params }: TalksPageProps) {
  const { talk, profile } = await talkViewModel(params.slug, params.sponsorSlug);

  if (!talk) {
    notFound();
  }
  
  const formattedDate = formatDate(talk.date);

  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, };

  const timeEastern = talk.date.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'America/New_York' });
  const timeCentral = talk.date.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'America/Chicago' });
  const timeSpain = talk.date.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'Europe/Madrid' });
  const timeArgentina = talk.date.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'America/Argentina/Buenos_Aires' });
  
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-vs-background z-10"></div>
        <div className="h-[400px] overflow-hidden">
          <Image
            src={`/assets/presentation/background-image.png`}
            alt={talk.title}
            className="w-full h-full object-cover object-center"
            fill
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-[380px]">
          <div className="max-w-4xl mx-auto pt-36">
            {talk.status === PRESENTATION_STATUS.UPCOMING && (
                <span className="inline-block bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full mb-4 shadow-lg animate-pulse">
                Upcoming Event
                </span>
            )}
            {talk.status === PRESENTATION_STATUS.ONGOING && (
              <span className="inline-block bg-red-600 text-white text-sm font-semibold py-1 px-3 rounded-full mb-4 shadow-lg animate-pulse">
                Happening Today!
              </span>
            )}
            {talk.status === PRESENTATION_STATUS.PAST && (
              <span className="inline-block bg-gray-700 text-white text-sm font-semibold py-1 px-3 rounded-full mb-4">
                Past Event
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 text-shadow-sm">
              {talk.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-block bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
                {talk.type}
              </span>
              {talk.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-800/80 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-300 pb-2">
              <div className="flex items-center mb-3 sm:mb-0">
                <span role="img" aria-label="building" className="mr-2">🏢</span>
                <span className="font-semibold mr-1">By:</span> {talk.sponsor}
                {talk.eventName && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="font-semibold mr-1">Event:</span> {talk.eventName}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1 text-gray-300 pb-2">
                <div>
                <div className="font-semibold mb-1">📅 {formattedDate}</div>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>🕒 🇺🇸 Eastern Time (ET) — {timeEastern}</li>
                    <li>🕒 🇺🇸 Central Time (CT) — {timeCentral}</li>
                    <li>🕒 🇪🇸 Spain (CEST) — {timeSpain}</li>
                    <li>🕒 🇦🇷 Argentina (ART) — {timeArgentina}</li>
                  </ul>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/pages/talks" className="inline-flex items-center text-vs-primary hover:text-vs-primary-dark mb-8 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Talks
          </Link>

          <div className="bg-vs-background-light rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-vs-primary mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start mb-4">
                  <span role="img" aria-label="map marker" className="mt-1 mr-3 text-vs-primary">📍</span>
                  <div>
                    <h3 className="font-semibold text-vs-foreground">Location</h3>
                    <p className="text-vs-foreground/80">{talk.place}</p>
                    {talk.location && <p className="text-vs-foreground/80">{talk.location}</p>}
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <span role="img" aria-label="globe" className="mt-1 mr-3 text-vs-primary">🌐</span>
                  <div>
                    <h3 className="font-semibold text-vs-foreground">Language</h3>
                    <p className="text-vs-foreground/80">{talk.language}</p>
                  </div>
                </div>
                {talk.eventName && (
                  <div className="flex items-start">
                    <span role="img" aria-label="building" className="mt-1 mr-3 text-vs-primary">🏢</span>
                    <div>
                      <h3 className="font-semibold text-vs-foreground">Event</h3>
                      <p className="text-vs-foreground/80">{talk.eventName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-start mb-4">
                  <span role="img" aria-label="calendar" className="mt-1 mr-3 text-vs-primary">📅</span>
                  <div>
                  <h3 className="font-semibold text-vs-foreground">Date & Time</h3>
                  <p className="text-sm">
                    May 7, 2025 — Shown above in your local time zones 👆
                  </p>
                    <p className="text-vs-foreground/60 text-sm mt-1">
                      <b>
                        {talk.status === PRESENTATION_STATUS.UPCOMING && "Coming soon!"}
                        {talk.status === PRESENTATION_STATUS.ONGOING && "Happening today!"}
                        {talk.status === PRESENTATION_STATUS.PAST && "This event has already taken place."}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span role="img" aria-label="tags" className="mt-1 mr-3 text-vs-primary">🏷️</span>
                  <div>
                    <h3 className="font-semibold text-vs-foreground">Format & Topics</h3>
                    <p className="text-vs-foreground/80 capitalize">{talk.type}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {talk.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow hover:bg-blue-600 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold text-vs-primary mb-6">About this Talk</h2>
            <div className="bg-vs-background-light rounded-lg p-6 shadow-inner">
              <div dangerouslySetInnerHTML={{ __html: talk.description }} />
            </div>
          </div>

          {talk.status === PRESENTATION_STATUS.PAST && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-vs-primary mb-6">Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {talk.slidesUrl && (
                  <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">📊</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Presentation Slides</h3>
                  <p className="text-vs-foreground/70 text-sm">View or download the presentation slides</p>
                  </a>
                )}
                
                {talk.videoUrl && (
                  <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">🎬</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Recorded Video</h3>
                  <p className="text-vs-foreground/70 text-sm">Watch the talk recording</p>
                  </a>
                )}
                
                {talk.repositoryUrl && (
                  <a href={talk.repositoryUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">💻</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Code Repository</h3>
                  <p className="text-vs-foreground/70 text-sm">Access the code samples and demos</p>
                  </a>
                )}
                
                {talk.resourcesUrl && (
                  <a href={talk.resourcesUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">📚</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Additional Resources</h3>
                  <p className="text-vs-foreground/70 text-sm">Supplementary materials and resources</p>
                  </a>
                )}
                
                {talk.postUrl && (
                  <a href={talk.postUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">📝</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Blog Post</h3>
                  <p className="text-vs-foreground/70 text-sm">Read the accompanying article</p>
                  </a>
                )}
                
                {talk.feedbackUrl && (
                  <a href={talk.feedbackUrl} target="_blank" rel="noopener noreferrer" className="bg-vs-background-light hover:bg-vs-background-lighter rounded-lg p-5 flex flex-col items-center text-center transition-all transform hover:-translate-y-1 shadow hover:shadow-md">
                  <span className="text-2xl mb-3">✍️</span>
                  <h3 className="font-semibold text-vs-foreground mb-2">Feedback Form</h3>
                  <p className="text-vs-foreground/70 text-sm">Share your thoughts about the talk</p>
                  </a>
                )}
                
                {!talk.slidesUrl && !talk.videoUrl && !talk.repositoryUrl && !talk.resourcesUrl && !talk.postUrl && !talk.feedbackUrl && (
                  <div className="bg-vs-background-light rounded-lg p-6 text-center col-span-full">
                  <p className="text-vs-foreground/80">Resources for this talk will be available soon.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(talk.status === PRESENTATION_STATUS.UPCOMING || talk.status === PRESENTATION_STATUS.ONGOING) && (
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg p-8 text-white shadow-lg mb-12">
              <h2 className="text-2xl font-bold mb-4">Join this {talk.type === PRESENTATION_TYPE.ONLINE ? "Online" : "Presentation"}!</h2>
              <p className="mb-6">
                {talk.status === PRESENTATION_STATUS.UPCOMING ? "Mark your calendar and don't miss this upcoming event." : "This event is happening today! Don't miss out on this opportunity to participate live."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <a href={talk.registrationUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors shadow-md text-center">
                Register Now
              </a>
              </div>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-vs-primary mb-6">About the Speaker</h2>
            <div className="bg-vs-background-light rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/assets/profile/maurogioberti-avatar.png"
                  alt={profile.fullname}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-vs-foreground mb-2">{profile.fullname}</h3>
                <p className="text-vs-foreground/80 mb-4">
                  {profile?.position} {profile?.additionalPositions && `| ${profile?.additionalPositions.join(" | ")}`}
                </p>
                <p className="text-vs-foreground/80 mb-4">
                  {profile?.shortDescription}
                </p>
                <div className="flex gap-3">
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {profile.youtubeUrl && (
                    <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </a>
                  )}
                  {profile.twitterUrl && (
                    <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  {profile.instagramUrl && (
                    <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-pink-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                      </svg>
                    </a>
                  )}
                  {profile.websiteUrl && (
                    <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-green-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const params = await talkParamsViewModel();
  return params;
}