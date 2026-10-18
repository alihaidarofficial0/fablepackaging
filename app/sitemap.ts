import type { MetadataRoute } from "next";
import { getBlogPosts, getCatalogItems, getIndustries, getProducts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fablepack.co";
  const [products, industries, catalog, blogPosts] = await Promise.all([getProducts(), getIndustries(), getCatalogItems(), getBlogPosts()]);
  const staticRoutes = ["", "/custom-boxes", "/industries", "/materials", "/finishes", "/projects", "/blog", "/about", "/our-process", "/sustainability", "/faq", "/contact", "/get-a-quote", "/privacy-policy", "/terms"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${base}/custom-boxes/${product.slug}`, lastModified: new Date() })),
    ...industries.map((industry) => ({ url: `${base}/industries/${industry.slug}`, lastModified: new Date() })),
    ...catalog.map((item) => ({ url: `${base}/${item.kind === "material" ? "materials" : "finishes"}/${item.slug}`, lastModified: new Date() })),
    ...blogPosts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.published_at ? new Date(post.published_at) : new Date() })),
  ];
}
