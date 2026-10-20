import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getPublishedBlogs, getCategories } from "@/app/admin/blog/actions";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";

export const metadata: Metadata = {
  title: "All Articles & Essays | Fable Journal",
  description:
    "The complete archive of packaging essays, material studies, dieline guides, and creative direction from Fable Packaging.",
};

export default async function BlogArchivePage() {
  const [posts, categories] = await Promise.all([
    getPublishedBlogs(),
    getCategories(),
  ]);

  const featured = posts.find((p) => p.isFeatured || p.featured) || posts[0];
  const list = featured ? posts.filter((p) => p.slug !== featured.slug) : posts.slice(1);

  return (
    <>
      {/* HERO HEADER */}
      <section className="border-b border-[#E7DDD2] bg-[linear-gradient(180deg,#FFF9F2,#FFFDF9)] py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <BookOpen className="size-3.5 text-[#D96B2B]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#D96B2B]">
                Editorial Archive
              </span>
              <span className="h-px w-8 bg-[#D96B2B]/40" />
              <span className="text-[10px] font-semibold text-[#98A2B3] uppercase tracking-widest">
                {posts.length} Stories
              </span>
            </div>

            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#0B1F33] leading-[1.06] tracking-tight">
                Ideas worth{" "}
                <em className="not-italic text-[#D96B2B]">unpacking.</em>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#526171] leading-relaxed max-w-xl">
                Curated investigations into packaging engineering, sustainable substrates,
                typography, and tactile craft — for ambitious brands and makers.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E7DDD2]">
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#BC5420] shadow-sm"
              >
                All Topics
              </Link>
              {categories.map((cat: any, idx: number) => (
                <Link
                  key={`cat-${idx}-${cat.id || cat.slug || cat.name}`}
                  href={`/blog/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-[#E7DDD2] text-[#667085] hover:border-[#D96B2B] hover:text-[#D96B2B] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURED LEAD POST */}
      {featured && (
        <section className="bg-[#FFFDF9] py-10 border-b border-[#E7DDD2]">
          <Container>
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-[#E7DDD2] bg-white hover:border-[#D96B2B]/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(217,107,43,0.12)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
                {/* Image */}
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-[#F3E8DA]">
                  <Image
                    src={resolveBlogCover(featured.image, featured.coverImage || featured.cover_image)}
                    alt={featured.coverImageAlt || featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D96B2B]/10 text-[#D96B2B] text-[10px] font-extrabold uppercase tracking-[0.18em]">
                        <TrendingUp className="size-3" /> Featured Essay
                      </span>
                      {featured.category && (
                        <span className="text-[10px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                          {featured.category}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#0B1F33] leading-snug group-hover:text-[#D96B2B] transition-colors">
                      {featured.title}
                    </h2>

                    <p className="text-sm text-[#526171] leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-[#F0EAE2] pt-5">
                    <div className="flex items-center gap-3 text-xs text-[#98A2B3]">
                      <span className="font-bold text-[#0B1F33] text-sm">
                        {featured.author || "Editorial Staff"}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-[#D96B2B]" />
                        {featured.readTime || "6 min read"}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0B1F33] text-white text-xs font-bold uppercase tracking-wider group-hover:bg-[#D96B2B] transition-all duration-300">
                      Read Essay <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ARTICLE GRID */}
      <section className="bg-[#FFFDF9] py-12 sm:py-16">
        <Container>
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E7DDD2]">
            <div className="flex items-center gap-2.5">
              <span className="h-4 w-0.5 bg-[#D96B2B] rounded-full" />
              <h2 className="font-serif text-lg font-bold text-[#0B1F33]">All Stories</h2>
              <span className="text-xs text-[#98A2B3] font-medium">{list.length} articles</span>
            </div>
            <span className="text-xs font-semibold text-[#D96B2B] uppercase tracking-wider">
              Latest First
            </span>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="size-10 text-[#E7DDD2] mx-auto mb-4" />
              <p className="font-serif text-2xl text-[#0B1F33]">No additional articles yet.</p>
              <p className="text-sm text-[#667085] mt-1">Check back soon for new stories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden hover:border-[#D96B2B]/40 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(217,107,43,0.10)]"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#F3E8DA] shrink-0"
                  >
                    <Image
                      src={resolveBlogThumbnail(post.image, post.coverImage || post.cover_image)}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#D96B2B] shadow-sm">
                      {post.category || "Journal"}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-serif text-[1.05rem] font-bold text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors line-clamp-2 leading-snug mb-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs leading-relaxed text-[#667085] line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0EAE2]">
                      <span className="text-[11px] font-bold text-[#0B1F33]">
                        {post.author || "Editorial"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-[#98A2B3]">
                          <Clock className="size-3 text-[#D96B2B]" />
                          {post.readTime || "4 min read"}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          aria-label={`Read ${post.title}`}
                          className="grid size-7 place-items-center rounded-lg bg-[#F3E8DA] text-[#D96B2B] hover:bg-[#D96B2B] hover:text-white transition-all"
                        >
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
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
