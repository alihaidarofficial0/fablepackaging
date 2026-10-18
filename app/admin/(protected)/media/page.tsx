import { Upload } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { uploadSiteMedia } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MediaLibraryGrid, type MediaFile } from "@/components/admin/MediaLibraryGrid";

export default async function MediaPage() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  const { data: folders } = client ? await client.storage.from("site-media").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } }) : { data: [] };
  const files: MediaFile[] = [];
  if (client) for (const entry of folders || []) {
    if (entry.id) files.push({ name: entry.name, path: entry.name, url: client.storage.from("site-media").getPublicUrl(entry.name).data.publicUrl, size: Number(entry.metadata?.size || 0), createdAt: entry.created_at || undefined });
    else {
      const { data: nested } = await client.storage.from("site-media").list(entry.name, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      for (const item of nested || []) if (item.id) {
        const path = `${entry.name}/${item.name}`;
        files.push({ name: item.name, path, url: client.storage.from("site-media").getPublicUrl(path).data.publicUrl, size: Number(item.metadata?.size || 0), createdAt: item.created_at || undefined });
      }
    }
  }
  return <><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Storage</p><h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">Media library</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">Upload, find, copy and remove website images from your Supabase media library.</p></div><form action={uploadSiteMedia} className="mt-7 flex flex-col gap-3 rounded-xl border border-[#E7DDD2] bg-white p-5 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-bold text-[#0B1F33]">Upload image <span className="font-normal text-[#98A2B3]">(JPG, PNG, WebP, AVIF or GIF · max 10 MB)</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" required className="mt-2 block w-full rounded-lg border border-[#E7DDD2] bg-[#FFFDF9] p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#FFF4E9] file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-[#D96B2B]" /></label><SubmitButton><span className="inline-flex items-center gap-2"><Upload className="size-4" />Upload image</span></SubmitButton></form><MediaLibraryGrid files={files} /></>;
}
