import { Metadata } from 'next';
import Image from 'next/image';

import resumeMetadata from '@/core/crosscutting/seo/resume';

import { resumeViewModel } from './resumeViewModel';

export const metadata: Metadata = { ...resumeMetadata };

export default async function ResumePage() {
  const { profile, timeline, recommendations } = await resumeViewModel();
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground px-4 py-16 sm:px-6 sm:py-20">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-4">Resume</h1>
        <p className="text-lg mt-4">
          {profile.conciseDescription}
        </p>
      </header>
      <div className="flex flex-col items-center mb-8">
        <Image src="/assets/profile/maurogioberti.png" alt="Mauro Gioberti" width={200} height={200} className="w-50 h-50 rounded-full object-cover shadow-lg" />
      </div>
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start gap-10 pb-4 sm:pb-8 lg:flex-row">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Professional Timeline</h2>

          <div className="-my-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex items-center gap-4 mb-2">
                  {item.companyLogoUrl && (
                    <Image src={item.companyLogoUrl} alt={`${item.company} logo`} width={56} height={56} className="w-14 h-14 rounded-md object-contain"/>
                  )}
                  <div>
                    <div className="font-caveat font-medium text-2xl text-vs-primary">
                      {item.companyUrl ? (
                        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                    </div>
                    {item.consultingCompany && (
                      <div className="flex items-center gap-4">
                        {item.consultingCompanyLogoUrl && (
                          <Image src={item.consultingCompanyLogoUrl} alt={`${item.consultingCompany} logo`} width={56} height={56} className="w-14 h-14 rounded-md object-contain" />
                        )}
                        <p className="text-base italic text-vs-primary">
                          Services for{" "}
                          {item.consultingCompanyUrl ? (
                            <a href={item.consultingCompanyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {item.consultingCompany}
                            </a>
                          ) : (
                            item.consultingCompany
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                    {(item.location || item.workType) && (
                      <div className="text-sm text-vs-foreground-muted mt-1">
                        {item.location}{item.location && item.workType && ' - '}{item.workType}
                      </div>
                    )}
                <div
                  className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden 
                      before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-vs-primary 
                      sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 
                      after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-vs-primary 
                      after:border-4 after:box-content after:border-vs-background after:rounded-full 
                      sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                  <time
                    className="sm:absolute left-0 translate-y-0.5 inline-flex items-center 
                      justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 
                      sm:mb-0 text-white bg-vs-primary rounded-full">
                    {item.year}
                  </time>

                  <div className="text-xl font-bold text-vs-foreground">{item.title}</div>
                </div>

                <div className="text-sm text-vs-foreground/80">{item.description}</div>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="card w-full max-w-3xl px-4 py-3 lg:w-[30rem] lg:max-w-none lg:flex-none lg:self-start">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-vs-primary sm:text-3xl dark:text-sky-200">
            Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => {
              return (
                <div key={index} className="flex w-full items-start gap-2.5 border-b border-vs-primary/20 pb-2 last:border-b-0 last:pb-0">
                  <Image src={recommendation.profilePictureUrl} alt={`${recommendation.name}'s profile`} width={48} height={48} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  <div className="relative min-w-0 flex-1 pb-3 pr-12">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-[2px]">
                        <a
                          href={recommendation.linkedInProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-bold leading-tight text-vs-heading hover:text-vs-primary-light hover:underline">
                          {recommendation.name}
                        </a>
                        <p className="text-md font-medium leading-snug text-vs-primary">
                          {recommendation.position}
                        </p>
                        <p className="-mt-1 -mb-2 text-[12px] leading-tight text-blue-700 dark:text-sky-400">
                          {recommendation.relation}
                        </p>
                      </div>
                      <a
                        href={recommendation.linkedInRecommendationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm leading-snug text-vs-foreground/90 hover:underline">
                        {recommendation.text}
                      </a>
                    </div>
                    <time
                      className="pointer-events-none absolute bottom-0 right-0 text-right text-[10px] leading-tight text-gray-500/45 dark:text-gray-500/40"
                      dateTime={recommendation.date.toISOString().slice(0, 10)}>
                      {recommendation.formattedDate}
                    </time>
                    {recommendation.translation ? <span className="sr-only">{recommendation.translation}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
}
