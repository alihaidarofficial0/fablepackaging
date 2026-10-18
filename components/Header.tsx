"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Mail, PackageCheck, Phone, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "./Logo";
import { AccountMenu, type HeaderAdmin } from "./AccountMenu";
import { buildNavMenus, DesktopNav, MegaPanel } from "./MegaMenu";
import { MiniDropdown } from "./MiniDropdown";
import { MobileMenu } from "./MobileMenu";
import { SearchPopup, type SiteSearchItem } from "./SearchPopup";
import type { SiteSettings } from "@/types/cms";
import type { CmsCatalogItem, CmsIndustry, CmsNavigationItem, CmsProduct } from "@/types/cms";

export function Header({ settings, products, industries, catalog, navigation, admin }: { settings: SiteSettings; products: CmsProduct[]; industries: CmsIndustry[]; catalog: CmsCatalogItem[]; navigation: CmsNavigationItem[]; admin: HeaderAdmin }) {
  const menus = buildNavMenus(products, industries, catalog, navigation);
  const directItems = navigation.filter((item) => item.location === "header_direct").map((item) => ({ label: item.label, href: item.href }));
  const mobileDirectItems = directItems.map((item) => [item.label, item.href] as const);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const searchItems = useMemo(() => {
    const items: SiteSearchItem[] = [
      { label: "All custom boxes", href: "/custom-boxes", category: "Products", description: "Browse every packaging format." },
      { label: "All industries", href: "/industries", category: "Industries", description: "Packaging solutions by sector." },
      { label: "Materials", href: "/materials", category: "Materials", description: "Explore packaging materials." },
      { label: "Finishes", href: "/finishes", category: "Finishes", description: "Explore print and finishing options." },
      { label: "Get a quote", href: "/get-a-quote", category: "Support", description: "Start your custom packaging project." },
      { label: "Contact us", href: "/contact", category: "Support", description: "Talk to a packaging specialist." },
      ...products.map((product) => ({ label: product.name, href: `/custom-boxes/${product.slug}`, category: "Product", description: product.subtitle })),
      ...industries.map((industry) => ({ label: industry.name, href: `/industries/${industry.slug}`, category: "Industry", description: industry.description })),
      ...catalog.map((item) => ({ label: item.name, href: `/${item.kind === "material" ? "materials" : "finishes"}/${item.slug}`, category: item.kind === "material" ? "Material" : "Finish", description: item.description })),
      ...navigation.map((item) => ({ label: item.label, href: item.href, category: "Page", description: item.description })),
    ];

    return Array.from(new Map(items.map((item) => [item.href, item])).values());
  }, [catalog, industries, navigation, products]);

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
      {settings.announcement_enabled !== false ? <div className="relative z-[60] hidden h-9 bg-[#0B1F33] text-white min-[1160px]:block">
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 text-[11px] font-semibold">
          <div className="flex items-center gap-5 xl:gap-7">
            <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#C99A4A]" aria-hidden="true" />{settings.announcement_item_1 || "Free design support"}</span>
            <span className="flex items-center gap-1.5"><PackageCheck className="size-3.5 text-[#C99A4A]" aria-hidden="true" />{settings.announcement_item_2 || "Low minimum order"}</span>
            <span className="hidden items-center gap-1.5 min-[1280px]:flex"><Leaf className="size-3.5 text-[#C99A4A]" aria-hidden="true" />{settings.announcement_item_3 || "Sustainable packaging"}</span>
          </div>
          <div className="flex items-center gap-5 xl:gap-7">
            <a href={`mailto:${settings.email}`} className="flex h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D]"><Mail className="size-3.5" aria-hidden="true" />{settings.email}</a>
            <a href={`tel:${settings.phone_href}`} className="hidden h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D] min-[1280px]:flex"><Phone className="size-3.5" aria-hidden="true" />{settings.phone}</a>
            <MiniDropdown label={settings.currency || "USD"} ariaLabel="Select currency" options={["USD", "EUR", "GBP"]} />
          </div>
        </div>
      </div> : null}

      <header
        ref={root}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="sticky top-0 z-[80]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[68px] border-b border-[#0B1F33]/10 bg-[#FFFDF9]/95 backdrop-blur-md min-[1160px]:h-[78px]" />
        <div className="relative mx-auto h-[68px] max-w-[1320px] px-4 text-[#0B1F33] min-[1160px]:h-[78px] sm:px-6">
          <div className="grid h-full grid-cols-[auto_1fr_auto] items-center">
            <Logo brandName={settings.company_name.replace(/\s+Packaging$/i, "") || "Fable"} descriptor={settings.brand_descriptor || "Packaging Co."} logoUrl={settings.logo_url || ""} />
            <DesktopNav menus={menus} directItems={directItems} openMenu={openMenu} onOpen={open} onClose={close} />
            <div className="hidden items-center gap-0.5 min-[1160px]:flex">
              <button type="button" onClick={() => setSearchOpen(true)} aria-label="Open search" aria-haspopup="dialog" className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Search className="size-5" /></button>
              <Link href="/cart" aria-label="Shopping bag, 0 items" className="relative grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><ShoppingBag className="size-5" /><span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-[#D96B2B] text-[9px] text-white">0</span></Link>
              <AccountMenu admin={admin} />
              <Link href={settings.header_cta_href || "/get-a-quote"} style={{ color: "#FFFFFF" }} className="ml-2 flex h-11 items-center gap-2 whitespace-nowrap rounded-[10px] border border-[#D96B2B] bg-[#D96B2B] px-4 text-sm font-bold transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-3 xl:h-12 xl:px-5">{settings.header_cta_label || "Get a Quote"} <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <MobileMenu menus={menus} directItems={mobileDirectItems} admin={admin} onSearch={() => setSearchOpen(true)} />
          </div>
          <MegaPanel menus={menus} openMenu={openMenu} onClose={close} onStay={cancelClose} onLeave={scheduleClose} />
        </div>
      </header>
      <SearchPopup open={searchOpen} items={searchItems} onClose={closeSearch} />
    </>
  );
}
