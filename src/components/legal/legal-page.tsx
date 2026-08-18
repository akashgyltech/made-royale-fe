import React from "react";
import Link from "next/link";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import { LegalDoc, legalDocList } from "@/data/legal";
import type { LegalCmsDoc } from "@/lib/cms-content";

const anchor = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function extractHeadingsAndInjectIds(html: string) {
  const toc: { heading: string; id: string }[] = [];
  const used = new Set<string>();
  const withIds = html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level: string, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return match;
    const base = anchor(text) || "section";
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    toc.push({ heading: text, id });
    const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, "");
    return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`;
  });
  return { html: withIds, toc };
}

type Props = { slug: string; doc?: LegalDoc; cms?: LegalCmsDoc | null };

export default function LegalPage({ slug, doc, cms }: Props) {
  const relatedLinks = legalDocList.filter((d) => d.slug !== slug);

  if (cms) {
    const { html, toc } = extractHeadingsAndInjectIds(cms.body);
    const title = cms.title;
    const subtitle = cms.subtitle || doc?.subtitle || "";

    return (
      <>
        <LuxBreadcrumb subtitle={subtitle} title={title} image={cms.bannerImage} crumbs={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: title }]} />
        <section className="mr-legal">
          <div className="container container-1300">
            <div className="mr-legal-layout">
              <aside className="mr-legal-toc">
                <span className="mr-legal-toc-title">On this page</span>
                <nav>
                  {toc.map((t) => (
                    <a key={t.id} href={`#${t.id}`}>{t.heading}</a>
                  ))}
                </nav>
                <div className="mr-legal-toc-help">
                  <strong>Still have questions?</strong>
                  <p>Our care team is happy to help.</p>
                  <Link href="/contact" className="mr-btn-outline mr-btn-sm">Contact Us</Link>
                </div>
              </aside>

              <div className="mr-legal-content">
                {cms.updatedAt && (
                  <p className="mr-legal-updated">
                    Last updated: {new Date(cms.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                {cms.intro && <p className="mr-legal-lead">{cms.intro}</p>}
                <div className="mr-legal-section" dangerouslySetInnerHTML={{ __html: html }} />

                {relatedLinks.length > 0 && (
                  <div className="mr-legal-related">
                    <span>Related policies</span>
                    <div className="mr-legal-related-links">
                      {relatedLinks.map((d) => (
                        <Link key={d.slug} href={`/${d.slug}`}>{d.title}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!doc) return null;

  return (
    <>
      <LuxBreadcrumb
        subtitle={doc.subtitle}
        title={doc.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: doc.title }]}
      />
      <section className="mr-legal">
        <div className="container container-1300">
          <div className="mr-legal-layout">
            <aside className="mr-legal-toc">
              <span className="mr-legal-toc-title">On this page</span>
              <nav>
                {doc.sections.map((s) => (
                  <a key={s.heading} href={`#${anchor(s.heading)}`}>{s.heading}</a>
                ))}
              </nav>
              <div className="mr-legal-toc-help">
                <strong>Still have questions?</strong>
                <p>Our care team is happy to help.</p>
                <Link href="/contact" className="mr-btn-outline mr-btn-sm">Contact Us</Link>
              </div>
            </aside>

            <div className="mr-legal-content">
              <p className="mr-legal-updated">Last updated: {doc.updated}</p>
              <p className="mr-legal-lead">{doc.intro}</p>
              {doc.sections.map((s) => (
                <div key={s.heading} id={anchor(s.heading)} className="mr-legal-section">
                  <h2>{s.heading}</h2>
                  {s.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ))}

              <div className="mr-legal-related">
                <span>Related policies</span>
                <div className="mr-legal-related-links">
                  {relatedLinks.map((d) => (
                    <Link key={d.slug} href={`/${d.slug}`}>{d.title}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
