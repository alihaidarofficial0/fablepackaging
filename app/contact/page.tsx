import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { getPageContent, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Contact Fable Packaging", description: "Talk with a Fable Packaging specialist about your custom packaging project." };

export default async function ContactPage() {
  const [settings, content] = await Promise.all([getSiteSettings(), getPageContent("contact")]);
  return (
    <>
      <section className="subhero"><div className="container"><p className="eyebrow">{content.contact_eyebrow || "We’re here to help"}</p><h1>{content.contact_title || "Let’s talk packaging."}</h1><p>{content.contact_intro || "Questions about materials, sizing or a project already in motion? Send us a note."}</p></div></section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>{content.contact_info_title || "Talk to a real packaging person."}</h2><p>{content.contact_info_body || "Our team works across time zones to keep projects moving."}</p>
            <div><span><Mail /></span><p><b>Email</b><a href={`mailto:${settings.email}`}>{settings.email}</a></p></div>
            <div><span><Phone /></span><p><b>Phone</b><a href={`tel:${settings.phone_href}`}>{settings.phone}</a></p></div>
            <div><span><Clock /></span><p><b>Hours</b><small>{content.contact_hours || "Monday–Friday, 9am–6pm EST"}</small></p></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
