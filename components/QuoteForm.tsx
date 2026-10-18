"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  HelpCircle,
  Mail,
  Palette,
  Phone,
  UploadCloud,
} from "lucide-react";
import { homeProducts } from "@/data/products";
import type { CmsProduct } from "@/types/cms";

const STEPS = ["Packaging", "Specs", "Details", "Review"] as const;

const QUANTITIES = ["100 – 499", "500 – 999", "1,000 – 4,999", "5,000 – 9,999", "10,000+", "Not sure yet"];
const MATERIALS = ["Kraft", "Corrugated", "Paperboard", "Rigid board", "Recycled paper", "Not sure yet"];
const PRINTING = ["Outside only", "Inside only", "Inside & outside", "No printing", "Not sure yet"];
const FINISHES = ["Matte", "Gloss", "Soft touch", "Spot UV", "Foil", "Embossing", "Debossing"];
const ARTWORK = [
  { id: "have", label: "I have artwork", note: "PDF, AI, EPS or ZIP" },
  { id: "later", label: "I’ll send it later", note: "Quote first, files after" },
  { id: "help", label: "I need design help", note: "Our team can guide you" },
] as const;

type QuoteData = {
  packaging: string;
  quantity: string;
  length: string;
  width: string;
  height: string;
  unit: string;
  material: string;
  printing: string;
  finishes: string[];
  artwork: string;
  fileName: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
};

const empty: QuoteData = {
  packaging: "",
  quantity: "",
  length: "",
  width: "",
  height: "",
  unit: "Inches",
  material: "",
  printing: "",
  finishes: [],
  artwork: "",
  fileName: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

const fieldClass =
  "mt-2 h-[52px] w-full rounded-[9px] border border-[#0B1F33]/15 bg-white px-4 text-sm text-[#111827] outline-none transition-[border-color,box-shadow] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10";
const selectClass = `${fieldClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")] bg-[length:16px] bg-[position:right_14px_center] bg-no-repeat pr-10`;

function mapQuantity(value: string) {
  const n = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return value || "";
  if (n < 500) return "100 – 499";
  if (n < 1000) return "500 – 999";
  if (n < 5000) return "1,000 – 4,999";
  if (n < 10000) return "5,000 – 9,999";
  return "10,000+";
}

function mapPackaging(value: string, products: CmsProduct[]) {
  if (!value) return "";
  const needle = value.toLowerCase().trim();
  return products.find((product) => {
    const name = product.name.toLowerCase();
    return name === needle || name.includes(needle) || needle.includes(name.replace(/s$/, ""));
  })?.name || value;
}

function parseDimensions(value: string) {
  const parts = value.split(/[x×,/]+/i).map((part) => part.replace(/[^0-9.]/g, "").trim()).filter(Boolean);
  if (parts.length < 2) return { length: "", width: "", height: "" };
  return { length: parts[0] || "", width: parts[1] || "", height: parts[2] || "" };
}

function dimensionsLabel(data: QuoteData) {
  if (!data.length && !data.width && !data.height) return "We’ll help size it";
  return `${data.length || "—"} × ${data.width || "—"} × ${data.height || "—"} ${data.unit}`;
}

function Pill({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border px-4 text-sm font-bold transition-colors ${
        selected
          ? "border-[#D96B2B] bg-[#FFF4EC] text-[#D96B2B]"
          : "border-[#E7DDD2] bg-white text-[#0B1F33] hover:border-[#D96B2B]/50 hover:bg-[#FFF9F2]"
      }`}
    >
      {selected ? <Check className="mr-1.5 size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
      {label}
    </button>
  );
}

export function QuoteForm({ products = homeProducts }: { products?: CmsProduct[] }) {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [data, setData] = useState<QuoteData>(empty);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const formId = useId();

  useEffect(() => {
    const draftRaw = sessionStorage.getItem("fable-quote-draft");
    const starterRaw = sessionStorage.getItem("fable-quote-starter");
    let next = empty;
    let nextStep = 0;
    let nextMax = 0;
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw) as { step?: number; maxStep?: number; data?: Partial<QuoteData> };
        next = { ...empty, ...draft.data, finishes: draft.data?.finishes || [] };
        nextStep = typeof draft.step === "number" ? Math.min(Math.max(draft.step, 0), 3) : 0;
        nextMax = typeof draft.maxStep === "number" ? Math.min(Math.max(draft.maxStep, nextStep), 3) : nextStep;
      } catch {}
    }
    if (starterRaw) {
      try {
        const starter = JSON.parse(starterRaw) as Record<string, string>;
        const dims = parseDimensions(starter.dimensions || "");
        next = {
          ...next,
          packaging: mapPackaging(starter.packaging || next.packaging, products),
          quantity: mapQuantity(starter.quantity || next.quantity),
          material: starter.material && starter.material !== "Not sure yet" ? starter.material : next.material,
          printing: starter.printing || next.printing,
          email: starter.email || next.email,
          length: dims.length || next.length,
          width: dims.width || next.width,
          height: dims.height || next.height,
        };
        sessionStorage.removeItem("fable-quote-starter");
        nextStep = 0;
      } catch {}
    }
    setData(next);
    setStep(nextStep);
    setMaxStep(Math.max(nextMax, nextStep));
    setReady(true);
  }, [products]);

  useEffect(() => {
    if (!ready || done) return;
    sessionStorage.setItem("fable-quote-draft", JSON.stringify({ step, maxStep, data }));
  }, [ready, step, maxStep, data, done]);

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    document.getElementById("quote-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, done]);

  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function toggleFinish(finish: string) {
    setData((current) => ({
      ...current,
      finishes: current.finishes.includes(finish)
        ? current.finishes.filter((item) => item !== finish)
        : [...current.finishes, finish],
    }));
  }

  function validate(from = step) {
    if (from === 0 && !data.packaging) return "Choose a packaging style to continue.";
    if (from === 1 && !data.quantity) return "Select a quantity so we can price the right production route.";
    if (from === 2) {
      if (data.name.trim().length < 2) return "Add your name so we know who to contact.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Add a valid work email.";
    }
    return "";
  }

  function goTo(index: number) {
    if (index > maxStep) return;
    setError("");
    setStep(index);
  }

  function next() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setStep((current) => {
      const upcoming = Math.min(current + 1, STEPS.length - 1);
      setMaxStep((reached) => Math.max(reached, upcoming));
      return upcoming;
    });
  }

  async function submit() {
    const message = validate(2);
    if (message) {
      setError(message);
      setStep(2);
      return;
    }
    setSubmitting(true);
    setError("");
    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => body.set(key, key === "finishes" ? JSON.stringify(value) : String(value)));
    body.set("website", "");
    if (artworkFile) body.set("file", artworkFile);
    try {
      const response = await fetch("/api/quote", { method: "POST", body });
      const result = await response.json() as { error?: string; reference?: string };
      if (!response.ok) throw new Error(result.error || "Your request could not be submitted.");
      sessionStorage.removeItem("fable-quote-draft");
      sessionStorage.removeItem("fable-quote-starter");
      setReference(result.reference || "");
      setDone(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your request could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const questions = [
    "What are you creating?",
    "Tell us about the project.",
    "How should we reach you?",
    "Does everything look right?",
  ];

  if (done) {
    return (
      <div id="quote-builder" className="scroll-mt-[120px] rounded-[18px] border border-[#E7DDD2] bg-white px-6 py-12 text-center shadow-[0_20px_55px_rgba(65,43,25,0.08)] sm:px-10 sm:py-16">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#4D805B] text-white">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <p className="mt-6 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Request received</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.08] text-[#0B1F33]">Your project is in good hands.</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#667085]">A packaging specialist will review the details and reply within one business day — usually with sizing advice, pricing and next steps.</p>
        {reference ? <p className="mx-auto mt-4 w-fit rounded-full bg-[#FFF4EC] px-4 py-2 text-sm font-bold text-[#D96B2B]">Reference: {reference}</p> : null}
        <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm font-bold text-[#0B1F33]">
          {["We’ll confirm structure and materials", "You’ll get a clear quote and timeline", "Artwork and proofs come after you approve"].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#FFF4EC] text-[#D96B2B]"><Check className="size-3.5" strokeWidth={3} /></span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-[50px] items-center justify-center rounded-[9px] border border-[#D96B2B] bg-[#D96B2B] px-5 text-sm font-extrabold text-white transition-colors hover:border-[#BC5420] hover:bg-[#BC5420]">Back to home</Link>
          <Link href="/contact" className="inline-flex h-[50px] items-center justify-center rounded-[9px] border border-[#0B1F33]/20 bg-white px-5 text-sm font-extrabold text-[#0B1F33] transition-colors hover:bg-[#FFF9F2]">Talk to an expert</Link>
        </div>
      </div>
    );
  }

  return (
    <div id="quote-builder" className="scroll-mt-[120px] rounded-[18px] border border-[#E7DDD2] bg-white p-5 shadow-[0_20px_55px_rgba(65,43,25,0.08)] sm:p-8">
      <div className="flex items-center justify-between gap-4 text-[12px] font-extrabold uppercase tracking-[0.14em]">
        <span className="text-[#667085]">Step {step + 1} of {STEPS.length}</span>
        <span className="text-[#D96B2B]">{STEPS[step]}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ECE7E0]" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Quote progress">
        <div className="h-full rounded-full bg-[#D96B2B] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${progress}%` }} />
      </div>
      <ol className="mt-5 hidden grid-cols-4 gap-2 sm:grid">
        {STEPS.map((label, index) => {
          const complete = index < step;
          const current = index === step;
          const reachable = index <= maxStep;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={index > maxStep}
                onClick={() => goTo(index)}
                className={`flex w-full items-center gap-2 rounded-full px-2 py-1.5 text-left text-[12px] font-bold transition-colors ${
                  current ? "text-[#D96B2B]" : reachable ? "text-[#0B1F33] hover:text-[#D96B2B]" : "cursor-default text-[#98A2B3]"
                }`}
              >
                <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] ${
                  current || complete ? "bg-[#D96B2B] text-white" : reachable ? "bg-[#FFF4EC] text-[#D96B2B]" : "bg-[#F1EDE8] text-[#667085]"
                }`}>
                  {complete ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      <div key={step} className="quote-panel mt-8 min-h-[340px]">
        <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">{STEPS[step]}</p>
        <h2 className="max-w-[640px] font-serif text-[clamp(1.85rem,3.4vw,2.55rem)] leading-[1.08] tracking-[-0.03em] text-[#0B1F33]">{questions[step]}</h2>
        {step === 0 ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#667085]">Pick a format to start. If you’re unsure, choose the closest option — we’ll refine the structure with you.</p>
        ) : null}

        {step === 0 ? (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {products.map((product) => {
                const selected = data.packaging === product.name;
                return (
                  <button
                    key={product.slug}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("packaging", product.name)}
                    className={`cursor-pointer overflow-hidden rounded-[14px] border text-left transition-colors duration-200 ${
                      selected
                        ? "border-[#D96B2B] bg-[#FFF4EC]"
                        : "border-[#E7DDD2] hover:border-[#D96B2B]/45 hover:bg-[#FFF9F2]"
                    }`}
                  >
                    <span className="relative block aspect-[4/3] bg-[#F3E8DA]">
                      <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover" />
                      {selected ? (
                        <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-[#D96B2B] text-white">
                          <Check className="size-4" strokeWidth={3} />
                        </span>
                      ) : null}
                    </span>
                    <span className="block px-3 py-3">
                      <b className="block text-sm text-[#0B1F33]">{product.name}</b>
                      <span className="mt-0.5 line-clamp-1 block text-[12px] text-[#667085]">{product.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-pressed={data.packaging === "Not sure yet"}
              onClick={() => update("packaging", "Not sure yet")}
              className={`mt-3 flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left transition-colors ${
                data.packaging === "Not sure yet" ? "border-[#D96B2B] bg-[#FFF4EC]" : "border-dashed border-[#D4C4B3] bg-[#FFF9F2] hover:border-[#D96B2B]/50"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#D96B2B]"><HelpCircle className="size-5" /></span>
              <span>
                <b className="block text-sm text-[#0B1F33]">Not sure yet</b>
                <span className="text-[12px] text-[#667085]">We’ll recommend a structure from your product and quantity.</span>
              </span>
            </button>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-7 space-y-8">
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Quantity</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUANTITIES.map((item) => (
                  <Pill key={item} label={item} selected={data.quantity === item} onSelect={() => update("quantity", item)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Dimensions <span className="font-semibold text-[#667085]">· optional</span></legend>
              <p className="mt-1 text-[12px] text-[#667085]">Leave blank if you don’t know yet — we’ll size it around your product.</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="text-[12px] font-bold text-[#0B1F33]">Length<input className={fieldClass} inputMode="decimal" placeholder="12" value={data.length} onChange={(event) => update("length", event.target.value)} /></label>
                <label className="text-[12px] font-bold text-[#0B1F33]">Width<input className={fieldClass} inputMode="decimal" placeholder="9" value={data.width} onChange={(event) => update("width", event.target.value)} /></label>
                <label className="text-[12px] font-bold text-[#0B1F33]">Height<input className={fieldClass} inputMode="decimal" placeholder="4" value={data.height} onChange={(event) => update("height", event.target.value)} /></label>
                <label className="text-[12px] font-bold text-[#0B1F33]">Unit
                  <select className={selectClass} value={data.unit} onChange={(event) => update("unit", event.target.value)} aria-label="Dimension unit">
                    <option>Inches</option>
                    <option>Millimeters</option>
                  </select>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Material</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {MATERIALS.map((item) => (
                  <Pill key={item} label={item} selected={data.material === item} onSelect={() => update("material", item)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Printing</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRINTING.map((item) => (
                  <Pill key={item} label={item} selected={data.printing === item} onSelect={() => update("printing", item)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Finishes <span className="font-semibold text-[#667085]">· choose any</span></legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {FINISHES.map((item) => (
                  <Pill key={item} label={item} selected={data.finishes.includes(item)} onSelect={() => toggleFinish(item)} />
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-7 space-y-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#0B1F33]">Full name<input required className={fieldClass} placeholder="Alex Morgan" autoComplete="name" value={data.name} onChange={(event) => update("name", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-[#0B1F33]">Work email<input required type="email" className={fieldClass} placeholder="alex@company.com" autoComplete="email" value={data.email} onChange={(event) => update("email", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-[#0B1F33]">Phone <span className="font-semibold text-[#667085]">· optional</span><input type="tel" className={fieldClass} placeholder="+1 555 000 0000" autoComplete="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-[#0B1F33]">Company <span className="font-semibold text-[#667085]">· optional</span><input className={fieldClass} placeholder="Your company" autoComplete="organization" value={data.company} onChange={(event) => update("company", event.target.value)} />
              </label>
            </div>
            <fieldset>
              <legend className="text-sm font-bold text-[#0B1F33]">Artwork</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {ARTWORK.map((option) => {
                  const selected = data.artwork === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => update("artwork", option.id)}
                      className={`rounded-[14px] border px-4 py-4 text-left transition-colors ${
                        selected ? "border-[#D96B2B] bg-[#FFF4EC]" : "border-[#E7DDD2] bg-white hover:border-[#D96B2B]/45"
                      }`}
                    >
                      <span className="grid size-9 place-items-center rounded-full bg-[#F3E8DA] text-[#D96B2B]">
                        {option.id === "have" ? <UploadCloud className="size-4" /> : option.id === "help" ? <Palette className="size-4" /> : <Clock className="size-4" />}
                      </span>
                      <b className="mt-3 block text-sm text-[#0B1F33]">{option.label}</b>
                      <span className="mt-1 block text-[12px] text-[#667085]">{option.note}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            {data.artwork === "have" ? (
              <label className="relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#C5B7AA] bg-[#FFFBF7] px-4 py-8 text-center">
                <UploadCloud className="size-8 text-[#D96B2B]" />
                <b className="mt-3 text-sm text-[#0B1F33]">{data.fileName || "Drop artwork here or browse"}</b>
                <span className="mt-1 text-[12px] text-[#667085]">PDF, AI, EPS or ZIP up to 25MB</span>
                <input
                  id={`${formId}-file`}
                  type="file"
                  accept=".pdf,.ai,.eps,.zip,image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(event) => { const file = event.target.files?.[0] || null; setArtworkFile(file); update("fileName", file?.name || ""); }}
                />
              </label>
            ) : null}
            <label className="block text-sm font-bold text-[#0B1F33]">Anything else we should know? <span className="font-semibold text-[#667085]">· optional</span>
              <textarea
                rows={5}
                className="mt-2 w-full resize-y rounded-[9px] border border-[#0B1F33]/15 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-[border-color,box-shadow] placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10"
                placeholder="Product type, launch date, inserts, special requirements…"
                value={data.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              ["Packaging", data.packaging, 0],
              ["Quantity", data.quantity, 1],
              ["Dimensions", dimensionsLabel(data), 1],
              ["Material", data.material || "We’ll advise", 1],
              ["Printing", data.printing || "We’ll advise", 1],
              ["Finishes", data.finishes.length ? data.finishes.join(", ") : "None selected", 1],
              ["Artwork", ARTWORK.find((item) => item.id === data.artwork)?.label || "Not specified", 2],
              ["Contact", [data.name, data.email, data.company].filter(Boolean).join(" · "), 2],
            ].map(([label, value, target]) => (
              <div key={String(label)} className="flex items-start justify-between gap-3 rounded-[12px] bg-[#FFF9F2] px-4 py-3.5">
                <p>
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">{label}</span>
                  <b className="mt-1 block text-sm font-bold text-[#0B1F33]">{value || "—"}</b>
                </p>
                <button type="button" onClick={() => goTo(Number(target))} className="shrink-0 text-[12px] font-bold text-[#D96B2B] hover:text-[#BC5420]">Edit</button>
              </div>
            ))}
            {data.notes ? (
              <div className="sm:col-span-2 rounded-[12px] bg-[#FFF9F2] px-4 py-3.5">
                <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">Notes</span>
                <p className="mt-1 text-sm text-[#0B1F33]">{data.notes}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-5 text-sm font-bold text-[#B43E2E]" role="alert">{error}</p> : null}

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E7DDD2] pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => { setError(""); setStep((current) => Math.max(current - 1, 0)); }}
          className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[9px] border border-[#0B1F33]/20 bg-white px-5 text-sm font-extrabold text-[#0B1F33] transition-colors hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => (step === 3 ? void submit() : next())}
          className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[9px] border border-[#D96B2B] bg-[#D96B2B] px-6 text-sm font-extrabold text-white transition-colors hover:border-[#BC5420] hover:bg-[#BC5420]"
        >
          {submitting ? "Submitting…" : step === 3 ? "Submit quote" : "Continue"} <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function QuoteSidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-[108px]">
      <div className="overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-white">
        <div className="relative h-36 bg-[#F3E8DA]">
          <Image src="/images/home/why-fable-packaging.webp" alt="Custom packaging styled in the Fable studio" fill sizes="340px" className="object-cover" />
        </div>
        <div className="p-5">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#D96B2B]">What happens next</p>
          <ol className="mt-4 space-y-3.5">
            {[
              ["Share what you know", "Skip anything you’re unsure about."],
              ["We review within a day", "A specialist checks structure and materials."],
              ["You get a clear quote", "Pricing, timing and recommended next steps."],
            ].map(([title, copy], index) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#FFF4EC] text-[11px] font-extrabold text-[#D96B2B]">{index + 1}</span>
                <span>
                  <b className="block text-sm text-[#0B1F33]">{title}</b>
                  <span className="text-[13px] leading-5 text-[#667085]">{copy}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="rounded-[18px] border border-[#E7DDD2] bg-[#FFF9F2] p-5">
        <p className="text-sm font-extrabold text-[#0B1F33]">Rather talk it through?</p>
        <p className="mt-1 text-[13px] leading-5 text-[#667085]">A packaging specialist can help you choose a structure before you submit.</p>
        <a href="mailto:hello@fablepack.co" className="mt-4 flex items-center gap-3 text-sm font-bold text-[#0B1F33] hover:text-[#D96B2B]">
          <span className="grid size-9 place-items-center rounded-full bg-white text-[#D96B2B]"><Mail className="size-4" /></span>
          hello@fablepack.co
        </a>
        <a href="tel:+18551234567" className="mt-2 flex items-center gap-3 text-sm font-bold text-[#0B1F33] hover:text-[#D96B2B]">
          <span className="grid size-9 place-items-center rounded-full bg-white text-[#D96B2B]"><Phone className="size-4" /></span>
          +1 (855) 123-4567
        </a>
      </div>
    </aside>
  );
}
