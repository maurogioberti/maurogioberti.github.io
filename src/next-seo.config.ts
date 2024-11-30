const SEO = {
    title: "Mauro Gioberti | Portfolio & Blog",
    description: "Welcome to Mauro Gioberti's personal portfolio. Explore projects, blogs, and services for software engineering, mentoring, and more.",
    canonical: "https://maurogioberti.com",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://maurogioberti.com",
      site_name: "Mauro Gioberti Portfolio",
      images: [
        {
          url: "/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Mauro Gioberti's Portfolio",
        },
      ],
    },
    twitter: {
      handle: '@maurogioberti',
      site: '@maurogioberti',
      cardType: 'summary_large_image',
      creator: '@maurogioberti',
      title: "Mauro Gioberti - Software Engineer",
      description: "Software Engineer Portfolio & Blog",
      image: 'https://maurogioberti.com/assets/twitter-card.jpg'
    },
    additionalMetaTags: [
      {
        name: 'author',
        content: 'Mauro Gioberti'
      },
      {
        name: 'keywords',
        content: 'software engineer, .net, cloud services, interviewer, mentor, microservices, clean architecture, .net automation, .net core'
      }
    ]
  };
  
  export default SEO;  