import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { SignupForm } from "@/components/admin/SignupForm";

export const metadata = { title: "Admin sign up" };

export default async function AdminSignupPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="admin-app grid min-h-screen place-items-center bg-[#F3E8DA] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#D9D0C7] bg-white p-7 shadow-xl sm:p-9">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#D96B2B]">Fable Packaging</p>
        <h1 className="mt-3 font-serif text-4xl text-[#0B1F33]">Admin sign up</h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">Only emails approved by the site owner can create an admin account.</p>
        {hasSupabaseEnv() ? <SignupForm /> : (
          <div className="mt-7 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Supabase is not configured. Add your project keys to <code>.env.local</code> before creating an account.
          </div>
        )}
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#667085] hover:text-[#D96B2B]">Back to website</Link>
      </section>
    </div>
  );
}
