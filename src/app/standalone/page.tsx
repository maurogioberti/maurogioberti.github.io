import './standalone.css';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { speakerViewModel } from '@/app/standalone/speaker/speakerViewModel';

export const metadata: Metadata = {
  title: 'Standalone Views',
  description: 'A directory of Mauro Gioberti\'s focused, shareable speaker, recording, link, and talk pages.',
  alternates: {
    canonical: '/standalone',
  },
  openGraph: {
    title: 'Standalone Views | Mauro Gioberti',
    description: 'Focused pages for speaking, recordings, links, and individual technical talks.',
    url: '/standalone',
    type: 'website',
    images: ['/assets/open-graph/talk-og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Standalone Views | Mauro Gioberti',
    description: 'Focused pages for speaking, recordings, links, and individual technical talks.',
    images: ['/assets/open-graph/talk-og-image.png'],
  },
};

const DIRECTORY_ITEMS = [
  {
    index: '01',
    label: 'Speaker landing',
    title: 'Technical speaker profile',
    description: 'Positioning, topics, sessions, recordings, and contact paths in one conference-ready page.',
    href: '/standalone/speaker',
    accent: 'speaker',
  },
  {
    index: '02',
    label: 'Link hub',
    title: 'Everything in one link',
    description: 'The compact social and portfolio directory designed for bios, profiles, and quick sharing.',
    href: '/standalone/linktree',
    accent: 'links',
  },
  {
    index: '03',
    label: 'Video library',
    title: 'Talk recordings',
    description: 'A distraction-free collection of available presentations and community sessions.',
    href: '/standalone/recordings',
    accent: 'recordings',
  },
];

export default async function StandalonePage() {
  const { profile, sessions } = await speakerViewModel();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Standalone views | ${profile.fullname}`,
    url: 'https://maurogioberti.com/standalone',
    description: 'A directory of focused speaker, recording, link, and technical talk pages.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: DIRECTORY_ITEMS.length + sessions.length,
      itemListElement: [
        ...DIRECTORY_ITEMS.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `https://maurogioberti.com${item.href}`,
        })),
        ...sessions.map((session, index) => ({
          '@type': 'ListItem',
          position: DIRECTORY_ITEMS.length + index + 1,
          name: session.title,
          url: `https://maurogioberti.com${session.standaloneUrl}`,
        })),
      ],
    },
  };

  return (
    <div className="standalone-directory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="standalone-directory-grid" aria-hidden="true" />

      <header className="standalone-directory-header">
        <div className="standalone-directory-shell standalone-directory-header-inner">
          <Link className="standalone-directory-brand" href="/">
            <span aria-hidden="true">MG</span>
            <strong>{profile.fullname}</strong>
            <small>/ standalone</small>
          </Link>
          <Link className="standalone-directory-exit" href="/">
            Main portfolio <ArrowUpRightIcon />
          </Link>
        </div>
      </header>

      <main>
        <section className="standalone-directory-shell standalone-directory-hero" aria-labelledby="standalone-title">
          <div className="standalone-directory-hero-copy">
            <p className="standalone-directory-eyebrow">Standalone directory</p>
            <h1 id="standalone-title">One place for every focused view.</h1>
            <p>
              Share the page that fits the moment: a speaker profile, a compact link hub, the recording library, or a companion page for a specific talk.
            </p>
          </div>
          <div className="standalone-directory-summary" aria-label="Directory summary">
            <div><strong>{DIRECTORY_ITEMS.length}</strong><span>Core views</span></div>
            <div><strong>{sessions.length}</strong><span>Talk pages</span></div>
          </div>
        </section>

        <section className="standalone-directory-shell standalone-directory-section" aria-labelledby="core-views">
          <div className="standalone-directory-section-heading">
            <div>
              <p className="standalone-directory-eyebrow">Choose a destination</p>
              <h2 id="core-views">Core standalone views</h2>
            </div>
            <p>Each view is deliberately focused, fast to scan, and easy to share on its own.</p>
          </div>

          <div className="standalone-directory-card-grid">
            {DIRECTORY_ITEMS.map((item) => (
              <Link
                href={item.href}
                className={`standalone-directory-card standalone-directory-card-${item.accent}`}
                key={item.href}
              >
                <span className="standalone-directory-card-topline">
                  <span>{item.index}</span>
                  <ArrowUpRightIcon />
                </span>
                <span className="standalone-directory-card-label">{item.label}</span>
                <strong>{item.title}</strong>
                <span className="standalone-directory-card-description">{item.description}</span>
                <span className="standalone-directory-card-action">Open view <ArrowRightIcon /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="standalone-directory-talks" aria-labelledby="talk-views">
          <div className="standalone-directory-shell standalone-directory-section">
            <div className="standalone-directory-section-heading">
              <div>
                <p className="standalone-directory-eyebrow">Talk companions</p>
                <h2 id="talk-views">A standalone page for every session</h2>
              </div>
              <p>Open the audience-ready view with the talk summary and its available resources.</p>
            </div>

            <ol className="standalone-directory-talk-list">
              {sessions.map((session, index) => (
                <li key={`${session.id}-${session.standaloneUrl}`}>
                  <Link href={session.standaloneUrl}>
                    <span className="standalone-directory-talk-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="standalone-directory-talk-image">
                      <Image
                        src={session.thumbnailUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 88px, 142px"
                      />
                    </span>
                    <span className="standalone-directory-talk-copy">
                      <span className="standalone-directory-talk-meta">
                        {session.eventName} · {session.dateYear}
                      </span>
                      <strong>{session.title}</strong>
                      <span className="standalone-directory-talk-tags">
                        {session.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                      </span>
                    </span>
                    <span className="standalone-directory-talk-action" aria-hidden="true"><ArrowUpRightIcon /></span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="standalone-directory-footer">
        <div className="standalone-directory-shell">
          <p>Focused views. One source of truth.</p>
          <div>
            <Link href="/standalone/speaker">Speaker</Link>
            <Link href="/standalone/recordings">Recordings</Link>
            <a href={profile.sessionizeUrl} target="_blank" rel="noopener noreferrer">Sessionize</a>
          </div>
          <p>© {new Date().getFullYear()} {profile.fullname}</p>
        </div>
      </footer>
    </div>
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
