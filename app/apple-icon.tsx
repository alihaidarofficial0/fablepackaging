import { ImageResponse } from "next/og";
import { absoluteAssetUrl } from "@/lib/site-icon";
import { getSiteSettings } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const { favicon_url } = await getSiteSettings();

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
        }}
      >
        {favicon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={absoluteAssetUrl(favicon_url)}
            width={180}
            height={180}
            alt=""
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              color: "#D96B2B",
              fontSize: 92,
              fontWeight: 700,
            }}
          >
            F
          </div>
        )}
      </div>
    ),
    size,
  );
}
