"use client";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import SmartImage from "@/components/ui/smart-image";
import type { BackendBlog } from "@/types/backend";
import { authorName, formatBlogDate, estimateReadTime, isHtmlContent } from "./blog-utils";

type Props = {
  blog: BackendBlog | null;
  more: BackendBlog[];
};

const BlogArticleMain = ({ blog, more }: Props) => {
  const author = blog ? authorName(blog.author) : undefined;

  return (
    <Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        {!blog ? (
          <div className="mr-shop-empty" style={{ padding: "100px 20px" }}><div className="mr-shop-empty-glyph">❖</div><h3>Article not found</h3><Link href="/blog" className="mr-btn-solid">Back to Journal</Link></div>
        ) : (
          <article className="mr-article">
            <div className="container container-1000">
              <div className="mr-article-head">
                {blog.category && <span className="mr-article-cat">{blog.category}</span>}
                <h1 className="mr-article-title">{blog.title}</h1>
                <div className="mr-article-meta">
                  {author && <><span>By {author}</span><em>•</em></>}
                  <span>{formatBlogDate(blog.publishedAt)}</span><em>•</em><span>{estimateReadTime(blog.content)}</span>
                </div>
              </div>
              <div className="mr-article-hero"><SmartImage src={blog.thumbnail} alt={blog.title} label={blog.category} ratio="16 / 9" /></div>
              <div className="mr-article-body">
                {blog.excerpt && <p className="mr-article-lead">{blog.excerpt}</p>}
                {isHtmlContent(blog.content) ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  blog.content.split(/\n+/).map((p) => p.trim()).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                )}
              </div>
              <div className="mr-article-back"><Link href="/blog" className="mr-btn-outline">← Back to Journal</Link></div>
            </div>
            {more.length > 0 && (
              <div className="container container-1400">
                <div className="mr-article-more">
                  <h3 className="mr-account-h3">More from the Journal</h3>
                  <div className="mr-grid mr-grid-3">
                    {more.map((b) => (
                      <article className="mr-blog-card" key={b.id}>
                        <Link href={`/blog-details/${b.slug}`} className="mr-blog-card-media"><SmartImage src={b.thumbnail} alt={b.title} label={b.category} ratio="4 / 3" /></Link>
                        <div className="mr-blog-card-body">{b.category && <span className="mr-blog-card-cat">{b.category}</span>}<h3 className="mr-blog-card-title"><Link href={`/blog-details/${b.slug}`}>{b.title}</Link></h3><Link href={`/blog-details/${b.slug}`} className="mr-blog-card-link">Read Article →</Link></div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        )}
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default BlogArticleMain;
