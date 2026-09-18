import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, Headset, ShieldCheck } from "lucide-react";
import { QuoteForm, QuoteSidebar } from "@/components/QuoteForm";
import { Accordion } from "@/components/Accordion";
import { Container } from "@/components/shared/Container";
import { quoteFaq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Get a Custom Packaging Quote",
  description: "Request a free custom packaging quote. Share your box style, quantity and details — Fable specialists reply within one business day.",
};

const perks = [
  [Check, "Free, no-obligation quote"],
  [Clock3, "Reply within 1 business day"],
  [ShieldCheck, "MOQ from 100 units"],
  [Headset, "Design support included"],
] as const;

export default function QuotePage() {
  return (
    <>
      <section className="bg-[#FFF9F2] py-10 sm:py-12 lg:py-14">
        <Container className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#667085]">
              <Link href="/" className="transition-colors hover:text-[#D96B2B]">Home</Link>
              <span>/</span>
              <b className="text-[#0B1F33]">Get a quote</b>
            </div>
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Built around your product</p>
            <h1 className="max-w-[640px] font-serif text-[clamp(2.35rem,4.6vw,3.7rem)] leading-[1.04] tracking-[-0.04em] text-[#0B1F33]">Tell us about your packaging.</h1>
            <p className="mt-5 max-w-[540px] text-base leading-7 text-[#667085]">Share what you know — skip the rest. Quotes are free, and a specialist usually replies within one business day.</p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {perks.map(([Icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 text-[13px] font-bold text-[#0B1F33]">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F3E8DA] text-[#D96B2B]"><Icon className="size-4" aria-hidden="true" /></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden aspect-[5/4] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA] lg:block">
            <Image src="/images/home/faq-packaging.webp" alt="Premium custom packaging boxes arranged in a warm studio setting" fill sizes="(max-width: 1023px) 100vw, 46vw" className="object-cover" />
          </div>
        </Container>
      </section>

      <section className="bg-[#FFFDF9] py-10 sm:py-12 lg:py-16">
        <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <QuoteForm />
          <QuoteSidebar />
        </Container>
      </section>

      <section className="bg-[#FFF9F2] py-14 sm:py-16">
        <Container className="max-w-[860px]">
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Before you send</p>
          <h2 className="mb-6 font-serif text-[clamp(2rem,4vw,2.8rem)] text-[#0B1F33]">Quote questions, answered.</h2>
          <Accordion items={quoteFaq} />
        </Container>
      </section>
    </>
  );
}
