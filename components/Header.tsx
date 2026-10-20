"use client";

import Link from "next/link";
import { Sparkles, Mail, Search, ArrowRight, Menu, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "./Logo";
import { SearchPopup, type SiteSearchItem } from "./SearchPopup";
import type { SiteSettings } from "@/types/cms";
import type { HeaderAdmin } from "./AccountMenu";

export function Header({
  settings,
  admin,
}: {
  settings: SiteSettings;
  admin: HeaderAdmin;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const searchItems: SiteSearchItem[] = useMemo(() => [
    { label: "All Journal Articles", href: "/blog", category: "Journal", description: "Browse the full collection of stories and guides." },
    { label: "Box Styles & Structure", href: "/blog/category/box-styles-structural-design", category: "Topic", description: "Rigid boxes, custom mailers, and dielines." },
    { label: "Materials & Substrates", href: "/blog/category/materials-substrates", category: "Topic", description: "Virgin kraft, fluted boards, and greyboard." },
    { label: "Sustainable Packaging", href: "/blog/category/sustainable-packaging", category: "Topic", description: "Zero-plastic, circular lifecycles, and eco inks." },
    { label: "Printing & Luxury Finishes", href: "/blog/category/printing-luxury-finishes", category: "Topic", description: "Foil stamping, debossing, and spot UV." },
    { label: "E-Commerce & Unboxing", href: "/blog/category/ecommerce-unboxing", category: "Topic", description: "DTC shipping, branded reveals, and inserts." },
    { label: "Prepress & Design Guides", href: "/blog/category/prepress-design-guides", category: "Topic", description: "Artwork checklists and bleed tolerances." },
    { label: "About the Journal", href: "/about", category: "Publication", description: "Our editorial mission and philosophy." },
    { label: "Reader Contact", href: "/contact", category: "Publication", description: "Get in touch with the editors." },
  ], []);

  const topics = [
    { name: "Box Styles & Structure", href: "/blog/category/box-styles-structural-design", desc: "Rigid boxes, mailers & dielines" },
    { name: "Materials & Substrates", href: "/blog/category/materials-substrates", desc: "Kraft, corrugated & greyboard calipers" },
    { name: "Sustainable Packaging", href: "/blog/category/sustainable-packaging", desc: "Zero-plastic & circular design" },
    { name: "Printing & Finishes", href: "/blog/category/printing-luxury-finishes", desc: "Hot foil stamping, deboss & spot UV" },
    { name: "E-Commerce & Unboxing", href: "/blog/category/ecommerce-unboxing", desc: "DTC shipping & branded reveals" },
    { name: "Prepress Guides", href: "/blog/category/prepress-design-guides", desc: "Artwork prep & fold tolerances" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative z-[60] hidden h-9 bg-[#0B1F33] text-white min-[1160px]:block">
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 text-[11px] font-semibold">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/80">
              <Sparkles className="size-3.5 text-[#D96B2B]" />
              Fable Journal — Exploring craftsmanship, structural design, and material culture.
            </span>
          </div>
          <div className="flex items-center gap-6 text-white/70">
            <Link href="/blog#newsletter" className="hover:text-[#D96B2B] transition-colors">
              Subscribe to Newsletter
            </Link>
            <span className="h-3 w-px bg-white/20" />
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="size-3 text-[#D96B2B]" />
              {settings.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-[80] border-b border-[#0B1F33]/10 bg-[#FFFDF9]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Logo brandName="Fable" descriptor="Journal & Essays" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 min-[960px]:flex">
            <Link
              href="/"
              className="text-sm font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors"
            >
              All Articles
            </Link>

            {/* Topics dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
                setTopicsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setTopicsDropdownOpen(false), 200);
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors py-2 cursor-pointer"
              >
                Topics &amp; Themes
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${topicsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {topicsDropdownOpen && (
                <div className="absolute top-full left-0 w-72 rounded-2xl border border-[#E7DDD2] bg-white p-3 shadow-xl transition-all space-y-1">
                  {topics.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setTopicsDropdownOpen(false)}
                      className="block p-3 rounded-xl hover:bg-[#FFF9F2] transition-colors group"
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] group-hover:text-[#D96B2B]">
                        {t.name}
                      </span>
                      <span className="block text-[11px] text-[#667085] mt-0.5">
                        {t.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search stories"
              className="grid size-10 place-items-center rounded-xl border border-[#E7DDD2] bg-white text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors cursor-pointer"
            >
              <Search className="size-4" />
            </button>


            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#D96B2B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#BC5420] shadow-md shadow-[#D96B2B]/20 ml-2"
            >
              Read Stories <ArrowRight className="size-3.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-10 place-items-center rounded-xl border border-[#E7DDD2] bg-white text-[#0B1F33] min-[960px]:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E7DDD2] bg-white px-6 py-5 min-[960px]:hidden space-y-4">
            <div className="flex flex-col space-y-3 font-semibold text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#0B1F33] hover:text-[#D96B2B]"
              >
                Home
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#0B1F33] hover:text-[#D96B2B]"
              >
                All Articles
              </Link>
              <div className="pt-2 border-t border-[#F0EAE2] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                  Topics
                </span>
                {topics.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold text-[#0B1F33] hover:text-[#D96B2B]"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-[#F0EAE2] space-y-2">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#0B1F33] hover:text-[#D96B2B]"
                >
                  About the Journal
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#0B1F33] hover:text-[#D96B2B]"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchPopup open={searchOpen} items={searchItems} onClose={closeSearch} />
    </>
  );
}
