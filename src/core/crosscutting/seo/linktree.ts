import { Metadata } from 'next';

const linktreeMetadata: Metadata = {
  title: "Linktree",
  description: "Connect with Mauro Gioberti through various platforms.",
  openGraph: {
    title: "Linktree | Mauro Gioberti",
    description: "Find all the ways to connect with Mauro Gioberti.",
    url: "https://maurogioberti.com/standalone/linktree",
    images: [
      {
        url: "/assets/open-graph/linktree-og-image.png",
        width: 1200,
        height: 630,
        alt: "Linktree - Mauro Gioberti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linktree | Mauro Gioberti",
    description: "Find all the ways to connect with Mauro Gioberti.",
    images: ["https://maurogioberti.com/assets/open-graph/linktree-twitter-card.png"],
  },
};

export default linktreeMetadata;