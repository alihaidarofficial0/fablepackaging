"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="rounded-2xl border border-[#E7DDD2] bg-[#FCF7F0] px-5 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `accordion-answer-${index}`;
        return (
          <div key={item.question} className="border-b border-[#E7DDD2] last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-5 py-4 text-left text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B] sm:text-[17px]"
            >
              <span>{item.question}</span>
              <span className="grid size-[42px] shrink-0 place-items-center rounded-full border border-[#E7DDD2] bg-white text-[#D96B2B] transition-transform duration-300 ease-out motion-reduce:transition-none" aria-hidden="true">
                {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
              </span>
            </button>
            <div
              id={answerId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-4 text-[15px] leading-[1.65] text-[#667085] sm:pr-12 sm:text-base">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
