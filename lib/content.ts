import "server-only";

import { createClient } from "@/lib/supabase/server";
import { homeProducts } from "@/data/products";
import { homeIndustries } from "@/data/industries";
import { homeProjects } from "@/data/projects";
import { homeFaq, quoteFaq } from "@/data/faq";
import type {
  CmsFaq,
  CmsCatalogItem,
  CmsBlogPost,
  CmsIndustry,
  CmsNavigationItem,
  CmsProduct,
  CmsProject,
  SiteSettings,
} from "@/types/cms";

const fallbackCatalog: CmsCatalogItem[] = [
  { kind: "material", name: "Natural kraft", slug: "natural-kraft", description: "A reliable, print-friendly option selected for strength, feel and end-of-life practicality.", image: "/images/products/shipping-box.webp", alt: "Natural kraft packaging board", sort_order: 10 },
  { kind: "material", name: "White paperboard", slug: "white-paperboard", description: "A smooth, bright surface for crisp color and detailed retail print.", image: "/images/products/mailer-box.webp", alt: "White paperboard packaging", sort_order: 20 },
  { kind: "material", name: "Corrugated board", slug: "corrugated-board", description: "Protective fluted board built for ecommerce and shipping.", image: "/images/products/shipping-box.webp", alt: "Corrugated packaging board", sort_order: 30 },
  { kind: "material", name: "Rigid greyboard", slug: "rigid-greyboard", description: "Heavyweight structure for premium presentation and gifting.", image: "/images/products/rigid-box.webp", alt: "Rigid greyboard packaging", sort_order: 40 },
  { kind: "finish", name: "Matte lamination", slug: "matte-lamination", description: "A smooth, low-shine protective finish.", image: "/images/products/mailer-box.webp", alt: "Matte laminated packaging", sort_order: 10 },
  { kind: "finish", name: "Soft touch", slug: "soft-touch", description: "A velvety premium coating designed to invite touch.", image: "/images/products/rigid-box.webp", alt: "Soft touch packaging finish", sort_order: 20 },
  { kind: "finish", name: "Spot UV", slug: "spot-uv", description: "Targeted shine that highlights logos and design details.", image: "/images/products/folding-carton.webp", alt: "Spot UV packaging detail", sort_order: 30 },
  { kind: "finish", name: "Foil stamping", slug: "foil-stamping", description: "Metallic detail with a crisp, premium impression.", image: "/images/projects/velora-tea.webp", alt: "Foil stamped packaging", sort_order: 40 },
];

const fallbackNavigation: CmsNavigationItem[] = [
  { location: "header_direct", label: "About", href: "/about", sort_order: 10 },
  { location: "header_direct", label: "Blog", href: "/blog", sort_order: 20 },
  { location: "design_support", label: "Artwork Guidelines", href: "/artwork-guidelines", description: "Prepare artwork with confidence.", image: "/images/home/faq-packaging.webp", sort_order: 10 },
  { location: "design_support", label: "Structural Design", href: "/design-support", description: "A structure made for your product.", image: "/images/products/display-box.webp", sort_order: 20 },
  { location: "design_support", label: "Get Expert Help", href: "/contact", description: "Talk with a packaging specialist.", image: "/images/home/why-fable-packaging.webp", sort_order: 30 },
  { location: "footer_company", label: "About Us", href: "/about", sort_order: 10 },
  { location: "footer_company", label: "Our Process", href: "/our-process", sort_order: 20 },
  { location: "footer_company", label: "Contact Us", href: "/contact", sort_order: 30 },
  { location: "footer_support", label: "Get a Quote", href: "/get-a-quote", sort_order: 10 },
  { location: "footer_support", label: "FAQs", href: "/faq", sort_order: 20 },
  { location: "footer_support", label: "Help Center", href: "/help-center", sort_order: 30 },
];

const defaultSettings: SiteSettings = {
  company_name: "Fable Packaging",
  email: "hello@fablepack.co",
  phone: "+1 (855) 123-4567",
  phone_href: "+18551234567",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  tagline: "Thoughtful custom packaging for ambitious brands. Sustainable, scalable and memorable.",
  newsletter_title: "Packaging notes, worth opening.",
  newsletter_body: "Fresh ideas, useful guides and product news. No clutter.",
  copyright_text: "© 2026 Fable Packaging Co. All rights reserved.",
  announcement_enabled: true,
  announcement_item_1: "Free design support",
  announcement_item_2: "Low minimum order",
  announcement_item_3: "Sustainable packaging",
  currency: "USD",
  brand_descriptor: "Packaging Co.",
  header_cta_label: "Get a Quote",
  header_cta_href: "/get-a-quote",
  logo_url: "",
};

export async function getProducts(): Promise<CmsProduct[]> {
  const supabase = await createClient();
  if (!supabase) return homeProducts;
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,subtitle,description,image,alt,badge,active,featured,sort_order")
    .eq("active", true)
    .order("sort_order")
    .order("name");
  if (error || !data?.length) return homeProducts;
  return data as CmsProduct[];
}

export async function getIndustries(): Promise<CmsIndustry[]> {
  const supabase = await createClient();
  if (!supabase) return homeIndustries;
  const { data, error } = await supabase
    .from("industries")
    .select("id,name,slug,description,image,alt,active,featured,sort_order")
    .eq("active", true)
    .order("sort_order")
    .order("name");
  if (error || !data?.length) return homeIndustries;
  return data as CmsIndustry[];
}

export async function getProjects(): Promise<CmsProject[]> {
  const supabase = await createClient();
  if (!supabase) return homeProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,slug,category,description,image,alt,active,featured,sort_order")
    .eq("active", true)
    .order("sort_order")
    .order("name");
  if (error || !data?.length) return homeProjects;
  return data as CmsProject[];
}

export async function getFaqs(group: "home" | "quote" | "general" = "home"): Promise<CmsFaq[]> {
  const fallback = group === "quote" ? quoteFaq : homeFaq;
  const supabase = await createClient();
  if (!supabase) return fallback;
  const { data, error } = await supabase
    .from("faqs")
    .select("id,question,answer,group_name,active,sort_order")
    .eq("active", true)
    .eq("group_name", group)
    .order("sort_order");
  if (error || !data?.length) return fallback;
  return data as CmsFaq[];
}

// High-performance in-memory cache to prevent redundant Supabase queries on every navigation
const contentMemoryCache = new Map<string, { value: any; expiresAt: number }>();

function getFromCache<T>(key: string): T | null {
  const hit = contentMemoryCache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }
  return null;
}

function saveToCache<T>(key: string, value: T, ttlMs = 45000): T {
  contentMemoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function invalidateContentCache(keyPrefix?: string) {
  if (!keyPrefix) {
    contentMemoryCache.clear();
  } else {
    for (const k of contentMemoryCache.keys()) {
      if (k.startsWith(keyPrefix)) contentMemoryCache.delete(k);
    }
  }
}

async function withTimeout<T>(promise: Promise<T>, ms = 1200, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function getPageContent(pageSlug: string) {
  const cacheKey = `page_content:${pageSlug}`;
  const cached = getFromCache<Record<string, string>>(cacheKey);
  if (cached) return cached;

  try {
    const supabase = await createClient();
    if (!supabase) return {};

    const fetcher = async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key,value")
        .eq("page_slug", pageSlug)
        .order("sort_order");
      if (error || !data) return {} as Record<string, string>;
      return Object.fromEntries(data.map((item) => [item.content_key, item.value])) as Record<string, string>;
    };

    const res = await withTimeout(fetcher(), 1200, {} as Record<string, string>);
    return saveToCache(cacheKey, res);
  } catch {
    return {};
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const cacheKey = "site_settings:general";
  const cached = getFromCache<SiteSettings>(cacheKey);
  if (cached) return cached;

  try {
    const supabase = await createClient();
    if (!supabase) return defaultSettings;

    const fetcher = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "general")
        .maybeSingle();
      if (error || !data?.value || typeof data.value !== "object") return defaultSettings;
      return { ...defaultSettings, ...(data.value as Partial<SiteSettings>) };
    };

    const res = await withTimeout(fetcher(), 1200, defaultSettings);
    return saveToCache(cacheKey, res);
  } catch {
    return defaultSettings;
  }
}

export async function getHomeSectionVisibility(): Promise<Record<string, boolean>> {
  const cacheKey = "site_settings:home_section_visibility";
  const cached = getFromCache<Record<string, boolean>>(cacheKey);
  if (cached) return cached;

  try {
    const supabase = await createClient();
    if (!supabase) return {};

    const fetcher = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "home_section_visibility")
        .maybeSingle();
      if (error || !data?.value || typeof data.value !== "object") return {};
      return data.value as Record<string, boolean>;
    };

    const res = await withTimeout(fetcher(), 1200, {});
    return saveToCache(cacheKey, res);
  } catch {
    return {};
  }
}

export async function getCatalogItems(kind?: "material" | "finish"): Promise<CmsCatalogItem[]> {
  const fallback = kind ? fallbackCatalog.filter((item) => item.kind === kind) : fallbackCatalog;
  const supabase = await createClient();
  if (!supabase) return fallback;
  let query = supabase.from("catalog_items").select("id,kind,name,slug,description,image,alt,active,sort_order").eq("active", true).order("sort_order").order("name");
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error || !data?.length) return fallback;
  return data as CmsCatalogItem[];
}

export async function getNavigationItems(): Promise<CmsNavigationItem[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackNavigation;
  const { data, error } = await supabase.from("navigation_items").select("id,location,label,href,description,image,active,sort_order").eq("active", true).order("sort_order");
  if (error || !data?.length) return fallbackNavigation;
  return data as CmsNavigationItem[];
}

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,category,author,image,alt,published_at,active,featured,seo_title,seo_description,sort_order")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("sort_order");
  if (error || !data) return [];
  return data as CmsBlogPost[];
}

export async function getBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,category,author,image,alt,published_at,active,featured,seo_title,seo_description,sort_order")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as CmsBlogPost;
}
