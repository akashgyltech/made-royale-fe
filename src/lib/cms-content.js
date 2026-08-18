function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}
// ── Header ───────────────────────────────────────────────────────────────────
// Expected shape (matches made-royale-admin's "header" quick-template):
//   { logo?, logoAlt?, links: [{ label, url, order?, children?: [{label,url}] }], announcementBar? }
// `children` isn't part of the admin's current template but is supported defensively in
// case a future editor adds nested nav — falls back to a flat link when absent.
function adaptChild(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const label = raw.label;
    const url = raw.url;
    if (!isNonEmptyString(label) || !isNonEmptyString(url))
        return null;
    return { title: label, link: url };
}
function adaptLink(raw, id) {
    if (!raw || typeof raw !== 'object')
        return null;
    const label = raw.label;
    const url = raw.url;
    const order = raw.order;
    const rawChildren = raw.children;
    if (!isNonEmptyString(label) || !isNonEmptyString(url))
        return null;
    const children = Array.isArray(rawChildren)
        ? rawChildren.map(adaptChild).filter((c) => !!c)
        : [];
    const menu = {
        id,
        title: label,
        link: url,
        ...(children.length > 0 ? { dropdown_menus: children } : {}),
    };
    return { menu, order: typeof order === 'number' ? order : id };
}
/** Validated IMenuDT[] from a CMS `header` doc's content, or null if the shape isn't usable
 * (missing/empty/malformed `links`) — caller should fall back to the static menu_data. */
export function adaptHeaderMenu(content) {
    if (!content || typeof content !== 'object')
        return null;
    const links = content.links;
    if (!Array.isArray(links) || links.length === 0)
        return null;
    const adapted = links
        .map((l, i) => adaptLink(l, i + 1))
        .filter((m) => !!m);
    if (adapted.length === 0)
        return null;
    adapted.sort((a, b) => a.order - b.order);
    return adapted.map((a) => a.menu);
}
function adaptFooterLink(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const label = raw.label;
    const url = raw.url;
    if (!isNonEmptyString(label) || !isNonEmptyString(url))
        return null;
    return { title: label, link: url };
}
function adaptFooterColumn(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const title = raw.title;
    const rawLinks = raw.links;
    if (!isNonEmptyString(title) || !Array.isArray(rawLinks))
        return null;
    const links = rawLinks.map(adaptFooterLink).filter((l) => !!l);
    if (links.length === 0)
        return null;
    return { title, links };
}
/** Validated FooterContent from a CMS `footer` doc's content, or null if the doc has nothing
 * usable at all — individual fields are still returned even if only some are present, so
 * callers should fall back per-field to their static defaults. */
export function adaptFooterContent(content) {
    if (!content || typeof content !== 'object')
        return null;
    const c = content;
    const description = isNonEmptyString(c.description) ? c.description : undefined;
    const columns = Array.isArray(c.columns)
        ? c.columns.map(adaptFooterColumn).filter((col) => !!col)
        : [];
    const rawSocial = c.social;
    let social;
    if (rawSocial && typeof rawSocial === 'object') {
        const s = rawSocial;
        const picked = {};
        ['instagram', 'facebook', 'youtube', 'twitter', 'linkedin', 'pinterest'].forEach((key) => {
            if (isNonEmptyString(s[key]))
                picked[key] = s[key];
        });
        if (Object.keys(picked).length > 0)
            social = picked;
    }
    const copyright = isNonEmptyString(c.copyright) ? c.copyright : undefined;
    const gstin = isNonEmptyString(c.gstin) ? c.gstin : undefined;
    const result = {
        description,
        columns: columns.length > 0 ? columns : undefined,
        social,
        copyright,
        gstin,
    };
    const hasAnything = !!(result.description || result.columns || result.social || result.copyright || result.gstin);
    return hasAnything ? result : null;
}
export function adaptBranding(content) {
    if (!content || typeof content !== 'object')
        return null;
    const c = content;
    const logoDark = isNonEmptyString(c.logoDark) ? c.logoDark : undefined;
    const logoLight = isNonEmptyString(c.logoLight) ? c.logoLight : undefined;
    return logoDark || logoLight ? { logoDark, logoLight } : null;
}
function adaptFaqItem(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const question = raw.question;
    const answer = raw.answer;
    if (!isNonEmptyString(question) || !isNonEmptyString(answer))
        return null;
    return { question, answer };
}
/** Validated FaqItem[] from a CMS `faq` doc's content ({ items: [{question,answer}] }),
 * or null if empty/malformed — caller should fall back to its static FAQ list. */
export function adaptFaqList(content) {
    if (!content || typeof content !== 'object')
        return null;
    const items = content.items;
    if (!Array.isArray(items))
        return null;
    const adapted = items.map(adaptFaqItem).filter((i) => !!i);
    return adapted.length > 0 ? adapted : null;
}
export function adaptLegalDoc(content) {
    if (!content || typeof content !== 'object')
        return null;
    const c = content;
    if (!isNonEmptyString(c.title) || !isNonEmptyString(c.body))
        return null;
    return {
        title: c.title,
        body: c.body,
        subtitle: isNonEmptyString(c.subtitle) ? c.subtitle : undefined,
        intro: isNonEmptyString(c.intro) ? c.intro : undefined,
        updatedAt: isNonEmptyString(c.updatedAt) ? c.updatedAt : undefined,
        bannerImage: isNonEmptyString(c.bannerImage) ? c.bannerImage : undefined,
    };
}
function adaptOpenGraph(raw) {
    if (!raw || typeof raw !== 'object')
        return undefined;
    const r = raw;
    const out = {};
    if (isNonEmptyString(r.title))
        out.title = r.title;
    if (isNonEmptyString(r.description))
        out.description = r.description;
    if (isNonEmptyString(r.image))
        out.image = r.image;
    return Object.keys(out).length > 0 ? out : undefined;
}
function adaptTwitterCard(raw) {
    if (!raw || typeof raw !== 'object')
        return undefined;
    const r = raw;
    const out = {};
    if (r.card === 'summary' || r.card === 'summary_large_image')
        out.card = r.card;
    if (isNonEmptyString(r.title))
        out.title = r.title;
    if (isNonEmptyString(r.description))
        out.description = r.description;
    if (isNonEmptyString(r.image))
        out.image = r.image;
    return Object.keys(out).length > 0 ? out : undefined;
}
/** Validated SeoContent from a CMS `seo` doc's content, or null if empty/malformed —
 * caller (src/lib/seo-cms.ts) falls back per-field to the `seo-default` doc, then to a
 * hardcoded default passed in by the page. */
export function adaptSeoContent(content) {
    if (!content || typeof content !== 'object')
        return null;
    const c = content;
    const result = {
        title: isNonEmptyString(c.title) ? c.title : undefined,
        description: isNonEmptyString(c.description) ? c.description : undefined,
        siteName: isNonEmptyString(c.siteName) ? c.siteName : undefined,
        og: adaptOpenGraph(c.og),
        twitter: adaptTwitterCard(c.twitter),
    };
    const hasAnything = !!(result.title || result.description || result.siteName || result.og || result.twitter);
    return hasAnything ? result : null;
}
