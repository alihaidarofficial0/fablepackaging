import fs from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";



const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

function sanitizeFilename(filename: string): string {
  return path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "-");
}

/**
 * Converts a string to a URL-safe slug (lowercase, hyphens only).
 * Strips the extension before slugifying so callers can pass a plain name.
 */
export function slugifyFilename(name: string): string {
  return name
    .replace(/\.[a-z0-9]{2,5}$/i, "") // strip extension
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns the file extension (without dot) from a filename or MIME type.
 */
function guessExtension(filename: string, contentType?: string): string {
  const fromName = filename.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase();
  if (fromName) return fromName;
  const mime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "image/x-icon": "ico",
  };
  return (contentType && mime[contentType]) || "bin";
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

/**
 * Upload a buffer with an admin-chosen slug as the filename.
 * The stored path becomes: `{supabaseFolder}/{slug}.{ext}` (upsert = true so
 * uploading the same slug replaces the previous file).
 *
 * Falls back to local disk when Supabase is unavailable.
 *
 * @param buffer     Raw file bytes
 * @param slug       Admin-supplied name (will be slugified)
 * @param filename   Original filename – used only to derive the extension
 * @param contentType  MIME type (also used as extension fallback)
 * @param supabaseFolder  Supabase storage sub-folder (e.g. "collections/products")
 */
export async function saveUploadBufferWithSlug(
  buffer: Buffer,
  slug: string,
  filename: string,
  contentType?: string,
  supabaseFolder = "uploads"
): Promise<{ url: string; storagePath: string }> {
  const cleanSlug = slugifyFilename(slug);
  if (!cleanSlug) throw new Error("Image name (slug) must not be empty after sanitization.");

  const ext = guessExtension(filename, contentType);
  const namedFile = `${cleanSlug}.${ext}`;
  const storagePath = `${supabaseFolder}/${namedFile}`;

  // Supabase first
  try {
    const admin = createAdminClient() || (await createClient());
    if (admin) {
      const { error } = await admin.storage
        .from("site-media")
        .upload(storagePath, buffer, {
          contentType: contentType || "application/octet-stream",
          upsert: true, // replace if same slug already exists
        });

      if (!error) {
        const { data } = admin.storage.from("site-media").getPublicUrl(storagePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl, storagePath };
        }
      }
    }
  } catch (err) {
    console.warn("Supabase slug upload fallback to local disk:", err);
  }

  // Local fallback: write to public/uploads/{namedFile}
  const { url } = await saveLocalBuffer(buffer, namedFile, "uploads");
  return { url, storagePath: `uploads/${namedFile}` };
}

export function extractStoragePath(url: string): { type: "supabase" | "local" | "external"; path: string; ext: string } {
  if (!url) return { type: "external", path: "", ext: "webp" };

  const supabaseMarker = "/storage/v1/object/public/site-media/";
  const markerIdx = url.indexOf(supabaseMarker);
  if (markerIdx !== -1) {
    const rawPath = url.slice(markerIdx + supabaseMarker.length).split("?")[0];
    const ext = rawPath.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase() || "webp";
    return { type: "supabase", path: rawPath, ext };
  }

  if (url.startsWith("/uploads/") || url.startsWith("/downloads/")) {
    const rawPath = url.replace(/^\/+/, "").split("?")[0];
    const ext = rawPath.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase() || "webp";
    return { type: "local", path: rawPath, ext };
  }

  const ext = url.split("?")[0].match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase() || "webp";
  return { type: "external", path: url, ext };
}

export async function renameUploadAsset({
  url,
  slug,
  folder = "uploads",
}: {
  url: string;
  slug: string;
  folder?: string;
}): Promise<{ url: string; storagePath: string }> {
  const cleanSlug = slugifyFilename(slug);
  if (!cleanSlug) throw new Error("Image name (slug) is required.");

  const info = extractStoragePath(url);
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const targetFilename = `${cleanSlug}.${info.ext}`;
  const targetPath = `${cleanFolder}/${targetFilename}`;

  // 1. Supabase first
  try {
    const admin = createAdminClient() || (await createClient());
    if (admin) {
      if (info.type === "supabase") {
        if (info.path === targetPath) {
          const { data } = admin.storage.from("site-media").getPublicUrl(targetPath);
          return { url: data.publicUrl, storagePath: targetPath };
        }

        const { data: fileData, error: downloadErr } = await admin.storage
          .from("site-media")
          .download(info.path);

        if (!downloadErr && fileData) {
          const buf = Buffer.from(await fileData.arrayBuffer());
          const { error: uploadErr } = await admin.storage
            .from("site-media")
            .upload(targetPath, buf, {
              upsert: true,
              contentType: fileData.type || "application/octet-stream",
            });
          if (!uploadErr) {
            const { data } = admin.storage.from("site-media").getPublicUrl(targetPath);
            return { url: data.publicUrl, storagePath: targetPath };
          }
        }
      } else if (info.type === "local") {
        const localFilePath = path.join(process.cwd(), "public", info.path);
        try {
          const buf = await fs.readFile(localFilePath);
          const { error: uploadErr } = await admin.storage
            .from("site-media")
            .upload(targetPath, buf, { upsert: true });
          if (!uploadErr) {
            const { data } = admin.storage.from("site-media").getPublicUrl(targetPath);
            return { url: data.publicUrl, storagePath: targetPath };
          }
        } catch {}
      }
    }
  } catch (err) {
    console.warn("Supabase rename error, falling back to local:", err);
  }

  // 2. Local fallback
  const localTargetDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(localTargetDir, { recursive: true });
  const localTargetPath = path.join(localTargetDir, targetFilename);

  if (info.type === "local") {
    const localSourcePath = path.join(process.cwd(), "public", info.path);
    try {
      await fs.copyFile(localSourcePath, localTargetPath);
      return { url: `/uploads/${targetFilename}`, storagePath: `uploads/${targetFilename}` };
    } catch {}
  }

  // If source was external or supabase URL, fetch and save locally
  try {
    const res = await fetch(url);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      await fs.writeFile(localTargetPath, Buffer.from(arrayBuffer));
      return { url: `/uploads/${targetFilename}`, storagePath: `uploads/${targetFilename}` };
    }
  } catch {}

  throw new Error("Could not apply image name to the specified URL.");
}

export async function deleteUploadAsset(url: string): Promise<void> {
  const info = extractStoragePath(url);
  if (info.type === "supabase") {
    const admin = createAdminClient() || (await createClient());
    if (admin) {
      await admin.storage.from("site-media").remove([info.path]);
    }
  } else if (info.type === "local") {
    const localPath = path.join(process.cwd(), "public", info.path);
    await fs.unlink(localPath).catch(() => {});
  }
}
