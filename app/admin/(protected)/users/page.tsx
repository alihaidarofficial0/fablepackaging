import { ShieldCheck } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

type AdminUser = { user_id: string; email: string; role: "owner" | "editor"; active: boolean; created_at: string };

export default async function UsersAdminPage() {
  const admin = await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const { data } = client ? await client.from("admin_users").select("user_id,email,role,active,created_at").order("created_at") : { data: [] };
  const users = (data || []) as AdminUser[];
  const visibleUsers = users.some((user) => user.user_id === admin.id) ? users : [{ user_id: admin.id, email: admin.email, role: admin.role, active: true, created_at: new Date().toISOString() }, ...users];
  return <><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Settings</p><h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">Users</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">Only approved Supabase Auth users can access this protected CMS.</p></div><section className="mt-8 overflow-hidden rounded-xl border border-[#E7DDD2] bg-white"><div className="hidden grid-cols-[minmax(220px,1.5fr)_140px_120px_180px] gap-4 border-b border-[#E7DDD2] bg-[#FFF9F2] px-6 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#667085] md:grid"><span>User</span><span>Role</span><span>Status</span><span>Added</span></div><div className="divide-y divide-[#F0EAE2]">{visibleUsers.map((user) => <div key={user.user_id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(220px,1.5fr)_140px_120px_180px] md:items-center md:gap-4 md:px-6"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#0B1F33] text-xs font-bold text-white">{user.email.slice(0, 2).toUpperCase()}</span><span><b className="block text-sm text-[#0B1F33]">{user.email}</b>{user.user_id === admin.id && <span className="mt-0.5 block text-xs text-[#D96B2B]">Current session</span>}</span></div><span className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold capitalize text-[#0B1F33]"><ShieldCheck className="size-4 text-[#D96B2B]" />{user.role}</span><span><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${user.active ? "bg-[#EDF9F1] text-[#198754]" : "bg-[#FFF1F0] text-[#DC3545]"}`}>{user.active ? "ACTIVE" : "INACTIVE"}</span></span><span className="text-sm text-[#667085]">{new Date(user.created_at).toLocaleDateString()}</span></div>)}</div></section><p className="mt-4 text-xs leading-5 text-[#667085]">To grant access, create the user in Supabase Auth, then add their approved email to <code>ADMIN_EMAILS</code> or the secure <code>admin_users</code> table.</p></>;
}
