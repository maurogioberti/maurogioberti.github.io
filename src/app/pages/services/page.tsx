import { Metadata } from 'next';

import servicesMetadata from '@/core/crosscutting/seo/services';

import { serviceViewModel } from './serviceViewModel';

export const metadata: Metadata = {...servicesMetadata};

export default async function ServicesPage() {
  const { services, profile } = await serviceViewModel();
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground p-6">
      <header className="mb-6 text-center">
      <h1 className="text-5xl font-extrabold text-vs-primary mb-4">🕵️‍♂️ Services I Offer</h1>
        <p className="mt-4 text-lg">
          Leveraging expertise in software engineering to deliver impactful solutions across the United States.
        </p>
      </header>
      <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="bg-vs-background-light p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: service.content }} />
            {!service.available && (
              <>
                <div className="flex justify-center">
                  <div className="inline-block bg-blue-500 text-white text-xs font-semibold uppercase rounded-full px-3 py-1 mt-2">
                    Fully Booked 🚫
                  </div>
                </div>
                <div className="mt-2 p-4 bg-blue-600 text-white text-center text-sm font-semibold rounded-lg shadow">
                  Please check back soon for availability! 😊
                </div>
              </>
            )}
          </div>
        ))}
      </section>
      <section className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-vs-primary text-center">
          📞 Direct Contact for Professional Inquiries
        </h3>

        <p className="mt-4 text-base text-vs-foreground/80 text-center">
          I work with companies on architecture reviews, technical interviews, and team development initiatives. If you&apos;re reaching out regarding a consulting engagement, speaking opportunity, or technical collaboration, you can use the direct contact options below. Please include your organization and a brief description of your needs so I can respond appropriately.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="bg-vs-background-light p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-vs-foreground">
              U.S. Business Phone
            </h4>
            <p className="mt-2 text-sm text-vs-foreground/80">
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
          <div className="bg-vs-background-light p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-vs-foreground">
              WhatsApp
            </h4>
            <p className="mt-2 text-sm text-vs-foreground/80">
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