import { Metadata } from 'next';
import Image from 'next/image';

import resumeMetadata from '@/core/crosscutting/seo/resume';

import { resumeViewModel } from './resumeViewModel';

export const metadata: Metadata = { ...resumeMetadata };

export default async function ResumePage() {
  const { timeline, recommendations } = await resumeViewModel();
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground p-6">
      <h1 className="text-5xl font-extrabold text-vs-primary mb-4">📜 Resume</h1>
      <div className="flex flex-col items-center mb-8">
        <Image src="/assets/profile/maurogioberti.png" alt="Mauro Gioberti" width={200} height={200} className="w-50 h-50 rounded-full object-cover shadow-lg" />
      </div>
      <section className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">📈 Professional Timeline</h2>

          <div className="-my-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex items-center gap-4 mb-2">
                  {item.companyLogoUrl && (
                    <Image src={item.companyLogoUrl} alt={`${item.company} logo`} width={56} height={56} className="w-14 h-14 rounded-md object-cover" />
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
                          <Image src={item.consultingCompanyLogoUrl} alt={`${item.consultingCompany} logo`} width={56} height={56} className="w-14 h-14 rounded-md object-cover" />
                        )}
                        <p className="text-base italic text-blue-300">
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

                <div
                  className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden 
                      before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-blue-600 
                      sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 
                      after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-vs-primary 
                      after:border-4 after:box-content after:border-vs-background after:rounded-full 
                      sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                  <time
                    className="sm:absolute left-0 translate-y-0.5 inline-flex items-center 
                      justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 
                      sm:mb-0 text-white bg-blue-500 rounded-full">
                    {item.year}
                  </time>

                  <div className="text-xl font-bold text-vs-foreground">{item.title}</div>
                </div>

                <div className="text-sm text-vs-foreground/80">{item.description}</div>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="sm:w-1/3 bg-vs-background-light p-4 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4">🏅 Recommendations</h2>
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-4 pb-6 border-b border-vs-primary">
                <Image src={recommendation.profilePictureUrl} alt={`${recommendation.name}'s profile`} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <a
                    href={recommendation.linkedInProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-vs-primary hover:underline">
                    {recommendation.name}
                  </a>
                  <p className="italic text-blue-400">{recommendation.position}</p>

                  <p className="text-xs text-vs-foreground/60 mb-1">Recommended on: {recommendation.formattedDate}</p>

                  <p className="text-xs text-blue-500 mb-2 italic">{recommendation.relation}</p>
                  {recommendation.translation && <p className="text-xs text-blue-400 italic mt-1">{recommendation.translation}</p>}
                  <a
                    href={recommendation.linkedInRecommendationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-vs-foreground hover:underline">
                    {recommendation.text}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}