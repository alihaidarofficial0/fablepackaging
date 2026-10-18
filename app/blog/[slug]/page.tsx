import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { blogContentToHtml } from "@/lib/blog-content";

function formatDate(value?: string | null) {
  if (!value) return "Fable Journal";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: { title: post.seo_title || post.title, description: post.seo_description || post.excerpt, images: post.image ? [{ url: post.image, alt: post.alt }] : [] },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleHtml = blogContentToHtml(post.content);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fablepack.co";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [`${post.image.startsWith("http") ? "" : base}${post.image}`] : [],
    datePublished: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Fable Packaging" },
    publisher: { "@type": "Organization", name: "Fable Packaging", url: base },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <article className="bg-[#FFFDF9]">
        <header className="border-b border-[#E7DDD2] bg-[linear-gradient(120deg,#FFF9F2,#F3E8DA)] py-12 sm:py-16 lg:py-20">
          <Container>
            <Link href="/blog" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#D96B2B] outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><ArrowLeft className="size-4" />Back to journal</Link>
            <div className="mt-8 max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#D96B2B]">{post.category || "Packaging insight"}</p>
              <h1 className="mt-4 font-serif text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.98] tracking-[-0.045em] text-[#0B1F33]">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#526171]">{post.excerpt}</p>
              <p className="mt-6 text-sm font-semibold text-[#667085]">{formatDate(post.published_at)}{post.author ? ` · By ${post.author}` : ""}</p>
            </div>
          </Container>
        </header>

        <Container className="py-10 sm:py-14 lg:py-16">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#E7DDD2] bg-[#F3E8DA]">
            <Image src={post.image} alt={post.alt} fill priority sizes="(max-width: 1320px) 100vw, 1320px" className="object-cover" />
          </div>
          <div className="blog-article-content mx-auto max-w-3xl py-10 sm:py-14" dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </Container>
      </article>

      {related.length ? <section className="border-t border-[#E7DDD2] bg-[#FFF9F2] py-14"><Container><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#D96B2B]">Keep reading</p><h2 className="mt-3 font-serif text-4xl text-[#0B1F33]">More from the journal</h2></div><Link href="/blog" className="hidden items-center gap-2 text-sm font-bold text-[#D96B2B] sm:inline-flex">View all <ArrowRight className="size-4" /></Link></div><div className="mt-8 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.id || item.slug} href={`/blog/${item.slug}`} className="rounded-xl border border-[#E7DDD2] bg-white p-5 transition-colors hover:border-[#D96B2B]/55"><span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#D96B2B]">{item.category || "Packaging"}</span><h3 className="mt-3 font-serif text-xl leading-6 text-[#0B1F33]">{item.title}</h3><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#D96B2B]">Read article <ArrowRight className="size-4" /></span></Link>)}</div></Container></section> : null}
    </>
  );
}
