import { Metadata } from 'next';

import { Presentation } from '@/core/domain/model/Presentation';

export class TalktreeMetadata {
  static generate(presentation: Presentation | undefined): Metadata {
    const talkMetadata: Metadata = {
      title: "Talk | Mauro Gioberti",
      description: "Access resources, slides, and additional content from Mauro Gioberti's live presentations.",
      openGraph: {
        title: "Live Tech Talk | Mauro Gioberti",
        description: "Explore resources shared live during Mauro Gioberti's tech presentations.",
        url: "https://maurogioberti.com/talks",
        images: [
          {
            url: "https://maurogioberti.com/assets/open-graph/talktree-og-image.png",
            width: 1200,
            height: 630,
            alt: "Mauro Gioberti Live Tech Talk",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Live Tech Talk | Mauro Gioberti",
        description: "Access live content and materials from Mauro Gioberti's presentations.",
        images: ["https://maurogioberti.com/assets/open-graph/talktree-og-image.png"],
      },
    };

    if (!presentation) {
      return {
        ...talkMetadata,
        title: "Presentation not found",
        description: "The requested presentation content could not be found.",
      };
    }

    return {
      ...talkMetadata,
      title: `Mauro Gioberti Talk | ${presentation.title}`,
      description: presentation.description,
      openGraph: {
        ...talkMetadata.openGraph,
        title: presentation.title,
        description: presentation.description,
        images: [
          {
            url: presentation.imageUrl,
            alt: `Mauro Gioberti Live Talk - ${presentation.title}`,
          },
        ],
      },
      twitter: {
        ...talkMetadata.twitter,
        card: "summary_large_image",
        title: presentation.title,
        description: presentation.description,
        images: [presentation.imageUrl],
      },
    };
  }
}