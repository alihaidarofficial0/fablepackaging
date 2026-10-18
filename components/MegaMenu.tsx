"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Package } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { homeProducts } from "@/data/products";
import { homeIndustries } from "@/data/industries";
import type { CmsCatalogItem, CmsIndustry, CmsNavigationItem, CmsProduct } from "@/types/cms";

export type MenuItem = { label: string; href: string; description?: string; image?: string };

export type NavMenu = {
  label: string;
  href: string;
  intro: string;
  items: MenuItem[];
};

export function buildNavMenus(products: CmsProduct[] = homeProducts, industries: CmsIndustry[] = homeIndustries, catalog: CmsCatalogItem[] = [], navigation: CmsNavigationItem[] = []): NavMenu[] { return [
  {
    label: "Custom Boxes",
    href: "/custom-boxes",
    intro: "Made around your product.",
    items: products.map((product) => ({
      label: product.name,
      href: `/custom-boxes/${product.slug}`,
      description: product.subtitle,
      image: product.image,
    })),
  },
  {
    label: "Industries",
    href: "/industries",
    intro: "Packaging shaped around your sector.",
    items: industries.map((industry) => ({
      label: industry.name,
      href: `/industries/${industry.slug}`,
      description: industry.description,
      image: industry.image,
    })),
  },
  {
    label: "Materials",
    href: "/materials",
    intro: "Details that make the difference.",
    items: catalog.filter((item) => item.kind === "material").length ? catalog.filter((item) => item.kind === "material").map((item) => ({ label: item.name, href: `/materials/${item.slug}`, description: item.description, image: item.image })) : [
      { label: "Kraft Paper", href: "/materials/kraft-paper", description: "Natural, tactile and direct.", image: "/images/products/shipping-box.webp" },
      { label: "Premium Paperboard", href: "/materials/premium-paperboard", description: "Smooth, crisp and versatile.", image: "/images/products/mailer-box.webp" },
      { label: "Corrugated Board", href: "/materials/corrugated-board", description: "Protective strength for transit.", image: "/images/products/shipping-box.webp" },
      { label: "Rigid Board", href: "/materials/rigid-board", description: "Weight and presence for gifting.", image: "/images/products/rigid-box.webp" },
    ],
  },
  {
    label: "Design Support",
    href: "/design-support",
    intro: "Clarity from first sketch to final proof.",
    items: navigation.filter((item) => item.location === "design_support").length ? navigation.filter((item) => item.location === "design_support").map((item) => ({ label: item.label, href: item.href, description: item.description, image: item.image })) : [
      { label: "Artwork Guidelines", href: "/artwork-guidelines", description: "Prepare artwork with confidence.", image: "/images/home/faq-packaging.webp" },
      { label: "Structural Design", href: "/design-support", description: "A structure made for your product.", image: "/images/products/display-box.webp" },
      { label: "Samples & Prototypes", href: "/samples", description: "Review form and finish before production.", image: "/images/products/folding-carton.webp" },
      { label: "Get Expert Help", href: "/contact", description: "Talk with a packaging specialist.", image: "/images/home/why-fable-packaging.webp" },
    ],
  },
]; }

export const navMenus: NavMenu[] = buildNavMenus();

const directLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export function DesktopNav({
  openMenu,
  onOpen,
  onClose,
  menus = navMenus,
  directItems = directLinks,
}: {
  openMenu: string | null;
  onOpen: (label: string) => void;
  onClose: () => void;
  menus?: NavMenu[];
  directItems?: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label="Main navigation" className="hidden h-full items-center justify-center min-[1160px]:flex">
      {menus.map((menu) => {
        const isOpen = openMenu === menu.label;
        return (
          <div
            key={menu.label}
            className="relative flex h-full items-center"
            onMouseEnter={() => onOpen(menu.label)}
          >
            <Link
              href={menu.href}
              className={`flex h-full items-center rounded-sm pl-2.5 pr-0.5 text-[13px] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#D96B2B] ${isOpen ? "text-[#D96B2B]" : "text-[#344054] hover:text-[#D96B2B]"}`}
            >
              {menu.label}
            </Link>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-label={`${isOpen ? "Hide" : "Show"} ${menu.label} categories`}
              onClick={() => onOpen(menu.label)}
              className={`grid size-8 place-items-center rounded-md outline-none transition-colors duration-200 hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B] ${isOpen ? "text-[#D96B2B]" : "text-[#667085]"}`}
            >
              <ChevronDown className={`size-3.5 transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          </div>
        );
      })}
      {directItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onMouseEnter={onClose}
          onFocus={onClose}
          className="flex h-full items-center rounded-sm px-2.5 text-[13px] font-semibold text-[#344054] outline-none transition-colors duration-200 hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MegaPanel({
  openMenu,
  onClose,
  onStay,
  onLeave,
  menus = navMenus,
}: {
  openMenu: string | null;
  onClose: () => void;
  onStay: () => void;
  onLeave: () => void;
  menus?: NavMenu[];
}) {
  const menuId = useId();
  const menu = menus.find((item) => item.label === openMenu) ?? null;
  const open = Boolean(menu);
  const [mounted, setMounted] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState<NavMenu | null>(null);
  const [box, setBox] = useState({ top: 0, left: 24, width: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (menu) setVisibleMenu(menu);
  }, [menu]);

  useEffect(() => {
    function update() {
      const header = document.querySelector("header");
      const inner = header?.querySelector(":scope > .relative") as HTMLElement | null;
      if (!header) return;
      const headerRect = header.getBoundingClientRect();
      const innerRect = inner?.getBoundingClientRect() ?? headerRect;
      setBox({ top: headerRect.bottom - 8, left: innerRect.left, width: innerRect.width });
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open]);

  const shown = menu ?? visibleMenu;

  if (!mounted) return null;

  return createPortal(
    <div
      id="desktop-mega-panel"
      data-menu-id={menuId}
      role="menu"
      aria-label={shown ? `${shown.label} categories` : undefined}
      aria-hidden={!open}
      {...(!open ? { inert: true } : {})}
      onMouseEnter={onStay}
      onMouseLeave={onLeave}
      onPointerDown={(event) => event.stopPropagation()}
      style={{ top: box.top, left: box.left, width: box.width || undefined }}
      className={`fixed z-[400] origin-top bg-[#FFFDF9] pt-2 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-2 opacity-0"}`}
    >
      {shown ? (
        <div className="overflow-hidden rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-5 shadow-[0_22px_50px_rgba(11,31,51,0.16)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:gap-7">
            <div className="rounded-xl bg-[#F3E8DA] p-5">
              <span className="grid size-10 place-items-center rounded-lg border border-[#D96B2B]/20 bg-white text-[#D96B2B]" aria-hidden="true">
                <Package className="size-5" />
              </span>
              <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#D96B2B]">Explore {shown.label}</p>
              <p className="mt-2 font-serif text-[26px] leading-[1.12] tracking-[-0.025em] text-[#0B1F33]">{shown.intro}</p>
              <Link
                href={shown.href}
                role="menuitem"
                onClick={onClose}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#D96B2B] outline-none transition-colors hover:text-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"
              >
                View all <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className={`grid content-start gap-2 sm:grid-cols-2 ${shown.items.length > 4 ? "xl:grid-cols-3" : ""}`}>
              {shown.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={onClose}
                  className="flex min-h-[76px] items-center gap-3 rounded-xl border border-[#E7DDD2]/80 bg-white p-3 outline-none transition-colors duration-200 hover:border-[#D96B2B]/30 hover:bg-[#FFF9F2] focus-visible:border-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"
                >
                  {item.image ? (
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#F3E8DA]">
                      <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#0B1F33]">{item.label}</span>
                    {item.description ? <span className="mt-1 block text-xs leading-5 text-[#667085]">{item.description}</span> : null}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
