"use client";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import type { BackendBlog } from "@/types/backend";
import { formatBlogDate, estimateReadTime } from "./blog-utils";
import BlogSearchForm from "./blog-search-form";

type Props = {
  blogs: BackendBlog[];
  page: number;
  totalPages: number;
  totalResults: number;
  category?: string;
  tag?: string;
  search?: string;
};

function buildHref(page: number, params: { category?: string; tag?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.tag) qs.set("tag", params.tag);
  if (params.search) qs.set("search", params.search);
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString();
  return query ? `/blog?${query}` : "/blog";
}

const BlogListMain = ({ blogs, page, totalPages, totalResults, category, tag, search }: Props) => {
  const hasFilters = !!(category || tag || search);

  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="The Journal" title="Stories & Style Notes" crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
        <section className="mr-blog">
          <div className="container container-1400">
            <div className="mr-shop-toolbar">
              <div className="mr-shop-count">
                <strong>{totalResults}</strong> {totalResults === 1 ? "story" : "stories"}
                {category && <> in <span>{category}</span></>}
                {tag && <> tagged <span>{tag}</span></>}
              </div>
              <BlogSearchForm initialSearch={search} />
            </div>
            {hasFilters && (
              <div style={{ marginBottom: 30 }}>
                <Link href="/blog" className="mr-shop-clear">Clear filters</Link>
              </div>
            )}

            {blogs.length === 0 ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">❖</div>
                <h3>{hasFilters ? "No stories match your filters" : "No posts yet"}</h3>
                <p>{hasFilters ? "Try a different search or category." : "New stories from the Journal are on their way — check back soon."}</p>
                {hasFilters && <Link href="/blog" className="mr-btn-solid">View all stories</Link>}
              </div>
            ) : (
              <>
                <div className="mr-grid mr-grid-3">
                  {blogs.map((b) => (
                    <article className="mr-blog-card" key={b.id}>
                      <Link href={`/blog-details/${b.slug}`} className="mr-blog-card-media">
                        <SmartImage src={b.thumbnail} alt={b.title} label={b.category} ratio="4 / 3" />
                      </Link>
                      <div className="mr-blog-card-body">
                        {b.category && <span className="mr-blog-card-cat">{b.category}</span>}
                        <h3 className="mr-blog-card-title"><Link href={`/blog-details/${b.slug}`}>{b.title}</Link></h3>
                        {b.excerpt && <p className="mr-blog-card-excerpt">{b.excerpt}</p>}
                        <div className="mr-blog-card-meta">
                          <span>{formatBlogDate(b.publishedAt)}</span><em>•</em><span>{estimateReadTime(b.content)}</span>
                        </div>
                        <Link href={`/blog-details/${b.slug}`} className="mr-blog-card-link">Read Article →</Link>
                      </div>
                    </article>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 50 }}>
                    <Link
                      href={buildHref(page - 1, { category, tag, search })}
                      className="mr-btn-outline"
                      aria-disabled={page <= 1}
                      style={page <= 1 ? { pointerEvents: "none", opacity: 0.4 } : undefined}
                    >
                      ← Previous
                    </Link>
                    <span style={{ fontSize: 14 }}>Page {page} of {totalPages}</span>
                    <Link
                      href={buildHref(page + 1, { category, tag, search })}
                      className="mr-btn-outline"
                      aria-disabled={page >= totalPages}
                      style={page >= totalPages ? { pointerEvents: "none", opacity: 0.4 } : undefined}
                    >
                      Next →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default BlogListMain;
