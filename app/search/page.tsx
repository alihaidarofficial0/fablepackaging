import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Search, Sparkles, X } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getPublishedBlogs } from "@/app/admin/blog/actions";
import { resolveBlogThumbnail } from "@/lib/blogImage";

export const metadata: Metadata = {
  title: "Search Articles | Fable Journal",
  description:
    "Search essays, case studies, dieline guides, and material investigations across the Fable Journal archive.",
};

function matches(query: string, ...values: (string | null | undefined)[]) {
  const haystack = values.filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(query);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQuery = "" } = await searchParams;
  const query = rawQuery.trim().toLowerCase().slice(0, 100);

  const allPosts = await getPublishedBlogs();

  const results = query
    ? allPosts.filter((post) =>
        matches(
          query,
          post.title,
          post.excerpt,
          post.category,
          post.author,
          post.tags?.join(" "),
          post.content
        )
      )
    : [];

  const popularSearches = [
    "Sustainability",
    "Kraft",
    "Paperboard",
    "Dielines",
    "Foil Stamping",
    "Finishes",
    "Luxury",
  ];

  return (
    <section className="min-h-[calc(100vh-220px)] bg-[#FFF9F2] py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
            <BookOpen className="size-3.5" />
            <span>Search The Journal</span>
          </span>
          <h1 className="mt-3 font-serif text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.05] tracking-[-0.03em] text-[#0B1F33]">
            Search articles &amp; archives
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#526171] sm:text-lg">
            Search across our entire library of packaging essays, material studies,
            production breakdowns, and design theory.
          </p>
        </div>

        {/* Search bar */}
        <form
          action="/search"
          method="GET"
          className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
          role="search"
        >
          <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#E7DDD2] bg-white px-4 text-[#667085] focus-within:border-[#D96B2B] focus-within:ring-2 focus-within:ring-[#D96B2B]/15 transition-all">
            <Search className="size-5 shrink-0 text-[#D96B2B]" aria-hidden="true" />
            <input
              name="q"
              defaultValue={rawQuery}
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-base text-[#0B1F33] outline-none placeholder:text-[#98A2B3]"
              placeholder="Search by topic, material, finish, or keyword…"
            />
            {rawQuery && (
              <Link
                href="/search"
                aria-label="Clear search"
                className="grid size-9 place-items-center rounded-lg transition-colors hover:bg-[#FFF4E9] hover:text-[#D96B2B]"
              >
                <X className="size-4" />
              </Link>
            )}
          </label>
          <button
            type="submit"
            className="h-14 rounded-xl bg-[#D96B2B] px-8 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420]"
          >
            Search
          </button>
        </form>

        {/* Results or Suggestions */}
        {query ? (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-4 border-b border-[#E7DDD2] pb-4">
              <h2 className="font-serif text-2xl text-[#0B1F33]">
                Results for &ldquo;{rawQuery}&rdquo;
              </h2>
              <p className="text-sm font-semibold text-[#667085]">
                {results.length} {results.length === 1 ? "article" : "articles"} found
              </p>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => {
                  const thumb = resolveBlogThumbnail(post.image, post.thumbnail);
                  return (
                    <article
                      key={post.slug || post.id}
                      className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden transition-all hover:border-[#D96B2B] hover:shadow-lg"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block aspect-[16/10] overflow-hidden bg-[#F3E8DA]"
                      >
                        <Image
                          src={thumb}
                          alt={post.thumbnailAlt || post.imageAlt || post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {post.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B1F33]/85 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                            {post.category}
                          </span>
                        )}
                      </Link>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-[#667085] mb-2.5">
                          {post.readTime && (
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="size-3 text-[#D96B2B]" />
                              <span>{post.readTime} min read</span>
                            </span>
                          )}
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3 text-[#D96B2B]" />
                              <span>
                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#0B1F33] leading-snug line-clamp-2 mb-2 group-hover:text-[#D96B2B] transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        {post.excerpt && (
                          <p className="text-sm text-[#526171] line-clamp-3 leading-relaxed mb-4 flex-1">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="pt-4 border-t border-[#E7DDD2]/70 mt-auto">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D96B2B] group-hover:text-[#BC5420] transition-colors"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-[#E7DDD2] bg-white px-6 py-16 text-center">
                <p className="font-serif text-2xl text-[#0B1F33]">No articles found</p>
                <p className="mt-2 text-sm leading-relaxed text-[#667085] max-w-md mx-auto">
                  We couldn&rsquo;t find any articles matching &ldquo;{rawQuery}&rdquo;. Try
                  searching for broader packaging topics like kraft, rigid boxes, or sustainability.
                </p>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B1F33] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D96B2B] transition-colors"
                >
                  <BookOpen className="size-4" />
                  <span>Browse All Articles</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-[#E7DDD2] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-4">
              <Sparkles className="size-4 text-[#D96B2B]" />
              <span>Recommended Topics &amp; Themes</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="inline-flex items-center rounded-xl border border-[#E7DDD2] bg-[#FFF9F2] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-all hover:border-[#D96B2B] hover:bg-white hover:text-[#D96B2B] hover:shadow-xs"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
