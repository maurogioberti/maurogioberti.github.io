import { Metadata } from 'next';

const servicesMetadata: Metadata = {
  title: "Services | Mauro Gioberti",
  description: "Explore the services offered by Mauro Gioberti, including technical interviews, microservices development, and mentoring.",
  openGraph: {
    title: "Services | Mauro Gioberti",
    description: "Learn about the services Mauro Gioberti offers, including tech interviewer, mentoring and development.",
    url: "https://maurogioberti.com/services",
    images: [
      {
        url: "https://maurogioberti.com/assets/open-graph/services-og-image.png",
        width: 1200,
        height: 630,
        alt: "Mauro Gioberti - Services Offered",
      },
    ],
  },
};

export default servicesMetadata;