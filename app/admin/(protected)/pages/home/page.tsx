import Link from "next/link";
import { ArrowLeft, Eye, Check, SlidersHorizontal } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { saveHomepageSection } from "@/app/admin/actions";
import {
  homepageSectionDefinitions,
  homepageDefaults,
  type HomepageSection,
} from "@/lib/admin-homepage";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-3.5 text-sm text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:bg-white focus:ring-2 focus:ring-[#D96B2B]/10";

export default async function HomepageEditorPage() {
  await requireAdmin();

  const client = createAdminClient() || (await createClient());
  const [{ data: rows }, { data: visibilityRow }] = client
    ? await Promise.all([
        client.from("page_content").select("content_key,value").eq("page_slug", "home"),
        client
          .from("site_settings")
          .select("value")
          .eq("key", "home_section_visibility")
          .maybeSingle(),
      ])
    : [{ data: [] }, { data: null }];

  const values = Object.fromEntries(
    (rows || []).map((row) => [row.content_key, row.value])
  ) as Record<string, string>;

  const visibility = (visibilityRow?.value || {}) as Record<string, boolean>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors mb-2"
          >
            <ArrowLeft className="size-4" /> Back to Pages
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B1F33]">
            Homepage Sections Editor
          </h1>
          <p className="mt-3 text-sm text-[#667085]">
            Configure copy, headings, and toggle visibility for all active homepage sections.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7DDD2] bg-white text-xs font-bold uppercase tracking-wider text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors shadow-xs"
        >
          <Eye className="size-4 text-[#D96B2B]" /> Preview Live Website
        </Link>
      </div>

      {/* Sections Accordion */}
      <div className="space-y-4">
        {Object.entries(homepageSectionDefinitions).map(([key, section], index) => {
          const name = key as HomepageSection;
          const isEnabled = visibility[key] !== false;

          return (
            <details
              key={key}
              className="group overflow-hidden rounded-2xl border border-[#E7DDD2] bg-white shadow-sm transition-all open:border-[#D96B2B]/60 open:shadow-md"
              open={index === 0}
            >
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 outline-none transition-colors hover:bg-[#FFFDF9] focus-visible:bg-[#FFFDF9]">
                <div className="flex items-center gap-3.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4E9] text-xs font-bold text-[#D96B2B] border border-[#F0E1D2] shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="font-serif text-base font-bold text-[#0B1F33]">
                        {section.label}
                      </b>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEnabled
                            ? "bg-[#EDF9F1] text-[#198754]"
                            : "bg-[#F3F4F6] text-[#98A2B3]"
                        }`}
                      >
                        {isEnabled ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <span className="block text-xs text-[#667085] mt-0.5">
                      {section.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D96B2B] group-open:hidden">
                    Edit Section
                  </span>
                  <span className="hidden text-xs font-bold uppercase tracking-wider text-[#667085] group-open:block">
                    Collapse
                  </span>
                </div>
              </summary>

              <div className="border-t border-[#F0EAE2] p-6 sm:p-7 bg-[#FFFDF9]">
                <form
                  action={saveHomepageSection.bind(null, name)}
                  className="space-y-5"
                >
                  {/* Visibility switch */}
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E7DDD2] bg-white cursor-pointer hover:border-[#D96B2B] transition-colors">
                    <input
                      name="enabled"
                      type="checkbox"
                      defaultChecked={isEnabled}
                      className="size-4.5 rounded accent-[#D96B2B]"
                    />
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                        Enable this section on the live homepage
                      </span>
                      <span className="block text-[11px] text-[#667085] mt-0.5">
                        If unchecked, this entire section will be hidden from public view.
                      </span>
                    </div>
                  </label>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map(([fieldKey, label, inputType]) => {
                      const currentVal =
                        values[fieldKey] !== undefined && values[fieldKey] !== ""
                          ? values[fieldKey]
                          : homepageDefaults[fieldKey] || "";

                      const isWide =
                        inputType === "textarea" ||
                        inputType === "image" ||
                        fieldKey.includes("title") ||
                        fieldKey.includes("quote");

                      return (
                        <div
                          key={fieldKey}
                          className={isWide ? "md:col-span-2 space-y-1" : "space-y-1"}
                        >
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                            {label}
                          </label>

                          {inputType === "textarea" ? (
                            <textarea
                              name={fieldKey}
                              rows={3}
                              defaultValue={currentVal}
                              className={`${inputClass} h-auto py-2.5 font-normal leading-relaxed`}
                            />
                          ) : (
                            <input
                              name={fieldKey}
                              type={inputType === "url" ? "url" : "text"}
                              defaultValue={currentVal}
                              className={inputClass}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#E7DDD2]">
                    <SubmitButton>
                      Save Section Content
                    </SubmitButton>
                  </div>
                </form>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
