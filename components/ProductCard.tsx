import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-white transition-colors duration-[250ms] ease-in-out hover:border-[#D96B2B]/70">
      <Link
        href={`/custom-boxes/${product.slug}`}
        aria-label={`Explore ${product.name}`}
        className="flex h-full cursor-pointer flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]"
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#F3E8DA]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 519px) 100vw, (max-width: 899px) 50vw, (max-width: 1199px) 33vw, 210px"
            className="object-cover"
          />
          {product.badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0B1F33]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5">
          <h3 className="font-serif text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-[#0B1F33] sm:text-[22px]">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-[14px] leading-[1.45] text-[#667085] sm:text-[15px]">{product.subtitle}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-[13px] font-bold text-[#D96B2B] transition-colors duration-[250ms] group-hover:text-[#BC5420]">Explore product</span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#E7DDD2] bg-[#FFF9F2] text-[#D96B2B] transition-colors duration-[250ms] group-hover:bg-[#D96B2B] group-hover:text-white" aria-hidden="true">
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
