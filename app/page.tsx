import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  Layers,
  Leaf,
  Package,
  PenLine,
  Printer,
  Quote,
  Recycle,
  Ruler,
  ShoppingBag,
  TrendingUp,
  User,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getBlogs, getCategories } from "@/app/admin/blog/actions";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getPageContent, getHomeSectionVisibility } from "@/lib/content";
import { homepageDefaults } from "@/lib/admin-homepage";

export const metadata: Metadata = {
  title: "Fable Journal — Packaging Design, Craftsmanship & Material Culture",
  description:
    "In-depth packaging essays, material studies, dieline guides, and sustainable craftsmanship for ambitious brands and creators.",
};

export default async function HomePage() {
  const [blogs, categories, pageContent, sectionVisibility] = await Promise.all([
    getBlogs(),
    getCategories(),
    getPageContent("home"),
    getHomeSectionVisibility(),
  ]);

  const val = (key: string, fallback?: string) => {
    const raw = pageContent[key];
    if (raw !== undefined && raw.trim() !== "") return raw;
    if (fallback !== undefined) return fallback;
    return homepageDefaults[key] || "";
  };

  const isVisible = (secKey: string) => sectionVisibility[secKey] !== false;

  const published = blogs.filter((b) => b.status === "Published" || !b.status);

  // 1. Featured Lead Pick - Defaults to the premier architectural packaging feature
  const preferredSlug = val("featured_story_slug", "architectural-unboxing-structural-engineering-dtc");
  const featured =
    published.find((p) => p.slug === preferredSlug) ||
    published.find((p) => p.slug === "architectural-unboxing-structural-engineering-dtc") ||
    published.find((p) => p.isFeatured || p.featured) ||
    published[0];

  // Remaining articles (prioritizes high-end editorial packaging photography)
  const remaining = (featured ? published.filter((p) => p.slug !== featured.slug) : published.slice(1))
    .sort((a, b) => {
      const aHasLogo = (a.image || "").includes("western") || (a.image || "").includes("logo");
      const bHasLogo = (b.image || "").includes("western") || (b.image || "").includes("logo");
      if (aHasLogo && !bHasLogo) return 1;
      if (!aHasLogo && bHasLogo) return -1;
      return 0;
    });

  // 2. Trending / Editor's List (Next 3-4 articles)
  const trending = remaining.slice(0, 4);

  // 3. Material Lab / Deep-Dives (Articles in Materials Guide or Sustainability)
  const materialSpotlights = published
    .filter(
      (p) =>
        p.slug !== featured?.slug &&
        (p.category === "Materials Guide" ||
          p.category === "Materials" ||
          p.category === "Sustainability" ||
          p.category === "Design & Craft")
    )
    .slice(0, 3);

  // 4. Archive Grid (Up to 6 articles)
  const archiveStories = remaining.slice(2, 8).length >= 3
    ? remaining.slice(2, 8)
    : remaining.slice(0, 6);

  return (
    <>
      {/* ─── 1. FEATURED STORY + LATEST ARTICLES (Premier Above-The-Fold Section) ─── */}
      {featured && isVisible("featured_story") && (
        <section id="featured-story" className="bg-[#FFFDF9] pt-3 pb-5 sm:pt-4 sm:pb-6 border-b border-[#E7DDD2]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr_0.82fr] gap-0 rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden">

              {/* Col 1 — Cover image */}
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative min-h-[260px] lg:min-h-[460px] block overflow-hidden bg-[#F3E8DA]"
              >
                <Image
                  src={resolveBlogCover(featured.image, featured.coverImage || featured.cover_image)}
                  alt={featured.coverImageAlt || featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </Link>

              {/* Col 2 — Featured story text */}
              <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-7 border-t lg:border-t-0 lg:border-x border-[#E7DDD2]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D96B2B]">
                      {val("featured_badge", "Featured Story")}
                    </span>
                    <span className="h-px w-5 bg-[#D96B2B]/30" />
                    <span className="text-[10px] font-semibold text-[#8C98A4]">Issue 04</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-[#0B1F33] leading-[1.18] tracking-tight mb-2.5 hover:text-[#D96B2B] transition-colors line-clamp-3">
                    <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#526171] leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#F0EAE2] flex items-center justify-between text-xs text-[#98A2B3] mt-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-medium text-[#526171]">
                      <Clock className="size-3 text-[#D96B2B]" />
                      {featured.readTime || "6 min read"}
                    </span>
                    <span>·</span>
                    <span className="text-[#D96B2B] font-bold uppercase tracking-wider text-[11px]">{featured.category}</span>
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-xs text-[#D96B2B] hover:text-[#BC5420] transition-colors"
                  >
                    Read Essay <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>

              {/* Col 3 — Latest Articles sidebar */}
              <div className="flex flex-col border-t lg:border-t-0 border-[#E7DDD2]">
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#E7DDD2] bg-[#FAF7F2]/40">
                  <h3 className="font-serif font-bold text-sm text-[#0B1F33]">
                    {val("featured_sidebar_title", "Latest Articles")}
                  </h3>
                  <Link
                    href="/blog"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] flex items-center gap-1 transition-colors"
                  >
                    {val("featured_sidebar_cta", "View All")} <ArrowRight className="size-2.5" />
                  </Link>
                </div>
                <div className="divide-y divide-[#F0EAE2] flex-1 flex flex-col">
                  {remaining.slice(0, 4).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center gap-3 px-5 py-2 hover:bg-[#FFFDF9] transition-colors"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#F3E8DA]">
                        <Image
                          src={resolveBlogThumbnail(post.image, post.coverImage || post.cover_image)}
                          alt={post.imageAlt || post.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#D96B2B]">
                          {post.category || "Essay"}
                        </p>
                        <h4 className="font-serif text-[13px] font-bold text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors line-clamp-2 leading-snug mt-0.5">
                          {post.title}
                        </h4>
                        <p className="text-[10px] text-[#98A2B3] mt-0.5">
                          {post.readTime || "4 min read"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </Container>
        </section>
      )}

      {/* ─── 2. CATEGORY QUICK-LINKS STRIP ──────────────────────────────────── */}
      {isVisible("quick_strip") && (
        <section className="border-b border-[#E7DDD2] bg-[#FFFDF9]">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 sm:py-3.5">
              {[
                {
                  label: val("quick_strip_item_1_label", "Structural Design"),
                  href: val("quick_strip_item_1_url", "/blog/category/box-styles-structural-design"),
                },
                {
                  label: val("quick_strip_item_2_label", "Materials & Sustainability"),
                  href: val("quick_strip_item_2_url", "/blog/category/materials-substrates"),
                },
                {
                  label: val("quick_strip_item_3_label", "Print & Finishing"),
                  href: val("quick_strip_item_3_url", "/blog/category/printing-luxury-finishes"),
                },
                {
                  label: val("quick_strip_item_4_label", "Brand Case Studies"),
                  href: val("quick_strip_item_4_url", "/blog/category/industry-solutions"),
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-2 text-xs sm:text-[13px] font-semibold tracking-wide text-[#2C3E50] hover:text-[#D96B2B] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[#D96B2B] text-sm group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 4. TRENDING ESSAYS (NUMBERED EDITORIAL LIST) ───────────────────── */}
      {trending.length > 0 && isVisible("trending") && (
        <section className="bg-white py-14 sm:py-18 border-b border-[#E7DDD2]">
          <Container>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#D96B2B] mb-2">
              <TrendingUp className="size-4" />
              <span>{val("trending_eyebrow", "Trending Across The Journal")}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0B1F33] mb-8">
              {val("trending_title", "Most Read This Month")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((post, idx) => (
                <article
                  key={post.id || post.slug}
                  className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] overflow-hidden hover:bg-white hover:border-[#D96B2B] transition-all hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/9] overflow-hidden bg-[#F3E8DA] shrink-0"
                  >
                    <Image
                      src={resolveBlogThumbnail(post.image, post.coverImage || post.cover_image)}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 font-serif text-2xl font-bold text-white/90 drop-shadow-md">
                      0{idx + 1}
                    </span>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96B2B] bg-[#FFF4E9] px-2.5 py-1 rounded-md">
                        {post.category || "Essay"}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors line-clamp-2 leading-snug mt-2 mb-1">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E7DDD2]/60 flex items-center justify-between text-[11px] text-[#98A2B3]">
                      <span className="font-medium text-[#0B1F33]">
                        {post.author || "Editorial"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-[#D96B2B]" />
                        {post.readTime || "4 min"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 5. CURATED TOPICS & THEMES ────────────────────────────────────── */}
      {categories.length > 0 && isVisible("topics") && (
        <section id="topics" className="bg-[#FFFDF9] py-14 sm:py-18 border-b border-[#E7DDD2]">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                  {val("topics_eyebrow", "Curated Themes")}
                </p>
                <h2 className="font-serif text-3xl font-bold text-[#0B1F33] mt-1">
                  {val("topics_title", "Explore by Topic")}
                </h2>
                <p className="text-sm text-[#667085] mt-2 max-w-xl">
                  {val("topics_body", "Every article lives inside a carefully curated topic — pick one and go deep.")}
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] flex items-center gap-1.5 shrink-0"
              >
                {val("topics_cta_label", "All Categories")} <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {(() => {
                const iconMap: Record<string, React.ElementType> = {
                  "Box Styles & Structural Design": Package,
                  "Materials & Substrates": Layers,
                  "Sustainable Packaging": Recycle,
                  "Printing & Luxury Finishes": Printer,
                  "E-Commerce & Unboxing": ShoppingBag,
                  "Industry Solutions": Award,
                  "Prepress & Design Guides": Ruler,
                };
                return categories.slice(0, 8).map((cat: any, idx: number) => {
                  const Icon = iconMap[cat.name] || FileText;
                  return (
                    <Link
                      key={`cat-${idx}-${cat.id || cat._id || cat.slug || cat.name}`}
                      href={`/blog/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group flex flex-col gap-4 p-6 rounded-2xl border border-[#E7DDD2] bg-white hover:border-[#D96B2B] hover:shadow-lg transition-all"
                    >
                      <div className="size-12 rounded-xl bg-[#FFF4E9] flex items-center justify-center text-[#D96B2B] group-hover:bg-[#D96B2B] group-hover:text-white transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#0B1F33] group-hover:text-[#D96B2B] transition-colors leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#667085] mt-1.5 leading-relaxed line-clamp-2">
                          {cat.description || "In-depth explorations, guides and case studies."}
                        </p>
                      </div>
                      <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D96B2B] group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  );
                });
              })()}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 6. THE MATERIAL & CRAFT LAB (DARK CONTRAST SECTION) ───────────── */}
      {materialSpotlights.length > 0 && isVisible("material_lab") && (
        <section className="bg-[#0B1F33] py-16 sm:py-20 text-white relative overflow-hidden border-b border-[#0B1F33]">
          <div className="absolute top-0 right-0 size-96 rounded-full bg-[#D96B2B]/10 blur-3xl pointer-events-none" />
          <Container className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
                  <Layers className="size-4" />
                  <span>{val("lab_eyebrow", "The Material Lab")}</span>
                </span>
                <h2 style={{ color: "#FFFFFF" }} className="font-serif text-3xl sm:text-4xl font-bold !text-white mt-2">
                  {val("lab_title", "Substrates, Finishes & Engineering")}
                </h2>
                <p className="text-sm text-white/70 mt-2 max-w-xl leading-relaxed">
                  {val("lab_body", "Deep investigations into greyboard calipers, unbleached kraft pulping, foil tooling, and structural tolerances.")}
                </p>
              </div>
              <Link
                href={val("lab_cta_url", "/blog/category/materials-guide")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors"
              >
                {val("lab_cta_label", "Explore Materials")} <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {materialSpotlights.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-[#D96B2B] transition-all hover:bg-white/[0.08]"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-white/10"
                  >
                    <Image
                      src={resolveBlogThumbnail(post.image, post.coverImage || post.cover_image)}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B1F33]/90 text-[10px] font-bold uppercase tracking-wider text-[#D96B2B] border border-white/10">
                      {post.category}
                    </span>
                  </Link>

                  <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D96B2B] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs leading-relaxed text-white/60 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                      <span>{post.author || "Materials Desk"}</span>
                      <span className="flex items-center gap-1 text-[#D96B2B]">
                        <Clock className="size-3" />
                        {post.readTime || "5 min read"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 7. FROM THE ARCHIVE GRID (UP TO 6 ARTICLES) ───────────────────── */}
      {archiveStories.length > 0 && isVisible("archive") && (
        <section className="bg-white py-14 sm:py-20 border-b border-[#E7DDD2]">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                  {val("archive_eyebrow", "Selected Stories")}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1F33] mt-1">
                  {val("archive_title", "From the Journal")}
                </h2>
                <p className="text-sm text-[#667085] mt-2 max-w-xl">
                  {val("archive_body", "Essays, material reviews, and structural dieline tutorials written by our packaging engineers and designers.")}
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] text-xs font-bold uppercase tracking-wider text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors"
              >
                {val("archive_cta_label", "View Full Archive")} ({published.length}) <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archiveStories.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="group flex flex-col rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] overflow-hidden hover:border-[#D96B2B]/60 transition-all hover:shadow-lg hover:bg-white"
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
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[10px] font-bold uppercase tracking-wider text-[#D96B2B] shadow-sm">
                      {post.category || "Journal"}
                    </span>
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
                        {post.author || "Editorial Staff"}
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
          </Container>
        </section>
      )}

      {/* ─── 8. EDITORIAL PHILOSOPHY (HIGH-CONTRAST QUOTE) ────────────────── */}
      {isVisible("philosophy") && (
        <section className="bg-[#0B1F33] py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-[#D96B2B]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-[#C99A4A]/10 blur-3xl pointer-events-none" />

          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
              <span className="size-12 mx-auto rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                <Quote className="size-6 text-[#D96B2B]" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D96B2B]">
                {val("philosophy_eyebrow", "Editorial Philosophy")}
              </p>
              <h2
                style={{ color: "#FFFFFF" }}
                className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-relaxed !text-white text-center"
              >
                &ldquo;{val("philosophy_quote", "Packaging is the only medium where form, weight, touch, and sustainability intersect in the palm of a customer’s hand.")}&rdquo;
              </h2>
              <div className="pt-2">
                <p style={{ color: "rgba(255,255,255,0.75)" }} className="text-sm font-semibold !text-white/75">
                  {val("philosophy_author", "— Fable Packaging Editorial Board")}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)" }} className="text-xs mt-1 !text-white/50">
                  {val("philosophy_sub", "Documenting material culture, structural craft, and ecological design")}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── 9. WHY FABLE JOURNAL ─────────────────────────────────────────────── */}
      {isVisible("why_read") && (
        <section className="bg-white py-16 sm:py-20 border-b border-[#E7DDD2]">
          <Container>
            <div className="text-center mb-12">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B] mb-2">
                {val("why_eyebrow", "Why Read Fable")}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1F33]">
                {val("why_title", "Written for makers, brands & designers.")}
              </h2>
              <p className="text-sm text-[#667085] mt-3 max-w-xl mx-auto leading-relaxed">
                {val("why_body", "Fable Journal is an independent publication dedicated to the craft, science, and culture of packaging.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  Icon: PenLine,
                  title: "Editorial Depth",
                  body: "Every essay is rigorously researched — no sponsored content, no filler. Just honest, long-form writing from practitioners in the field.",
                },
                {
                  Icon: Leaf,
                  title: "Sustainability First",
                  body: "We track eco-certifications, circular design systems, and zero-plastic innovations so you don't have to wade through greenwashing.",
                },
                {
                  Icon: Ruler,
                  title: "Technical Precision",
                  body: "Dieline tolerances, greyboard calipers, bleed specs — we go deep into the technical details that production teams actually need.",
                },
                {
                  Icon: BookOpen,
                  title: "Free & Independent",
                  body: "No paywalls. No brand bias. Fable is funded by a love of great packaging — available to every curious reader at no cost.",
                },
                {
                  Icon: CheckCircle,
                  title: "Vetted & Curated",
                  body: "Our editorial board reviews every piece for accuracy. If it's published, it meets the craft standards we'd hold our own projects to.",
                },
                {
                  Icon: Compass,
                  title: "Industry Coverage",
                  body: "From rigid luxury rigid boxes to e-commerce mailers — we cover the full spectrum of the global packaging industry.",
                },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="flex gap-5">
                  <div className="size-11 shrink-0 rounded-xl bg-[#FFF4E9] flex items-center justify-center text-[#D96B2B] mt-0.5">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0B1F33] mb-1.5">{title}</h3>
                    <p className="text-sm text-[#667085] leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 10. WEEKLY DISPATCH NEWSLETTER ─────────────────────────────────── */}
      {isVisible("newsletter") && (
        <section id="newsletter" className="bg-[#FFF9F2] py-16 sm:py-20 border-t border-[#E7DDD2]">
          <Container>
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
                {val("newsletter_eyebrow", "The Weekly Dispatch")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1F33]">
                {val("newsletter_title", "Join our reading circle.")}
              </h2>
              <p className="text-sm leading-relaxed text-[#667085]">
                {val("newsletter_body", "Get fresh essays, prepress dieline guides, and substrate breakdowns sent straight to your inbox every Thursday.")}
              </p>
              <div className="pt-3 max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
