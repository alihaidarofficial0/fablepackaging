"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, Search, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navMenus, type NavMenu } from "./MegaMenu";
import type { HeaderAdmin } from "./AccountMenu";
import { logoutAction } from "@/app/admin/actions";

const defaultDirectLinks = [["About", "/about"], ["Blog", "/blog"]] as const;

export function MobileMenu({ menus = navMenus, directItems = defaultDirectLinks, admin = null, onSearch }: { menus?: NavMenu[]; directItems?: ReadonlyArray<readonly [string, string]>; admin?: HeaderAdmin; onSearch?: () => void }) {
  const groups = menus.map((menu) => ({ label: menu.label, href: menu.href, items: menu.items.map((item) => [item.label, item.href] as const) }));
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const el = event.target instanceof Element ? event.target : (event.target as Node | null)?.parentElement;
      if (!el) return;
      if (root.current?.contains(el) || panel.current?.contains(el)) return;
      setOpen(false);
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  const menu = open ? (
    <>
      <div className="fixed inset-x-0 bottom-0 top-[68px] z-[199] bg-[#0B1F33]/40 transition-opacity duration-200" onClick={closeMenu} aria-hidden="true" />
      <nav
        ref={panel}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="fixed inset-x-0 top-[68px] z-[200] max-h-[calc(100vh-68px)] overflow-y-auto border-b border-[#E7DDD2] bg-[#FFFDF9] px-4 pb-7 pt-2 shadow-[0_18px_40px_rgba(11,31,51,0.12)] sm:px-6"
      >
        {groups.map((group) => {
          const isExpanded = expanded === group.label;
          const submenuId = `mobile-${group.label.toLowerCase().replaceAll(" ", "-")}`;
          return (
            <div key={group.label} className="border-b border-[#E7DDD2]">
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={submenuId}
                onClick={() => setExpanded(isExpanded ? null : group.label)}
                className="flex min-h-14 w-full items-center justify-between gap-2 text-left text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]"
              >
                {group.label}
                <ChevronDown className={`size-4 shrink-0 text-[#667085] transition-transform duration-300 ease-out motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div
                id={submenuId}
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-2 pb-4 min-[480px]:grid-cols-2">
                    <Link href={group.href} onClick={closeMenu} className="flex min-h-11 items-center rounded-lg border border-[#D96B2B]/25 bg-[#FFF9F2] px-3 text-[13px] font-semibold text-[#D96B2B] outline-none transition-colors hover:border-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">View all {group.label}</Link>
                    {group.items.map(([label, href]) => (
                      <Link key={href} href={href} onClick={closeMenu} className="flex min-h-11 items-center rounded-lg border border-[#E7DDD2] bg-white px-3 text-[13px] font-semibold text-[#344054] outline-none transition-colors hover:border-[#D96B2B]/35 hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {directItems.map(([label, href]) => (
          <Link key={href} href={href} onClick={closeMenu} className="flex min-h-14 items-center justify-between border-b border-[#E7DDD2] text-[15px] font-bold text-[#0B1F33] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B]">{label}<ArrowRight className="size-4 text-[#D96B2B]" aria-hidden="true" /></Link>
        ))}

        <div className="mt-5 rounded-xl border border-[#E7DDD2] bg-white p-2">
          {admin ? (
            <>
              <div className="px-3 py-2">
                <p className="truncate text-sm font-bold text-[#0B1F33]">{admin.email}</p>
                <p className="mt-0.5 text-xs capitalize text-[#667085]">{admin.role} account</p>
              </div>
              <Link href="/admin" onClick={closeMenu} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] hover:bg-[#F3E8DA] hover:text-[#D96B2B]"><LayoutDashboard className="size-4" aria-hidden="true" />Admin dashboard</Link>
              <form action={logoutAction}>
                <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#344054] hover:bg-[#FDEDE4] hover:text-[#BC5420]"><LogOut className="size-4" aria-hidden="true" />Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/admin/login" onClick={closeMenu} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] hover:bg-[#F3E8DA] hover:text-[#D96B2B]"><LogIn className="size-4" aria-hidden="true" />Admin sign in</Link>
              <Link href="/admin/signup" onClick={closeMenu} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] hover:bg-[#F3E8DA] hover:text-[#D96B2B]"><UserPlus className="size-4" aria-hidden="true" />Admin sign up</Link>
            </>
          )}
        </div>
        <Link href="/get-a-quote" onClick={closeMenu} style={{ color: "#FFFFFF" }} className="mt-5 flex h-[50px] items-center justify-center gap-2 rounded-[10px] border border-[#D96B2B] bg-[#D96B2B] font-bold transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">Get a Quote <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </nav>
    </>
  ) : null;

  return (
    <div ref={root} className="col-start-3 flex items-center justify-self-end gap-1 min-[1160px]:hidden">
      <button type="button" aria-label="Open search" aria-haspopup="dialog" onClick={() => { closeMenu(); onSearch?.(); }} className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Search className="size-5" /></button>
      <button ref={menuButton} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{open ? <X className="size-6" /> : <Menu className="size-6" />}</button>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
