"use client";

import { useState } from "react";

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
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      form.reset();
      setStatus("done");
      setMessage("Thank you — your message has been received.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="form-grid">
        <label>Full name<input name="name" required minLength={2} maxLength={120} placeholder="Your name" /></label>
        <label>Work email<input name="email" required type="email" maxLength={254} placeholder="you@company.com" /></label>
        <label>Phone<input name="phone" type="tel" maxLength={50} placeholder="+1 555 000 0000" /></label>
        <label>Company<input name="company" maxLength={160} placeholder="Company name" /></label>
      </div>
      <label>Country<select name="country" defaultValue="United States" aria-label="Country"><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Europe</option><option>Other</option></select></label>
      <label>How can we help?<textarea name="message" required minLength={10} maxLength={5000} rows={6} placeholder="Tell us about your packaging needs…" /></label>
      {message ? <p role="status" className={status === "error" ? "text-sm font-bold text-red-700" : "text-sm font-bold text-green-700"}>{message}</p> : null}
      <button disabled={status === "sending"} className="button button-primary" type="submit">{status === "sending" ? "Sending…" : "Send message →"}</button>
    </form>
  );
}

