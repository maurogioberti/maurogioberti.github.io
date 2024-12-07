import { Metadata } from 'next';

const resumeMetadata: Metadata = {
  title: "Resume | Mauro Gioberti",
  description:
    "Explore Mauro Gioberti's professional timeline, achievements, and recommendations in software engineering, clean architecture, and modern development practices.",
  openGraph: {
    title: "Resume | Mauro Gioberti",
    description:
      "Dive into Mauro Gioberti's professional career, showcasing his expertise in software engineering, clean architecture, and modern development methodologies.",
    url: "https://maurogioberti.com/resume",
    images: [
      {
        url: "https://maurogioberti.com/assets/open-graph/resume-og-image.png",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti Resume - Professional Journey and Expertise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Mauro Gioberti",
    description: "Discover Mauro Gioberti's professional journey, achievements, and skills in software engineering and development practices.",
    images: ["https://maurogioberti.com/assets/open-graph/resume-og-image.png"],
  },
};

export default resumeMetadata;