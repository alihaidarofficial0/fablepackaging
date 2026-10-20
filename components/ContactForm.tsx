"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      form.reset();
      setStatus("done");
      setMessage("Thank you — your note has been forwarded to the editorial desk.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <div className="rounded-2xl border border-[#E7DDD2] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F33] mb-2">
        Send a Message
      </h2>
      <p className="text-sm text-[#526171] mb-8 leading-relaxed">
        Fill out the form below and your enquiry will be routed to the appropriate editor or desk.
      </p>

      <form onSubmit={submit} className="space-y-5">
        {/* Honeypot field for bot protection */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
            >
              Full name <span className="text-[#D96B2B]">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              required
              minLength={2}
              maxLength={120}
              placeholder="e.g. Elena Rostova"
              className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
            >
              Email address <span className="text-[#D96B2B]">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              required
              type="email"
              maxLength={254}
              placeholder="elena@studio.com"
              className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="contact-company"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
            >
              Publication / Studio / Brand
            </label>
            <input
              id="contact-company"
              name="company"
              maxLength={160}
              placeholder="Studio or Organization"
              className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-phone"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
            >
              Phone (optional)
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              maxLength={50}
              placeholder="+1 555 000 0000"
              className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-country"
            className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
          >
            Location / Region
          </label>
          <select
            id="contact-country"
            name="country"
            defaultValue="United States"
            className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="European Union">European Union</option>
            <option value="Australia & NZ">Australia & New Zealand</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Other">Other Region</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]"
          >
            Your Message or Pitch <span className="text-[#D96B2B]">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Share your pitch, topic suggestion, or inquiry in detail..."
            className="w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D96B2B]/15 transition-all leading-relaxed"
          />
        </div>

        {message && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
              status === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {status === "error" ? (
              <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
            )}
            <p className="font-medium">{message}</p>
          </div>
        )}

        <button
          disabled={status === "sending"}
          type="submit"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#D96B2B] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 hover:bg-[#BC5420] focus:outline-none focus:ring-2 focus:ring-[#D96B2B] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
