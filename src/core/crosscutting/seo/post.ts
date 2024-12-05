import { Metadata } from 'next';

import blogMetadata from '@/core/crosscutting/seo/blog';
import { Post } from '@/core/domain/model/Post';

export class PostMetadata {
  static generate(post: Post | undefined): Metadata {
    if (!post) {
      return {
        ...blogMetadata,
        title: "Post not found",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      ...blogMetadata,
      title:  `Mauro Gioberti Blog - ${post.title}`,
      description: post.description,
      openGraph: {
        ...blogMetadata.openGraph,
        title: post.title,
        description: post.description,
        images: [
          {
            url: post.imageUrl,
            alt: `Mauro Gioberti Blog - ${post.title}`,
          },
        ],
      },
      twitter: {
        ...blogMetadata.twitter,
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [post.imageUrl],
      },
    };
  }
}