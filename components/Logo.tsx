import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4" aria-label="Fable Packaging home">
      <span className={`grid size-10 rotate-45 place-items-center rounded-[6px] border-2 border-[#C99A4A] ${inverse ? "text-white" : "text-[#0B1F33]"}`}>
        <svg className="size-6 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </span>
      <span className="leading-none">
        <strong className={`block font-serif text-[1.35rem] font-medium tracking-[-0.03em] ${inverse ? "text-white" : "text-[#0B1F33]"}`}>Fable</strong>
        <small className={`mt-1 block text-[8px] font-bold tracking-[0.18em] ${inverse ? "text-white/55" : "text-[#667085]"}`}>PACKAGING CO.</small>
      </span>
    </Link>
  );
}
