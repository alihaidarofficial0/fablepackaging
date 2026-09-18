import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: { label: string; href: string } }) {
  return <div className="section-title"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <Link className="text-link" href={action.href}>{action.label} <span>→</span></Link>}</div>
}

export function ProductVisual({ tone, icon: Icon, label }: { tone: string; icon: LucideIcon; label: string }) {
  return <div className={`product-visual ${tone}`}><div className="mini-box box-back"/><div className="mini-box box-main"><Icon size={30}/><small>FABLE</small></div><span className="plant">⌁</span><span className="shadow"/><span className="sr-only">{label}</span></div>
}

export function CardLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link className="card-arrow" href={href} aria-label="View details"><ArrowUpRight size={17}/>{children}</Link> }
