import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdmin } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <div className="admin-app grid min-h-screen place-items-center bg-[#F3E8DA] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#D9D0C7] bg-white p-7 shadow-xl sm:p-9">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#D96B2B]">Fable Packaging</p>
        <h1 className="mt-3 font-serif text-4xl text-[#0B1F33]">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">Only invited administrators can access website content and customer inquiries.</p>
        {hasSupabaseEnv() ? <LoginForm /> : (
          <div className="mt-7 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and add your project keys.
          </div>
        )}
        <p className="mt-5 text-center text-sm text-[#667085]">Approved but new here? <Link href="/admin/signup" className="font-bold text-[#D96B2B] hover:text-[#BC5420]">Sign up</Link></p>
      </section>
    </div>
  );
}
