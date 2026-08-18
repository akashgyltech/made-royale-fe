import React from 'react';
import type { Metadata } from 'next';
import BlogArticleMain from '@/pages/blog/blog-article-main';
import { cmsApi } from '@/lib/store-api';
import { buildPageMetadata } from '@/lib/seo-cms';
import type { BackendBlog } from '@/types/backend';

// The dynamic segment here is keyed by slug (not the Mongo _id) — confirmed by the old
// dummy-data wiring (`blogs.map((b) => ({ id: b.slug }))`) and matches cmsApi.getBlogBySlug.
async function fetchBlog(slug: string): Promise<BackendBlog | null> {
  try {
    return await cmsApi.getBlogBySlug(slug);
  } catch {
    return null; // not found, or DB has no matching post yet
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlog(id);
  return buildPageMetadata('blog', {
    title: blog ? blog.seo?.metaTitle || `${blog.title} — Shizenta` : 'Journal — Shizenta',
    description: blog?.seo?.metaDescription || blog?.excerpt,
    image: blog?.thumbnail,
    path: `/blog-details/${id}`,
  });
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await fetchBlog(id);

  let more: BackendBlog[] = [];
  try {
    const page = await cmsApi.getBlogs({ limit: 4 });
    more = page.results.filter((b) => b.slug !== id).slice(0, 3);
  } catch {
    more = [];
  }

  return <BlogArticleMain blog={blog} more={more} />;
}
