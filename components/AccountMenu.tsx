"use client";

import Link from "next/link";
import { LayoutDashboard, LogIn, LogOut, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/admin/actions";

export type HeaderAdmin = { email: string; role: "owner" | "editor" } | null;

export function AccountMenu({ admin }: { admin: HeaderAdmin }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-expanded={open} aria-controls="header-account-menu" aria-haspopup="menu" aria-label="Open admin account menu" onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">
        {admin ? <span className="grid size-8 place-items-center rounded-full bg-[#0B1F33] text-xs font-extrabold text-white" aria-hidden="true">{admin.email.charAt(0).toUpperCase()}</span> : <LogIn className="size-5" aria-hidden="true" />}
      </button>
      <div id="header-account-menu" role="menu" hidden={!open} className="absolute right-0 top-[calc(100%+10px)] z-[100] w-64 rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] p-2 shadow-[0_18px_42px_rgba(11,31,51,0.14)]">
        {admin ? (
          <>
            <div className="border-b border-[#E7DDD2] px-3 py-3">
              <p className="truncate text-sm font-bold text-[#0B1F33]">{admin.email}</p>
              <p className="mt-1 text-xs capitalize text-[#667085]">{admin.role} account</p>
            </div>
            <Link href="/admin" role="menuitem" onClick={() => setOpen(false)} className="mt-1 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><LayoutDashboard className="size-4" aria-hidden="true" />Admin dashboard</Link>
            <form action={logoutAction}>
              <button type="submit" role="menuitem" className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#344054] outline-none transition-colors hover:bg-[#FDEDE4] hover:text-[#BC5420] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><LogOut className="size-4" aria-hidden="true" />Sign out</button>
            </form>
          </>
        ) : (
          <>
            <p className="px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Admin access</p>
            <Link href="/admin/login" role="menuitem" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><LogIn className="size-4" aria-hidden="true" />Sign in</Link>
            <Link href="/admin/signup" role="menuitem" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#344054] outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><UserPlus className="size-4" aria-hidden="true" />Sign up</Link>
          </>
        )}
      </div>
    </div>
  );
}

