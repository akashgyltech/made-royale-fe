import React from 'react';
import type { Metadata } from 'next';
import BlogArticleMain from '@/pages/blog/blog-article-main';
import { blogs, getBlog } from '@/data/catalog';

export function generateStaticParams() {
  return blogs.map((b) => ({ id: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = getBlog(id);
  return { title: blog ? `${blog.title} — Made Royale` : 'Journal — Made Royale' };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogArticleMain slug={id} />;
}
