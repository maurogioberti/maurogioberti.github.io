import './post.css';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostMetadata } from '@/core/crosscutting/seo/post';

import { postParamsViewModel } from './postParamsViewModel';
import { postViewModel } from './postViewModel';

type BlogDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { post } = await postViewModel(params.slug);
  return PostMetadata.generate(post);
}

export default async function PostPage({ params }: BlogDetailPageProps) {
  const { post } = await postViewModel(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <div>
          <Link href="/pages/blog">
            <button className="back-button">← Back to posts</button>
          </Link>
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-vs-primary mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500">{post.formattedDate}</p>
        </header>
        <section className="prose prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </section>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return await postParamsViewModel();
}