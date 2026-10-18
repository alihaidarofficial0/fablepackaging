import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited, isSameOrigin, requestIpHash } from "@/lib/request-security";

export const runtime = "nodejs";

const schema = z.object({
  packaging: z.string().trim().min(1).max(120),
  quantity: z.string().trim().min(1).max(120),
  length: z.string().trim().max(30),
  width: z.string().trim().max(30),
  height: z.string().trim().max(30),
  unit: z.string().trim().max(30),
  material: z.string().trim().max(120),
  printing: z.string().trim().max(120),
  finishes: z.array(z.string().max(80)).max(20),
  artwork: z.string().trim().max(80),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50),
  company: z.string().trim().max(160),
  notes: z.string().trim().max(5000),
  website: z.string().max(0),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const client = createAdminClient();
  if (!client) return Response.json({ error: "Quote service is not configured." }, { status: 503 });

  const body = await request.formData();
  let finishes: unknown = [];
  try { finishes = JSON.parse(String(body.get("finishes") || "[]")); } catch {}
  const parsed = schema.safeParse({
    packaging: body.get("packaging"), quantity: body.get("quantity"),
    length: body.get("length") || "", width: body.get("width") || "", height: body.get("height") || "",
    unit: body.get("unit") || "", material: body.get("material") || "", printing: body.get("printing") || "",
    finishes, artwork: body.get("artwork") || "", name: body.get("name"), email: body.get("email"),
    phone: body.get("phone") || "", company: body.get("company") || "", notes: body.get("notes") || "",
    website: body.get("website") || "",
  });
  if (!parsed.success) return Response.json({ error: "Please check the submitted details." }, { status: 400 });

  const ipHash = requestIpHash(request);
  if (await isRateLimited("quote_requests", ipHash)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const file = body.get("file");
  let artworkPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    const allowedTypes = new Set(["application/pdf", "application/zip", "image/jpeg", "image/png", "image/webp", "application/postscript"]);
    if (file.size > 25 * 1024 * 1024 || !allowedTypes.has(file.type)) {
      return Response.json({ error: "Artwork must be PDF, ZIP, EPS, JPG, PNG or WebP and under 25MB." }, { status: 400 });
    }
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    artworkPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await client.storage.from("quote-artwork").upload(artworkPath, file, { contentType: file.type, upsert: false });
    if (error) return Response.json({ error: "Artwork upload failed. Please try again." }, { status: 500 });
  }

  const { website: _website, ...payload } = parsed.data;
  const { data, error } = await client.from("quote_requests").insert({
    ...payload,
    artwork_path: artworkPath,
    ip_hash: ipHash,
  }).select("reference").single();
  if (error) {
    if (artworkPath) await client.storage.from("quote-artwork").remove([artworkPath]);
    return Response.json({ error: "We could not save your request. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true, reference: data.reference }, { status: 201 });
}
