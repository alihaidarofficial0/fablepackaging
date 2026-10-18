import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getBlogPosts } from "@/lib/content";
import type { CmsBlogPost } from "@/types/cms";

export const metadata: Metadata = {
  title: "Packaging Ideas & Guides",
  description: "Practical custom packaging guides, material advice, design ideas, and production insights from Fable Packaging.",
};

function formatDate(value?: string | null) {
  if (!value) return "Fable Journal";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function BlogCard({ post }: { post: CmsBlogPost }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E7DDD2] bg-white transition-colors hover:border-[#D96B2B]/55">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F3E8DA]">
          <Image src={post.image} alt={post.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#D96B2B]"><span>{post.category || "Packaging"}</span><span className="size-1 rounded-full bg-[#D9D0C7]" /><time dateTime={post.published_at || undefined} className="text-[#667085]">{formatDate(post.published_at)}</time></div>
          <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2rem)] leading-[1.12] tracking-[-0.025em] text-[#0B1F33]">{post.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{post.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#D96B2B]">Read article <ArrowRight className="size-4" aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featured = posts.find((post) => post.featured) || posts[0];
  const remaining = featured ? posts.filter((post) => post.slug !== featured.slug) : [];

  return (
    <>
      <section className="border-b border-[#E7DDD2] bg-[linear-gradient(120deg,#FFF9F2,#F3E8DA)] py-16 sm:py-20 lg:py-24">
        <Container>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Fable journal</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[clamp(3rem,7vw,5.6rem)] leading-[0.98] tracking-[-0.045em] text-[#0B1F33]">Ideas worth unpacking.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#526171] sm:text-lg">Practical packaging guidance, material notes, production advice, and inspiration for growing brands.</p>
        </Container>
      </section>

      <section className="bg-[#FFFDF9] py-14 sm:py-18 lg:py-20">
        <Container>
          {featured ? (
            <>
              <article className="group grid overflow-hidden rounded-2xl border border-[#E7DDD2] bg-white lg:grid-cols-[1.15fr_.85fr]">
                <Link href={`/blog/${featured.slug}`} className="relative min-h-[300px] overflow-hidden bg-[#F3E8DA] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B] lg:min-h-[430px]">
                  <Image src={featured.image} alt={featured.alt} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                </Link>
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#D96B2B]">Featured · {featured.category || "Packaging"}</p>
                  <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,3.3rem)] leading-[1.05] tracking-[-0.035em] text-[#0B1F33]">{featured.title}</h2>
                  <p className="mt-5 text-base leading-7 text-[#667085]">{featured.excerpt}</p>
                  <p className="mt-5 text-xs font-semibold text-[#98A2B3]">{formatDate(featured.published_at)}{featured.author ? ` · ${featured.author}` : ""}</p>
                  <Link href={`/blog/${featured.slug}`} className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#D96B2B] px-5 text-sm font-bold text-white transition-colors hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">Read featured article <ArrowRight className="size-4" /></Link>
                </div>
              </article>

              {remaining.length ? <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{remaining.map((post) => <BlogCard key={post.id || post.slug} post={post} />)}</div> : null}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D9D0C7] bg-white px-6 py-20 text-center">
              <BookOpen className="mx-auto size-10 text-[#D96B2B]" aria-hidden="true" />
              <h2 className="mt-5 font-serif text-3xl text-[#0B1F33]">The journal is being prepared.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#667085]">Publish your first article from the Blog section in the admin panel and it will appear here automatically.</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
