import './post.css';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { highlightBlogCodeBlocks } from '@/core/crosscutting/content/shiki';
import { PostMetadata } from '@/core/crosscutting/seo/post';

import { postParamsViewModel } from './postParamsViewModel';
import { postViewModel } from './postViewModel';

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await postViewModel(slug);
  return PostMetadata.generate(post);
}

export default async function PostPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const { post } = await postViewModel(slug);

  if (!post) {
    notFound();
  }

  const highlightedContent = await highlightBlogCodeBlocks(post.content);

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <div className="post-header-card">
          <Link href="/pages/blog" className="back-button">← Back to posts</Link>
          <p className="post-tag">AI • RAG • Benchmarking</p>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-date">{post.formattedDate}</p>
        </div>
        <section className="prose prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
        </section>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return await postParamsViewModel();
}
