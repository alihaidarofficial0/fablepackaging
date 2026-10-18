"use client";

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

