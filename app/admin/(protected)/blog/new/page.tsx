"use client";

import BlogEditor from "@/components/admin/BlogEditor";
import { addBlog } from "@/app/admin/blog/actions";

export default function NewBlogPage() {
  return <BlogEditor onSubmit={addBlog} />;
}
