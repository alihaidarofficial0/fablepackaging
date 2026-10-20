import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Play,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/app/admin/blog/actions";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";
import { sanitizeBlogContent } from "@/lib/blog-content";

function formatDate(value?: string | null) {
  if (!value) return "Recently published";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  const title = post.seoTitle || post.seo_title || post.title;
  const description = post.seoDescription || post.seo_description || post.excerpt;
  const cover = resolveBlogCover(post.image, post.coverImage || post.cover_image);
  const canonical = post.canonicalLink || post.canonical_link;
  const noIndex = post.noIndex === true || post.no_index === true;

  return {
    title,
    description,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover, alt: post.coverImageAlt || post.title }] : [],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPublishedBlogBySlug(slug),
    getPublishedBlogs(),
  ]);

  if (!post) notFound();

  const related = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleHtml = sanitizeBlogContent(post.content || "");

  const coverUrl = resolveBlogCover(post.image, post.coverImage || post.cover_image);
  const coverAlt = post.coverImageAlt || post.imageAlt || post.title;
  const embedVideo = getEmbedUrl(post.videoUrl || post.video_url);

  const faqs = Array.isArray(post.faqs) ? post.faqs : [];
  const faqTitle = post.faqTitle || post.faq_title || "Frequently Asked Questions";
  const faqDescription = post.faqDescription || post.faq_description;
  const faqImage = post.faqImage || post.faq_image;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fablepack.co";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: coverUrl ? [`${coverUrl.startsWith("http") ? "" : base}${coverUrl}`] : [],
    datePublished: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Editorial Staff" },
    publisher: { "@type": "Organization", name: "Fable Journal", url: base },
  };

  const schemaScript = post.schemaScript || post.schema_script;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {schemaScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaScript.replace(/<\/?script[^>]*>/gi, ""),
          }}
        />
      )}

      <article className="bg-[#FFFDF9] pb-16">
        {/* Article Header */}
        <header className="border-b border-[#E7DDD2] bg-[linear-gradient(180deg,#FFF9F2,#FFFDF9)] py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="w-full space-y-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors"
              >
                <ArrowLeft className="size-4" /> Back to Journal
              </Link>

              <div className="space-y-4">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FFF0E2] text-[#D96B2B] text-xs font-bold uppercase tracking-wider border border-[#D96B2B]/20">
                  {post.category || "Journal"}
                </span>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-bold text-[#0B1F33] leading-[1.08] tracking-tight">
                  {post.title}
                </h1>

                <p className="text-lg sm:text-2xl text-[#526171] leading-relaxed max-w-5xl">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E7DDD2] text-xs font-semibold text-[#667085]">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#FFF4E9] text-[#D96B2B] flex items-center justify-center font-bold">
                    <User className="size-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-[#0B1F33]">
                      {post.author || "Editorial Staff"}
                    </span>
                    <span className="block text-[11px] text-[#98A2B3]">
                      {formatDate(post.published_at)} · {post.readTime || "4 min read"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7DDD2] bg-white text-[#0B1F33]">
                    <Bookmark className="size-3.5 text-[#D96B2B]" />
                    <span>Curated Read</span>
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Hero Cover Image */}
        {coverUrl && (
          <Container className="pt-10 sm:pt-14">
            <div className="w-full">
              <div className="relative aspect-[21/9] sm:aspect-[2.2/1] overflow-hidden rounded-3xl border border-[#E7DDD2] bg-[#F3E8DA] shadow-xl">
                <Image
                  src={coverUrl}
                  alt={coverAlt}
                  fill
                  priority
                  sizes="(max-width: 1320px) 100vw, 1320px"
                  className="object-cover"
                />
              </div>
              {post.coverImageAlt && (
                <p className="mt-2 text-center text-xs text-[#98A2B3] italic">
                  {post.coverImageAlt}
                </p>
              )}
            </div>
          </Container>
        )}

        {/* Article Body */}
        <Container className="py-12 sm:py-16">
          <div className="w-full">
            <div
              className="blog-article-content prose prose-lg sm:prose-xl max-w-none prose-headings:font-serif prose-headings:text-[#0B1F33] prose-a:text-[#D96B2B] prose-blockquote:border-l-[#D96B2B] prose-blockquote:text-[#526171] prose-blockquote:font-serif leading-relaxed text-[#0B1F33]"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            {/* Embedded Video (Optional) */}
            {embedVideo && (
              <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-[#E7DDD2] bg-[#FFF9F2] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B]">
                  <Play className="size-4" />
                  <span>Featured Video</span>
                </div>
                {post.videoTitle && (
                  <h3 className="font-serif text-2xl font-bold text-[#0B1F33]">
                    {post.videoTitle}
                  </h3>
                )}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E7DDD2] bg-black shadow-md">
                  <iframe
                    src={embedVideo}
                    title={post.videoTitle || "Article Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              </div>
            )}

            {/* Per-Post FAQ Section (Optional) */}
            {faqs.length > 0 && (
              <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-[#E7DDD2] bg-white shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B]">
                  <HelpCircle className="size-4" />
                  <span>Topic Questions</span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F33]">
                    {faqTitle}
                  </h3>
                  {faqDescription && (
                    <p className="text-sm text-[#667085] mt-1">{faqDescription}</p>
                  )}
                </div>

                {faqImage && (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E7DDD2]">
                    <Image
                      src={faqImage}
                      alt={post.faqImageAlt || "FAQ Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4 pt-2 divide-y divide-[#F0EAE2]">
                  {faqs.map((faq: any, i: number) => (
                    <details key={i} className="pt-4 group cursor-pointer">
                      <summary className="font-serif font-bold text-lg text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors list-none flex items-center justify-between">
                        <span>{faq.question}</span>
                        <span className="text-[#D96B2B] text-xl font-mono ml-4 shrink-0">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-[#667085] pl-2 border-l-2 border-[#D96B2B]/40">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            <div className="mt-16 rounded-3xl border border-[#E7DDD2] bg-[#FFF9F2] overflow-hidden">
              <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
                <div className="size-20 rounded-2xl bg-[#FFF0E2] text-[#D96B2B] flex items-center justify-center font-bold shrink-0 border border-[#D96B2B]/30">
                  <User className="size-10" />
                </div>
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D96B2B]">
                      About the Author
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#0B1F33] mt-0.5">
                      {post.author || "Editorial Staff"}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-[#526171] max-w-3xl">
                    Writing on packaging engineering, circular material substrates, typography, and structural design for the Fable Packaging journal. Covers the intersection of craft, ecology, and consumer experience.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors"
                    >
                      Read all articles from this author <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-[#E7DDD2] bg-[#FFF9F2] py-16 sm:py-20">
          <Container>
            <div className="w-full">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                    Keep Exploring
                  </p>
                  <h2 className="font-serif text-3xl font-bold text-[#0B1F33] mt-1">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] flex items-center gap-1.5"
                >
                  View Archive <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((item) => (
                  <article
                    key={item.id || item.slug}
                    className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden hover:border-[#D96B2B]/60 transition-all hover:shadow-md"
                  >
                    <Link
                      href={`/blog/${item.slug}`}
                      className="relative aspect-[16/10] overflow-hidden bg-[#F3E8DA]"
                    >
                      <Image
                        src={resolveBlogThumbnail(item.image, item.coverImage || item.cover_image)}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-5 flex flex-1 flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96B2B]">
                          {item.category || "Journal"}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors line-clamp-2 mt-1 leading-snug">
                          <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                        </h4>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#D96B2B]">
                        Read story <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
