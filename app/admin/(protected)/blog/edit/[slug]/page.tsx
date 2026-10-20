import { notFound } from "next/navigation";
import BlogEditorWrapper from "./BlogEditorWrapper";
import { getBlogBySlug, getCategories } from "@/app/admin/blog/actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const raw = (await params).slug;
  const slug = decodeURIComponent(raw);

  const [post, categories] = await Promise.all([
    getBlogBySlug(slug),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogEditorWrapper initialData={post} slug={slug} categories={categories} />;
}
