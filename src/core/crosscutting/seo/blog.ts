import { Metadata } from 'next';

const blogMetadata: Metadata = {
  title: "Blog | Mauro Gioberti",
  description: "Discover insights, tutorials, and discussions on software engineering, clean architecture, and modern development practices.",
  openGraph: {
    title: "Blog | Mauro Gioberti",
    description: "Explore in-depth articles about clean architecture, software engineering best practices, and more.",
    url: "https://maurogioberti.com/blog",
    images: [
      {
        url: "https://maurogioberti.com/assets/open-graph/blog-og-image.png",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti Blog - Insights and Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Mauro Gioberti",
    description: "Dive into articles about clean architecture, testing, and software development best practices.",
    images: ["https://maurogioberti.com/assets/open-graph/blog-og-image.png"],
  },
};

export default blogMetadata;