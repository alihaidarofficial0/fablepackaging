import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { saveSiteSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { SiteSettings } from "@/types/cms";

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3.5 text-sm text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10";
const textareaClass = `${inputClass} h-auto min-h-[96px] resize-y py-3`;
const labelClass = "block text-sm font-bold text-[#0B1F33]";

const defaults: SiteSettings = {
  company_name: "Fable Packaging",
  email: "hello@fablepack.co",
  phone: "+1 (855) 123-4567",
  phone_href: "+18551234567",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  tagline: "Thoughtful custom packaging for ambitious brands. Sustainable, scalable and memorable.",
  newsletter_title: "Packaging notes, worth opening.",
  newsletter_body: "Fresh ideas, useful guides and product news. No clutter.",
  copyright_text: "© 2026 Fable Packaging Co. All rights reserved.",
  header_scripts: "",
  footer_scripts: "",
};

export const metadata = { title: "Site Settings — Fable Packaging Admin" };

export default async function SettingsAdminPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const { data: settingsRow } = client
    ? await client.from("site_settings").select("value").eq("key", "general").maybeSingle()
    : { data: null };
  const settings = { ...defaults, ...((settingsRow?.value || {}) as Partial<SiteSettings>) };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Settings</p>
        <h1 className="mt-1.5 font-serif text-3xl text-[#0B1F33] sm:text-4xl">Site settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
          Company details, footer copy, social links, and tracking scripts used across the public website.
        </p>
      </div>

      <form action={saveSiteSettings} className="space-y-5">
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl text-[#0B1F33]">Company</h2>
          <p className="mt-1 text-sm text-[#667085]">Shown in the header, footer, and contact page.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Company name
              <input name="company_name" required defaultValue={settings.company_name} className={inputClass} />
            </label>
            <label className={labelClass}>
              Email
              <input name="email" type="email" required defaultValue={settings.email} className={inputClass} />
            </label>
            <label className={labelClass}>
              Phone
              <input name="phone" defaultValue={settings.phone} className={inputClass} />
            </label>
            <label className={labelClass}>
              Phone link
              <input name="phone_href" defaultValue={settings.phone_href} placeholder="+18551234567" className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Address
              <textarea name="address" rows={3} defaultValue={settings.address} className={textareaClass} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl text-[#0B1F33]">Footer</h2>
          <p className="mt-1 text-sm text-[#667085]">Tagline, newsletter block, and copyright line.</p>
          <div className="mt-6 grid gap-5">
            <label className={labelClass}>
              Tagline
              <textarea name="tagline" rows={3} defaultValue={settings.tagline} className={textareaClass} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Newsletter title
                <input name="newsletter_title" defaultValue={settings.newsletter_title} className={inputClass} />
              </label>
              <label className={labelClass}>
                Copyright
                <input name="copyright_text" defaultValue={settings.copyright_text} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Newsletter text
              <textarea name="newsletter_body" rows={3} defaultValue={settings.newsletter_body} className={textareaClass} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl text-[#0B1F33]">Tracking scripts</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Paste Google Analytics, Tag Manager, or Search Console snippets. Header scripts load in <code className="text-[12px]">&lt;head&gt;</code>; footer scripts load before the closing body tag. Leave blank to skip.
          </p>
          <div className="mt-6 grid gap-5">
            <label className={labelClass}>
              Header scripts
              <textarea
                name="header_scripts"
                rows={7}
                defaultValue={settings.header_scripts || ""}
                spellCheck={false}
                placeholder={'<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>\n<meta name="google-site-verification" content="…" />'}
                className={`${textareaClass} min-h-[160px] font-mono text-[13px] leading-5`}
              />
            </label>
            <label className={labelClass}>
              Footer scripts
              <textarea
                name="footer_scripts"
                rows={6}
                defaultValue={settings.footer_scripts || ""}
                spellCheck={false}
                placeholder={'<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'}
                className={`${textareaClass} min-h-[140px] font-mono text-[13px] leading-5`}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl text-[#0B1F33]">Social links</h2>
          <p className="mt-1 text-sm text-[#667085]">Leave a field blank to hide that icon in the footer.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Facebook
              <input name="facebook" defaultValue={settings.facebook} placeholder="https://" className={inputClass} />
            </label>
            <label className={labelClass}>
              Instagram
              <input name="instagram" defaultValue={settings.instagram} placeholder="https://" className={inputClass} />
            </label>
            <label className={labelClass}>
              LinkedIn
              <input name="linkedin" defaultValue={settings.linkedin} placeholder="https://" className={inputClass} />
            </label>
            <label className={labelClass}>
              YouTube
              <input name="youtube" defaultValue={settings.youtube} placeholder="https://" className={inputClass} />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end">
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
