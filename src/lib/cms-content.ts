// Adapters that turn admin-authored CMS `header`/`footer` doc content into the shapes
// header-six.tsx / footer-six.tsx render. The CMS `content` field is free-form JSON typed
// into a textarea in made-royale-admin (see its CMS page's quick-action templates), so it's
// untrusted, unvalidated input from the DB's point of view — validate defensively here and
// return null on anything that isn't usable so callers fall back to static defaults.
import type { IMenuDT } from '@/types/menu-d-t';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ── Header ───────────────────────────────────────────────────────────────────
// Expected shape (matches made-royale-admin's "header" quick-template):
//   { logo?, logoAlt?, links: [{ label, url, order?, children?: [{label,url}] }], announcementBar? }
// `children` isn't part of the admin's current template but is supported defensively in
// case a future editor adds nested nav — falls back to a flat link when absent.

function adaptChild(raw: unknown): { title: string; link: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const label = (raw as { label?: unknown }).label;
  const url = (raw as { url?: unknown }).url;
  if (!isNonEmptyString(label) || !isNonEmptyString(url)) return null;
  return { title: label, link: url };
}

function adaptLink(raw: unknown, id: number): { menu: IMenuDT; order: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const label = (raw as { label?: unknown }).label;
  const url = (raw as { url?: unknown }).url;
  const order = (raw as { order?: unknown }).order;
  const rawChildren = (raw as { children?: unknown }).children;
  if (!isNonEmptyString(label) || !isNonEmptyString(url)) return null;

  const children = Array.isArray(rawChildren)
    ? rawChildren.map(adaptChild).filter((c): c is { title: string; link: string } => !!c)
    : [];

  const menu: IMenuDT = {
    id,
    title: label,
    link: url,
    ...(children.length > 0 ? { dropdown_menus: children } : {}),
  };
  return { menu, order: typeof order === 'number' ? order : id };
}

/** Validated IMenuDT[] from a CMS `header` doc's content, or null if the shape isn't usable
 * (missing/empty/malformed `links`) — caller should fall back to the static menu_data. */
export function adaptHeaderMenu(content: unknown): IMenuDT[] | null {
  if (!content || typeof content !== 'object') return null;
  const links = (content as { links?: unknown }).links;
  if (!Array.isArray(links) || links.length === 0) return null;

  const adapted = links
    .map((l, i) => adaptLink(l, i + 1))
    .filter((m): m is { menu: IMenuDT; order: number } => !!m);
  if (adapted.length === 0) return null;

  adapted.sort((a, b) => a.order - b.order);
  return adapted.map((a) => a.menu);
}

// ── Footer ───────────────────────────────────────────────────────────────────
// Expected shape (matches made-royale-admin's "footer" quick-template):
//   { description?, columns?: [{ title, links: [{label,url}] }], social?: {instagram,facebook,youtube,...}, copyright?, gstin? }

export interface FooterLink { title: string; link: string; }
export interface FooterColumn { title: string; links: FooterLink[]; }
export interface FooterSocial {
  instagram?: string; facebook?: string; youtube?: string; twitter?: string; linkedin?: string; pinterest?: string;
}
export interface FooterContent {
  description?: string;
  columns?: FooterColumn[];
  social?: FooterSocial;
  copyright?: string;
  gstin?: string;
}

function adaptFooterLink(raw: unknown): FooterLink | null {
  if (!raw || typeof raw !== 'object') return null;
  const label = (raw as { label?: unknown }).label;
  const url = (raw as { url?: unknown }).url;
  if (!isNonEmptyString(label) || !isNonEmptyString(url)) return null;
  return { title: label, link: url };
}

function adaptFooterColumn(raw: unknown): FooterColumn | null {
  if (!raw || typeof raw !== 'object') return null;
  const title = (raw as { title?: unknown }).title;
  const rawLinks = (raw as { links?: unknown }).links;
  if (!isNonEmptyString(title) || !Array.isArray(rawLinks)) return null;
  const links = rawLinks.map(adaptFooterLink).filter((l): l is FooterLink => !!l);
  if (links.length === 0) return null;
  return { title, links };
}

/** Validated FooterContent from a CMS `footer` doc's content, or null if the doc has nothing
 * usable at all — individual fields are still returned even if only some are present, so
 * callers should fall back per-field to their static defaults. */
export function adaptFooterContent(content: unknown): FooterContent | null {
  if (!content || typeof content !== 'object') return null;
  const c = content as Record<string, unknown>;

  const description = isNonEmptyString(c.description) ? c.description : undefined;

  const columns = Array.isArray(c.columns)
    ? c.columns.map(adaptFooterColumn).filter((col): col is FooterColumn => !!col)
    : [];

  const rawSocial = c.social;
  let social: FooterSocial | undefined;
  if (rawSocial && typeof rawSocial === 'object') {
    const s = rawSocial as Record<string, unknown>;
    const picked: FooterSocial = {};
    (['instagram', 'facebook', 'youtube', 'twitter', 'linkedin', 'pinterest'] as const).forEach((key) => {
      if (isNonEmptyString(s[key])) picked[key] = s[key] as string;
    });
    if (Object.keys(picked).length > 0) social = picked;
  }

  const copyright = isNonEmptyString(c.copyright) ? c.copyright : undefined;
  const gstin = isNonEmptyString(c.gstin) ? c.gstin : undefined;

  const result: FooterContent = {
    description,
    columns: columns.length > 0 ? columns : undefined,
    social,
    copyright,
    gstin,
  };

  const hasAnything = !!(result.description || result.columns || result.social || result.copyright || result.gstin);
  return hasAnything ? result : null;
}

export interface BrandingContent { logoDark?: string; logoLight?: string; }

export function adaptBranding(content: unknown): BrandingContent | null {
  if (!content || typeof content !== 'object') return null;
  const c = content as Record<string, unknown>;
  const logoDark = isNonEmptyString(c.logoDark) ? c.logoDark : undefined;
  const logoLight = isNonEmptyString(c.logoLight) ? c.logoLight : undefined;
  return logoDark || logoLight ? { logoDark, logoLight } : null;
}

export interface FaqItem { question: string; answer: string; }

function adaptFaqItem(raw: unknown): FaqItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const question = (raw as { question?: unknown }).question;
  const answer = (raw as { answer?: unknown }).answer;
  if (!isNonEmptyString(question) || !isNonEmptyString(answer)) return null;
  return { question, answer };
}

/** Validated FaqItem[] from a CMS `faq` doc's content ({ items: [{question,answer}] }),
 * or null if empty/malformed — caller should fall back to its static FAQ list. */
export function adaptFaqList(content: unknown): FaqItem[] | null {
  if (!content || typeof content !== 'object') return null;
  const items = (content as { items?: unknown }).items;
  if (!Array.isArray(items)) return null;
  const adapted = items.map(adaptFaqItem).filter((i): i is FaqItem => !!i);
  return adapted.length > 0 ? adapted : null;
}

export interface LegalCmsDoc {
  title: string;
  subtitle?: string;
  intro?: string;
  body: string;
  updatedAt?: string;
}

export function adaptLegalDoc(content: unknown): LegalCmsDoc | null {
  if (!content || typeof content !== 'object') return null;
  const c = content as Record<string, unknown>;
  if (!isNonEmptyString(c.title) || !isNonEmptyString(c.body)) return null;
  return {
    title: c.title,
    body: c.body,
    subtitle: isNonEmptyString(c.subtitle) ? c.subtitle : undefined,
    intro: isNonEmptyString(c.intro) ? c.intro : undefined,
    updatedAt: isNonEmptyString(c.updatedAt) ? c.updatedAt : undefined,
  };
}
