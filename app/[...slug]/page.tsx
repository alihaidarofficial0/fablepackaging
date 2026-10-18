import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { IndustryCard } from "@/components/IndustryCard";
import { IndustryDetailPage } from "@/components/IndustryDetailPage";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailPage } from "@/components/ProductDetailPage";
import { ProjectCard } from "@/components/ProjectCard";
import { getCatalogItems, getFaqs, getIndustries, getPageContent, getProducts, getProjects } from "@/lib/content";
import type { CmsCatalogItem, CmsFaq, CmsIndustry, CmsProduct, CmsProject } from "@/types/cms";


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
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{
  const {slug}=await params;
  const [products, industries, catalog, content] = await Promise.all([getProducts(), getIndustries(), getCatalogItems(), getPageContent(slug[0])]);
  const base=pageCopy[slug[0]];
  const product=products.find(p=>p.slug===slug[1] || p.slug===slug[0]);
  const industry=industries.find(i=>i.slug===slug[1]);
  const catalogItem=catalog.find(i=>i.slug===slug[1]);
  if (!base && !product && !industry && !catalogItem) notFound();
  return {title:product?.name||industry?.name||catalogItem?.name||content.page_title||base?.title||"Fable Packaging", description: catalogItem?.description || content.page_intro || undefined};
}

export default async function GenericPage({params}:{params:Promise<{slug:string[]}>}){
  const {slug}=await params;
  const root=slug[0];
  const [products, industries, projects, catalog, faqs, content] = await Promise.all([getProducts(), getIndustries(), getProjects(), getCatalogItems(), getFaqs("home"), getPageContent(root)]);
  const detail=slug[1];
  const product=products.find(p=>p.slug===detail) || (!detail ? products.find(p=>p.slug===root) : undefined);
  const industry=industries.find(i=>i.slug===detail);
  const catalogItem=catalog.find(i=>i.slug===detail && ((root==="materials" && i.kind==="material") || (root==="finishes" && i.kind==="finish")));
  if(product) return <ProductDetailPage product={product} products={products} faqs={faqs}/>;
  if(industry) return <IndustryDetailPage industry={industry} products={products} faqs={faqs}/>;
  if(catalogItem) return <CatalogDetail item={catalogItem}/>;
  const fallback=pageCopy[root];
  if(!fallback) notFound();
  const copy={ title: content.page_title || fallback.title, eyebrow: content.page_eyebrow || fallback.eyebrow, intro: content.page_intro || fallback.intro };
  return <><section className="subhero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><b>{copy.title}</b></div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p></div></section><GenericBody root={root} products={products} industries={industries} projects={projects} catalog={catalog} faqs={faqs}/></>;
}

function GenericBody({root,products,industries,projects,catalog,faqs}:{root:string;products:CmsProduct[];industries:CmsIndustry[];projects:CmsProject[];catalog:CmsCatalogItem[];faqs:CmsFaq[]}){
  if(root==="custom-boxes")return <section className="section"><div className="container"><div className="listing-toolbar"><p>Showing {products.length} popular formats</p><select aria-label="Sort products" defaultValue="popular" suppressHydrationWarning><option value="popular">Most popular</option><option value="name">Name A–Z</option></select></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(product=><ProductCard key={product.slug} product={product}/>)}</div></div></section>;
  if(root==="industries")return <section className="section"><div className="container"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{industries.map((industry)=><IndustryCard key={industry.slug} industry={industry}/>)}</div></div></section>;
  if(root==="projects")return <section className="section"><div className="container"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project)=><ProjectCard key={project.name} project={project}/>)}</div></div></section>;
  if(root==="materials"||root==="finishes") {const kind=root==="materials"?"material":"finish";const items=catalog.filter(item=>item.kind===kind);return <section className="section"><div className="container material-grid">{items.map((item)=><article key={item.slug} className="overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-white"><div className="relative h-[210px] bg-[#F3E8DA]"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover"/></div><div className="p-5"><h2 className="font-serif text-[1.6rem] text-[#0B1F33]">{item.name}</h2><p className="mt-2 text-sm text-[#667085]">{item.description}</p><Link className="text-link mt-4" href={`/${root}/${item.slug}`}>View details →</Link></div></article>)}</div></section>}
  if(["privacy-policy","terms","shipping-policy","refund-policy"].includes(root))return <section className="section"><article className="container legal"><h2>Overview</h2><p>We believe important policies should be understandable. This page explains our practices in plain language and applies to visitors, customers and project inquiries.</p><h2>Your information and choices</h2><p>We only request information needed to respond to your inquiry, prepare quotations and deliver agreed services. We use reasonable safeguards and never sell personal information.</p><h2>Orders and production</h2><p>Custom goods enter production after proof approval. Timing and shipping estimates are shared with each quotation and may vary by specification, destination and carrier.</p><h2>Contact</h2><p>Questions can be sent to hello@fablepack.co. We aim to reply within one business day.</p></article></section>;
  return <><section className="section"><div className="container content-feature"><div><p className="eyebrow">Guidance at every step</p><h2>Make decisions with confidence.</h2><p>Great packaging comes from the right structure, honest material advice, press-ready artwork and a production plan that respects your launch.</p><ul>{["Free structural consultation","Production-ready dielines","Artwork and prepress review","Transparent timelines","Worldwide logistics"].map(x=><li key={x}><Check/>{x}</li>)}</ul></div><div className="relative min-h-[360px] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA]"><Image src="/images/home/why-fable-packaging.webp" alt="Custom packaging designed with care" fill sizes="(max-width: 900px) 100vw, 40vw" className="object-cover"/></div></div></section><Faq items={faqs}/><Cta/></>;
}

function Faq({items}:{items:CmsFaq[]}){return <section className="section faq"><div className="container max-w-[860px]"><p className="eyebrow">Useful to know</p><h2 className="mb-6">Frequently asked questions</h2><Accordion items={items}/></div></section>}
function Cta(){return <section className="container bottom-cta"><div><p className="eyebrow">Start your project</p><h2>Ready to make something memorable?</h2><p>Get expert guidance and a clear quote—usually within one business day.</p></div><Link className="button button-light" href="/get-a-quote">Get a free quote <ArrowRight/></Link></section>}

function CatalogDetail({item}:{item:CmsCatalogItem}){const parent=item.kind==="material"?"materials":"finishes";return <><section className="bg-[#FFF9F2] py-12 sm:py-16"><div className="container grid items-center gap-10 lg:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA]"><Image src={item.image} alt={item.alt} fill priority sizes="(max-width:1023px) 100vw,50vw" className="object-cover"/></div><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/${parent}`}>{parent}</Link><span>/</span><b>{item.name}</b></div><p className="eyebrow mt-5">{item.kind}</p><h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-[#0B1F33]">{item.name}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#667085]">{item.description}</p><Link className="button button-primary mt-8" href="/get-a-quote">Use in your project</Link></div></div></section><Cta/></>}
