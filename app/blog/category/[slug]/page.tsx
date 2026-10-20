import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, FolderOpen, User } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { getPublishedBlogsByCategory, getCategories } from "@/app/admin/blog/actions";
import { resolveBlogThumbnail } from "@/lib/blogImage";
import { slugify } from "@/lib/brandedDownloads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find(
    (c: any) =>
      c.slug === slug ||
      slugify(c.name) === slug ||
      c.name.toLowerCase() === decodeURIComponent(slug).toLowerCase()
  );

  const title = cat ? `${cat.name} — Fable Journal` : "Category Archive";
  const description = cat?.description || "Browse articles and guides in this topic.";

  return { title, description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug);
  const categories = await getCategories();
  const cat = categories.find(
    (c: any) =>
      c.slug === cleanSlug ||
      slugify(c.name) === cleanSlug ||
      c.name.toLowerCase() === cleanSlug.toLowerCase()
  );

  const categoryName = cat?.name || cleanSlug.replace(/-/g, " ");
  const posts = await getPublishedBlogsByCategory(categoryName);

  return (
    <>
      <section className="border-b border-[#E7DDD2] bg-[linear-gradient(180deg,#FFF9F2,#FFFDF9)] py-14 sm:py-18">
        <Container>
          <div className="max-w-3xl space-y-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors"
            >
              <ArrowLeft className="size-4" /> All Topics
            </Link>

            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E2] text-[#D96B2B] text-xs font-bold uppercase tracking-wider border border-[#D96B2B]/20">
              <FolderOpen className="size-3.5" />
              <span>Topic Archive</span>
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0B1F33] leading-none tracking-tight capitalize">
              {categoryName}
            </h1>

            {cat?.description && (
              <p className="text-base sm:text-lg text-[#526171] leading-relaxed">
                {cat.description}
              </p>
            )}

            <p className="text-xs font-semibold text-[#98A2B3]">
              Showing {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-[#FFFDF9] py-14 sm:py-18">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-[#E7DDD2] bg-white max-w-xl mx-auto">
              <FolderOpen className="size-10 text-[#D96B2B] mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-[#0B1F33]">
                No articles yet in this topic
              </h3>
              <p className="text-sm text-[#667085] mt-1">
                Stories are currently being written for this collection.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-colors"
              >
                Browse All Topics <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden hover:border-[#D96B2B]/60 transition-all hover:shadow-lg"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-[#F3E8DA]"
                  >
                    <Image
                      src={resolveBlogThumbnail(post.image, post.coverImage || post.cover_image)}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs leading-relaxed text-[#667085] mt-2 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#98A2B3] pt-4 border-t border-[#F0EAE2]">
                      <span className="font-semibold text-[#0B1F33]">
                        {post.author || "Editorial"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime || "3 min read"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
