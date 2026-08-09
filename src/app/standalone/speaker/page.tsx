import './speaker.css';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import speakerMetadata from '@/core/crosscutting/seo/speaker';

import { SpeakerSession, speakerViewModel } from './speakerViewModel';

export const metadata: Metadata = { ...speakerMetadata };

const SPEAKER_PROFILE_URL = 'https://maurogioberti.com/standalone/speaker';

const SPEAKING_TOPICS = [
  'Applied AI',
  'LLMs, RAG & AI agents',
  'AI-assisted development',
  'Specification-Driven Development',
  '.NET & C#',
  'Software architecture',
  'Code quality & refactoring',
  'Testing & engineering practices',
  'Developer productivity',
  'Mentoring & technical leadership',
];

const SPEAKER_PRINCIPLES = [
  {
    number: '01',
    title: 'From real systems',
    description: 'Sessions start with engineering decisions, constraints, and lessons from work that had to run beyond the demo.',
  },
  {
    number: '02',
    title: 'Demonstrable by design',
    description: 'Code, architecture, tests, and trade-offs are part of the story—not a decorative slide at the end.',
  },
  {
    number: '03',
    title: 'Useful on Monday',
    description: 'Attendees leave with patterns, questions, and practical ideas they can take back to their teams.',
  },
];

export default async function SpeakerPage() {
  const { profile, sessions, featuredRecordings } = await speakerViewModel();
  const headline = [profile.position, ...profile.additionalPositions].join(' | ');
  const location = profile.location?.description || 'Barcelona, Spain';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SPEAKER_PROFILE_URL}#profile`,
        url: SPEAKER_PROFILE_URL,
        name: `${profile.fullname} | Technical Speaker`,
        description: 'Technical speaker profile for Mauro Gioberti, covering applied AI, .NET, software architecture, testing, and engineering leadership.',
        mainEntity: {
          '@id': `${SPEAKER_PROFILE_URL}#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${SPEAKER_PROFILE_URL}#person`,
        name: profile.fullname,
        url: profile.websiteUrl,
        image: 'https://maurogioberti.com/assets/profile/maurogioberti-avatar.png',
        jobTitle: headline,
        description: 'Tech Lead, AI Architect, mentor, software engineer, and technical speaker based in Barcelona.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.location?.city || 'Barcelona',
          addressCountry: profile.location?.country || 'Spain',
        },
        sameAs: [
          profile.sessionizeUrl,
          profile.linkedinUrl,
          profile.githubUrl,
          profile.youtubeUrl,
          profile.twitterUrl,
          profile.instagramUrl,
        ].filter(Boolean),
        knowsAbout: SPEAKING_TOPICS,
      },
    ],
  };

  return (
    <div className="speaker-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className="speaker-background-grid" aria-hidden="true" />

      <header className="speaker-topbar">
        <div className="speaker-shell speaker-topbar-inner">
          <a href={profile.websiteUrl} className="speaker-brand" aria-label="Visit Mauro Gioberti's portfolio">
            <span className="speaker-brand-mark" aria-hidden="true">MG</span>
            <span className="speaker-brand-copy">
              <strong>maurogioberti.com</strong>
              <small>Speaker profile</small>
            </span>
          </a>

          <nav className="speaker-nav" aria-label="Speaker page navigation">
            <a href="#sessions">Sessions</a>
            <a href="#recordings">Recordings</a>
            <a href={profile.sessionizeUrl} target="_blank" rel="noopener noreferrer">
              Sessionize <ArrowUpRightIcon />
            </a>
          </nav>
        </div>
      </header>

      <section className="speaker-shell speaker-hero" aria-labelledby="speaker-name">
        <a
          href={profile.sessionizeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="speaker-avatar-link"
          aria-label={`View ${profile.fullname}'s Sessionize profile`}
        >
          <span className="speaker-avatar-frame">
            <Image
              src="/assets/profile/maurogioberti-avatar.png"
              alt={`Portrait of ${profile.fullname}`}
              width={176}
              height={176}
              className="speaker-avatar"
              priority
            />
            <span className="speaker-avatar-badge" aria-hidden="true"><MicIcon /></span>
          </span>
        </a>

        <div className="speaker-hero-copy">
          <p className="speaker-eyebrow">
            <span aria-hidden="true" />
            Technical speaker · {location}
          </p>
          <h1 id="speaker-name">{profile.fullname}</h1>
          <p className="speaker-professional-headline">{headline}</p>
          <p className="speaker-hero-intro">
            Practical, engineering-driven talks about applied AI, .NET, software architecture, and the craft of building reliable systems.
          </p>
          <div className="speaker-hero-actions">
            <a className="speaker-button speaker-button-primary" href={profile.sessionizeUrl} target="_blank" rel="noopener noreferrer">
              View on Sessionize <ArrowUpRightIcon />
            </a>
            <Link className="speaker-button speaker-button-secondary" href="/standalone/recordings">
              Watch recordings <PlayIcon />
            </Link>
          </div>
        </div>

        <aside className="speaker-hero-note" aria-label="Speaker approach">
          <p className="speaker-note-label">Speaker approach</p>
          <p className="speaker-note-quote">“Build it. Measure it. Explain the trade-offs.”</p>
          <div className="speaker-note-topics" aria-label="Core speaking topics">
            <span>Applied AI</span>
            <span>.NET</span>
            <span>Architecture</span>
          </div>
        </aside>
      </section>

      <section className="speaker-section speaker-shell" aria-labelledby="about-speaker">
        <SectionHeading
          eyebrow="About the speaker"
          title="Hands-on engineering, made useful on stage."
          id="about-speaker"
        />

        <div className="speaker-about-grid">
          <div className="speaker-bio">
            <p>
              Mauro is a Tech Lead and software engineer with 15+ years of experience building scalable systems across fintech and complex domains. His work stays close to the code: hands-on engineering, architecture, mentoring, and platform modernization.
            </p>
            <p>
              He designs and builds AI-driven systems with LLMs, RAG, agents, AI-assisted development, and specification-driven development. His talks turn that work into practical sessions with real code, clear trade-offs, and ideas attendees can actually use.
            </p>
          </div>

          <ol className="speaker-principles" aria-label="Speaking principles">
            {SPEAKER_PRINCIPLES.map((principle) => (
              <li key={principle.number}>
                <span className="speaker-principle-number" aria-hidden="true">{principle.number}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="speaker-section speaker-section-topics" aria-labelledby="speaking-topics">
        <div className="speaker-shell">
          <SectionHeading
            eyebrow="Speaking topics"
            title="The systems, practices, and decisions behind modern software."
            id="speaking-topics"
            description="A focused topic range grounded in Mauro's current engineering work, public projects, and technical sessions."
          />

          <ul className="speaker-topic-list">
            {SPEAKING_TOPICS.map((topic, index) => (
              <li key={topic}>
                <span className="speaker-topic-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="sessions" className="speaker-section speaker-shell" aria-labelledby="speaker-sessions">
        <div className="speaker-section-heading-row">
          <SectionHeading
            eyebrow="Talks & sessions"
            title="Real engineering stories, backed by working material."
            id="speaker-sessions"
            description="Sessions are loaded from the portfolio's presentation data, including their original event, resources, and recordings."
          />
          <Link className="speaker-text-link speaker-section-link" href="/pages/talks">
            View all talk details <ArrowRightIcon />
          </Link>
        </div>

        <div className="speaker-session-grid">
          {sessions.map((session, index) => (
            <SessionCard key={`${session.id}-${session.detailUrl}`} session={session} featured={index === 0} />
          ))}
        </div>
      </section>

      <section id="recordings" className="speaker-section speaker-recordings-section" aria-labelledby="speaker-recordings">
        <div className="speaker-shell speaker-recordings-panel">
          <div className="speaker-section-heading-row">
            <SectionHeading
              eyebrow="Featured recordings"
              title="Watch the ideas move from slides to systems."
              id="speaker-recordings"
              description="A small selection of the latest available sessions. The complete video collection remains in the standalone recordings experience."
            />
            <Link className="speaker-button speaker-button-secondary speaker-recordings-cta" href="/standalone/recordings">
              View all recordings <ArrowRightIcon />
            </Link>
          </div>

          <div className="speaker-recording-grid">
            {featuredRecordings.map((recording) => (
              <RecordingCard key={`recording-${recording.id}-${recording.detailUrl}`} recording={recording} />
            ))}
          </div>
        </div>
      </section>

      <section className="speaker-section speaker-shell" aria-labelledby="speaker-contact">
        <div className="speaker-contact-panel">
          <div>
            <p className="speaker-section-eyebrow">Speaking & collaboration</p>
            <h2 id="speaker-contact">Planning a practical engineering session?</h2>
            <p>
              For conferences, meetups, podcasts, technical communities, or engineering teams, use Sessionize or send a short note with the event and audience context.
            </p>
          </div>

          <div className="speaker-contact-actions">
            <a className="speaker-button speaker-button-primary" href={profile.sessionizeUrl} target="_blank" rel="noopener noreferrer">
              Invite via Sessionize <ArrowUpRightIcon />
            </a>
            <a className="speaker-button speaker-button-secondary" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn <ArrowUpRightIcon />
            </a>
            <Link className="speaker-text-link speaker-contact-link" href="/pages/services">
              Professional contact <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <footer className="speaker-footer">
        <div className="speaker-shell speaker-footer-inner">
          <p>Build thoughtfully. Share what works.</p>
          <div className="speaker-footer-links">
            <Link href="/standalone">Standalone</Link>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <Link href="/">Portfolio</Link>
          </div>
          <p>© {new Date().getFullYear()} {profile.fullname}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  id,
  description,
}: {
  eyebrow: string;
  title: string;
  id: string;
  description?: string;
}) {
  return (
    <div className="speaker-section-heading">
      <p className="speaker-section-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? <p className="speaker-section-description">{description}</p> : null}
    </div>
  );
}

function SessionCard({ session, featured }: { session: SpeakerSession; featured: boolean }) {
  const showEventLink = session.registrationUrl && session.registrationUrl !== session.videoUrl;

  return (
    <article className={`speaker-session-card${featured ? ' speaker-session-card-featured' : ''}`}>
      <Link href={session.detailUrl} className="speaker-session-media" aria-label={`View ${session.title} talk details`}>
        <Image
          src={session.thumbnailUrl}
          alt={`${session.title} at ${session.eventName}`}
          fill
          sizes={featured ? '(max-width: 760px) 100vw, 46vw' : '(max-width: 760px) 100vw, 42vw'}
          className="speaker-session-image"
        />
        <span className="speaker-session-media-shade" aria-hidden="true" />
        <span className="speaker-session-type">{session.typeLabel}</span>
        <time className="speaker-session-year" dateTime={session.date.toISOString()}>{session.dateYear}</time>
      </Link>

      <div className="speaker-session-content">
        <div className="speaker-session-meta">
          <span>{session.statusLabel}</span>
          <time dateTime={session.date.toISOString()}>{session.formattedDate}</time>
        </div>
        <h3><Link href={session.detailUrl}>{session.title}</Link></h3>
        <p className="speaker-session-event">{session.eventName}</p>
        {session.location ? <p className="speaker-session-location"><MapPinIcon /> {session.location}</p> : null}
        <p className="speaker-session-description">{session.description}</p>

        <ul className="speaker-session-tags" aria-label="Session topics">
          {session.tags.slice(0, 6).map((tag) => <li key={tag}>{tag}</li>)}
          {session.tags.length > 6 ? <li>+{session.tags.length - 6}</li> : null}
        </ul>

        <div className="speaker-session-actions" aria-label={`${session.title} resources`}>
          <Link href={session.detailUrl}>Details <ArrowRightIcon /></Link>
          {session.videoUrl ? <a href={session.videoUrl} target="_blank" rel="noopener noreferrer">Recording <PlayIcon /></a> : null}
          {session.slidesUrl ? <a href={session.slidesUrl} target="_blank" rel="noopener noreferrer">Slides <ArrowUpRightIcon /></a> : null}
          {session.repositoryUrl ? <a href={session.repositoryUrl} target="_blank" rel="noopener noreferrer">Code <ArrowUpRightIcon /></a> : null}
          {showEventLink ? <a href={session.registrationUrl} target="_blank" rel="noopener noreferrer">Event <ArrowUpRightIcon /></a> : null}
        </div>
      </div>
    </article>
  );
}

function RecordingCard({ recording }: { recording: SpeakerSession }) {
  return (
    <a
      className="speaker-recording-card"
      href={recording.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${recording.title} on YouTube`}
    >
      <span className="speaker-recording-media">
        <Image
          src={recording.thumbnailUrl}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 42vw"
          className="speaker-recording-image"
        />
        <span className="speaker-recording-shade" aria-hidden="true" />
        <span className="speaker-recording-play" aria-hidden="true"><PlayIcon /></span>
        <span className="speaker-recording-platform">YouTube</span>
      </span>
      <span className="speaker-recording-copy">
        <span className="speaker-recording-meta">{recording.eventName} · {recording.dateYear}</span>
        <strong>{recording.title}</strong>
        <span className="speaker-recording-watch">Watch recording <ArrowUpRightIcon /></span>
      </span>
    </a>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="m5.5 4 6 4-6 4V4Z" fill="currentColor" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M12.5 6.5c0 3-4.5 7-4.5 7s-4.5-4-4.5-7a4.5 4.5 0 1 1 9 0Z" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2.5" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5M7.5 17.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
