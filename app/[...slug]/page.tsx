import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { homeProducts } from "@/data/products";
import { homeIndustries } from "@/data/industries";
import { homeFaq } from "@/data/faq";
import { Accordion } from "@/components/Accordion";
import { IndustryCard } from "@/components/IndustryCard";
import { IndustryDetailPage } from "@/components/IndustryDetailPage";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailPage } from "@/components/ProductDetailPage";
import { ProjectCard } from "@/components/ProjectCard";
import { homeProjects } from "@/data/projects";


const pageCopy: Record<string,{title:string; eyebrow:string; intro:string}> = {
  "custom-boxes": {title:"Custom boxes, made around you.",eyebrow:"Packaging library",intro:"Explore proven box structures, then tailor every dimension, material and detail to your product."},
  industries:{title:"Built for the way you sell.",eyebrow:"Industry expertise",intro:"Practical structures and beautiful print for brands in every aisle and every inbox."},
  materials:{title:"Materials with substance.",eyebrow:"Material library",intro:"Compare strength, printability, texture and sustainability to find the right foundation."},
  finishes:{title:"The details people remember.",eyebrow:"Finishes & effects",intro:"Add tactile and visual depth with a carefully chosen premium finish."},
  "design-support":{title:"Design support, on the house.",eyebrow:"From sketch to press",intro:"Dielines, artwork checks, 3D mockups and practical advice from specialists who know boxes."},
  sustainability:{title:"Packaging with more purpose.",eyebrow:"Better by design",intro:"Smarter materials and less waste, without giving up the moments that make your brand special."},
  about:{title:"Making custom feel uncomplicated.",eyebrow:"Our story",intro:"We pair production expertise with thoughtful service to help growing brands package with confidence."},
  faq:{title:"Good questions. Clear answers.",eyebrow:"Help center",intro:"Everything you need to move your packaging project forward."},
  blog:{title:"Ideas worth unpacking.",eyebrow:"Fable journal",intro:"Practical packaging guidance, material notes and inspiration for growing brands."},
  "packaging-guide":{title:"The packaging guide.",eyebrow:"Start smarter",intro:"A friendly, practical guide to structure, sizing, materials, print and production."},
  "our-process":{title:"From idea to delivery.",eyebrow:"Our process",intro:"A clear, collaborative path from structural concept to finished packaging."},
  reviews:{title:"Brands say the nicest things.",eyebrow:"Customer stories",intro:"See why growing teams trust Fable with their most important product moments."},
  projects:{title:"Fresh from the studio.",eyebrow:"Selected work",intro:"A collection of packaging projects built to perform and designed to be remembered."},
  "artwork-guidelines":{title:"Artwork guidelines.",eyebrow:"Ready for press",intro:"Prepare clean, accurate artwork and move from proof to production with confidence."},
  "shipping-and-delivery":{title:"Shipping and delivery.",eyebrow:"Around the world",intro:"Flexible freight options, transparent timelines and clear project tracking."},
  faqs:{title:"Good questions. Clear answers.",eyebrow:"Help center",intro:"Everything you need to move your packaging project forward."},
  "track-your-order":{title:"Track your order.",eyebrow:"Project status",intro:"Get in touch with your order reference and our team will share the latest update."},
  "help-center":{title:"How can we help?",eyebrow:"Fable support",intro:"Guides and answers for artwork, materials, production, shipping and more."},
  search:{title:"Find what you need.",eyebrow:"Search Fable",intro:"Search our products, industries and practical packaging guides."},
  cart:{title:"Your bag is empty.",eyebrow:"No checkout needed",intro:"Fable quotes custom packaging rather than selling off-the-shelf boxes. Start a project and a specialist will take it from there."},
  sitemap:{title:"Sitemap",eyebrow:"Explore Fable",intro:"A quick path to packaging, resources and company information."},
  "privacy-policy":{title:"Privacy policy",eyebrow:"The important details",intro:"How we collect, use and protect your information."},
  terms:{title:"Terms of service",eyebrow:"The important details",intro:"The terms that govern use of our website and services."},
  "shipping-policy":{title:"Shipping policy",eyebrow:"The important details",intro:"How we plan, track and deliver packaging around the world."},
  "refund-policy":{title:"Refund policy",eyebrow:"The important details",intro:"Our approach to changes, cancellations and production issues."}
};
const materials = [
  { name: "Natural kraft", image: "/images/products/shipping-box.webp" },
  { name: "White paperboard", image: "/images/products/mailer-box.webp" },
  { name: "Corrugated board", image: "/images/products/shipping-box.webp" },
  { name: "Rigid greyboard", image: "/images/products/rigid-box.webp" },
  { name: "Recycled paper", image: "/images/products/folding-carton.webp" },
  { name: "Specialty paper", image: "/images/home/faq-packaging.webp" },
];
const finishes = [
  { name: "Matte lamination", image: "/images/products/mailer-box.webp" },
  { name: "Soft touch", image: "/images/products/rigid-box.webp" },
  { name: "Gloss lamination", image: "/images/products/display-box.webp" },
  { name: "Spot UV", image: "/images/products/folding-carton.webp" },
  { name: "Foil stamping", image: "/images/projects/velora-tea.webp" },
  { name: "Embossing", image: "/images/projects/aurora-skincare.webp" },
  { name: "Debossing", image: "/images/products/rigid-box.webp" },
  { name: "Window cutouts", image: "/images/products/display-box.webp" },
];

export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{
  const {slug}=await params;
  const base=pageCopy[slug[0]];
  const product=homeProducts.find(p=>p.slug===slug[1] || p.slug===slug[0]);
  const industry=homeIndustries.find(i=>i.slug===slug[1]);
  return {title:product?.name||industry?.name||base?.title||"Fable Packaging"};
}

export default async function GenericPage({params}:{params:Promise<{slug:string[]}>}){
  const {slug}=await params;
  const root=slug[0];
  const detail=slug[1];
  const product=homeProducts.find(p=>p.slug===detail) || (!detail ? homeProducts.find(p=>p.slug===root) : undefined);
  const industry=homeIndustries.find(i=>i.slug===detail);
  if(product) return <ProductDetailPage product={product}/>;
  if(industry) return <IndustryDetailPage industry={industry}/>;
  const copy=pageCopy[root];
  if(!copy) notFound();
  return <><section className="subhero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><b>{copy.title}</b></div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p></div></section><GenericBody root={root}/></>;
}

function GenericBody({root}:{root:string}){
  if(root==="custom-boxes")return <section className="section"><div className="container"><div className="listing-toolbar"><p>Showing {homeProducts.length} popular formats</p><select aria-label="Sort products" defaultValue="popular" suppressHydrationWarning><option value="popular">Most popular</option><option value="name">Name A–Z</option></select></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{homeProducts.map(product=><ProductCard key={product.slug} product={product}/>)}</div></div></section>;
  if(root==="industries")return <section className="section"><div className="container"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{homeIndustries.map((industry)=><IndustryCard key={industry.slug} industry={industry}/>)}</div></div></section>;
  if(root==="projects")return <section className="section"><div className="container"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{homeProjects.map((project)=><ProjectCard key={project.name} project={project}/>)}</div></div></section>;
  if(root==="materials"||root==="finishes") {const items=root==="materials"?materials:finishes;return <section className="section"><div className="container material-grid">{items.map((item)=><article key={item.name} className="overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-white"><div className="relative h-[210px] bg-[#F3E8DA]"><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover"/></div><div className="p-5"><h2 className="font-serif text-[1.6rem] text-[#0B1F33]">{item.name}</h2><p className="mt-2 text-sm text-[#667085]">{root==="materials"?"A reliable, print-friendly option selected for strength, feel and end-of-life practicality.":"A refined surface effect that adds depth and gives key design details a memorable finish."}</p><Link className="text-link mt-4" href="/get-a-quote">Use in your project →</Link></div></article>)}</div></section>}
  if(["privacy-policy","terms","shipping-policy","refund-policy"].includes(root))return <section className="section"><article className="container legal"><h2>Overview</h2><p>We believe important policies should be understandable. This page explains our practices in plain language and applies to visitors, customers and project inquiries.</p><h2>Your information and choices</h2><p>We only request information needed to respond to your inquiry, prepare quotations and deliver agreed services. We use reasonable safeguards and never sell personal information.</p><h2>Orders and production</h2><p>Custom goods enter production after proof approval. Timing and shipping estimates are shared with each quotation and may vary by specification, destination and carrier.</p><h2>Contact</h2><p>Questions can be sent to hello@fablepack.co. We aim to reply within one business day.</p></article></section>;
  return <><section className="section"><div className="container content-feature"><div><p className="eyebrow">Guidance at every step</p><h2>Make decisions with confidence.</h2><p>Great packaging comes from the right structure, honest material advice, press-ready artwork and a production plan that respects your launch.</p><ul>{["Free structural consultation","Production-ready dielines","Artwork and prepress review","Transparent timelines","Worldwide logistics"].map(x=><li key={x}><Check/>{x}</li>)}</ul></div><div className="relative min-h-[360px] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA]"><Image src="/images/home/why-fable-packaging.webp" alt="Custom packaging designed with care" fill sizes="(max-width: 900px) 100vw, 40vw" className="object-cover"/></div></div></section><Faq/><Cta/></>;
}

function Faq(){return <section className="section faq"><div className="container max-w-[860px]"><p className="eyebrow">Useful to know</p><h2 className="mb-6">Frequently asked questions</h2><Accordion items={homeFaq}/></div></section>}
function Cta(){return <section className="container bottom-cta"><div><p className="eyebrow">Start your project</p><h2>Ready to make something memorable?</h2><p>Get expert guidance and a clear quote—usually within one business day.</p></div><Link className="button button-light" href="/get-a-quote">Get a free quote <ArrowRight/></Link></section>}
