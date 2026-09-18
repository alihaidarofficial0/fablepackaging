import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: { label: string; href: string } }) {
  return <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">{eyebrow}</p>}
      <h2 className="font-serif text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.04] tracking-[-0.035em] text-[#0B1F33]">{title}</h2>
      {copy && <p className="mt-4 max-w-2xl text-base leading-7 text-[#667085]">{copy}</p>}
    </div>
    {action && <Link href={action.href} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start font-bold text-[#D96B2B] outline-none hover:text-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4 md:self-auto">{action.label}<ArrowRight className="size-4" aria-hidden="true"/></Link>}
  </div>;
}
