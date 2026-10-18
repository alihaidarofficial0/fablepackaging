"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/admin/actions";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-[#0B1F33]">
        Email
        <input name="email" type="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-lg border border-[#D9D0C7] px-4 font-normal outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10" />
      </label>
      <label className="block text-sm font-bold text-[#0B1F33]">
        Password
        <input name="password" type="password" required minLength={8} autoComplete="current-password" className="mt-2 h-12 w-full rounded-lg border border-[#D9D0C7] px-4 font-normal outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10" />
      </label>
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p> : null}
      <button disabled={pending} className="h-12 w-full rounded-lg bg-[#D96B2B] font-bold text-white hover:bg-[#BC5420] disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}

