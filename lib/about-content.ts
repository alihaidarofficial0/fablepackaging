import { createClient } from "@/lib/supabase/server";

export type AboutPillar = {
  title: string;
  body: string;
};

export type AboutTeamMember = {
  initials: string;
  name: string;
  role: string;
  bio: string;
};

export type AboutStat = {
  label: string;
  value: string;
};

export type AboutPageContent = {
  badge: string;
  hero_title: string;
  hero_description: string;

  mission_quote: string;
  mission_author: string;
  mission_subtext: string;

  pillars_badge: string;
  pillars_title: string;
  pillars_description: string;
  pillars: AboutPillar[];

  story_badge: string;
  story_title: string;
  story_p1: string;
  story_p2: string;
  stats_title: string;
  stats: AboutStat[];

  team_badge: string;
  team_title: string;
  team_description: string;
  team: AboutTeamMember[];

  cta_title: string;
  cta_description: string;
  cta_btn_text: string;
  cta_btn_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
};

export const defaultAboutContent: AboutPageContent = {
  badge: "Our Publication",
  hero_title: "About Fable Journal",
  hero_description:
    "Fable Journal is a dedicated publication for packaging engineers, brand designers, and material enthusiasts who believe the box matters as much as what's inside it.",

  mission_quote:
    "Great packaging is the intersection of form, weight, touch, and sustainability — all in the palm of a customer's hand.",
  mission_author: "— Fable Packaging Editorial Board",
  mission_subtext:
    "Documenting material culture, structural craft, and ecological design since 2022",

  pillars_badge: "Our Focus",
  pillars_title: "What we cover",
  pillars_description:
    "Four editorial pillars guide everything we write and commission.",
  pillars: [
    {
      title: "Editorial Depth",
      body: "Every piece we publish is researched, crafted, and edited with care. We believe the packaging world deserves writing that respects the complexity of its craft.",
    },
    {
      title: "Sustainability First",
      body: "From substrate selection to lifecycle analysis, we write honestly about what it means to design packaging that's better for people and planet.",
    },
    {
      title: "Technical Rigour",
      body: "Structural dielines, prepress prep, material specifications — we go deep so practitioners can make informed decisions, not just inspired ones.",
    },
    {
      title: "Material Culture",
      body: "We treat packaging as a cultural artifact. The intersection of tactile design, consumer psychology, and brand identity is always on our editorial calendar.",
    },
  ],

  story_badge: "Our Story",
  story_title: "Why we started",
  story_p1:
    "Fable Journal was born from a simple observation: the packaging industry lacked a publication that treated its practitioners with the intellectual respect they deserved. Designers, engineers, and sustainability leads were making decisions with profound consequences — for brand perception, for supply chains, for the environment — and they deserved writing that matched that gravity.",
  story_p2:
    "We launched with a small team of practitioners who had spent their careers inside studios, on press floors, and in material labs. Every article we publish is written by people who understand what it means to take a structural concept from a sketch to a finished production run.",
  stats_title: "By the Numbers",
  stats: [
    { label: "Articles Published", value: "200+" },
    { label: "Editorial Topics", value: "12" },
    { label: "Monthly Readers", value: "18k+" },
    { label: "Years of Coverage", value: "3+" },
  ],

  team_badge: "The Team",
  team_title: "Who writes for Fable",
  team_description:
    "Practitioners first, writers second. Every contributor has real-world industry experience.",
  team: [
    {
      initials: "FE",
      name: "Fable Editorial",
      role: "Editor in Chief",
      bio: "Writing on structural design, material culture, and the language of packaging for over a decade.",
    },
    {
      initials: "MP",
      name: "Materials Desk",
      role: "Materials & Substrates",
      bio: "Deep expertise in paperboards, foils, sustainable fibres, and the chemistry of finishes.",
    },
    {
      initials: "DP",
      name: "Design Practice",
      role: "Design & Prepress",
      bio: "Production-side experience covering dieline setup, colour management, and press-ready artwork.",
    },
  ],

  cta_title: "Join our reading circle",
  cta_description:
    "Subscribe to the Weekly Dispatch — essays, material notes, and design insight delivered every Thursday.",
  cta_btn_text: "Subscribe Free",
  cta_btn_link: "/blog#newsletter",
  cta_secondary_text: "Contact Editors",
  cta_secondary_link: "/contact",
};

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const supabase = await createClient();
    if (!supabase) return defaultAboutContent;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_page")
      .maybeSingle();

    if (error || !data?.value || typeof data.value !== "object") {
      return defaultAboutContent;
    }

    const val = data.value as Partial<AboutPageContent>;
    return {
      ...defaultAboutContent,
      ...val,
      pillars: Array.isArray(val.pillars) && val.pillars.length > 0 ? val.pillars : defaultAboutContent.pillars,
      stats: Array.isArray(val.stats) && val.stats.length > 0 ? val.stats : defaultAboutContent.stats,
      team: Array.isArray(val.team) && val.team.length > 0 ? val.team : defaultAboutContent.team,
    };
  } catch {
    return defaultAboutContent;
  }
}
