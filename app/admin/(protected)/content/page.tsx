import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { savePageContent, saveSiteSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { SiteSettings } from "@/types/cms";

const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-[#D9D0C7] bg-white px-3 text-sm outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10";
const defaultSettings: SiteSettings = { company_name: "Fable Packaging", email: "hello@fablepack.co", phone: "+1 (855) 123-4567", phone_href: "+18551234567", address: "", facebook: "", instagram: "", linkedin: "", youtube: "", tagline: "Thoughtful custom packaging for ambitious brands. Sustainable, scalable and memorable.", newsletter_title: "Packaging notes, worth opening.", newsletter_body: "Fresh ideas, useful guides and product news. No clutter.", copyright_text: "© 2026 Fable Packaging Co. All rights reserved." };

export default async function SiteContentPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const [{ data: rows }, { data: settingsRow }] = client ? await Promise.all([
    client.from("page_content").select("*").order("page_slug").order("sort_order"),
    client.from("site_settings").select("value").eq("key", "general").maybeSingle(),
  ]) : [{ data: [] }, { data: null }];
  const settings = { ...defaultSettings, ...((settingsRow?.value || {}) as Partial<SiteSettings>) };
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Global content</p>
      <h1 className="mt-2 font-serif text-4xl">Site content & settings</h1>
      <section className="mt-8 rounded-xl border border-[#DDD6CE] bg-white p-5 sm:p-7">
        <h2 className="text-xl font-bold">Company details</h2>
        <form action={saveSiteSettings} className="mt-5 grid gap-4 sm:grid-cols-2">
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className={`text-sm font-bold ${key === "address" ? "sm:col-span-2" : ""}`}>{key.replaceAll("_", " ")}<input name={key} type={key === "email" ? "email" : "text"} defaultValue={String(value)} className={inputClass} /></label>
          ))}
          <div className="sm:col-span-2"><SubmitButton>Save company details</SubmitButton></div>
        </form>
      </section>
      <section className="mt-6 rounded-xl border border-[#DDD6CE] bg-white p-5 sm:p-7">
        <h2 className="text-xl font-bold">Page copy</h2>
        <p className="mt-2 text-sm text-[#667085]">Safely edit homepage headings and descriptions.</p>
        <div className="mt-5 space-y-4">
          {(rows || []).map((row) => (
            <form key={row.id} action={savePageContent.bind(null, String(row.id))} className="rounded-lg border border-[#EEE8E1] bg-[#FCFBF9] p-4">
              <label className="text-sm font-bold">{row.label}<span className="ml-2 text-xs font-normal text-[#98A2B3]">{row.page_slug}.{row.content_key}</span>
                {row.input_type === "textarea" ? <textarea name="value" rows={4} defaultValue={row.value} className={`${inputClass} h-auto py-3`} /> : <input name="value" defaultValue={row.value} className={inputClass} />}
              </label>
              <div className="mt-3"><SubmitButton>Save</SubmitButton></div>
            </form>
          ))}
        </div>
      </section>
    </>
  );
}
