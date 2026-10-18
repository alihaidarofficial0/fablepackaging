"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({ compact = false }: { compact?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} onClick={(event) => { if (!window.confirm("Delete this item permanently? This cannot be undone.")) event.preventDefault(); }} className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60 ${compact ? "px-3 text-xs" : "px-4"}`}>{pending ? "Deleting…" : compact ? "Delete" : "Delete permanently"}</button>;
}
