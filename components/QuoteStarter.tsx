"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LifeBuoy } from "lucide-react";

type Starter = { packaging: string; quantity: string; dimensions: string; material: string; printing: string; email: string };
const empty: Starter = { packaging: "", quantity: "", dimensions: "", material: "", printing: "", email: "" };

export function QuoteStarter() {
  const router = useRouter();
  const [values, setValues] = useState<Starter>(empty);

  useEffect(() => {
    const saved = sessionStorage.getItem("fable-quote-starter");
    if (saved) { try { setValues({ ...empty, ...JSON.parse(saved) }); } catch {} }
  }, []);

  function update(key: keyof Starter, value: string) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      sessionStorage.setItem("fable-quote-starter", JSON.stringify(next));
      return next;
    });
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    sessionStorage.setItem("fable-quote-starter", JSON.stringify(values));
    router.push("/get-a-quote?starter=1");
  }

  const field = "mt-2 h-[52px] w-full rounded-[9px] border border-[#0B1F33]/15 bg-white px-4 text-sm text-[#111827] outline-none transition-[border-color,box-shadow] focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10";
  const selectField = `${field} cursor-pointer appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")] bg-[length:16px] bg-[position:right_14px_center] bg-no-repeat pr-10`;
  return <section className="bg-[#F3E8DA] py-14 sm:py-16 lg:py-20">
    <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
      <div><p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Start with the basics</p><h2 className="font-serif text-[clamp(2.4rem,4vw,3.75rem)] leading-[1.04] tracking-[-0.035em] text-[#0B1F33]">Tell us what you need. We’ll help with the rest.</h2><p className="mt-5 max-w-xl text-base leading-7 text-[#667085]">Share a few project details and our packaging team will guide you through structure, materials, finishes and pricing.</p></div>
      <form onSubmit={submit} className="rounded-[18px] border border-[#0B1F33]/10 bg-[#FFFDF9] p-5 shadow-[0_20px_55px_rgba(65,43,25,0.09)] sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold text-[#0B1F33]">Packaging Type<select required value={values.packaging} onChange={(event) => update("packaging", event.target.value)} className={selectField}><option value="">Select a style</option><option>Mailer box</option><option>Rigid box</option><option>Folding carton</option><option>Shipping box</option><option>Display box</option><option>Mylar bag</option></select></label>
          <label className="text-sm font-bold text-[#0B1F33]">Quantity<input required inputMode="numeric" value={values.quantity} onChange={(event) => update("quantity", event.target.value)} className={field} placeholder="e.g. 1,000" /></label>
          <label className="text-sm font-bold text-[#0B1F33]">Dimensions<input value={values.dimensions} onChange={(event) => update("dimensions", event.target.value)} className={field} placeholder="L × W × H" /></label>
          <label className="text-sm font-bold text-[#0B1F33]">Material Preference<select value={values.material} onChange={(event) => update("material", event.target.value)} className={selectField}><option value="">Not sure yet</option><option>Kraft</option><option>Paperboard</option><option>Corrugated</option><option>Rigid board</option></select></label>
          <label className="text-sm font-bold text-[#0B1F33]">Printing Requirement<select value={values.printing} onChange={(event) => update("printing", event.target.value)} className={selectField}><option value="">Select printing</option><option>Outside only</option><option>Inside only</option><option>Inside & outside</option><option>No printing</option></select></label>
          <label className="text-sm font-bold text-[#0B1F33]">Email<input required type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} className={field} placeholder="you@company.com" /></label>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[9px] border border-[#D96B2B] bg-[#D96B2B] px-5 text-sm font-extrabold text-white transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">Start my quote <ArrowRight className="size-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => router.push("/contact")} className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[9px] border border-[#0B1F33]/20 bg-white px-5 text-sm font-extrabold text-[#0B1F33] transition-colors hover:bg-[#FFF9F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4"><LifeBuoy className="size-4" aria-hidden="true" />I need help choosing</button>
        </div>
      </form>
    </div>
  </section>;
}
