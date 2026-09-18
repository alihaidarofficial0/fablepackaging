"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Mail, PackageCheck, Phone, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { DesktopNav, MegaPanel } from "./MegaMenu";
import { MiniDropdown } from "./MiniDropdown";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 280);
  }

  function open(label: string) {
    cancelClose();
    setOpenMenu(label);
  }

  function close() {
    cancelClose();
    setOpenMenu(null);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const el = event.target instanceof Element ? event.target : (event.target as Node | null)?.parentElement;
      if (!el) return;
      if (root.current?.contains(el)) return;
      if (el.closest("#desktop-mega-panel")) return;
      close();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelClose();
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="relative z-[60] hidden h-9 bg-[#0B1F33] text-white min-[1160px]:block">
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 text-[11px] font-semibold">
          <div className="flex items-center gap-5 xl:gap-7">
            <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Free design support</span>
            <span className="flex items-center gap-1.5"><PackageCheck className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Low minimum order</span>
            <span className="hidden items-center gap-1.5 min-[1280px]:flex"><Leaf className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Sustainable packaging</span>
          </div>
          <div className="flex items-center gap-5 xl:gap-7">
            <a href="mailto:hello@fablepack.co" className="flex h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D]"><Mail className="size-3.5" aria-hidden="true" />hello@fablepack.co</a>
            <a href="tel:+18551234567" className="hidden h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D] min-[1280px]:flex"><Phone className="size-3.5" aria-hidden="true" />+1 (855) 123-4567</a>
            <MiniDropdown label="USD" ariaLabel="Select currency" options={["USD", "EUR", "GBP"]} />
          </div>
        </div>
      </div>

      <header
        ref={root}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="sticky top-0 z-[80]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[68px] border-b border-[#0B1F33]/10 bg-[#FFFDF9]/95 backdrop-blur-md min-[1160px]:h-[78px]" />
        <div className="relative mx-auto h-[68px] max-w-[1320px] px-4 text-[#0B1F33] min-[1160px]:h-[78px] sm:px-6">
          <div className="grid h-full grid-cols-[auto_1fr_auto] items-center">
            <Logo />
            <DesktopNav openMenu={openMenu} onOpen={open} onClose={close} />
            <div className="hidden items-center gap-0.5 min-[1160px]:flex">
              <Link href="/search" aria-label="Search" className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Search className="size-5" /></Link>
              <Link href="/cart" aria-label="Shopping bag, 0 items" className="relative grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><ShoppingBag className="size-5" /><span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-[#D96B2B] text-[9px] text-white">0</span></Link>
              <Link href="/get-a-quote" style={{ color: "#FFFFFF" }} className="ml-2 flex h-11 items-center gap-2 whitespace-nowrap rounded-[10px] border border-[#D96B2B] bg-[#D96B2B] px-4 text-sm font-bold transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-3 xl:h-12 xl:px-5">Get a Quote <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <MobileMenu />
          </div>
          <MegaPanel openMenu={openMenu} onClose={close} onStay={cancelClose} onLeave={scheduleClose} />
        </div>
      </header>
    </>
  );
}
