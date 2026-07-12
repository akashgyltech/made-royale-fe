import React from "react";
import { Metadata } from "next";
import BlogListMain from "@/pages/blog/blog-list-main";

export const metadata: Metadata = { title: "The Journal — Made Royale" };

const BlogPage = () => <BlogListMain />;
export default BlogPage;
