import { Metadata } from 'next';

const DESCRIPTION =
  'Mauro Gioberti is a Barcelona-based technical speaker sharing practical sessions on applied AI, LLMs, RAG, .NET, software architecture, testing, and engineering leadership.';

const speakerMetadata: Metadata = {
  title: 'Technical Speaker',
  description: DESCRIPTION,
  alternates: {
    canonical: '/standalone/speaker',
  },
  openGraph: {
    title: 'Mauro Gioberti | Technical Speaker',
    description: DESCRIPTION,
    url: 'https://maurogioberti.com/standalone/speaker',
    siteName: 'Mauro Gioberti',
    type: 'profile',
    images: [
      {
        url: '/assets/open-graph/talk-og-image.png',
        alt: 'Mauro Gioberti technical speaker profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mauro Gioberti | Technical Speaker',
    description: DESCRIPTION,
    images: ['https://maurogioberti.com/assets/open-graph/talk-og-image.png'],
  },
};

export default speakerMetadata;
