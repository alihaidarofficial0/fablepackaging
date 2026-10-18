import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { saveHomepageSection } from "@/app/admin/actions";
import { homepageSectionDefinitions, type HomepageSection } from "@/lib/admin-homepage";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10";

export default async function HomepageEditorPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const [{ data: rows }, { data: visibilityRow }] = client ? await Promise.all([
    client.from("page_content").select("content_key,value").eq("page_slug", "home"),
    client.from("site_settings").select("value").eq("key", "home_section_visibility").maybeSingle(),
  ]) : [{ data: [] }, { data: null }];
  const values = Object.fromEntries((rows || []).map((row) => [row.content_key, row.value])) as Record<string, string>;
  const visibility = ((visibilityRow?.value || {}) as Record<string, boolean>);

  return <>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#667085] transition-colors hover:text-[#D96B2B]"><ArrowLeft className="size-4" />All pages</Link><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Page editor</p><h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">Homepage</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">Edit each homepage section in a clear, structured workspace.</p></div><Link href="/" target="_blank" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E7DDD2] bg-white px-4 text-sm font-bold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Eye className="size-4" />Preview website</Link></div>
    <div className="mt-8 space-y-3">{Object.entries(homepageSectionDefinitions).map(([key, section], index) => {
      const name = key as HomepageSection;
      return <details key={key} className="group overflow-hidden rounded-xl border border-[#E7DDD2] bg-white" open={index === 0}><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 outline-none transition-colors hover:bg-[#FFF9F2] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D96B2B] sm:px-6"><span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#FFF4E9] text-xs font-bold text-[#D96B2B]">{String(index + 1).padStart(2, "0")}</span><span><b className="block text-sm text-[#0B1F33]">{section.label}</b><span className="mt-0.5 block text-xs text-[#98A2B3]">Structured section settings</span></span></span><span className="text-sm font-semibold text-[#D96B2B] group-open:hidden">Edit</span><span className="hidden text-sm font-semibold text-[#667085] group-open:block">Close</span></summary><div className="border-t border-[#F0EAE2] p-5 sm:p-6"><form action={saveHomepageSection.bind(null, name)} className="grid gap-4 sm:grid-cols-2"><label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#E7DDD2] bg-[#FFFDF9] px-3 text-sm font-semibold text-[#0B1F33] sm:col-span-2"><input name="enabled" type="checkbox" defaultChecked={visibility[key] !== false} className="size-4 accent-[#D96B2B]" />Enable this section on the homepage</label>{section.fields.map(([fieldKey, label, inputType]) => <label key={fieldKey} className={`text-sm font-bold text-[#0B1F33] ${inputType === "textarea" || inputType === "image" ? "sm:col-span-2" : ""}`}>{label}{inputType === "textarea" ? <textarea name={fieldKey} rows={4} defaultValue={values[fieldKey] || ""} className={`${inputClass} h-auto py-3`} /> : <input name={fieldKey} type={inputType === "url" ? "url" : "text"} defaultValue={values[fieldKey] || ""} className={inputClass} />}</label>)}<div className="sm:col-span-2"><SubmitButton>Save {section.label}</SubmitButton></div></form></div></details>;
    })}</div>
  </>;
}
