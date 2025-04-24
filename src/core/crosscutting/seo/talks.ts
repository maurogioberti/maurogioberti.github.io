import { Metadata } from 'next';

const talkMetadata: Metadata = {
  title: "Talk | Mauro Gioberti",
  description: "Discover insights, tutorials, and discussions on software engineering, clean architecture, and modern development practices.",
  openGraph: {
    title: "Talk | Mauro Gioberti",
    description: "Explore in-depth articles about clean architecture, software engineering best practices, and more.",
    url: "https://maurogioberti.com/talk",
    images: [
      {
        url: "https://maurogioberti.com/assets/open-graph/talk-og-image.png",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti Talk - Insights and Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talk | Mauro Gioberti",
    description: "Dive into articles about clean architecture, testing, and software development best practices.",
    images: ["https://maurogioberti.com/assets/open-graph/talk-og-image.png"],
  },
};

export default talkMetadata;