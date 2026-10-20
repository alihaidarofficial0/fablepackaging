import { NextResponse } from "next/server";
import { saveUploadBuffer } from "@/lib/uploadsServer";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File must be under 50MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { url } = await saveUploadBuffer(buffer, file.name, file.type, "downloads");

    return NextResponse.json({ url, fileUrl: url, name: file.name, success: true });
  } catch (error) {
    console.error("File Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
