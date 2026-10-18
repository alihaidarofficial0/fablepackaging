import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const client = createAdminClient();
  if (!client) return Response.json({ error: "Newsletter is not configured." }, { status: 503 });
  const parsed = z.object({ email: z.string().trim().email().max(254) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter a valid email." }, { status: 400 });
  const { error } = await client.from("subscribers").upsert({ email: parsed.data.email.toLowerCase(), active: true }, { onConflict: "email" });
  if (error) return Response.json({ error: "Subscription could not be saved." }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}

