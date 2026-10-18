import Link from "next/link";
import { ArrowRight, FilePenLine, Home, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

const pages = [
  ["Home", "/", "Published", "/admin/pages/home"],
  ["About", "/about", "Published", "/admin/content"],
  ["Contact", "/contact", "Published", "/admin/content"],
  ["Custom Boxes", "/custom-boxes", "Published", "/admin/products"],
  ["Industries", "/industries", "Published", "/admin/industries"],
  ["Materials", "/materials", "Published", "/admin/materials"],
  ["Design Support", "/design-support", "Published", "/admin/content"],
  ["Sustainability", "/sustainability", "Published", "/admin/content"],
  ["Blog", "/blog", "Draft", "/admin/blog"],
  ["FAQ", "/faq", "Published", "/admin/faqs"],
] as const;

export default async function PagesPage() {
  await requireAdmin();
  return <>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Website content</p><h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">Pages</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">Manage structured content without changing your website code.</p></div><Link href="/admin/pages/home" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#D96B2B] px-4 text-sm font-bold text-white transition-colors hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-2"><FilePenLine className="size-4" />Edit homepage</Link></div>
    <section className="mt-8 overflow-hidden rounded-xl border border-[#E7DDD2] bg-white"><div className="hidden grid-cols-[minmax(180px,1.4fr)_minmax(160px,1fr)_120px_150px] gap-4 border-b border-[#E7DDD2] bg-[#FFF9F2] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#667085] md:grid"><span>Page</span><span>Slug</span><span>Status</span><span className="text-right">Action</span></div><div className="divide-y divide-[#F0EAE2]">{pages.map(([title, slug, status, href]) => <div key={slug} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(180px,1.4fr)_minmax(160px,1fr)_120px_150px] md:items-center md:gap-4 md:px-6"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[#FFF4E9] text-[#D96B2B]">{slug === "/" ? <Home className="size-4" /> : <FilePenLine className="size-4" />}</span><span><b className="block text-sm text-[#0B1F33]">{title}</b><span className="mt-0.5 block text-xs text-[#98A2B3] md:hidden">{slug}</span></span></div><span className="hidden text-sm text-[#667085] md:block">{slug}</span><span><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "Published" ? "bg-[#EDF9F1] text-[#198754]" : "bg-[#FFF4E9] text-[#D96B2B]"}`}>{status}</span></span><Link href={href} className="inline-flex min-h-10 items-center justify-self-start gap-2 rounded-lg border border-[#E7DDD2] px-3 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] md:justify-self-end">Edit <ArrowRight className="size-4" /></Link></div>)}</div></section>
    <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#667085]"><Plus className="size-3.5 text-[#D96B2B]" />Additional page templates can be connected to the same structured content system as they are published.</p>
  </>;
}
