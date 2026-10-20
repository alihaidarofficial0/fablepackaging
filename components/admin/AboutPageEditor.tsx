"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Quote,
  Sparkles,
  Users,
  Layers,
  Heart,
} from "lucide-react";
import { saveAboutPageAction } from "@/app/admin/actions";
import type { AboutPageContent } from "@/lib/about-content";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-3.5 text-sm text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:ring-2 focus:ring-[#D96B2B]/10";
const textareaClass =
  "mt-1.5 w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] p-3.5 text-sm text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:ring-2 focus:ring-[#D96B2B]/10 resize-y";

export function AboutPageEditor({ initialContent }: { initialContent: AboutPageContent }) {
  const [content, setContent] = useState<AboutPageContent>(initialContent);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const updateField = <K extends keyof AboutPageContent>(key: K, value: AboutPageContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updatePillar = (index: number, field: "title" | "body", value: string) => {
    setContent((prev) => {
      const nextPillars = [...prev.pillars];
      nextPillars[index] = { ...nextPillars[index], [field]: value };
      return { ...prev, pillars: nextPillars };
    });
  };

  const updateStat = (index: number, field: "label" | "value", value: string) => {
    setContent((prev) => {
      const nextStats = [...prev.stats];
      nextStats[index] = { ...nextStats[index], [field]: value };
      return { ...prev, stats: nextStats };
    });
  };

  const updateTeam = (
    index: number,
    field: "initials" | "name" | "role" | "bio",
    value: string
  ) => {
    setContent((prev) => {
      const nextTeam = [...prev.team];
      nextTeam[index] = { ...nextTeam[index], [field]: value };
      return { ...prev, team: nextTeam };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(content));
        await saveAboutPageAction(formData);
        setStatus({ type: "success", message: "About page content saved successfully!" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: unknown) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to save content.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/pages"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D96B2B] transition-colors hover:text-[#BC5420]"
          >
            <ArrowLeft className="size-4" /> Back to Static Pages
          </Link>
          <h1 className="font-serif text-3xl text-[#0B1F33] sm:text-4xl">About Page Editor</h1>
          <p className="mt-1 text-sm text-[#667085]">
            Configure and align all copy, editorial mission, pillars, and team details dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E7DDD2] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]"
          >
            <ExternalLink className="size-4" /> Preview Live
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D96B2B] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420] disabled:opacity-60"
          >
            <Save className="size-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {status && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-5 shrink-0 text-rose-600" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* SECTION 1: Page Header & Hero */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
            <BookOpen className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">Hero Header</h2>
            <p className="text-xs text-[#667085]">Introductory heading and subtext for the page</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Eyebrow Badge
            </label>
            <input
              type="text"
              value={content.badge}
              onChange={(e) => updateField("badge", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Main Page Headline
            </label>
            <input
              type="text"
              value={content.hero_title}
              onChange={(e) => updateField("hero_title", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Description / Introduction
            </label>
            <textarea
              rows={3}
              value={content.hero_description}
              onChange={(e) => updateField("hero_description", e.target.value)}
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: Editorial Mission */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#0B1F33] text-[#D96B2B]">
            <Quote className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">Editorial Mission Quote</h2>
            <p className="text-xs text-[#667085]">Featured statement in the navy focal block</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Mission Quote
            </label>
            <textarea
              rows={3}
              value={content.mission_quote}
              onChange={(e) => updateField("mission_quote", e.target.value)}
              className={textareaClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Attribution
              </label>
              <input
                type="text"
                value={content.mission_author}
                onChange={(e) => updateField("mission_author", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Subtext / Timeline
              </label>
              <input
                type="text"
                value={content.mission_subtext}
                onChange={(e) => updateField("mission_subtext", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Pillars (What We Cover) */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
            <Layers className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">What We Cover (Pillars)</h2>
            <p className="text-xs text-[#667085]">The core values and focus areas of the publication</p>
          </div>
        </div>

        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={content.pillars_badge}
              onChange={(e) => updateField("pillars_badge", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Heading
            </label>
            <input
              type="text"
              value={content.pillars_title}
              onChange={(e) => updateField("pillars_title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Subtitle
            </label>
            <input
              type="text"
              value={content.pillars_description}
              onChange={(e) => updateField("pillars_description", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.pillars.map((pillar, i) => (
            <div key={i} className="rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] p-5">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                Pillar {i + 1}
              </span>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1F33]">Title</label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => updatePillar(i, "title", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1F33]">Description</label>
                  <textarea
                    rows={3}
                    value={pillar.body}
                    onChange={(e) => updatePillar(i, "body", e.target.value)}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Our Story & Numbers */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">Our Story & Metrics</h2>
            <p className="text-xs text-[#667085]">Foundational narrative and key numbers</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Story Narrative */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Story Eyebrow
              </label>
              <input
                type="text"
                value={content.story_badge}
                onChange={(e) => updateField("story_badge", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Story Heading
              </label>
              <input
                type="text"
                value={content.story_title}
                onChange={(e) => updateField("story_title", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Paragraph 1
              </label>
              <textarea
                rows={4}
                value={content.story_p1}
                onChange={(e) => updateField("story_p1", e.target.value)}
                className={textareaClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Paragraph 2
              </label>
              <textarea
                rows={4}
                value={content.story_p2}
                onChange={(e) => updateField("story_p2", e.target.value)}
                className={textareaClass}
              />
            </div>
          </div>

          {/* Numbers / Stats */}
          <div className="rounded-2xl border border-[#E7DDD2] bg-[#071827] p-6 text-white">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
                Metrics Card
              </span>
              <input
                type="text"
                value={content.stats_title}
                onChange={(e) => updateField("stats_title", e.target.value)}
                className="h-8 rounded-lg border border-white/20 bg-white/5 px-2.5 text-xs font-bold text-white outline-none focus:border-[#D96B2B]"
              />
            </div>

            <div className="space-y-4">
              {content.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_1fr] items-center gap-3">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Metric Label"
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/90 outline-none focus:border-[#D96B2B]"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="Value (e.g. 200+)"
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 font-serif text-sm font-bold text-[#D96B2B] outline-none focus:border-[#D96B2B]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: The Team */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
            <Users className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">Editorial Team</h2>
            <p className="text-xs text-[#667085]">Key authors and contributors</p>
          </div>
        </div>

        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={content.team_badge}
              onChange={(e) => updateField("team_badge", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Heading
            </label>
            <input
              type="text"
              value={content.team_title}
              onChange={(e) => updateField("team_title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Section Description
            </label>
            <input
              type="text"
              value={content.team_description}
              onChange={(e) => updateField("team_description", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {content.team.map((member, i) => (
            <div key={i} className="rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] p-5 space-y-3">
              <span className="block text-xs font-extrabold uppercase tracking-widest text-[#D96B2B]">
                Member {i + 1}
              </span>

              <div className="grid grid-cols-[60px_1fr] gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#0B1F33]">Initials</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={member.initials}
                    onChange={(e) => updateTeam(i, "initials", e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E7DDD2] text-center text-xs font-bold outline-none focus:border-[#D96B2B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#0B1F33]">Full Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeam(i, "name", e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E7DDD2] px-2.5 text-xs font-medium outline-none focus:border-[#D96B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0B1F33]">Role / Title</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateTeam(i, "role", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#E7DDD2] px-2.5 text-xs font-medium outline-none focus:border-[#D96B2B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0B1F33]">Short Bio</label>
                <textarea
                  rows={3}
                  value={member.bio}
                  onChange={(e) => updateTeam(i, "bio", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E7DDD2] p-2 text-xs outline-none focus:border-[#D96B2B]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Call To Action (Bottom CTA) */}
      <section className="rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[#F0EAE2] pb-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
            <Heart className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1F33]">Call to Action (CTA)</h2>
            <p className="text-xs text-[#667085]">Newsletter & contact block at the bottom of the page</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              CTA Headline
            </label>
            <input
              type="text"
              value={content.cta_title}
              onChange={(e) => updateField("cta_title", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              CTA Subtitle
            </label>
            <textarea
              rows={2}
              value={content.cta_description}
              onChange={(e) => updateField("cta_description", e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Primary Button Label
            </label>
            <input
              type="text"
              value={content.cta_btn_text}
              onChange={(e) => updateField("cta_btn_text", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Primary Button Link
            </label>
            <input
              type="text"
              value={content.cta_btn_link}
              onChange={(e) => updateField("cta_btn_link", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Secondary Button Label
            </label>
            <input
              type="text"
              value={content.cta_secondary_text}
              onChange={(e) => updateField("cta_secondary_text", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Secondary Button Link
            </label>
            <input
              type="text"
              value={content.cta_secondary_link}
              onChange={(e) => updateField("cta_secondary_link", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9]/95 p-4 shadow-xl backdrop-blur-md">
        <span className="text-xs text-[#667085]">
          Changes update live on the public <strong>/about</strong> page once saved.
        </span>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D96B2B] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420] disabled:opacity-60"
        >
          <Save className="size-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
