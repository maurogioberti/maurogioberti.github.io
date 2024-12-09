import { Metadata } from 'next';

import servicesMetadata from '@/core/crosscutting/seo/services';

import { serviceViewModel } from './serviceViewModel';

export const metadata: Metadata = {...servicesMetadata};

export default async function ServicesPage() {
  const { services } = await serviceViewModel();
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground p-6">
      <header className="mb-12 text-center">
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
      <section className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-vs-primary">🌎 Location & Availability</h3>
        <p className="mt-4 max-w-xl mx-auto">
          Flexible scheduling aligned with U.S. business hours, ensuring seamless collaboration and availability during prime working times. 
          Ideal for businesses seeking reliable support and real-time accessibility.
        </p>
        <div className="mt-6">
          <a 
            href="https://www.linkedin.com/in/maurogioberti" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-vs-primary rounded-lg hover:bg-vs-primary-dark inline-block">
            Connect on LinkedIn
          </a>
          <p className="mt-4 text-sm">
            Prefer to contact me via phone? 
            Send me a message 
            on <a href="mailto:giobertimauro@gmail.com" className="text-vs-primary hover:underline"> my email</a> to 
            request my U.S. phone number.
          </p>
        </div>
      </section>
    </div>
  );
}