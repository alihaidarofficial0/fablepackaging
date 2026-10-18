import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { updateLeadStatus } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-[#D9D0C7] bg-white px-3 text-sm";
type Lead = Record<string, unknown>;

function LeadCard({ lead, table }: { lead: Lead; table: "quote_requests" | "contact_requests" }) {
  const isQuote = table === "quote_requests";
  const statuses = isQuote ? ["new", "contacted", "quoted", "won", "lost", "spam"] : ["new", "contacted", "closed", "spam"];
  return (
    <details className="rounded-xl border border-[#E7DDD2] bg-white p-5">
      <summary className="flex cursor-pointer list-none flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <span><b className="block">{String(lead.name || "Unknown")}</b><span className="mt-1 block text-sm text-[#667085]">{String(lead.email || "")} · {new Date(String(lead.created_at)).toLocaleString()}</span></span>
        <span className="rounded-full bg-[#FFF0E2] px-3 py-1 text-xs font-bold uppercase text-[#D96B2B]">{String(lead.status)}</span>
      </summary>
      <div className="mt-5 grid gap-3 border-t border-[#EEE8E1] pt-5 text-sm sm:grid-cols-2">
        {Object.entries(lead).filter(([key, value]) => value && !["id", "ip_hash", "internal_notes"].includes(key)).map(([key, value]) => (
          <p key={key} className={key === "notes" || key === "message" ? "sm:col-span-2" : ""}><b className="block text-xs uppercase tracking-wide text-[#98A2B3]">{key.replaceAll("_", " ")}</b>{key === "artwork_url" ? <a className="mt-1 inline-block font-bold text-[#D96B2B] underline" href={String(value)} target="_blank" rel="noreferrer">Open private artwork</a> : <span className="mt-1 block break-words">{Array.isArray(value) ? value.join(", ") : String(value)}</span>}</p>
        ))}
      </div>
      <form action={updateLeadStatus.bind(null, table, String(lead.id))} className="mt-6 grid gap-4 border-t border-[#EEE8E1] pt-5 sm:grid-cols-[200px_1fr_auto] sm:items-end">
        <label className="text-sm font-bold">Status<select name="status" defaultValue={String(lead.status)} className={inputClass}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="text-sm font-bold">Internal notes<textarea name="internal_notes" rows={2} defaultValue={String(lead.internal_notes || "")} className={`${inputClass} h-auto py-2`} /></label>
        <SubmitButton>Update</SubmitButton>
      </form>
    </details>
  );
}

export default async function LeadsPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const [{ data: quotes }, { data: contacts }] = client ? await Promise.all([
    client.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(100),
    client.from("contact_requests").select("*").order("created_at", { ascending: false }).limit(100),
  ]) : [{ data: [] }, { data: [] }];
  const preparedQuotes = await Promise.all((quotes || []).map(async (lead) => {
    if (!client || !lead.artwork_path) return lead;
    const { data } = await client.storage.from("quote-artwork").createSignedUrl(String(lead.artwork_path), 60 * 60);
    return data?.signedUrl ? { ...lead, artwork_url: data.signedUrl } : lead;
  }));
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Customer inbox</p>
      <h1 className="mt-2 font-serif text-4xl">Leads</h1>
      <p className="mt-3 text-sm text-[#667085]">Review the 100 most recent quote and contact inquiries. Update their status and private team notes here.</p>
      <h2 className="mt-8 text-xl font-bold">Quote requests ({preparedQuotes.length})</h2>
      <div className="mt-4 space-y-3">{preparedQuotes.map((lead) => <LeadCard key={lead.id} lead={lead as Lead} table="quote_requests" />)}</div>
      <h2 className="mt-10 text-xl font-bold">Contact requests ({contacts?.length || 0})</h2>
      <div className="mt-4 space-y-3">{(contacts || []).map((lead) => <LeadCard key={lead.id} lead={lead as Lead} table="contact_requests" />)}</div>
    </>
  );
}
