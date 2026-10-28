"use client";

import { Save } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Save", danger = false }: { children?: React.ReactNode; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60 ${danger ? "bg-red-600 hover:bg-red-700" : "bg-[#D96B2B] hover:bg-[#BC5420]"}`}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function SaveChangesButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D96B2B] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420] disabled:cursor-wait disabled:opacity-60"
    >
      <Save className="size-4" />
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export function SaveChangesBar({ hint }: { hint: string }) {
  return (
    <div className="sticky bottom-6 z-20 flex items-center justify-between gap-4 rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9]/95 p-4 shadow-xl backdrop-blur-md">
      <span className="text-xs leading-5 text-[#667085]">{hint}</span>
      <SaveChangesButton />
    </div>
  );
}

