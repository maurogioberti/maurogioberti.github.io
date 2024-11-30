import { Metadata } from 'next';

const layoutMetadata: Metadata = {
  title: {
    default: "Mauro Gioberti | Portfolio & Blog",
    template: "%s | Mauro Gioberti",
  },
  description: "Welcome to Mauro Gioberti's personal portfolio. Explore projects, blogs, and services for software engineering, mentoring, and more.",
  metadataBase: new URL("https://maurogioberti.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maurogioberti.com",
    siteName: "Mauro Gioberti Portfolio",
    images: [
      {
        url: "/assets/open-graph/default-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti's Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maurogioberti",
    creator: "@maurogioberti",
    images: ["https://maurogioberti.com/assets/open-graph/twitter-card.jpg"],
  },
  authors: [{ name: "Mauro Gioberti" }],
  keywords: [
    "software engineer",
    ".net",
    "cloud services",
    "interviewer",
    "mentor",
    "microservices",
    "clean architecture",
    ".net automation",
    ".net core",
  ],
};

export default layoutMetadata;