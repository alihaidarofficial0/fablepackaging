"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function MiniDropdown({
  label,
  ariaLabel,
  options,
  tone = "light",
}: {
  label: string;
  ariaLabel: string;
  options: string[];
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(label);
  const [mounted, setMounted] = useState(false);
  const [box, setBox] = useState({ top: 0, bottom: 0, left: 0 });
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const isDark = tone === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function update() {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setBox({
        top: rect.bottom + 6,
        bottom: window.innerHeight - rect.top + 8,
        left: rect.right,
      });
    }
    if (!open) return;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (root.current?.contains(target) || list.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const menu = open ? (
    <ul
      ref={list}
      id={menuId}
      role="listbox"
      aria-label={ariaLabel}
      style={{
        top: isDark ? "auto" : box.top,
        bottom: isDark ? box.bottom : "auto",
        left: box.left,
      }}
      className={`fixed z-[220] min-w-[132px] -translate-x-full overflow-hidden rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] py-1.5 shadow-[0_16px_40px_rgba(11,31,51,0.14)] ${isDark ? "mini-drop-up" : "mini-drop"}`}
    >
      {options.map((option) => (
        <li key={option} role="option" aria-selected={option === value}>
          <button
            type="button"
            onClick={() => {
              setValue(option);
              setOpen(false);
            }}
            className={`flex min-h-10 w-full items-center px-3.5 text-left text-[13px] font-semibold outline-none transition-colors hover:bg-[#FFF9F2] hover:text-[#D96B2B] focus-visible:bg-[#FFF9F2] ${option === value ? "text-[#D96B2B]" : "text-[#0B1F33]"}`}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={`${ariaLabel}, currently ${value}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-9 cursor-pointer items-center gap-1 rounded-sm px-1 outline-none transition-colors focus-visible:ring-2 ${isDark ? "text-white/50 hover:text-white focus-visible:ring-[#D96B2B]" : "hover:text-[#EBC57D] focus-visible:ring-[#EBC57D]"}`}
      >
        {value}
        <ChevronDown className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
