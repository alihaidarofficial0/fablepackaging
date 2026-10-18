import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited, isSameOrigin, requestIpHash } from "@/lib/request-security";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50),
  company: z.string().trim().max(160),
  country: z.string().trim().max(120),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const client = createAdminClient();
  if (!client) return Response.json({ error: "Contact service is not configured." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please check all required fields." }, { status: 400 });
  const ipHash = requestIpHash(request);
  if (await isRateLimited("contact_requests", ipHash)) return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const { website: _website, ...payload } = parsed.data;
  const { error } = await client.from("contact_requests").insert({ ...payload, ip_hash: ipHash });
  if (error) return Response.json({ error: "Message could not be saved." }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}

