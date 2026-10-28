import { ImageResponse } from "next/og";
import { getUploadedFavicon } from "@/lib/site-icon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const uploaded = await getUploadedFavicon();
  if (uploaded) {
    return new Response(uploaded.buffer, {
      headers: {
        "Content-Type": uploaded.type,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1F33",
          color: "#D96B2B",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        F
      </div>
    ),
    size,
  );
}
