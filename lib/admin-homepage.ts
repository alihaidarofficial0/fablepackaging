export const homepageSectionDefinitions = {
  hero: {
    label: "1. Hero Banner",
    description: "Main above-the-fold journal banner and spotlight teaser card.",
    fields: [
      ["hero_eyebrow", "Eyebrow tag", "text"],
      ["hero_title", "Main heading (HTML/line breaks supported)", "textarea"],
      ["hero_body", "Supporting lead description", "textarea"],
      ["hero_cta_label", "Primary CTA button text", "text"],
      ["hero_cta_url", "Primary CTA link destination", "url"],
      ["hero_image", "Hero background image path", "image"],
      ["hero_spotlight_badge", "Floating spotlight badge label", "text"],
    ],
  },
  quick_strip: {
    label: "2. Category Quick Links Strip",
    description: "Horizontal category navigation bar directly beneath the hero.",
    fields: [
      ["quick_strip_item_1_label", "Topic 1 Label", "text"],
      ["quick_strip_item_1_url", "Topic 1 URL", "url"],
      ["quick_strip_item_2_label", "Topic 2 Label", "text"],
      ["quick_strip_item_2_url", "Topic 2 URL", "url"],
      ["quick_strip_item_3_label", "Topic 3 Label", "text"],
      ["quick_strip_item_3_url", "Topic 3 URL", "url"],
      ["quick_strip_item_4_label", "Topic 4 Label", "text"],
      ["quick_strip_item_4_url", "Topic 4 URL", "url"],
    ],
  },
  featured_story: {
    label: "3. Featured Lead Pick & Latest Sidebar",
    description: "3-column magazine layout spotlighting the lead story alongside latest articles.",
    fields: [
      ["featured_badge", "Featured badge text", "text"],
      ["featured_sidebar_title", "Sidebar column heading", "text"],
      ["featured_sidebar_cta", "Sidebar CTA link text", "text"],
    ],
  },
  trending: {
    label: "4. Trending / Most Read Stories",
    description: "Numbered editorial list of trending articles across the journal.",
    fields: [
      ["trending_eyebrow", "Eyebrow tag", "text"],
      ["trending_title", "Section main heading", "text"],
    ],
  },
  topics: {
    label: "5. Curated Themes & Categories",
    description: "Browse cards for each editorial packaging topic and theme.",
    fields: [
      ["topics_eyebrow", "Eyebrow tag", "text"],
      ["topics_title", "Section main heading", "text"],
      ["topics_body", "Section description", "textarea"],
      ["topics_cta_label", "All categories CTA text", "text"],
    ],
  },
  material_lab: {
    label: "6. The Material & Craft Lab",
    description: "High-contrast dark showcase focusing on substrates, structural craft, and engineering.",
    fields: [
      ["lab_eyebrow", "Eyebrow tag", "text"],
      ["lab_title", "Section main heading", "text"],
      ["lab_body", "Section description", "textarea"],
      ["lab_cta_label", "Explore materials CTA text", "text"],
      ["lab_cta_url", "Explore materials link URL", "url"],
    ],
  },
  archive: {
    label: "7. From the Journal Archive",
    description: "Editorial grid of selected essays, dieline tutorials, and production reviews.",
    fields: [
      ["archive_eyebrow", "Eyebrow tag", "text"],
      ["archive_title", "Section main heading", "text"],
      ["archive_body", "Section description", "textarea"],
      ["archive_cta_label", "Full archive button text", "text"],
    ],
  },
  philosophy: {
    label: "8. Editorial Philosophy Quote",
    description: "Full-width philosophical quote with dark contrast backdrop.",
    fields: [
      ["philosophy_eyebrow", "Eyebrow tag", "text"],
      ["philosophy_quote", "Quote statement", "textarea"],
      ["philosophy_author", "Attributed author / Board signature", "text"],
      ["philosophy_sub", "Supporting subtitle / mission tagline", "text"],
    ],
  },
  why_read: {
    label: "9. Why Read Fable (Makers & Designers)",
    description: "Six value propositions explaining the publication's craft standards.",
    fields: [
      ["why_eyebrow", "Eyebrow tag", "text"],
      ["why_title", "Section main heading", "text"],
      ["why_body", "Section description", "textarea"],
    ],
  },
  newsletter: {
    label: "10. Weekly Dispatch Newsletter",
    description: "Subscriber invitation card with email signup form.",
    fields: [
      ["newsletter_eyebrow", "Eyebrow tag", "text"],
      ["newsletter_title", "Section main heading", "text"],
      ["newsletter_body", "Section description", "textarea"],
    ],
  },
} as const;

export type HomepageSection = keyof typeof homepageSectionDefinitions;

export const homepageDefaults: Record<string, string> = {
  hero_eyebrow: "The Packaging Journal",
  hero_title: "Packaging,\nthoughtfully\ndesigned.",
  hero_body: "Ideas, materials and the craft behind exceptional packaging.",
  hero_cta_label: "Explore Stories",
  hero_cta_url: "/blog",
  hero_image: "/images/home/fable-hero-packaging.webp",
  hero_spotlight_badge: "Spotlight Story",

  quick_strip_item_1_label: "Structural Design",
  quick_strip_item_1_url: "/blog/category/box-styles-structural-design",
  quick_strip_item_2_label: "Materials & Sustainability",
  quick_strip_item_2_url: "/blog/category/materials-substrates",
  quick_strip_item_3_label: "Print & Finishing",
  quick_strip_item_3_url: "/blog/category/printing-luxury-finishes",
  quick_strip_item_4_label: "Brand Case Studies",
  quick_strip_item_4_url: "/blog/category/industry-solutions",

  featured_badge: "Featured Story",
  featured_sidebar_title: "Latest Articles",
  featured_sidebar_cta: "View All",

  trending_eyebrow: "Trending Across The Journal",
  trending_title: "Most Read This Month",

  topics_eyebrow: "Curated Themes",
  topics_title: "Explore by Topic",
  topics_body: "Every article lives inside a carefully curated topic — pick one and go deep.",
  topics_cta_label: "All Categories",

  lab_eyebrow: "The Material Lab",
  lab_title: "Substrates, Finishes & Engineering",
  lab_body: "Deep investigations into greyboard calipers, unbleached kraft pulping, foil tooling, and structural tolerances.",
  lab_cta_label: "Explore Materials",
  lab_cta_url: "/blog/category/materials-guide",

  archive_eyebrow: "Selected Stories",
  archive_title: "From the Journal",
  archive_body: "Essays, material reviews, and structural dieline tutorials written by our packaging engineers and designers.",
  archive_cta_label: "View Full Archive",

  philosophy_eyebrow: "Editorial Philosophy",
  philosophy_quote: "Packaging is the only medium where form, weight, touch, and sustainability intersect in the palm of a customer’s hand.",
  philosophy_author: "— Fable Packaging Editorial Board",
  philosophy_sub: "Documenting material culture, structural craft, and ecological design",

  why_eyebrow: "Why Read Fable",
  why_title: "Written for makers, brands & designers.",
  why_body: "Fable Journal is an independent publication dedicated to the craft, science, and culture of packaging.",

  newsletter_eyebrow: "The Weekly Dispatch",
  newsletter_title: "Join our reading circle.",
  newsletter_body: "Get fresh essays, prepress dieline guides, and substrate breakdowns sent straight to your inbox every Thursday.",
};
