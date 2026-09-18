import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Check,
  ClipboardList,
  Earth,
  Leaf,
  PackageCheck,
  Palette,
  PencilRuler,
  Quote,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  WandSparkles,
} from "lucide-react";
import { Container } from "./shared/Container";
import { Button } from "./shared/Button";
import { SectionHeading } from "./shared/SectionHeading";

export function Hero() {
  const benefits = [[Sparkles, "Free design support"], [Box, "Low minimums"], [Truck, "Fast turnaround"]] as const;

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#FFF9F2] lg:min-h-[680px]">
      <Image src="/images/home/fable-hero-packaging.webp" alt="Open navy mailer box with kraft, burnt-orange and sage cartons arranged with botanical leaves and limestone props" fill priority sizes="100vw" className="object-cover object-[72%_center] lg:object-center" />
      <div className="absolute inset-0 -z-0 bg-[linear-gradient(90deg,rgba(255,249,242,0.99)_0%,rgba(255,249,242,0.96)_27%,rgba(255,249,242,0.68)_48%,rgba(255,249,242,0.08)_76%)] lg:bg-[linear-gradient(90deg,rgba(255,249,242,0.99)_0%,rgba(255,249,242,0.94)_28%,rgba(255,249,242,0.45)_49%,rgba(255,249,242,0)_76%)]" />
      <Container className="relative z-10 grid min-h-[720px] items-center py-16 lg:min-h-[680px] lg:grid-cols-[46fr_54fr] lg:py-[72px]">
        <div className="max-w-[580px]">
          <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Custom packaging, made memorable</p>
          <h1 className="max-w-[540px] font-serif text-[clamp(2.65rem,5vw,4.6rem)] leading-[0.99] tracking-[-0.045em] text-[#0B1F33]">Packaging that<br className="hidden sm:block" /> elevates <span className="text-[#D96B2B]">your brand.</span></h1>
          <p className="mt-6 max-w-[520px] text-base leading-[1.65] text-[#526071] lg:text-lg">Custom boxes, endless possibilities. Thoughtful packaging solutions designed to protect your products, reflect your brand, and make every unboxing count.</p>
          <div className="mt-8 grid max-w-[430px] gap-3 sm:flex [&>a]:w-full sm:[&>a]:w-auto"><Button href="/get-a-quote">Get a custom quote</Button><Button href="#products" variant="secondary">Explore products</Button></div>
          <div className="mt-7 flex max-w-[520px] flex-wrap gap-x-5 gap-y-3 border-t border-[#0B1F33]/10 pt-5">{benefits.map(([Icon, label]) => <span key={label} className="flex min-h-8 items-center gap-2 text-[12px] font-bold text-[#0B1F33]"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F3E8DA] text-[#D96B2B]"><Icon className="size-4" aria-hidden="true" /></span>{label}</span>)}</div>
        </div>
      </Container>
    </section>
  );
}

export function TrustSection() {
  const points = [
    ["Free", "design support"],
    ["Low", "minimum orders"],
    ["1-day", "typical quotes"],
    ["FSC®", "material options"],
    ["Worldwide", "delivery"],
  ] as const;

  return (
    <section aria-label="Why brands choose Fable" className="border-y border-[#0B1F33]/10 bg-white py-7">
      <Container>
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#667085]">Built for custom packaging, start to finish</p>
        <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {points.map(([stat, label]) => (
            <li key={label} className="text-center">
              <strong className="block font-serif text-[1.35rem] font-medium tracking-[-0.03em] text-[#0B1F33]">{stat}</strong>
              <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#667085]">{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function WhyFable() {
  const checklist = ["100% customizable", "Premium materials & finishes", "Free design support", "Sustainable options", "Global shipping"];
  const features = [
    [Ruler, "Custom sizes & styles", "Built around your product."],
    [WandSparkles, "Premium finishes", "Foil, embossing, soft touch & more."],
    [Leaf, "Planet-minded materials", "Better options, thoughtfully selected."],
    [PackageCheck, "Low minimum orders", "Flexible runs for growing brands."],
    [ShieldCheck, "Expert support", "Guidance from concept to production."],
  ] as const;

  return (
    <section id="why-fable" className="bg-[linear-gradient(135deg,#FFF9F2_0%,#FFF9F2_55%,#F8EDE1_100%)] py-14 sm:py-16 lg:py-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center lg:grid-cols-[32fr_43fr_25fr] lg:gap-8 xl:gap-10">
        <div>
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Why Fable</p>
          <h2 className="max-w-[430px] font-serif text-[clamp(2.5rem,4vw,3.7rem)] leading-[1.01] tracking-[-0.04em] text-[#0B1F33]">Great packaging should feel simple.</h2>
          <p className="mt-5 max-w-[460px] text-base leading-[1.7] text-[#667085]">From first sketch to final delivery, our packaging experts bring structure, clarity and craft to every project — so you can focus on growing your brand.</p>
          <ul className="my-7 space-y-3" aria-label="Why choose Fable Packaging">
            {checklist.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-bold text-[#111827]"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#D96B2B] text-white" aria-hidden="true"><Check className="size-3" strokeWidth={3} /></span>{item}</li>)}
          </ul>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button href="/get-a-quote">Start your project</Button>
            <Link href="#how-it-works" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#0B1F33] underline decoration-[#D96B2B]/40 underline-offset-4 transition-colors hover:text-[#D96B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">See how our process works <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[#F3E8DA] shadow-[0_22px_55px_rgba(60,41,25,0.10)]">
          <Image src="/images/home/why-fable-packaging.webp" alt="Open navy mailer box and kraft carton styled with botanical leaves and limestone props" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 43vw" className="object-cover" />
          <p className="absolute left-[58%] top-[29%] w-[35%] -translate-x-1/2 text-center font-serif text-[clamp(0.72rem,1.35vw,1.2rem)] leading-[1.08] text-[#E9C37C]">Thoughtful outside.<br />Unforgettable inside.</p>
          <p className="absolute bottom-[25%] left-[14%] w-[24%] text-center text-[clamp(0.48rem,0.8vw,0.68rem)] font-extrabold uppercase leading-[1.25] tracking-[0.08em] text-[#0B1F33]/80">Packaging<br />with purpose.</p>
        </div>
        <ul className="grid gap-2 md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1" aria-label="Fable packaging services">
          {features.map(([Icon, title, subtitle]) => (
            <li key={title} className="flex min-h-[88px] items-center gap-3 rounded-[14px] border border-[#E7DDD2] bg-white/75 p-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#D96B2B]/20 bg-[#F3E8DA] text-[#0B1F33]" aria-hidden="true"><Icon className="size-5" /></span>
              <span><strong className="block text-[13px] leading-4 text-[#0B1F33]">{title}</strong><span className="mt-1 block text-[12px] leading-4 text-[#667085]">{subtitle}</span></span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function MaterialsSection() {
  const materials = [
    ["Kraft Paper", "Natural, tactile and direct", "/images/products/shipping-box.webp"],
    ["Premium Paperboard", "Smooth, crisp and versatile", "/images/products/mailer-box.webp"],
    ["Corrugated Board", "Protective strength for transit", "/images/products/shipping-box.webp"],
    ["Rigid Board", "Weight and presence for gifting", "/images/products/rigid-box.webp"],
  ];
  const finishes = ["Matte", "Soft Touch", "Gloss", "Gold Foil", "Silver Foil", "Spot UV", "Embossing", "Debossing"];
  return (
    <section id="materials" className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading eyebrow="Make it distinctly yours" title="Materials and finishes that make an impression." copy="From natural kraft textures to soft-touch finishes and metallic foils, choose the details that make your packaging unmistakably yours." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map(([name, copy, image]) => (
            <Link key={name} href="/materials" className="overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-[#FFF9F2] outline-none transition-colors hover:border-[#D96B2B]/65 focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">
              <div className="relative h-36 bg-[#F3E8DA]">
                <Image src={image} alt={name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5"><h3 className="font-serif text-[22px] text-[#0B1F33]">{name}</h3><p className="mt-2 text-sm leading-5 text-[#667085]">{copy}</p></div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">{finishes.map((finish) => <Link key={finish} href="/finishes" className="rounded-full border border-[#E7DDD2] bg-[#FFF9F2] px-4 py-2.5 text-sm font-bold text-[#0B1F33] outline-none transition-colors hover:border-[#D96B2B]/65 hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{finish}</Link>)}</div>
        <Link href="/materials" className="mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-[#D96B2B] transition-colors hover:text-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4">Explore materials & finishes <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </Container>
    </section>
  );
}

export function SustainabilitySection() {
  const benefits = [[Recycle, "Recyclable materials"], [Palette, "Soy-based inks"], [ShieldCheck, "FSC® options"], [Leaf, "Plastic-free choices"], [Earth, "Lower-impact shipping"]] as const;
  return (
    <section id="sustainability" className="overflow-hidden bg-[radial-gradient(circle_at_64%_45%,#17443d,#071827_70%)] py-14 text-white sm:py-16 lg:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_.9fr_.68fr] lg:gap-12">
        <div>
          <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#E6AD65]">Packaging with a lighter footprint</p>
          <h2 className="font-serif text-[clamp(2.5rem,4vw,3.65rem)] leading-[1.02] tracking-[-0.035em] text-white">A better box for a brighter tomorrow.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">Make confident material choices without compromising the experience. Our team helps you reduce waste at every step.</p>
          <div className="mt-7"><Button href="/sustainability" variant="light">Explore sustainable options</Button></div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-white/10 bg-[#122F32]">
          <Image src="/images/home/sustainable-kraft-box.webp" alt="Natural kraft box with green leaf linework on a dark studio background" fill sizes="(max-width: 1023px) 100vw, 36vw" className="object-cover" />
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-1">
          {benefits.map(([Icon, text]) => <li key={text} className="flex min-h-14 items-center gap-3 border-b border-white/12 text-sm font-bold"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5" aria-hidden="true"><Icon className="size-4 text-[#E9BD73]" /></span>{text}</li>)}
        </ul>
      </Container>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    [Box, "Choose your style", "Start with a structure built for your product."],
    [PencilRuler, "Make it yours", "Pick dimensions, materials, print and finishes."],
    [ClipboardList, "Get your quote", "Receive clear pricing and a digital proof."],
    [Truck, "We deliver", "Approve production and Fable handles the rest."],
  ] as const;
  return (
    <section id="how-it-works" className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-12 text-center"><p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">A clear path forward</p><h2 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-[#0B1F33]">How it works</h2><p className="mt-4 text-base text-[#667085]">Four simple steps from idea to delivery.</p></div>
        <div className="relative grid gap-5 md:grid-cols-4 md:gap-7 before:absolute before:left-[10%] before:right-[10%] before:top-10 before:hidden before:border-t before:border-dashed before:border-[#D96B2B]/35 md:before:block">
          {steps.map(([Icon, title, copy], index) => (
            <article key={title} className="relative grid grid-cols-[72px_1fr] items-center gap-4 rounded-[14px] border border-[#E7DDD2] bg-[#FFF9F2] p-4 md:block md:min-h-[250px] md:border-transparent md:bg-transparent md:p-0 md:text-center">
              <span className="relative z-10 grid size-18 place-items-center rounded-full border border-[#D96B2B]/25 bg-[#FFF0E2] md:mx-auto md:size-20" aria-hidden="true"><Icon className="size-6 text-[#0B1F33]" /></span>
              <div><span className="text-[12px] font-extrabold tracking-[0.12em] text-[#D96B2B]">0{index + 1}</span><h3 className="mt-1 text-base font-extrabold text-[#0B1F33] md:mt-5 md:text-lg">{title}</h3><p className="mt-2 max-w-[230px] text-sm leading-6 text-[#667085] md:mx-auto">{copy}</p></div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Testimonial() {
  return (
    <section aria-labelledby="customer-proof-heading" className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <article className="grid min-h-[340px] overflow-hidden rounded-[18px] border border-[#E7DDD2] bg-[linear-gradient(135deg,#FFF9F2,#F3E8DA)] lg:grid-cols-[1.25fr_.75fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#D96B2B]">Customer proof</p>
            <h2 id="customer-proof-heading" className="font-serif text-[clamp(2.2rem,4vw,3.35rem)] leading-[1.08] tracking-[-0.035em] text-[#0B1F33]">Packaging partnership, without the complexity.</h2>
            <div className="mt-6 tracking-[0.12em] text-[#C99A4A]" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote className="mt-4 max-w-3xl font-serif text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.5] text-[#26384B]">“Fable made a complex launch feel effortless. The samples were beautiful, communication was clear, and the finished boxes exceeded every expectation.”</blockquote>
            <div className="mt-7 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-[#0B1F33] text-sm font-extrabold text-white">SK</span><p><b className="block text-sm text-[#0B1F33]">Sarah Kim</b><span className="block text-sm text-[#667085]">Founder, PureGlow</span></p></div>
          </div>
          <div className="relative hidden min-h-[340px] items-center justify-center border-l border-[#E7DDD2] bg-[#0B1F33] lg:flex"><Quote className="size-32 text-[#C99A4A]/55" strokeWidth={1} aria-hidden="true" /><div className="absolute inset-x-10 bottom-10 text-center text-sm leading-6 text-white/65">Clear guidance.<br />Beautifully finished packaging.</div></div>
        </article>
      </Container>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-white pb-12 sm:pb-14 lg:pb-16">
      <Container>
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(110deg,#071827_0%,#0B1F33_58%,#123148_100%)] px-7 py-9 text-white sm:px-10 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-16">
          <Box className="pointer-events-none absolute -right-9 -top-10 size-52 text-[#8CAFC5]/10" strokeWidth={1} aria-hidden="true" />
          <div className="relative max-w-3xl"><p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#E6AD65]">Ready when you are</p><h2 className="font-serif text-[clamp(2.35rem,4vw,3.6rem)] leading-[1.05] tracking-[-0.035em] text-white">Let’s create packaging worth opening.</h2><p className="mt-4 text-base text-white/70">Tell us what you’re making. We’ll help shape the rest.</p></div>
          <div className="relative mt-8 flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:w-auto"><Button href="/get-a-quote" variant="light">Get a free quote</Button><Link href="/contact" className="flex h-[52px] w-full items-center justify-center rounded-[10px] border border-white/45 bg-transparent px-7 text-sm font-semibold text-white outline-none transition-colors hover:border-white/80 hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B1F33] sm:w-auto">Talk to an expert</Link></div>
        </div>
      </Container>
    </section>
  );
}
