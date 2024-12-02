import servicesMetadata from "@/core/crosscutting/seo/services";
import { Metadata } from "next";

export const metadata: Metadata = {...servicesMetadata};

export default function Services() {
  return (
    <div className="min-h-screen bg-vs-background text-vs-foreground p-6">
      <header className="mb-12 text-center">
      <h1 className="text-5xl font-extrabold text-vs-primary mb-4">🕵️‍♂️ Services I Offer</h1>
        <p className="mt-4 text-lg">
          Leveraging expertise in software engineering to deliver impactful solutions across the United States.
        </p>
      </header>
      <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        <div className="bg-vs-background-light p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🔍 Technical Interviews</h2>
          <p>
            I provide <strong>clear</strong> and <strong>impartial</strong> technical interviews to assess 
            candidates <strong>skills</strong> and alignment with <strong>role expectations</strong>. 
            Using <strong>extensive experience</strong> and cognitive techniques 
            like <strong>Follow-up Questions</strong> and <strong>Memory Recall</strong>, 
            I identify <strong>genuine expertise</strong> and ensure <strong>authenticity</strong> through 
            strategic problem-solving exercises.
          </p>
        </div>
        <div className="bg-vs-background-light p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Microservices Development</h2>
          <p>
            With a <strong>solid and extensive background</strong> in microservices development, 
            I deliver a  <strong>quick</strong>, <strong>efficient</strong> and <strong>scalable</strong> solutions to modern infrastructure needs. 
            I ensure <strong>high-quality code</strong> with <strong>exceptional test coverage</strong>, 
            ensuring your codebase is <strong>easy to maintain</strong>, <strong>readable</strong>, and aligned with 
            your <strong>architecture standards</strong>.
          </p>
        </div>
        <div className="bg-vs-background-light p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🎓 Mentorship</h2>
          <p>
            <strong>Personalized mentorship</strong> to aspiring developers, as well as junior and mid-level engineers, 
            guiding them through their growth with <strong>practical advice</strong> and <strong>peer programming sessions</strong>. 
            With experience in delivering <strong>technical talks</strong> and <strong>hands-on courses</strong>, 
            I focus on cultivating strong coding principles, particularly in <strong>.NET testing practices</strong>, ensuring developers gain 
            the skills to build robust and maintainable software.
          </p>
        </div>
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
            className="px-6 py-2 bg-vs-primary text-white rounded-lg hover:bg-vs-primary-dark inline-block"
          >
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
