import Link from "next/link";
import { ArrowRight, FilePenLine, Home, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

const pages = [
  ["Home", "/", "Published", "/admin/pages/home"],
  ["About", "/about", "Published", "/admin/pages/about"],
  ["Contact", "/contact", "Published", "/admin/content"],
] as const;

export default async function PagesPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">
            Website Content
          </p>
          <h1 className="mt-1.5 font-serif text-3xl sm:text-4xl text-[#0B1F33]">
            Static Pages
          </h1>
          <p className="mt-3 text-sm text-[#667085]">
            Manage structured page content, layouts, and copy without changing code.
          </p>
        </div>

        <Link
          href="/admin/pages/home"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-all shadow-md shadow-[#D96B2B]/20"
        >
          <FilePenLine className="size-4" /> Edit Homepage
        </Link>
      </div>

      {/* Pages Table Card */}
      <div className="bg-white rounded-2xl border border-[#E7DDD2] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[1.5fr_1.2fr_120px_120px] items-center gap-4 px-6 py-3.5 bg-[#FFF9F2] border-b border-[#E7DDD2] text-xs font-bold uppercase tracking-[.12em] text-[#667085]">
          <span>Page Title</span>
          <span>Slug</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#F0EAE2]">
          {pages.map(([title, slug, status, href]) => (
            <div
              key={slug}
              className="grid gap-3 p-4 sm:p-5 md:grid-cols-[1.5fr_1.2fr_120px_120px] md:items-center md:gap-4 md:px-6 hover:bg-[#FFFDF9] transition-colors"
            >
              {/* Page & Icon */}
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B] border border-[#F0E1D2]">
                  {slug === "/" ? <Home className="size-4" /> : <FilePenLine className="size-4" />}
                </span>
                <div>
                  <b className="block text-sm font-bold text-[#0B1F33]">{title}</b>
                  <span className="text-xs text-[#98A2B3] md:hidden">{slug}</span>
                </div>
              </div>

              {/* Slug */}
              <span className="hidden md:block text-xs font-mono text-[#667085]">
                {slug}
              </span>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    status === "Published"
                      ? "bg-[#EDF9F1] text-[#198754] border border-[#D1F2DD]"
                      : "bg-[#FFF4E9] text-[#D96B2B] border border-[#FDE1CD]"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-start md:justify-end">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7DDD2] bg-white text-xs font-bold text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] hover:bg-[#FFF9F2] transition-colors"
                >
                  Edit <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-[#667085] px-1">
        <Plus className="size-3.5 text-[#D96B2B]" />
        Additional page templates can be connected to the structured content system as they are published.
      </p>
    </div>
  );
}
