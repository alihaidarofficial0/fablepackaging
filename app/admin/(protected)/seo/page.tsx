import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { saveSeoSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm outline-none transition-colors focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10";

export default async function SeoSettingsPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const { data } = client ? await client.from("site_settings").select("value").eq("key", "seo").maybeSingle() : { data: null };
  const settings = { default_title: "Fable Packaging — Custom Boxes, Thoughtfully Made", default_description: "Premium custom packaging with low minimums, expert design support and worldwide delivery.", og_image: "", site_url: "https://www.fablepack.co", allow_indexing: true, ...((data?.value || {}) as Record<string, unknown>) } as { default_title: string; default_description: string; og_image: string; site_url: string; allow_indexing: boolean };
  return <><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Settings</p><h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">SEO settings</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">Set sensible search defaults. Individual content entries can still use their own SEO fields.</p></div><form action={saveSeoSettings} className="mt-8 max-w-3xl rounded-xl border border-[#E7DDD2] bg-white p-5 sm:p-6"><div className="grid gap-5"><label className="text-sm font-bold text-[#0B1F33]">Default SEO title<input name="default_title" defaultValue={settings.default_title} className={inputClass} /></label><label className="text-sm font-bold text-[#0B1F33]">Default meta description<textarea name="default_description" rows={4} defaultValue={settings.default_description} className={`${inputClass} h-auto py-3`} /></label><label className="text-sm font-bold text-[#0B1F33]">Default Open Graph image URL <span className="font-normal text-[#98A2B3]">(optional)</span><input name="og_image" type="url" defaultValue={settings.og_image} className={inputClass} /></label><label className="text-sm font-bold text-[#0B1F33]">Canonical site URL<input name="site_url" type="url" defaultValue={settings.site_url} className={inputClass} /></label><label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#E7DDD2] bg-[#FFFDF9] px-3 text-sm font-semibold text-[#0B1F33]"><input name="allow_indexing" type="checkbox" defaultChecked={settings.allow_indexing} className="size-4 accent-[#D96B2B]" />Allow search engines to index this site</label><SubmitButton>Save SEO settings</SubmitButton></div></form></>;
}
