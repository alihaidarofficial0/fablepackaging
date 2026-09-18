"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { homeFaq } from "@/data/faq";
import { Container } from "./shared/Container";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[#FFF9F2] py-16 sm:py-20 lg:py-24">
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

          <div className="rounded-2xl border border-[#E7DDD2] bg-[#FCF7F0] px-5 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5">
            {homeFaq.map((item, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;
              return (
                <div key={item.question} className="border-b border-[#E7DDD2] last:border-b-0">
                  <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? -1 : index)} className="flex min-h-[72px] w-full items-center justify-between gap-5 py-4 text-left text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B] sm:text-[17px]">
                    <span>{item.question}</span>
                    <span className="grid size-[42px] shrink-0 place-items-center rounded-full border border-[#E7DDD2] bg-transparent text-[#D96B2B]" aria-hidden="true">{isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}</span>
                  </button>
                  <div id={answerId} hidden={!isOpen} className="pb-5 pr-12 text-[15px] leading-[1.65] text-[#667085] sm:text-base">{item.answer}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
