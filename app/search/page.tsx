import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getCatalogItems, getIndustries, getProducts, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Fable Packaging products, industries, materials and projects.",
};

type Result = { title: string; description: string; image: string; alt: string; href: string; type: string };

function matches(query: string, ...values: string[]) {
  return values.join(" ").toLowerCase().includes(query);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQuery = "" } = await searchParams;
  const query = rawQuery.trim().toLowerCase().slice(0, 100);
  const [products, industries, catalog, projects] = await Promise.all([getProducts(), getIndustries(), getCatalogItems(), getProjects()]);
  const results: Result[] = query ? [
    ...products.filter((item) => matches(query, item.name, item.subtitle, item.description)).map((item) => ({ title: item.name, description: item.subtitle, image: item.image, alt: item.alt, href: `/custom-boxes/${item.slug}`, type: "Packaging format" })),
    ...industries.filter((item) => matches(query, item.name, item.description)).map((item) => ({ title: item.name, description: item.description, image: item.image, alt: item.alt, href: `/industries/${item.slug}`, type: "Industry" })),
    ...catalog.filter((item) => matches(query, item.name, item.description, item.kind)).map((item) => ({ title: item.name, description: item.description, image: item.image, alt: item.alt, href: `/${item.kind === "material" ? "materials" : "finishes"}/${item.slug}`, type: item.kind === "material" ? "Material" : "Finish" })),
    ...projects.filter((item) => matches(query, item.name, item.category, item.description || "")).map((item) => ({ title: item.name, description: item.category, image: item.image, alt: item.alt, href: "/projects", type: "Featured project" })),
  ].slice(0, 24) : [];

  return <section className="min-h-[calc(100vh-220px)] bg-[#FFF9F2] py-12 sm:py-16 lg:py-20"><Container>
    <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Search Fable</p><h1 className="mt-3 font-serif text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.04em] text-[#0B1F33]">Find what you need.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg">Search packaging formats, industries, materials, finishes and featured work.</p></div>
    <form action="/search" className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row" role="search"><label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#E7DDD2] bg-white px-4 text-[#667085] focus-within:border-[#D96B2B] focus-within:ring-2 focus-within:ring-[#D96B2B]/10"><Search className="size-5 shrink-0 text-[#D96B2B]" aria-hidden="true" /><input name="q" defaultValue={rawQuery} autoFocus className="min-w-0 flex-1 bg-transparent text-base text-[#0B1F33] outline-none placeholder:text-[#98A2B3]" placeholder="Try “mailer boxes” or “beauty”" /><Link href="/search" aria-label="Clear search" className={`grid size-9 place-items-center rounded-lg transition-colors hover:bg-[#FFF4E9] hover:text-[#D96B2B] ${rawQuery ? "" : "pointer-events-none opacity-0"}`}><X className="size-4" /></Link></label><button type="submit" className="h-14 rounded-xl bg-[#D96B2B] px-6 text-sm font-bold text-white transition-colors hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-2">Search</button></form>
    {query ? <div className="mt-10"><div className="flex items-center justify-between gap-4 border-b border-[#E7DDD2] pb-4"><h2 className="font-serif text-2xl text-[#0B1F33]">Results for “{rawQuery}”</h2><p className="text-sm text-[#667085]">{results.length} {results.length === 1 ? "result" : "results"}</p></div>{results.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((result) => <Link key={`${result.type}-${result.title}`} href={result.href} className="group overflow-hidden rounded-xl border border-[#E7DDD2] bg-white outline-none transition-colors hover:border-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><div className="relative aspect-[16/10] overflow-hidden bg-[#F3E8DA]"><Image src={result.image} alt={result.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-200 motion-reduce:transition-none group-hover:scale-[1.02]" /></div><div className="p-5"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#D96B2B]">{result.type}</p><h3 className="mt-2 font-serif text-2xl text-[#0B1F33]">{result.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">{result.description}</p><span className="mt-4 inline-flex min-h-6 items-center gap-2 text-sm font-bold text-[#D96B2B] transition-colors group-hover:text-[#BC5420]">View details <ArrowRight className="size-4" /></span></div></Link>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-[#E7DDD2] bg-white px-6 py-12 text-center"><p className="font-serif text-2xl text-[#0B1F33]">No exact matches yet.</p><p className="mt-2 text-sm leading-6 text-[#667085]">Try a broader term such as “boxes”, “beauty”, “kraft” or “shipping”.</p></div>}</div> : <div className="mt-10 rounded-xl border border-[#E7DDD2] bg-white p-6 sm:p-8"><p className="text-sm font-semibold text-[#0B1F33]">Popular searches</p><div className="mt-4 flex flex-wrap gap-2">{["Mailer Boxes", "Rigid Boxes", "Beauty", "Kraft", "Sustainable", "Shipping"].map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="inline-flex min-h-10 items-center rounded-full border border-[#E7DDD2] bg-[#FFF9F2] px-4 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]">{term}</Link>)}</div></div>}
  </Container></section>;
}
