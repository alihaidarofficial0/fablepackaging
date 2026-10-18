"use client";

import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SiteSearchItem = {
  label: string;
  href: string;
  category: string;
  description?: string;
};

export function SearchPopup({ open, items, onClose }: { open: boolean; items: SiteSearchItem[]; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items.slice(0, 8);

    return items
      .filter((item) => `${item.label} ${item.category} ${item.description || ""}`.toLowerCase().includes(normalizedQuery))
      .sort((first, second) => {
        const firstStarts = first.label.toLowerCase().startsWith(normalizedQuery);
        const secondStarts = second.label.toLowerCase().startsWith(normalizedQuery);
        return Number(secondStarts) - Number(firstStarts);
      })
      .slice(0, 12);
  }, [items, query]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-[#071827]/60 px-4 pt-[8vh] backdrop-blur-sm sm:pt-[12vh]"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="site-search-title" className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] shadow-[0_28px_80px_rgba(7,24,39,0.3)]">
        <div className="flex items-center justify-between border-b border-[#E7DDD2] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#D96B2B]">Search Fable</p>
            <h2 id="site-search-title" className="mt-1 font-serif text-2xl text-[#0B1F33]">What are you looking for?</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close search" className="grid size-11 shrink-0 place-items-center rounded-full text-[#667085] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#0B1F33] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <label className="relative block">
            <span className="sr-only">Search products, materials, industries, and pages</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, materials, industries..."
              className="h-14 w-full rounded-xl border border-[#D9D0C7] bg-white pl-12 pr-4 text-base text-[#0B1F33] outline-none placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10"
            />
          </label>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">{query.trim() ? `${results.length} results` : "Popular destinations"}</p>
            <span className="hidden text-xs text-[#98A2B3] sm:inline">Press Esc to close</span>
          </div>

          <div className="mt-3 max-h-[52vh] space-y-2 overflow-y-auto pr-1" aria-live="polite">
            {results.length ? results.map((item) => (
              <Link key={`${item.category}-${item.href}-${item.label}`} href={item.href} onClick={onClose} className="group flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-[#E7DDD2] bg-white px-4 py-3 outline-none transition-colors hover:border-[#D96B2B]/45 hover:bg-[#FFF9F2] focus-visible:border-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#D96B2B]">{item.category}</span>
                  <span className="mt-1 block font-bold text-[#0B1F33]">{item.label}</span>
                  {item.description ? <span className="mt-0.5 block truncate text-xs text-[#667085]">{item.description}</span> : null}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-[#98A2B3] transition-colors group-hover:text-[#D96B2B]" aria-hidden="true" />
              </Link>
            )) : (
              <div className="rounded-xl border border-dashed border-[#D9D0C7] bg-white px-5 py-10 text-center">
                <p className="font-bold text-[#0B1F33]">No results found</p>
                <p className="mt-1 text-sm text-[#667085]">Try a product, material, finish, or industry name.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
