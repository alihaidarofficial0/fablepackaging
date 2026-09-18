import Link from "next/link";
import { ArrowRight, ChevronDown, Leaf, Mail, PackageCheck, Phone, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { MegaMenu, NavDropdown, type MenuItem } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

const dropdowns: Array<{ label: string; href: string; intro: string; items: MenuItem[] }> = [
  {
    label: "Industries",
    href: "/industries",
    intro: "Packaging shaped around your sector.",
    items: [
      { label: "Cosmetics & Beauty", href: "/industries/cosmetics-beauty", description: "Polished packs for beauty launches." },
      { label: "Food & Beverage", href: "/industries/food-beverage", description: "Freshness, presentation and shelf appeal." },
      { label: "Retail & E-Commerce", href: "/industries/ecommerce", description: "Shipping built for memorable unboxing." },
      { label: "Health & Wellness", href: "/industries/health-wellness", description: "Clean, trustworthy brand presentation." },
      { label: "Electronics", href: "/industries/electronics", description: "Protective structures with premium detail." },
      { label: "Apparel & Fashion", href: "/industries/apparel-fashion", description: "Thoughtful gifting and mailer solutions." },
    ],
  },
  {
    label: "Materials",
    href: "/materials",
    intro: "Details that make the difference.",
    items: [
      { label: "Kraft Paper", href: "/materials/kraft-paper", description: "Natural, tactile and direct." },
      { label: "Premium Paperboard", href: "/materials/premium-paperboard", description: "Smooth, crisp and versatile." },
      { label: "Corrugated Board", href: "/materials/corrugated-board", description: "Protective strength for transit." },
      { label: "Rigid Board", href: "/materials/rigid-board", description: "Weight and presence for gifting." },
    ],
  },
  {
    label: "Design Support",
    href: "/design-support",
    intro: "Clarity from first sketch to final proof.",
    items: [
      { label: "Artwork Guidelines", href: "/artwork-guidelines", description: "Prepare artwork with confidence." },
      { label: "Structural Design", href: "/design-support", description: "A structure made for your product." },
      { label: "Samples & Prototypes", href: "/samples", description: "Review form and finish before production." },
      { label: "Get Expert Help", href: "/contact", description: "Talk with a packaging specialist." },
    ],
  },
];

export function Header() {
  return (
    <>
      <div className="hidden h-9 bg-[#0B1F33] text-white min-[900px]:block">
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 text-[11px] font-semibold">
          <div className="flex items-center gap-5 xl:gap-7">
            <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Free design support</span>
            <span className="flex items-center gap-1.5"><PackageCheck className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Low minimum order</span>
            <span className="flex items-center gap-1.5"><Leaf className="size-3.5 text-[#C99A4A]" aria-hidden="true" />Sustainable packaging</span>
          </div>
          <div className="flex items-center gap-5 xl:gap-7">
            <a href="mailto:hello@fablepack.co" className="flex h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D]"><Mail className="size-3.5" aria-hidden="true" />hello@fablepack.co</a>
            <a href="tel:+18551234567" className="flex h-9 items-center gap-1.5 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D]"><Phone className="size-3.5" aria-hidden="true" />+1 (855) 123-4567</a>
            <button type="button" className="flex h-9 items-center gap-1 px-1 transition-colors hover:text-[#EBC57D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBC57D]" aria-label="Select currency, currently US dollars">USD <ChevronDown className="size-3" aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 h-[68px] border-b border-[#0B1F33]/10 bg-[#FFFDF9]/95 text-[#0B1F33] backdrop-blur-md min-[1024px]:h-[78px]">
        <div className="relative mx-auto grid h-full max-w-[1320px] grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6">
          <Logo />

          <nav aria-label="Main navigation" className="hidden h-full items-center justify-center gap-0 min-[1024px]:flex xl:gap-1">
            <MegaMenu />
            {dropdowns.map((item) => <NavDropdown key={item.label} {...item} />)}
            <Link href="/about" className="flex h-full items-center rounded-sm px-3 text-[13px] font-semibold text-[#344054] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">About</Link>
            <Link href="/blog" className="flex h-full items-center rounded-sm px-3 text-[13px] font-semibold text-[#344054] outline-none transition-colors hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]">Blog</Link>
          </nav>

          <div className="hidden items-center gap-1 min-[1024px]:flex">
            <Link href="/search" aria-label="Search" className="grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Search className="size-5" /></Link>
            <Link href="/cart" aria-label="Shopping bag, 0 items" className="relative grid size-11 place-items-center rounded-lg outline-none transition-colors hover:bg-[#F3E8DA] hover:text-[#D96B2B] focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><ShoppingBag className="size-5" /><span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-[#D96B2B] text-[9px] text-white">0</span></Link>
            <Link href="/get-a-quote" style={{ color: "#FFFFFF" }} className="ml-2 flex h-[48px] items-center gap-2 whitespace-nowrap rounded-[10px] border border-[#D96B2B] bg-[#D96B2B] px-5 text-sm font-bold transition-colors hover:border-[#BC5420] hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-3">Get a Quote <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>

          <MobileMenu />
        </div>
      </header>
    </>
  );
}
