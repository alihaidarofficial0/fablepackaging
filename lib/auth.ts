import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function allowedEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * A public admin sign-in screen must remain available even if the auth service
 * is temporarily slow or unreachable. Protected routes still fail closed via
 * `requireAdmin`, while this prevents the entire preview from hanging.
 */
async function getClaimsWithTimeout(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>) {
  return Promise.race([
    supabase.auth.getClaims(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Admin authentication check timed out.")), 2500);
    }),
  ]);
}

export const getAdmin = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  let authResult: Awaited<ReturnType<typeof supabase.auth.getClaims>>;
  try {
    authResult = await getClaimsWithTimeout(supabase);
  } catch {
    return null;
  }

  const { data, error } = authResult;
  const claims = data?.claims;
  if (error || !claims?.sub) return null;

  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  if (email && allowedEmails().has(email)) {
    return { id: claims.sub, email, role: "owner" as const };
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id,email,role,active")
    .eq("user_id", claims.sub)
    .eq("active", true)
    .maybeSingle();

  if (!admin) return null;
  return {
    id: admin.user_id as string,
    email: admin.email as string,
    role: (admin.role || "editor") as "owner" | "editor",
  };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

