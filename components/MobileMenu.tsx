"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const groups = [
  { label: "Custom Boxes", href: "/custom-boxes", items: [["Mailer Boxes", "/custom-boxes/mailer-boxes"], ["Rigid Boxes", "/custom-boxes/rigid-boxes"], ["Folding Cartons", "/custom-boxes/folding-cartons"], ["Shipping Boxes", "/custom-boxes/shipping-boxes"], ["Display Boxes", "/custom-boxes/display-boxes"], ["Mylar Bags", "/custom-boxes/mylar-bags"]] },
  { label: "Industries", href: "/industries", items: [["Cosmetics & Beauty", "/industries/cosmetics-beauty"], ["Food & Beverage", "/industries/food-beverage"], ["Retail & E-Commerce", "/industries/ecommerce"], ["Health & Wellness", "/industries/health-wellness"], ["Electronics", "/industries/electronics"], ["Apparel & Fashion", "/industries/apparel-fashion"]] },
  { label: "Materials", href: "/materials", items: [["Kraft Paper", "/materials/kraft-paper"], ["Premium Paperboard", "/materials/premium-paperboard"], ["Corrugated Board", "/materials/corrugated-board"], ["Rigid Board", "/materials/rigid-board"]] },
  { label: "Design Support", href: "/design-support", items: [["Artwork Guidelines", "/artwork-guidelines"], ["Structural Design", "/design-support"], ["Samples & Prototypes", "/samples"], ["Get Expert Help", "/contact"]] },
] as const;

const directLinks = [["About", "/about"], ["Blog", "/blog"]] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div ref={root} className="col-start-3 flex items-center justify-self-end gap-1 min-[1024px]:hidden">
      <Link href="/search" aria-label="Search" className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Search className="size-5" /></Link>
      <button ref={menuButton} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{open ? <X className="size-6" /> : <Menu className="size-6" />}</button>

      <nav id="mobile-navigation" aria-label="Mobile navigation" className={`absolute inset-x-0 top-[67px] max-h-[calc(100vh-68px)] overflow-y-auto border-b border-[#E7DDD2] bg-[#FFFDF9] px-4 pb-6 pt-2 shadow-[0_18px_40px_rgba(11,31,51,0.12)] transition-[opacity,visibility] duration-200 motion-reduce:transition-none sm:px-6 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        {groups.map((group) => {
          const isExpanded = expanded === group.label;
          const submenuId = `mobile-${group.label.toLowerCase().replaceAll(" ", "-")}`;
          return (
            <div key={group.label} className="border-b border-[#E7DDD2]">
              <div className="flex min-h-14 items-center">
                <Link href={group.href} onClick={closeMenu} className="flex min-h-12 flex-1 items-center text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]">{group.label}</Link>
                <button type="button" aria-expanded={isExpanded} aria-controls={submenuId} onClick={() => setExpanded(isExpanded ? null : group.label)} className="grid size-11 place-items-center rounded-lg text-[#667085] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]" aria-label={`Show ${group.label} categories`}><ChevronDown className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} /></button>
              </div>
              <div id={submenuId} hidden={!isExpanded} className="grid grid-cols-2 gap-2 pb-4">
                {group.items.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu} className="flex min-h-11 items-center rounded-lg border border-[#E7DDD2] bg-white px-3 text-[13px] font-semibold text-[#344054] outline-none transition-colors hover:border-[#D96B2B]/35 hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{label}</Link>)}
              </div>
            </div>
          );
        })}

        {directLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu} className="flex min-h-14 items-center justify-between border-b border-[#E7DDD2] text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]">{label}<ArrowRight className="size-4 text-[#D96B2B]" aria-hidden="true" /></Link>)}

        <Link href="/get-a-quote" onClick={closeMenu} style={{ color: "#FFFFFF" }} className="mt-5 flex h-[50px] items-center justify-center gap-2 rounded-[10px] border border-[#D96B2B] bg-[#D96B2B] font-bold transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">Get a Quote <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </nav>
    </div>
  );
}
