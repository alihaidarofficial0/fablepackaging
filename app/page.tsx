import type { Metadata } from "next";
import Link from "next/link";
import { Headphones } from "lucide-react";
import { homeProducts } from "@/data/products";
import { homeIndustries } from "@/data/industries";
import { homeProjects } from "@/data/projects";
import { homeFaq } from "@/data/faq";
import { ProductSlider } from "@/components/ProductSlider";
import { IndustryCard } from "@/components/IndustryCard";
import { ProjectCard } from "@/components/ProjectCard";
import { QuoteStarter } from "@/components/QuoteStarter";
import { FAQ } from "@/components/FAQ";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FinalCTA, Hero, MaterialsSection, ProcessSection, SustainabilitySection, Testimonial, TrustSection, WhyFable } from "@/components/HomeSections";

export const metadata: Metadata = {
  title: "Custom Packaging & Custom Boxes | Fable Packaging",
  description: "Create premium custom boxes with Fable Packaging. Explore mailer boxes, rigid boxes, folding cartons, shipping boxes, display packaging and flexible packaging with expert design support.",
  alternates: { canonical: "https://www.fablepack.co/" },
  openGraph: {
    title: "Fable Packaging — Custom Packaging Made Memorable",
    description: "Thoughtful custom packaging for growing brands, from structural design and materials to printing, finishes and delivery.",
    url: "https://www.fablepack.co/",
    siteName: "Fable Packaging",
    type: "website",
    images: [{ url: "/images/home/fable-hero-packaging.webp", width: 1680, height: 945, alt: "Premium custom packaging by Fable Packaging" }],
  },
};

export default function HomePage() {
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Organization", name: "Fable Packaging", url: "https://www.fablepack.co/", email: "hello@fablepack.co", telephone: "+1-855-123-4567", logo: "https://www.fablepack.co/images/home/fable-hero-packaging.webp" },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Fable Packaging", url: "https://www.fablepack.co/" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/>
    <Hero/>
    <TrustSection/>
    <section id="products" className="bg-[#FFF9F2] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-[720px]">
            <p className="mb-4 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[#D96B2B]"><span className="h-px w-9 bg-[#D96B2B]" aria-hidden="true" />Our packaging</p>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[#0B1F33]">Find the right box for your product</h2>
            <p className="mt-5 max-w-[700px] text-base leading-[1.6] text-[#667085] sm:text-[17px]">Explore our most-loved packaging formats, built to protect, present and elevate your products.</p>
          </div>
          <Link href="/custom-boxes" className="inline-flex min-h-11 shrink-0 cursor-pointer items-center border-b border-[#D96B2B]/45 text-sm font-semibold text-[#D96B2B] transition-colors duration-[250ms] hover:text-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">View all packaging <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
        <ProductSlider products={homeProducts} />
        <div className="mt-10 flex items-center gap-5" aria-label="Packaging selection help">
          <span className="hidden h-px flex-1 bg-[#E7DDD2] sm:block" aria-hidden="true" />
          <div className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E7DDD2] bg-[#FFF9F2] px-5 py-3.5 text-center sm:w-auto sm:px-7">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F3E8DA] text-[#D96B2B]" aria-hidden="true"><Headphones className="size-5" /></span>
            <p className="text-left text-xs leading-5 text-[#667085] sm:text-sm"><span className="block font-semibold text-[#0B1F33]">Not sure which format fits your product?</span><Link href="/contact" className="inline-flex min-h-6 items-center font-bold text-[#D96B2B] transition-colors duration-[250ms] hover:text-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-2">Talk to a packaging expert <span className="ml-1.5" aria-hidden="true">→</span></Link></p>
          </div>
          <span className="hidden h-px flex-1 bg-[#E7DDD2] sm:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
    <WhyFable/>
    <MaterialsSection/>
    <section id="industries" className="bg-[#FFF9F2] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-[760px]">
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.15em] text-[#D96B2B]">Solutions by sector</p>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[#0B1F33]">Packaging made for your industry.</h2>
            <p className="mt-5 max-w-[700px] text-base leading-[1.6] text-[#667085] sm:text-[17px]">From beauty launches to ecommerce deliveries, discover packaging solutions shaped around the way your products are sold, shipped and experienced.</p>
          </div>
          <Link href="/industries" className="inline-flex min-h-11 shrink-0 items-center border-b border-[#D96B2B]/45 text-sm font-semibold text-[#D96B2B] transition-colors duration-[250ms] hover:text-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">View all industries <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 md:grid-cols-3 min-[1200px]:grid-cols-6">
          {homeIndustries.map((industry) => <IndustryCard key={industry.slug} industry={industry} />)}
        </div>
      </Container>
    </section>
    <SustainabilitySection/>
    <ProcessSection/>
    <section id="projects" className="bg-[#FFF9F2] py-14 sm:py-16 lg:py-20"><Container><SectionHeading eyebrow="Featured projects" title="Fresh from the studio" copy="Real structures. Original artwork. Packaging made to be remembered." action={{ label: "View all projects", href: "/projects" }}/><div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">{homeProjects.map(project => <ProjectCard key={project.name} project={project}/>)}</div></Container></section>
    <Testimonial/>
    <QuoteStarter/>
    <FAQ/>
    <FinalCTA/>
  </>;
}
