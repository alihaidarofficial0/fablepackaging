import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { MiniDropdown } from "./MiniDropdown";
import { NewsletterForm } from "./NewsletterForm";
import type { CmsNavigationItem, CmsProduct, SiteSettings } from "@/types/cms";

const staticGroups = [
  { title: "Company", links: [["About Us", "/about"], ["Our Process", "/our-process"], ["Sustainability", "/sustainability"], ["Reviews", "/reviews"], ["Blog", "/blog"], ["Contact Us", "/contact"]] },
  { title: "Support", links: [["Get a Quote", "/get-a-quote"], ["Artwork Guidelines", "/artwork-guidelines"], ["Shipping & Delivery", "/shipping-and-delivery"], ["FAQs", "/faq"], ["Track Your Order", "/track-your-order"], ["Help Center", "/help-center"]] },
];

export function Footer({ settings, products, navigation }: { settings: SiteSettings; products: CmsProduct[]; navigation: CmsNavigationItem[] }) {
  const socials = [[Facebook, "Facebook", settings.facebook], [Instagram, "Instagram", settings.instagram], [Linkedin, "LinkedIn", settings.linkedin], [Youtube, "YouTube", settings.youtube]] as const;
  const companyLinks = navigation.filter((item) => item.location === "footer_company").map((item) => [item.label, item.href]);
  const supportLinks = navigation.filter((item) => item.location === "footer_support").map((item) => [item.label, item.href]);
  const groups = [
    { title: "Products", links: products.map((product) => [product.name, `/custom-boxes/${product.slug}`]) },
    { title: "Company", links: companyLinks.length ? companyLinks : staticGroups[0].links },
    { title: "Support", links: supportLinks.length ? supportLinks : staticGroups[1].links },
  ];
  return <footer id="site-footer" className="bg-[radial-gradient(circle_at_88%_10%,#12354A,#071827_58%)] text-white">
    <div className="h-px bg-gradient-to-r from-transparent via-[#C99A4A]/45 to-transparent" />
    <div className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-x-7 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:grid-cols-[1.25fr_repeat(3,.72fr)_1.35fr] lg:gap-10 lg:py-16">
      <div className="col-span-2 md:col-span-4 lg:col-span-1">
        <Logo inverse />
        <p className="mt-5 max-w-[270px] text-sm leading-6 text-white/65">{settings.tagline}</p>
        <div className="mt-6 flex gap-2">
          {socials.filter(([, , href]) => href).map(([Icon, label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Icon className="size-4" /></a>)}
        </div>
      </div>
      {groups.map((group) => <div key={group.title}><h3 className="mb-5 font-sans text-sm font-extrabold leading-5 text-white">{group.title}</h3><ul className="space-y-2.5">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-6 text-[13px] text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]">{label}</Link></li>)}</ul></div>)}
      <div className="col-span-2 md:col-span-4 lg:col-span-1">
        <h3 className="font-serif text-[27px] leading-[1.12] text-white">{settings.newsletter_title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/60">{settings.newsletter_body}</p>
        <NewsletterForm />
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-extrabold text-white/75"><span>VISA</span><span className="flex" aria-label="Mastercard"><i className="size-3 rounded-full bg-[#EB6A45]" /><i className="-ml-1 size-3 rounded-full bg-[#EFBF55]" /></span><span className="italic text-[#76AEEA]">PayPal</span><span className="italic">stripe</span></div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1320px] flex-col items-start justify-between gap-4 px-4 py-5 text-[12px] text-white/50 sm:px-6 md:flex-row md:items-center">
        <span>{settings.copyright_text}</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link><Link href="/sitemap" className="transition-colors hover:text-white">Sitemap</Link></div>
        <MiniDropdown label="English" ariaLabel="Select language" options={["English", "Français", "Deutsch"]} tone="dark" />
      </div>
    </div>
  </footer>;
}
