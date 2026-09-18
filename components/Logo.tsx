import Link from "next/link";
import { Box } from "lucide-react";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4" aria-label="Fable Packaging home">
    <span className={`grid size-10 rotate-45 place-items-center rounded-[6px] border-2 border-[#C99A4A] ${inverse ? "text-white" : "text-[#0B1F33]"}`}><Box className="size-6 -rotate-45" strokeWidth={1.6}/></span>
    <span className="leading-none"><strong className={`block text-xl tracking-[-0.04em] ${inverse ? "text-white" : "text-[#0B1F33]"}`}>Fable</strong><small className={`mt-1 block text-[8px] font-bold tracking-[0.18em] ${inverse ? "text-white/55" : "text-[#667085]"}`}>PACKAGING CO.</small></span>
  </Link>;
}
