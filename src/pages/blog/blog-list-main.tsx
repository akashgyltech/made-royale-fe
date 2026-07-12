"use client";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import { blogs } from "@/data/catalog";

const BlogListMain = () => (
  <Wrapper>
    <HeaderSix />
    <main>
      <LuxBreadcrumb subtitle="The Journal" title="Stories & Style Notes" crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <section className="mr-blog">
        <div className="container container-1400">
          <div className="mr-grid mr-grid-3">
            {blogs.map((b) => (
              <article className="mr-blog-card" key={b.id}>
                <Link href={`/blog-details/${b.slug}`} className="mr-blog-card-media"><SmartImage src={b.image} alt={b.title} label={b.category} ratio="4 / 3" /></Link>
                <div className="mr-blog-card-body">
                  <span className="mr-blog-card-cat">{b.category}</span>
                  <h3 className="mr-blog-card-title"><Link href={`/blog-details/${b.slug}`}>{b.title}</Link></h3>
                  <p className="mr-blog-card-excerpt">{b.excerpt}</p>
                  <div className="mr-blog-card-meta"><span>{b.date}</span><em>•</em><span>{b.readTime}</span></div>
                  <Link href={`/blog-details/${b.slug}`} className="mr-blog-card-link">Read Article →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
    <FooterSix />
  </Wrapper>
);

export default BlogListMain;
