import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
export const metadata: Metadata = { title: "Get a Custom Packaging Quote" };
export default function QuotePage(){return <><section className="subhero quote-hero"><div className="container"><p className="eyebrow">Built around your product</p><h1>Tell us about your packaging.</h1><p>Share what you know—our experts can help with the rest. Quotes are free and usually arrive within one business day.</p></div></section><section className="section"><div className="container narrow"><QuoteForm/></div></section></>}
