import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Leaf,
  Ruler,
  Layers,
  Quote,
  Mail,
  Sparkles,
  Heart,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getAboutPageContent } from "@/lib/about-content";

export const metadata: Metadata = {
  title: "About the Journal | Fable Journal",
  description:
    "Learn about the editorial mission and philosophy behind Fable Journal — a dedicated publication exploring packaging design, material culture, and sustainable craftsmanship.",
};

const pillarIcons = [BookOpen, Leaf, Ruler, Layers];

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-[#E7DDD2] bg-[linear-gradient(180deg,#FFF9F2,#FFFDF9)] py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
              <BookOpen className="size-3.5" />
              <span>{content.badge}</span>
            </span>
            <h1 className="font-serif text-4xl font-bold leading-[1.04] tracking-tight text-[#0B1F33] sm:text-5xl lg:text-6xl">
              {content.hero_title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#526171] sm:text-lg">
              {content.hero_description}
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Statement */}
      <section className="relative overflow-hidden bg-[#0B1F33] py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[#D96B2B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-[#C99A4A]/10 blur-3xl" />
        <Container>
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10">
              <Quote className="size-6 text-[#D96B2B]" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D96B2B]">
              Editorial Mission
            </p>
            <h2
              style={{ color: "#FFFFFF" }}
              className="text-center font-serif text-2xl font-normal leading-relaxed !text-white sm:text-3xl lg:text-[34px]"
            >
              &ldquo;{content.mission_quote}&rdquo;
            </h2>
            <div className="pt-2">
              <p
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
                className="text-sm font-semibold !text-white/75"
              >
                {content.mission_author}
              </p>
              {content.mission_subtext && (
                <p
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  className="mt-1 text-xs !text-white/50"
                >
                  {content.mission_subtext}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* What We Cover */}
      <section className="border-b border-[#E7DDD2] bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                {content.pillars_badge}
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0B1F33] sm:text-4xl">
                {content.pillars_title}
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-[#526171]">
                {content.pillars_description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {content.pillars.map((pillar, index) => {
                const Icon = pillarIcons[index % pillarIcons.length] || BookOpen;
                return (
                  <div
                    key={pillar.title || index}
                    className="group rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-7 transition-all hover:border-[#D96B2B]/40 hover:shadow-sm"
                  >
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#FFF4E9] text-[#D96B2B] transition-colors group-hover:bg-[#D96B2B] group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mb-2 font-serif text-xl font-bold text-[#0B1F33]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#667085]">{pillar.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="border-b border-[#E7DDD2] bg-[#FFFDF9] py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                {content.story_badge}
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0B1F33] sm:text-4xl">
                {content.story_title}
              </h2>
              <p className="text-base leading-relaxed text-[#526171]">{content.story_p1}</p>
              {content.story_p2 && (
                <p className="text-base leading-relaxed text-[#526171]">{content.story_p2}</p>
              )}
              <Link
                href="/blog"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#D96B2B] transition-colors hover:text-[#BC5420]"
              >
                Read our latest essays <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="space-y-6 rounded-3xl bg-[#0B1F33] p-8 text-white sm:p-10">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-[#D96B2B]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
                  {content.stats_title}
                </span>
              </div>
              {content.stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 pb-4"
                >
                  <span className="text-sm text-white/65">{label}</span>
                  <span className="font-serif text-2xl font-bold text-[#D96B2B]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="border-b border-[#E7DDD2] bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                {content.team_badge}
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0B1F33] sm:text-4xl">
                {content.team_title}
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-[#526171]">
                {content.team_description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {content.team.map(({ initials, name, role, bio }) => (
                <div
                  key={name}
                  className="flex flex-col items-center space-y-3 rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-7 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-full border border-[#D96B2B]/20 bg-[#FFF0E2] text-lg font-bold text-[#D96B2B]">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0B1F33]">{name}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B2B]">
                      {role}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#667085]">{bio}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E7DDD2] bg-[#FFF9F2] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl space-y-5 text-center">
            <Heart className="mx-auto size-8 text-[#D96B2B]" />
            <h2 className="font-serif text-3xl font-bold text-[#0B1F33] sm:text-4xl">
              {content.cta_title}
            </h2>
            <p className="text-base leading-relaxed text-[#526171]">{content.cta_description}</p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href={content.cta_btn_link || "/blog#newsletter"}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D96B2B] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420]"
              >
                {content.cta_btn_text} <ArrowRight className="size-4" />
              </Link>
              {content.cta_secondary_text && (
                <Link
                  href={content.cta_secondary_link || "/contact"}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E7DDD2] bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]"
                >
                  <Mail className="size-4" /> {content.cta_secondary_text}
                </Link>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
