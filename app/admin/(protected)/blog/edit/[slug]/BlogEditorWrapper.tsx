"use client";

import BlogEditor from "@/components/admin/BlogEditor";
import { updateBlog } from "@/app/admin/blog/actions";

export default function BlogEditorWrapper({
  initialData,
  slug,
  categories = [],
}: {
  initialData: any;
  slug: string;
  categories?: { id?: string; _id?: string; name: string }[];
}) {
  const handleUpdate = async (formData: FormData) => {
    return await updateBlog(decodeURIComponent(slug), formData);
  };

  return (
    <BlogEditor
      key={slug}
      isEdit
      initialData={initialData}
      onSubmit={handleUpdate}
      categories={categories}
    />
  );
}
