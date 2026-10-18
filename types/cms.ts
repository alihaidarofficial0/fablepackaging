export type CmsProduct = {
  id?: string;
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  alt: string;
  badge?: "Popular" | "Luxury" | "Flexible";
  description: string;
  active?: boolean;
  featured?: boolean;
  sort_order?: number;
};

export type CmsIndustry = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  alt: string;
  active?: boolean;
  featured?: boolean;
  sort_order?: number;
};

export type CmsProject = {
  id?: string;
  name: string;
  slug?: string;
  category: string;
  image: string;
  alt: string;
  description?: string;
  active?: boolean;
  featured?: boolean;
  sort_order?: number;
};

export type CmsFaq = {
  id?: string;
  question: string;
  answer: string;
  group_name?: "home" | "quote" | "general";
  active?: boolean;
  sort_order?: number;
};

export type CmsCatalogItem = {
  id?: string;
  kind: "material" | "finish";
  name: string;
  slug: string;
  description: string;
  image: string;
  alt: string;
  active?: boolean;
  sort_order?: number;
};

export type CmsNavigationItem = {
  id?: string;
  location: "header_direct" | "design_support" | "footer_company" | "footer_support";
  label: string;
  href: string;
  description?: string;
  image?: string;
  active?: boolean;
  sort_order?: number;
};

export type CmsBlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  alt: string;
  published_at?: string | null;
  active?: boolean;
  featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  sort_order?: number;
};

export type SiteSettings = {
  company_name: string;
  email: string;
  phone: string;
  phone_href: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tagline: string;
  newsletter_title: string;
  newsletter_body: string;
  copyright_text: string;
  announcement_enabled?: boolean;
  announcement_item_1?: string;
  announcement_item_2?: string;
  announcement_item_3?: string;
  currency?: string;
  brand_descriptor?: string;
  header_cta_label?: string;
  header_cta_href?: string;
  logo_url?: string;
};
