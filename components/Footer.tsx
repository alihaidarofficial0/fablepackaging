import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, BookOpen, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import type { SiteSettings } from "@/types/cms";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    [Facebook, "Facebook", settings.facebook],
    [Instagram, "Instagram", settings.instagram],
    [Linkedin, "LinkedIn", settings.linkedin],
    [Youtube, "YouTube", settings.youtube],
  ] as const;

  const topicLinks = [
    ["Box Styles & Structure", "/blog/category/box-styles-structural-design"],
    ["Materials & Substrates", "/blog/category/materials-substrates"],
    ["Sustainable Packaging", "/blog/category/sustainable-packaging"],
    ["Printing & Luxury Finishes", "/blog/category/printing-luxury-finishes"],
    ["E-Commerce & Unboxing", "/blog/category/ecommerce-unboxing"],
    ["Prepress & Design Guides", "/blog/category/prepress-design-guides"],
  ];

  const publicationLinks = [
    ["All Articles", "/blog"],
    ["About the Journal", "/about"],
    ["Editorial Philosophy", "/about"],
    ["Reader Contact", "/contact"],
    ["RSS / Newsletter", "/blog#newsletter"],
  ];

  return (
    <footer id="site-footer" className="bg-[#0B1F33] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#D96B2B]/45 to-transparent" />
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr] lg:gap-12 lg:py-16">
        {/* Brand */}
        <div>
          <Logo inverse brandName="Fable" descriptor="Journal & Essays" />
          <p className="mt-5 max-w-[320px] text-sm leading-6 text-white/65 font-sans">
            A dedicated publication exploring structural design, material culture, sustainable choices, and craftsmanship.
          </p>
          <div className="mt-6 flex gap-2">
            {socials
              .filter(([, , href]) => href)
              .map(([Icon, label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <h3 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#D96B2B]">
            Topics & Themes
          </h3>
          <ul className="space-y-3">
            {topicLinks.map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="inline-flex text-[13px] text-white/70 hover:text-[#D96B2B] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Publication */}
        <div>
          <h3 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#D96B2B]">
            Publication
          </h3>
          <ul className="space-y-3">
            {publicationLinks.map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="inline-flex text-[13px] text-white/70 hover:text-[#D96B2B] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] mb-3">
            <Sparkles className="size-3.5" />
            <span>Weekly Dispatch</span>
          </div>
          <h3 className="font-serif text-2xl leading-tight text-white">
            Stories delivered to your inbox.
          </h3>
          <p className="mt-2 text-xs leading-5 text-white/60">
            Thoughtful essays, substrate notes, and design inspiration. No spam, ever.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[1320px] flex-col items-start justify-between gap-4 px-4 py-4 text-[12px] text-white/50 sm:px-6 md:flex-row md:items-center">
          <span>{settings.copyright_text || "© 2026 Fable Journal. All rights reserved."}</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Reading
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
