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
  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = 200;

  return (
    <div className="min-h-screen p-6 bg-vs-background text-vs-foreground font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-vs-primary mb-4">📝 Blog</h1>
        <p className="text-lg">Discover posts on software engineering, best practices, and Clean Architecture.</p>
      </header>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative bg-vs-background-light rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link href={`/pages/blog/${post.slug}`} className="block">
              <Image
                src={post.imageUrl}
                alt={`Open Graph image for ${post.title}`}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="h-48 w-full object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-vs-foreground group-hover:text-vs-primary transition-colors duration-300">{post.title}</h2>
                <p className="text-sm mt-1">{post.formattedDate}</p>
                <p className="text-md mt-2">{post.description}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow hover:bg-blue-600 transition-colors">
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