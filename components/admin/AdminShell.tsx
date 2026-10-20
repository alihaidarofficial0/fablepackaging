"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, BookOpen, Boxes, ChevronDown, FileText, FolderKanban,
  Inbox, LayoutDashboard, Menu, PackageOpen,
  PanelLeft, Search, Settings, Users, X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  activePaths?: string[];
};

const groups: { label: string; items: NavItem[] }[] = [
  { label: "Dashboard", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  { label: "Journal", items: [
    { label: "Articles", href: "/admin/blog", icon: BookOpen, activePaths: ["/admin/blog/new", "/admin/blog/edit"] },
    { label: "Categories", href: "/admin/blog/categories", icon: FolderKanban },
  ] },
  { label: "Website", items: [
    { label: "Static Pages", href: "/admin/pages", icon: FileText, activePaths: ["/admin/pages/home", "/admin/pages/about"] },
  ] },
  { label: "Audience", items: [
    { label: "Subscribers", href: "/admin/leads", icon: Inbox },
  ] },
  { label: "Settings", items: [
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Admin Users", href: "/admin/users", icon: Users },
  ] },
];
const allItems = groups.flatMap((group) => group.items);

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/admin") {
    return pathname === "/admin";
  }

  // Exact match
  if (pathname === item.href) {
    return true;
  }

  // Articles shouldn't match categories
  if (item.href === "/admin/blog") {
    if (pathname.startsWith("/admin/blog/categories")) {
      return false;
    }
    return (
      pathname.startsWith("/admin/blog/new") ||
      pathname.startsWith("/admin/blog/edit")
    );
  }

  if (item.activePaths && item.activePaths.length > 0) {
    if (item.activePaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return true;
    }
  }

  return pathname.startsWith(`${item.href}/`);
}

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className="space-y-6" aria-label="Admin navigation">
    {groups.map((group) => <section key={group.label}>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">{group.label}</p>
      <div className="space-y-0.5">
        {group.items.map((item) => {
          const { icon: Icon, label, href } = item;
          const active = isActive(pathname, item);
          return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`relative flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#E6AD65]/45 ${active ? "border-[#F08A4C] bg-[#D96B2B] text-white shadow-[0_6px_18px_rgba(217,107,43,0.28)]" : "border-transparent text-white/68 hover:bg-white/[0.055] hover:text-white"}`}>
            <span className="flex size-5 shrink-0 items-center justify-center">
              <Icon className={`size-[18px] ${active ? "text-white" : "text-white/56"}`} aria-hidden="true" />
            </span>
            <span className="truncate">{label}</span>
            {active ? <span className="ml-auto size-1.5 rounded-full bg-white" aria-hidden="true" /> : null}
          </Link>;
        })}
      </div>
    </section>)}
  </nav>;
}

function SearchControl() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? allItems.filter((item) => item.label.toLowerCase().includes(needle)).slice(0, 6) : [];
  }, [query]);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function go(href: string) { setOpen(false); setQuery(""); router.push(href); }
  return <div ref={ref} className="relative hidden min-[720px]:block">
    <label className="flex h-10 w-56 items-center gap-2 rounded-lg border border-[#E7DDD2] bg-[#FFFDF9] px-3 text-[#667085] focus-within:border-[#D96B2B] focus-within:ring-2 focus-within:ring-[#D96B2B]/10 lg:w-64">
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <input value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) go(results[0].href); if (event.key === "Escape") setOpen(false); }} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98A2B3]" placeholder="Search admin" aria-label="Search admin modules" />
      <kbd className="hidden rounded border border-[#E7DDD2] px-1.5 py-0.5 text-[10px] text-[#98A2B3] xl:block">⌘K</kbd>
    </label>
    {open && query && <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-72 overflow-hidden rounded-xl border border-[#E7DDD2] bg-white p-1.5">
      {results.length ? results.map((item) => <button key={item.href} type="button" onClick={() => go(item.href)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0B1F33] transition-colors hover:bg-[#FFF9F2] focus-visible:bg-[#FFF9F2] focus-visible:outline-none"><item.icon className="size-4 text-[#D96B2B]" aria-hidden="true" />{item.label}</button>) : <p className="px-3 py-3 text-sm text-[#667085]">No admin module found.</p>}
    </div>}
  </div>;
}

export function AdminShell({ children, email, role = "Administrator" }: { children: React.ReactNode; email: string; role?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const activeItem = allItems.find((item) => isActive(pathname, item));
  const initials = email.slice(0, 2).toUpperCase();
  return <div className="admin-app min-h-screen bg-[#F7F4EF] text-[#111827]">
    {drawerOpen && <button aria-label="Close admin navigation" onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-[#071827]/55 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-white/10 bg-[#071827] p-5 text-white transition-[transform,opacity] duration-200 lg:translate-x-0 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-start justify-between border-b border-white/10 pb-5">
        <Link href="/admin" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#E6AD65]"><span className="grid size-10 place-items-center rounded-xl border border-[#E6AD65]/70 bg-white/[0.03] font-serif text-lg text-[#E6AD65]">F</span><span><b className="block text-lg leading-5">Fable</b><span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/52">Packaging Admin</span></span></Link>
        <button type="button" onClick={() => setDrawerOpen(false)} className="grid size-10 place-items-center rounded-lg text-white/65 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6AD65] lg:hidden" aria-label="Close navigation"><X className="size-5" /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-6 pr-1"><AdminNav onNavigate={() => setDrawerOpen(false)} /></div>
    </aside>
    <div className="min-h-screen lg:pl-[264px]">
      <header className="sticky top-0 z-30 border-b border-[#E7DDD2] bg-[#FFFDF9]/95 backdrop-blur-md"><div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setDrawerOpen(true)} className="grid size-10 place-items-center rounded-lg border border-[#E7DDD2] bg-white text-[#0B1F33] transition-colors hover:bg-[#FFF9F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] lg:hidden" aria-label="Open navigation"><PanelLeft className="size-5" /></button>
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#667085]">Fable Packaging / <span className="text-[#0B1F33]">{activeItem?.label || "Admin"}</span></p><p className="hidden pt-0.5 text-[11px] text-[#98A2B3] sm:block">Content management workspace</p></div>
        <SearchControl />
        <button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-lg text-[#667085] transition-colors hover:bg-[#FFF9F2] hover:text-[#D96B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Bell className="size-[18px]" /><span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#D96B2B]" /></button>
        <div className="relative"><button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex h-11 items-center gap-2 rounded-lg px-1.5 text-left transition-colors hover:bg-[#FFF9F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]" aria-expanded={profileOpen} aria-haspopup="menu"><span className="grid size-8 place-items-center rounded-full bg-[#0B1F33] text-[11px] font-bold text-white">{initials}</span><span className="hidden max-w-32 min-w-0 md:block"><b className="block truncate text-xs text-[#0B1F33]">{email}</b><span className="block text-[10px] text-[#667085]">{role}</span></span><ChevronDown className="hidden size-4 text-[#667085] md:block" /></button>
          {profileOpen && <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 rounded-xl border border-[#E7DDD2] bg-white p-1.5"><Link href="/admin/settings" onClick={() => setProfileOpen(false)} role="menuitem" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0B1F33] transition-colors hover:bg-[#FFF9F2]">Profile & settings</Link><Link href="/" onClick={() => setProfileOpen(false)} role="menuitem" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0B1F33] transition-colors hover:bg-[#FFF9F2]">View website</Link><form action={logoutAction} className="mt-1 border-t border-[#F0EAE2] pt-1"><button role="menuitem" className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#DC3545] transition-colors hover:bg-[#FFF5F4]">Sign out</button></form></div>}
        </div>
      </div></header>
      <main className="mx-auto min-w-0 max-w-[1600px] p-4 sm:p-6 lg:p-8 xl:p-10">{children}</main>
    </div>
  </div>;
}
