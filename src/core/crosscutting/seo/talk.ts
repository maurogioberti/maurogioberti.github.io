import { Metadata } from 'next';

import talksMetadata from '@/core/crosscutting/seo/talks';
import { Presentation } from '@/core/domain/model/Presentation';

export class TalkMetadata {
  static generate(talk: Presentation | undefined): Metadata {
    if (!talk) {
      return {
        ...talksMetadata,
        title: "Talk not found",
        description: "The requested talk could not be found.",
      };
    }

    const absoluteImageUrl = talk.imageUrl.startsWith('http') 
      ? talk.imageUrl 
      : `https://maurogioberti.com${talk.imageUrl}`;

    return {
      ...talksMetadata,
      title: `Mauro Gioberti Talks | ${talk.title}`,
      description: talk.description,
      openGraph: {
        ...talksMetadata.openGraph,
        title: talk.title,
        description: talk.description,
        images: [
          {
            url: absoluteImageUrl,
            alt: `Mauro Gioberti Talks - ${talk.title}`,
          },
        ],
        type: "article",
        publishedTime: talk.date?.toISOString(),
        authors: ["Mauro Gioberti"],
        tags: talk.tags,
      },
      twitter: {
        ...talksMetadata.twitter,
        card: "summary_large_image",
        title: talk.title,
        description: talk.description,
        images: [absoluteImageUrl],
      },
    };
  }
}