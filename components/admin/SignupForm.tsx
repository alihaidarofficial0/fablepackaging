"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type AuthState } from "@/app/admin/actions";

const initialState: AuthState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-[#0B1F33]">
        Approved email
        <input name="email" type="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-lg border border-[#D9D0C7] px-4 font-normal outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10" />
      </label>
      <label className="block text-sm font-bold text-[#0B1F33]">
        Password
        <input name="password" type="password" required minLength={12} autoComplete="new-password" className="mt-2 h-12 w-full rounded-lg border border-[#D9D0C7] px-4 font-normal outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10" />
      </label>
      <label className="block text-sm font-bold text-[#0B1F33]">
        Confirm password
        <input name="confirmPassword" type="password" required minLength={12} autoComplete="new-password" className="mt-2 h-12 w-full rounded-lg border border-[#D9D0C7] px-4 font-normal outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10" />
      </label>
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p> : null}
      {state.success ? <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{state.success}</p> : null}
      <button type="submit" disabled={pending} className="h-12 w-full rounded-lg bg-[#D96B2B] font-bold text-white transition-colors hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-2 disabled:opacity-60">
        {pending ? "Creating account…" : "Create admin account"}
      </button>
      <p className="text-center text-sm text-[#667085]">Already have access? <Link href="/admin/login" className="font-bold text-[#D96B2B] hover:text-[#BC5420]">Sign in</Link></p>
    </form>
  );
}
