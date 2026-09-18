import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/data/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <article className="group h-[500px] overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-white transition-colors duration-[250ms] hover:border-[#D96B2B]/65">
      <Link
        href={`/industries/${industry.slug}`}
        aria-label={`Explore ${industry.name} packaging solutions`}
        className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]"
      >
        <div className="relative aspect-[4/3] h-[292px] shrink-0 overflow-hidden bg-[#F3E8DA]">
          <Image
            src={industry.image}
            alt={industry.alt}
            fill
            sizes="(max-width: 399px) 100vw, (max-width: 767px) 50vw, (max-width: 1199px) 33vw, 210px"
            className="object-cover transition-transform duration-[250ms] ease-in-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
          <h3 className="min-h-[52px] font-serif text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-[#0B1F33] transition-colors duration-[250ms] group-hover:text-[#D96B2B]">
            {industry.name}
          </h3>
          <p className="min-h-[67px] text-[14px] leading-[1.5] text-[#667085]">{industry.description}</p>
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="text-[12px] font-bold text-[#D96B2B] transition-colors duration-[250ms] group-hover:text-[#BC5420]">Explore industry</span>
            <span className="grid size-[42px] shrink-0 place-items-center rounded-full border border-[#E7DDD2] bg-[#FFF9F2] text-[#D96B2B] transition-colors duration-[250ms] group-hover:bg-[#D96B2B] group-hover:text-white" aria-hidden="true">
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
