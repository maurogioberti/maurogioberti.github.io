import { Metadata } from 'next';

const recordingsMetadata: Metadata = {
  title: "Talk Recordings | Mauro Gioberti",
  description:
    "Watch real-world tech talk recordings by Mauro Gioberti on automation, testing, clean architecture, and .NET-based systems, presented at international conferences and meetups.",

  openGraph: {
    title: "Talk Recordings | Mauro Gioberti",
    description: "Real-world tech talks on developer automation, testing strategies, clean architecture, and scalable systems, presented at international events.",
    url: "https://maurogioberti.com/standalone/recordings",
    images: [
      {
        url: "https://maurogioberti.com/assets/open-graph/recordings-og-image.png",
        width: 1200,
        height: 630,
        alt: "Tech Talk Recordings by Mauro Gioberti",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Talk Recordings | Mauro Gioberti",
    description: "Watch real tech talks on automation, testing, clean architecture, and .NET from international conferences and meetups.",
    images: ["https://maurogioberti.com/assets/open-graph/recordings-og-image.png"],
  },
};

export default recordingsMetadata;
