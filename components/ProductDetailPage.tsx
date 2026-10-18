import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleGauge, Leaf, Palette, Recycle, Ruler, ShieldCheck } from "lucide-react";
import type { Product } from "@/data/products";
import { homeProducts } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { Accordion } from "./Accordion";
import { ProductCard } from "./ProductCard";
import { Container } from "./shared/Container";
import { Button } from "./shared/Button";
import type { CmsFaq, CmsProduct } from "@/types/cms";

export function ProductDetailPage({ product, products = homeProducts, faqs = homeFaq }: { product: Product; products?: CmsProduct[]; faqs?: CmsFaq[] }) {
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="bg-[#FFF9F2] py-10 sm:py-14">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA]">
            <Image src={product.image} alt={product.alt} fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            {product.badge ? (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0B1F33]">{product.badge}</span>
            ) : null}
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#667085]">
              <Link href="/" className="transition-colors hover:text-[#D96B2B]">Home</Link>
              <span>/</span>
              <Link href="/custom-boxes" className="transition-colors hover:text-[#D96B2B]">Custom boxes</Link>
              <span>/</span>
              <b className="text-[#0B1F33]">{product.name}</b>
            </div>
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Made to order · MOQ 100</p>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.04em] text-[#0B1F33]">{product.name}</h1>
            <p className="mt-5 max-w-[540px] text-base leading-7 text-[#667085] sm:text-lg">{product.description}</p>
            <div className="mt-5 tracking-[0.12em] text-[#C99A4A]" aria-label="4.9 out of 5 stars">★★★★★ <span className="ml-2 text-sm tracking-normal text-[#667085]">4.9 · 127 reviews</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[[CircleGauge, "10–15 days", "Production"], [Ruler, "Any size", "Custom dimensions"], [Recycle, "Eco options", "Available"]].map(([Icon, title, note]) => {
                const ItemIcon = Icon as typeof Ruler;
                return (
                  <div key={String(title)} className="flex items-center gap-3 rounded-xl border border-[#E7DDD2] bg-white px-4 py-3">
                    <ItemIcon className="size-5 shrink-0 text-[#D96B2B]" />
                    <span><b className="block text-sm text-[#0B1F33]">{String(title)}</b><small className="text-[11px] text-[#667085]">{String(note)}</small></span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8"><Button href="/get-a-quote">Get a custom quote</Button></div>
          </div>
        </Container>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <Container>
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Your box, your way</p>
          <h2 className="max-w-[640px] font-serif text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.08] text-[#0B1F33]">Every detail can be tailored.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[[Ruler, "Perfectly fitted", "Custom dimensions keep products safe and shipping efficient."], [Palette, "Beautifully printed", "Crisp color inside and out, with finishes that invite touch."], [ShieldCheck, "Made to perform", "Materials chosen for the rigors of retail and delivery."], [Leaf, "Thoughtful options", "Recycled and responsibly sourced choices are available."]].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Ruler;
              return (
                <article key={String(title)} className="rounded-[14px] border border-[#E7DDD2] bg-[#FFF9F2] p-6">
                  <span className="grid size-11 place-items-center rounded-full bg-[#F3E8DA] text-[#D96B2B]"><ItemIcon className="size-5" /></span>
                  <h3 className="mt-4 text-lg font-bold text-[#0B1F33]">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
      {related.length ? (
        <section className="bg-[#FFF9F2] py-14 sm:py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-[#0B1F33]">Related packaging</h2>
              <Link href="/custom-boxes" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#D96B2B] hover:text-[#BC5420]">View all <ArrowRight className="size-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </Container>
        </section>
      ) : null}
      <section className="bg-white py-14 sm:py-16">
        <Container className="max-w-[860px]">
          <h2 className="mb-6 font-serif text-[clamp(2rem,4vw,2.8rem)] text-[#0B1F33]">Frequently asked questions</h2>
          <Accordion items={faqs} />
        </Container>
      </section>
      <section className="bg-white pb-14">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-[18px] bg-[#0B1F33] px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#E6AD65]">Start your project</p>
              <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] text-white">Ready to make something memorable?</h2>
            </div>
            <Button href="/get-a-quote" variant="light">Get a free quote</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
