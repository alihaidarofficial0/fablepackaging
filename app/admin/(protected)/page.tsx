import Link from "next/link";
import { ArrowRight, Boxes, FileText, FolderKanban, ImagePlus, Inbox, PackageOpen, PencilLine } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const number = new Intl.NumberFormat("en-US");

function StatCard({ label, value, href, icon: Icon, description }: { label: string; value: number; href: string; icon: typeof Boxes; description: string }) {
  return <Link href={href} className="group rounded-xl border border-[#E7DDD2] bg-white p-5 outline-none transition-colors hover:border-[#D96B2B]/60 focus-visible:ring-2 focus-visible:ring-[#D96B2B] sm:p-6">
    <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#FFF4E9] text-[#D96B2B]"><Icon className="size-5" /></span><ArrowRight className="mt-1 size-4 text-[#98A2B3] transition-colors group-hover:text-[#D96B2B]" /></div>
    <p className="mt-6 text-sm font-semibold text-[#667085]">{label}</p><strong className="mt-1 block font-serif text-4xl leading-none text-[#0B1F33]">{number.format(value)}</strong><p className="mt-3 text-xs leading-5 text-[#98A2B3]">{description}</p>
  </Link>;
}

function statusClass(action: string) {
  if (action === "delete") return "bg-[#FFF1F0] text-[#DC3545]";
  if (action === "create" || action === "upload") return "bg-[#EDF9F1] text-[#198754]";
  return "bg-[#FFF4E9] text-[#D96B2B]";
}

export default async function AdminDashboard() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const tables = ["products", "industries", "projects", "contact_requests", "quote_requests"] as const;
  const [productCount, industryCount, projectCount, leadCount, quoteCount] = await Promise.all(tables.map(async (table) => {
    if (!client) return 0;
    const { count } = await client.from(table).select("id", { count: "exact", head: true });
    return count || 0;
  }));
  const { data: activity } = client ? await client.from("audit_logs").select("id,action,entity,entity_id,created_at").order("created_at", { ascending: false }).limit(6) : { data: [] };
  const stats = [
    { label: "Published products", value: productCount, href: "/admin/products", icon: Boxes, description: "Manage your product catalogue" },
    { label: "Industries", value: industryCount, href: "/admin/industries", icon: PackageOpen, description: "Sector-specific packaging pages" },
    { label: "Featured projects", value: projectCount, href: "/admin/projects", icon: FolderKanban, description: "Portfolio work shown on site" },
    { label: "New leads", value: leadCount, href: "/admin/leads", icon: Inbox, description: "Contact form inquiries" },
    { label: "Quote requests", value: quoteCount, href: "/admin/quotes", icon: FileText, description: "Packaging pricing requests" },
  ];
  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Dashboard</p><h1 className="mt-2 font-serif text-4xl leading-none text-[#0B1F33] sm:text-5xl">Website overview</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">A clear view of the content and inquiries that keep Fable Packaging moving.</p></div><Link href="/admin/pages/home" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#D96B2B] px-4 text-sm font-bold text-white transition-colors hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-2">Edit homepage <PencilLine className="size-4" /></Link></div>
    <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
      <div className="rounded-xl border border-[#E7DDD2] bg-white"><div className="flex items-center justify-between border-b border-[#F0EAE2] px-5 py-5 sm:px-6"><div><h2 className="font-serif text-2xl text-[#0B1F33]">Recent activity</h2><p className="mt-1 text-sm text-[#667085]">Changes recorded from your CMS workspace.</p></div><Link href="/admin/pages" className="text-sm font-semibold text-[#D96B2B] hover:text-[#BC5420]">Manage pages</Link></div><div className="divide-y divide-[#F0EAE2]">{activity?.length ? activity.map((entry) => <div key={entry.id} className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold capitalize ${statusClass(entry.action)}`}>{entry.action.slice(0, 1)}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold capitalize text-[#0B1F33]">{entry.action} <span className="font-normal text-[#667085]">{entry.entity.replaceAll("_", " ")}</span></p><p className="mt-0.5 text-xs text-[#98A2B3]">{new Date(entry.created_at).toLocaleString()}</p></div></div>) : <div className="px-5 py-10 text-sm text-[#667085] sm:px-6">No CMS changes have been recorded yet.</div>}</div></div>
      <aside className="rounded-xl border border-[#E7DDD2] bg-[#FFF9F2] p-5 sm:p-6"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Quick actions</p><h2 className="mt-2 font-serif text-2xl text-[#0B1F33]">Keep work flowing</h2><div className="mt-5 space-y-2"><Link href="/admin/products" className="flex min-h-11 items-center justify-between rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B]">Add product <Boxes className="size-4 text-[#D96B2B]" /></Link><Link href="/admin/pages/home" className="flex min-h-11 items-center justify-between rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B]">Edit homepage <PencilLine className="size-4 text-[#D96B2B]" /></Link><Link href="/admin/leads" className="flex min-h-11 items-center justify-between rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B]">View leads <Inbox className="size-4 text-[#D96B2B]" /></Link><Link href="/admin/media" className="flex min-h-11 items-center justify-between rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm font-semibold text-[#0B1F33] transition-colors hover:border-[#D96B2B]">Upload media <ImagePlus className="size-4 text-[#D96B2B]" /></Link></div></aside>
    </section>
  </>;
}
