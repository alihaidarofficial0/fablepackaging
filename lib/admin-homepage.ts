export const homepageSectionDefinitions = {
  hero: { label: "Hero", fields: [["hero_eyebrow", "Hero eyebrow", "text"], ["hero_title", "Hero heading", "text"], ["hero_highlight", "Highlighted text", "text"], ["hero_body", "Hero description", "textarea"], ["hero_primary_label", "Primary CTA label", "text"], ["hero_primary_url", "Primary CTA URL", "url"], ["hero_secondary_label", "Secondary CTA label", "text"], ["hero_secondary_url", "Secondary CTA URL", "url"], ["hero_image", "Hero image", "image"], ["hero_benefit_1", "Benefit 1", "text"], ["hero_benefit_2", "Benefit 2", "text"], ["hero_benefit_3", "Benefit 3", "text"]] },
  trusted: { label: "Trusted brands", fields: [["trusted_title", "Section label", "text"]] },
  products: { label: "Product section", fields: [["products_title", "Section heading", "text"], ["products_body", "Section description", "textarea"]] },
  why: { label: "Why Fable", fields: [["why_eyebrow", "Eyebrow", "text"], ["why_title", "Section heading", "text"], ["why_body", "Section description", "textarea"]] },
  materials: { label: "Materials & finishes", fields: [["materials_eyebrow", "Eyebrow", "text"], ["materials_title", "Section heading", "text"], ["materials_body", "Section description", "textarea"]] },
  industries: { label: "Industries", fields: [["industries_title", "Section heading", "text"], ["industries_body", "Section description", "textarea"]] },
  sustainability: { label: "Sustainability", fields: [["sustainability_eyebrow", "Eyebrow", "text"], ["sustainability_title", "Section heading", "text"], ["sustainability_body", "Section description", "textarea"]] },
  process: { label: "How it works", fields: [["process_eyebrow", "Eyebrow", "text"], ["process_title", "Section heading", "text"], ["process_body", "Section description", "textarea"]] },
  projects: { label: "Featured projects", fields: [["projects_title", "Section heading", "text"], ["projects_body", "Section description", "textarea"]] },
  testimonials: { label: "Testimonials", fields: [["testimonial_title", "Section heading", "text"], ["testimonial_quote", "Quote", "textarea"], ["testimonial_name", "Customer name", "text"], ["testimonial_role", "Customer role", "text"]] },
  quick_quote: { label: "Quick quote", fields: [["quick_quote_title", "Section heading", "text"], ["quick_quote_body", "Section description", "textarea"]] },
  faq: { label: "FAQ", fields: [["faq_title", "Section heading", "text"], ["faq_body", "Section description", "textarea"]] },
  final_cta: { label: "Final CTA", fields: [["cta_eyebrow", "Eyebrow", "text"], ["cta_title", "Section heading", "text"], ["cta_body", "Section description", "textarea"]] },
} as const;

export type HomepageSection = keyof typeof homepageSectionDefinitions;
