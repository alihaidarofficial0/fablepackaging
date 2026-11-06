import { NextResponse } from "next/server";
import {
  saveUploadBuffer,
  saveUploadBufferWithSlug,
  renameUploadAsset,
  deleteUploadAsset,
} from "@/lib/uploadsServer";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    // Optional: admin-supplied image slug/name
    const rawSlug = String(formData.get("slug") || formData.get("image_name") || "").trim();
    // Optional: storage sub-folder (e.g. "collections/products")
    const folder = String(formData.get("folder") || "uploads").replace(/^\/+|\/+$/g, "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedName = /\.(png|jpe?g|webp|gif|avif|svg|ico)$/i.test(file.name);
    if (!file.type.startsWith("image/") && !allowedName) {
      return NextResponse.json({ error: "Only image files (JPG, PNG, WebP, SVG, ICO) are allowed." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be under 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (rawSlug) {
      // Upload with the admin-chosen slug as the exact filename
      const { url, storagePath } = await saveUploadBufferWithSlug(
        buffer,
        rawSlug,
        file.name,
        file.type,
        folder
      );
      return NextResponse.json({ url, imageUrl: url, storagePath, success: true });
    }

    // No slug — fall back to timestamped name
    const { url } = await saveUploadBuffer(buffer, file.name, file.type, "uploads");
    return NextResponse.json({ url, imageUrl: url, success: true });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/upload
 * Body: { url, slug, folder? }
 * Sets exact image slug / name on storage and returns the updated URL.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : "";
    const slug = typeof body?.slug === "string" ? body.slug : "";
    const folder = typeof body?.folder === "string" ? body.folder : "uploads";

    if (!url || !slug) {
      return NextResponse.json(
        { error: "url and slug are required" },
        { status: 400 }
      );
    }

    const renamed = await renameUploadAsset({
      url,
      slug,
      folder,
    });

    return NextResponse.json({
      url: renamed.url,
      imageUrl: renamed.url,
      storagePath: renamed.storagePath,
      success: true,
    });
  } catch (error) {
    console.error("Apply slug failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Apply slug failed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Body: { url: string }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : "";

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    await deleteUploadAsset(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete asset failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
