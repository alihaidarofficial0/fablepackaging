import type { Metadata } from "next";
import { Clock, Mail, MessageSquare, BookOpen, Send, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/shared/Container";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact the Editorial Desk | Fable Journal",
  description:
    "Get in touch with the editors of Fable Journal. Article pitches, technical enquiries on packaging materials, press releases, and reader feedback.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Header Banner */}
      <section className="border-b border-[#E7DDD2] bg-[linear-gradient(180deg,#FFF9F2,#FFFDF9)] py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D96B2B]">
              <MessageSquare className="size-3.5" />
              <span>Get In Touch</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B1F33] leading-[1.04] tracking-tight">
              Contact the Editorial Desk
            </h1>
            <p className="text-base sm:text-lg text-[#526171] leading-relaxed max-w-2xl">
              Have an article pitch, technical inquiry, or material study you'd like to share?
              We welcome correspondence from designers, packaging engineers, and curious practitioners.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="bg-[#FFFDF9] py-14 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-start">
            {/* Left Sidebar / Editorial Information */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-[#E7DDD2] bg-white p-7 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D96B2B] block mb-1">
                    Direct Desks
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#0B1F33]">
                    How to reach our team
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E7DDD2]/60">
                    <div className="size-9 rounded-lg bg-white flex items-center justify-center text-[#D96B2B] shadow-xs shrink-0">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#667085] block">
                        Editorial Inquiries & Pitches
                      </span>
                      <a
                        href={`mailto:${settings.email || "editors@fablejournal.com"}`}
                        className="font-medium text-[#0B1F33] hover:text-[#D96B2B] transition-colors"
                      >
                        {settings.email || "editors@fablejournal.com"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E7DDD2]/60">
                    <div className="size-9 rounded-lg bg-white flex items-center justify-center text-[#D96B2B] shadow-xs shrink-0">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#667085] block">
                        Desk Hours
                      </span>
                      <p className="font-medium text-[#0B1F33]">
                        Monday – Friday, 9:00 AM – 6:00 PM EST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E7DDD2] pt-6 space-y-3">
                  <h3 className="font-serif text-base font-bold text-[#0B1F33] flex items-center gap-2">
                    <BookOpen className="size-4 text-[#D96B2B]" />
                    <span>What we look for in pitches:</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-[#526171] leading-relaxed list-disc list-inside">
                    <li>First-person technical case studies from packaging runs</li>
                    <li>Substrate deep dives (kraft, greyboard, barrier coatings)</li>
                    <li>Ecological lifecycle and recyclability assessments</li>
                    <li>Structural dieline teardowns with production lessons</li>
                  </ul>
                </div>
              </div>

              {/* Response commitment badge */}
              <div className="rounded-2xl border border-[#D96B2B]/20 bg-[#FFF5EC] p-6 text-sm text-[#0B1F33] flex items-start gap-4">
                <Sparkles className="size-5 text-[#D96B2B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Editorial Commitment</p>
                  <p className="text-xs text-[#526171] leading-relaxed">
                    Every message is read by an editor. We aim to respond to pitches and inquiries
                    within 2 to 3 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
