import React from "react";
import Link from "next/link";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import { LegalDoc, legalDocList } from "@/data/legal";

const anchor = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function LegalPage({ doc }: { doc: LegalDoc }) {
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
                  {legalDocList.filter((d) => d.slug !== doc.slug).map((d) => (
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
