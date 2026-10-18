"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setStatus("Saving…");
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const result = await response.json() as { error?: string };
    if (response.ok) { form.reset(); setStatus("Subscribed!"); }
    else setStatus(result.error || "Please try again.");
  }
  return <><form onSubmit={submit} className="mt-5 flex h-[50px]"><label htmlFor="footer-email" className="sr-only">Email address</label><input name="email" id="footer-email" type="email" required autoComplete="email" placeholder="Email address" className="min-w-0 flex-1 rounded-l-[8px] border border-white/10 bg-white px-4 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#D96B2B]" /><button type="submit" aria-label="Subscribe" className="grid w-13 place-items-center rounded-r-[8px] border border-[#D96B2B] bg-[#D96B2B] transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ArrowRight className="size-4" /></button></form><p aria-live="polite" className="mt-2 min-h-5 text-xs text-white/70">{status}</p></>;
}
