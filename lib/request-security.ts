import "server-only";

import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = new Set<string>();
  allowed.add(new URL(request.url).origin);
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try { allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin); } catch {}
  }
  return allowed.has(origin);
}

export function requestIpHash(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const salt = process.env.REQUEST_HASH_SALT || process.env.SUPABASE_SECRET_KEY || "fable-request";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function isRateLimited(
  table: "quote_requests" | "contact_requests",
  ipHash: string,
  limit = 5,
) {
  const client = createAdminClient();
  if (!client) return false;
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await client
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  return (count || 0) >= limit;
}

