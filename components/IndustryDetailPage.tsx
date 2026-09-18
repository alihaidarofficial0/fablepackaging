import Image from "next/image";
import Link from "next/link";
import type { Industry } from "@/data/industries";
import { homeProducts } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { Accordion } from "./Accordion";
import { ProductCard } from "./ProductCard";
import { Container } from "./shared/Container";
import { Button } from "./shared/Button";

export function IndustryDetailPage({ industry }: { industry: Industry }) {
  return (
    <>
      <section className="bg-[#FFF9F2] py-10 sm:py-14">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA]">
            <Image src={industry.image} alt={industry.alt} fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#667085]">
              <Link href="/" className="transition-colors hover:text-[#D96B2B]">Home</Link>
              <span>/</span>
              <Link href="/industries" className="transition-colors hover:text-[#D96B2B]">Industries</Link>
              <span>/</span>
              <b className="text-[#0B1F33]">{industry.name}</b>
            </div>
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Packaging for {industry.name}</p>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.04em] text-[#0B1F33]">Make the first impression part of the product.</h1>
            <p className="mt-5 max-w-[540px] text-base leading-7 text-[#667085] sm:text-lg">{industry.description}</p>
            <div className="mt-8"><Button href="/get-a-quote">Plan your packaging</Button></div>
          </div>
        </Container>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <Container>
          <h2 className="mb-8 font-serif text-[clamp(2rem,4vw,2.8rem)] text-[#0B1F33]">Popular {industry.name.toLowerCase()} packaging</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeProducts.slice(0, 3).map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </Container>
      </section>
      <section className="bg-[#FFF9F2] py-14 sm:py-16">
        <Container className="max-w-[860px]">
          <h2 className="mb-6 font-serif text-[clamp(2rem,4vw,2.8rem)] text-[#0B1F33]">Frequently asked questions</h2>
          <Accordion items={homeFaq} />
        </Container>
      </section>
    </>
  );
}
