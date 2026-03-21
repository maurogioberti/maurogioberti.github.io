import { Metadata } from 'next';

import servicesMetadata from '@/core/crosscutting/seo/services';

import { serviceViewModel } from './serviceViewModel';

export const metadata: Metadata = {...servicesMetadata};

export default async function ServicesPage() {
  const { services, profile } = await serviceViewModel();
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground px-4 pt-12 pb-20 sm:px-6 sm:pt-12 sm:pb-20">
      <header className="mx-auto mb-6 max-w-3xl text-center">
      <h1 className="text-5xl font-extrabold text-vs-primary mb-4">Services I Offer</h1>
        <p className="mt-4 text-lg">
          Leveraging expertise in software engineering to deliver impactful solutions across the United States.
        </p>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div key={index} className="card flex flex-col p-6">
            <h2 className="text-xl font-semibold leading-tight mb-3">{service.title}</h2>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: service.content }} />
            {!service.available && (
              <>
                <div className="flex justify-center">
                  <div className="inline-block bg-vs-primary text-white text-xs font-semibold uppercase rounded-full px-3 py-1 mt-2">
                    Fully Booked
                  </div>
                </div>
                <div className="mt-2 p-4 bg-vs-primary-dark text-white text-center text-sm font-semibold rounded-lg">
                  Please check back soon for availability!
                </div>
              </>
            )}
          </div>
        ))}
      </section>
      <section className="mx-auto mt-16 max-w-3xl pb-4 sm:pb-8">
        <h3 className="text-2xl font-semibold text-vs-primary text-center">
          Direct Contact for Professional Inquiries
        </h3>

        <p className="mt-4 text-base text-vs-foreground/80 text-center">
          I work with companies on architecture reviews, technical interviews, and team development initiatives. If you&apos;re reaching out regarding a consulting engagement, speaking opportunity, or technical collaboration, you can use the direct contact options below. Please include your organization and a brief description of your needs so I can respond appropriately.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="card p-6">
            <h4 className="mt-0 mb-0 text-lg font-semibold text-vs-foreground">
              U.S. Business Phone
            </h4>
            <p className="mt-2 mb-0 text-sm leading-7 text-vs-foreground/80">
              Available for consulting and project-related discussions. Calls or text messages (SMS) are welcome. Conversations are typically scheduled in advance between <strong>1:00 PM – 6:00 PM Eastern Time (ET) / 12:00 PM – 5:00 PM Central Time (CT)</strong>. A short introduction and the purpose of your inquiry are appreciated.
            </p>

            {profile.phone && (
              <a
                href={`tel:${profile.phoneInternational}`}
                className="mt-4 inline-flex text-sm text-vs-primary hover:underline"
              >
                {profile.phone}
              </a>
            )}
          </div>
          <div className="card p-6">
            <h4 className="mt-0 mb-0 text-lg font-semibold text-vs-foreground">
              WhatsApp
            </h4>
            <p className="mt-2 mb-0 text-sm leading-7 text-vs-foreground/80">
              The same number is available on WhatsApp for those who prefer it. For faster responses, please include context about your project or organization.
            </p>

            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phoneWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm text-vs-primary hover:underline">
                Open WhatsApp chat
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
