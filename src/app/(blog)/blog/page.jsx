import React from "react";
import BlogListMain from "@/page-content/blog/blog-list-main";
import { cmsApi } from "@/lib/store-api";
import { buildPageMetadata } from "@/lib/seo-cms";
export async function generateMetadata() {
    return buildPageMetadata("blog", {
        title: "The Journal — Shizenta",
        description: "Stories on craft, design and interiors from Shizenta.",
        path: "/blog",
    });
}
function first(v) {
    return Array.isArray(v) ? v[0] : v;
}
const BlogPage = async ({ searchParams }) => {
    const sp = await searchParams;
    const category = first(sp.category);
    const tag = first(sp.tag);
    const search = first(sp.search);
    const pageParam = first(sp.page);
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
    // Public listing — fetched server-side. The DB may simply have no posts yet (real empty
    // state, not an error) or the request may fail; either way we render an empty list and
    // let BlogListMain show the "No posts yet" state rather than crashing the page.
    let result = null;
    try {
        result = await cmsApi.getBlogs({ page, limit: 9, category, tag, search });
    }
    catch {
        result = null;
    }
    return (<BlogListMain blogs={result?.results ?? []} page={result?.page ?? page} totalPages={result?.totalPages ?? 1} totalResults={result?.totalResults ?? 0} category={category} tag={tag} search={search}/>);
};
export default BlogPage;
