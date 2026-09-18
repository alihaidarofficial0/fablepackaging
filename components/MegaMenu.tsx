"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Package } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { homeProducts } from "@/data/products";

export type MenuItem = { label: string; href: string; description?: string };

const productItems: MenuItem[] = homeProducts.map((product) => ({
  label: product.name,
  href: `/custom-boxes/${product.slug}`,
  description: product.subtitle,
}));

type NavDropdownProps = {
  label: string;
  href: string;
  items: MenuItem[];
  intro: string;
  wide?: boolean;
};

export function NavDropdown({ label, href, items, intro, wide = false }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `${useId().replaceAll(":", "")}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelClose();
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function focusFirstItem() {
    requestAnimationFrame(() => panel.current?.querySelector<HTMLAnchorElement>("[role='menuitem']")?.focus());
  }

  return (
    <div ref={root} className="relative flex h-full items-center" onMouseEnter={() => { cancelClose(); setOpen(true); }} onMouseLeave={scheduleClose} onFocus={cancelClose} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      <div className="flex h-full items-center">
        <Link href={href} onClick={() => setOpen(false)} className="flex h-full items-center rounded-sm pl-2 pr-1 text-[13px] font-semibold text-[#344054] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{label}</Link>
        <button ref={trigger} type="button" aria-expanded={open} aria-controls={menuId} aria-haspopup="menu" aria-label={`Show ${label} categories`} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); focusFirstItem(); } }} className="grid size-8 place-items-center rounded-md text-[#667085] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><ChevronDown className={`size-3.5 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" /></button>
      </div>

      <div ref={panel} id={menuId} role="menu" aria-label={`${label} categories`} className={`absolute top-full z-50 ${wide ? "left-0 w-[min(760px,calc(100vw-48px))]" : "left-1/2 w-[min(540px,calc(100vw-48px))] -translate-x-1/2"} rounded-b-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-5 shadow-[0_18px_44px_rgba(11,31,51,0.12)] transition-[opacity,visibility] duration-200 motion-reduce:transition-none ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className={`grid ${wide ? "grid-cols-[210px_1fr]" : "grid-cols-[180px_1fr]"} gap-5`}>
          <div className="rounded-xl bg-[#F3E8DA]/65 p-5">
            <span className="grid size-10 place-items-center rounded-lg border border-[#D96B2B]/20 bg-white text-[#D96B2B]" aria-hidden="true"><Package className="size-5" /></span>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#D96B2B]">Explore {label}</p>
            <p className="mt-2 font-serif text-[25px] leading-[1.12] tracking-[-0.025em] text-[#0B1F33]">{intro}</p>
            <Link href={href} role="menuitem" onClick={() => setOpen(false)} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#D96B2B] outline-none transition-colors hover:text-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">View all <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 content-start gap-2">
            {items.map((item) => (
              <Link key={item.href} href={item.href} role="menuitem" onClick={() => setOpen(false)} className="min-h-[76px] rounded-xl border border-transparent bg-white p-3.5 outline-none transition-colors hover:border-[#D96B2B]/30 hover:bg-[#FFF9F2] focus-visible:border-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">
                <span className="block text-sm font-bold text-[#0B1F33]">{item.label}</span>
                {item.description ? <span className="mt-1 block text-xs leading-5 text-[#667085]">{item.description}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MegaMenu() {
  return <NavDropdown label="Custom Boxes" href="/custom-boxes" items={productItems} intro="Made around your product." wide />;
}
