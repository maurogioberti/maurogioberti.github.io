import { Metadata } from "next";

const standaloneLayoutMetadata: Metadata = {
  title: {
    default: "Standalone Pages | Mauro Gioberti",
    template: "%s | Mauro Gioberti",
  },
  description:
    "Standalone pages that live outside the main website layout, including custom tools like Linktree and QR data.",
  metadataBase: new URL("https://maurogioberti.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maurogioberti.com/standalone",
    siteName: "Mauro Gioberti Standalone Tools",
    images: [
      {
        url: "/assets/open-graph/standalone-og-image.png",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti's Standalone Pages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maurogioberti",
    creator: "@maurogioberti",
    images: [
      "https://maurogioberti.com/assets/open-graph/standalone-twitter-card.png",
    ],
  },
  authors: [{ name: "Mauro Gioberti" }],
  keywords: [
    "standalone pages",
    "linktree",
    "tools",
    "my qr data",
    ".net core",
    "microservices",
    ".net",
    "cloud services",
    "unit testing",
    "qa",
    "custom web tools",
    "mauro gioberti standalone",
  ],
};

export default standaloneLayoutMetadata;