export function authorName(author) {
    if (!author)
        return undefined;
    return typeof author === "string" ? author : author.name;
}
export function formatBlogDate(iso) {
    if (!iso)
        return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
/** made-royale-admin's blog editor is a plain textarea whose placeholder says "HTML
 * supported" — authors may type raw HTML or plain text. Only treat it as markup when it
 * actually looks like markup, so plain-text posts don't get their tags/newlines eaten. */
export function isHtmlContent(content) {
    return /<[a-z][\s\S]*>/i.test(content);
}
export function estimateReadTime(content) {
    const text = isHtmlContent(content) ? content.replace(/<[^>]*>/g, " ") : content;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}
