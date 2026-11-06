import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number
) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath = "/blog",
  params = {},
  className = "",
}: {
  page: number;
  totalPages: number;
  basePath?: string;
  params?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const numbers = pageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      {prev ? (
        <Link
          href={buildHref(basePath, params, prev)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] shadow-xs"
        >
          <ChevronLeft className="size-4" />
          <span>Prev</span>
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#F0EAE2] bg-[#FAF8F5] px-3.5 text-xs font-bold uppercase tracking-wider text-[#C0B7AF] cursor-not-allowed">
          <ChevronLeft className="size-4" />
          <span>Prev</span>
        </span>
      )}

      {numbers.map((n, idx) =>
        n === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex size-10 items-center justify-center text-xs font-bold text-[#98A2B3]"
          >
            …
          </span>
        ) : (
          <Link
            key={n}
            href={buildHref(basePath, params, n)}
            aria-current={n === page ? "page" : undefined}
            className={`inline-flex size-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
              n === page
                ? "bg-[#D96B2B] text-white shadow-xs"
                : "border border-[#E7DDD2] bg-white text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] shadow-xs"
            }`}
          >
            {n}
          </Link>
        )
      )}

      {next ? (
        <Link
          href={buildHref(basePath, params, next)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#F0EAE2] bg-[#FAF8F5] px-3.5 text-xs font-bold uppercase tracking-wider text-[#C0B7AF] cursor-not-allowed">
          <span>Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}

