import fs from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

function sanitizeFilename(filename: string): string {
  return path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function saveLocalBuffer(
  buffer: Buffer,
  filename: string,
  folder: "uploads" | "downloads" = "uploads"
): Promise<{ url: string }> {
  const safeName = sanitizeFilename(filename);
  const dir = folder === "downloads" ? DOWNLOADS_DIR : UPLOADS_DIR;
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, safeName), buffer);
  const urlPath = `/${folder}/${safeName}`;
  return { url: urlPath };
}

export async function saveUploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType?: string,
  folder: "uploads" | "downloads" = "uploads"
): Promise<{ url: string }> {
  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizeFilename(filename)}`;

  // Attempt Supabase storage first if configured
  try {
    const admin = createAdminClient() || (await createClient());
    if (admin) {
      const storagePath = `${folder}/${safeName}`;
      const { error } = await admin.storage
        .from("site-media")
        .upload(storagePath, buffer, {
          contentType: contentType || "application/octet-stream",
          upsert: true,
        });

      if (!error) {
        const { data } = admin.storage.from("site-media").getPublicUrl(storagePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl };
        }
      }
    }
  } catch (err) {
    console.warn("Supabase storage upload fallback to local disk:", err);
  }

  // Fallback to local public disk
  return saveLocalBuffer(buffer, safeName, folder);
}
