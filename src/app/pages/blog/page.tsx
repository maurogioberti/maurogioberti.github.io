import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import blogMetadata from '@/core/crosscutting/seo/blog';

import { postsViewModel } from './postsViewModel';

export const metadata: Metadata = {
  ...blogMetadata,
};

export default async function BlogPage() {
  const { posts } = await postsViewModel();
    const IMAGE_WIDTH = 1024;
    const IMAGE_HEIGHT = 1024;

  return (
    <div className="min-h-screen px-6 py-16 sm:py-20 bg-vs-background text-vs-foreground font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-vs-primary mb-4">Blog</h1>
        <p className="text-lg">Discover posts on software engineering, best practices, and Clean Architecture.</p>
      </header>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative card overflow-hidden">
            <Link href={`/pages/blog/${post.slug}`} className="block">
              <Image
                src={post.imageUrl}
                alt={`Open Graph image for ${post.title}`}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="w-full h-auto rounded-t-lg object-contain"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold leading-tight text-vs-foreground group-hover:text-vs-primary transition-colors duration-300">{post.title}</h2>
                <p className="text-sm mt-1">{post.formattedDate}</p>
                <p className="text-sm mt-2 text-vs-foreground/80">{post.description}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <strong className="inline-block mt-4 text-vs-primary font-semibold hover:underline">Read More →</strong>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}