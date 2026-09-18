"use client";

import Image from "next/image";
import { Accordion } from "./Accordion";
import { homeFaq } from "@/data/faq";
import { Container } from "./shared/Container";

export function FAQ() {
  return (
    <section id="faq" className="bg-[#FFF9F2] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.17em] text-[#D96B2B]">Questions, answered</p>
            <h2 className="mt-4 max-w-[500px] font-serif text-[clamp(2.45rem,4.6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[#0B1F33]">A few things brands usually ask us.</h2>
            <p className="mt-5 max-w-[480px] text-base leading-[1.65] text-[#667085]">Straight answers, helpful guidance and a team that’s here to make your packaging feel simple.</p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-[#E7DDD2] bg-[#F3E8DA]">
              <Image src="/images/home/faq-packaging.webp" alt="Premium custom packaging boxes styled in a warm editorial studio" fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" />
            </div>
          </div>
          <Accordion items={homeFaq} />
        </div>
      </Container>
    </section>
  );
}
