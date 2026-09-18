"use client";

import type { Product } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";

export function ProductSlider({ products }: { products: Product[] }) {
  const sliderProducts = [...products, ...products];
  const viewport = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);

  function cardStep() {
    const container = viewport.current;
    const card = container?.querySelector<HTMLElement>("[data-product-card]");
    if (!container || !card) return 0;
    const track = card.parentElement;
    const styles = track ? window.getComputedStyle(track) : null;
    const gap = Number.parseFloat(styles?.columnGap || styles?.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function normalizeLoop(direction: number) {
    const container = viewport.current;
    if (!container) return;
    const midpoint = container.scrollWidth / 2;
    if (direction > 0 && container.scrollLeft >= midpoint) container.scrollLeft -= midpoint;
    if (direction < 0 && container.scrollLeft <= 0) container.scrollLeft += midpoint;
  }

  function move(direction: number) {
    const container = viewport.current;
    const distance = cardStep();
    if (!container || !distance) return;
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    container.scrollBy({ left: direction * distance, behavior: "smooth" });
    window.setTimeout(() => normalizeLoop(direction), 450);
    resumeTimer.current = setTimeout(() => { paused.current = false; }, 2600);
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!paused.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) move(1);
    }, 5200);
    return () => {
      window.clearInterval(timer);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div className="product-slider" aria-label="Packaging products" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <div className="flex items-center gap-3 lg:gap-4">
        <button type="button" onClick={() => move(-1)} aria-label="Previous products" className="hidden size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-[#E7DDD2] bg-white text-[#0B1F33] outline-none transition-colors duration-200 hover:border-[#D96B2B] hover:bg-[#D96B2B] hover:text-white focus-visible:ring-2 focus-visible:ring-[#D96B2B] min-[900px]:grid">
          <ChevronLeft className="size-5" />
        </button>
        <div ref={viewport} className="product-slider__viewport min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden">
          <div className="product-slider__track flex w-max gap-4">
            {sliderProducts.map((product, index) => (
              <div
                data-product-card
                key={`${product.slug}-${index}`}
                className="w-[min(78vw,320px)] shrink-0 snap-start min-[640px]:w-[calc((min(100vw,1320px)-80px)/2)] min-[900px]:w-[calc((min(100vw,1320px)-196px)/3)] min-[1280px]:w-[calc((min(100vw,1320px)-212px)/4)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next products" className="hidden size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-[#E7DDD2] bg-white text-[#0B1F33] outline-none transition-colors duration-200 hover:border-[#D96B2B] hover:bg-[#D96B2B] hover:text-white focus-visible:ring-2 focus-visible:ring-[#D96B2B] min-[900px]:grid">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
