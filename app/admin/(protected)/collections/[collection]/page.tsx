import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  deleteCollectionItem,
  saveCollectionItem,
  type CollectionName,
} from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DatabaseSetupNotice } from "@/components/admin/DatabaseSetupNotice";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const collectionLabels: Record<CollectionName, string> = {
  products: "Products",
  industries: "Industries",
  projects: "Projects",
  faqs: "FAQs",
  catalog_items: "Materials & finishes",
  navigation_items: "Navigation links",
  blog_posts: "Blog posts",
  testimonials: "Testimonials",
};

const allowed = Object.keys(collectionLabels) as CollectionName[];
const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-[#D9D0C7] bg-white px-3 text-sm outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10";
const textareaClass = "mt-1.5 w-full rounded-lg border border-[#D9D0C7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D96B2B] focus:ring-4 focus:ring-[#D96B2B]/10";

type Row = Record<string, unknown>;

function ImageFields({
  item,
  optional = false,
  recommendation,
}: {
  item: Row;
  optional?: boolean;
  recommendation?: string;
}) {
  return (
    <>
      <label className="sm:col-span-2 text-sm font-bold">
        {optional ? "Optional image URL" : "Image URL"}
        <input
          name="image"
          defaultValue={String(item.image || "")}
          placeholder="/images/products/example.webp"
          className={inputClass}
        />
      </label>
      <label className="sm:col-span-2 text-sm font-bold">
        {item.image ? "Upload a replacement image" : "Upload an image"}
        <input
          name="image_file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="mt-1.5 block w-full rounded-lg border border-[#D9D0C7] bg-white p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#FFF0E2] file:px-4 file:py-2 file:font-bold file:text-[#D96B2B] hover:file:bg-[#FFE2C7]"
        />
        {recommendation ? (
          <span className="mt-2 block rounded-md border border-[#E8C9AA] bg-[#FFF8F1] px-3 py-2 text-xs font-normal leading-5 text-[#70401F]">
            <b className="font-bold">Recommended image:</b> {recommendation}
          </span>
        ) : null}
        <span className="mt-1.5 block text-xs font-normal text-[#667085]">
          JPG, PNG, WebP, AVIF, or GIF. Maximum 10 MB. A selected file replaces the URL above.
        </span>
      </label>
    </>
  );
}

function CollectionForm({ collection, item = {} }: { collection: CollectionName; item?: Row }) {
  const id = String(item.id || "");
  const action = saveCollectionItem.bind(null, collection, id);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {collection === "faqs" ? (
        <>
          <label className="sm:col-span-2 text-sm font-bold">Question<input name="question" required defaultValue={String(item.question || "")} className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Answer<textarea name="answer" required rows={5} defaultValue={String(item.answer || "")} className={textareaClass} /></label>
          <label className="text-sm font-bold">Group<select name="group_name" defaultValue={String(item.group_name || "home")} className={inputClass}><option value="home">Homepage</option><option value="quote">Quote page</option><option value="general">General</option></select></label>
          <label className="text-sm font-bold">Category<input name="category" defaultValue={String(item.category || "")} placeholder="e.g. Ordering" className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Page assignment<input name="page_assignment" defaultValue={String(item.page_assignment || item.group_name || "home")} className={inputClass} /></label>
        </>
      ) : collection === "navigation_items" ? (
        <>
          <label className="text-sm font-bold">Location<select name="location" defaultValue={String(item.location || "header_direct")} className={inputClass}><option value="header_direct">Header direct links</option><option value="design_support">Design support menu</option><option value="footer_company">Footer company</option><option value="footer_support">Footer support</option></select></label>
          <label className="text-sm font-bold">Label<input name="label" required defaultValue={String(item.label || "")} className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Link URL<input name="href" required defaultValue={String(item.href || "")} placeholder="/about" className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Description<textarea name="description" rows={3} defaultValue={String(item.description || "")} className={textareaClass} /></label>
          <ImageFields item={item} optional />
          <label className="text-sm font-bold">Parent item ID <span className="font-normal text-[#98A2B3]">(optional)</span><input name="parent_id" defaultValue={String(item.parent_id || "")} placeholder="Leave blank for top level" className={inputClass} /></label>
          <label className="flex items-end gap-2 pb-3 text-sm font-bold"><input name="open_in_new_tab" type="checkbox" defaultChecked={Boolean(item.open_in_new_tab)} className="size-4 accent-[#D96B2B]" />Open in new tab</label>
        </>
      ) : collection === "blog_posts" ? (
        <>
          <label className="sm:col-span-2 text-sm font-bold">Title<input name="title" required defaultValue={String(item.title || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={String(item.slug || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Category<input name="category" defaultValue={String(item.category || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Author<input name="author" defaultValue={String(item.author || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Publish date<input name="published_at" type="datetime-local" defaultValue={item.published_at ? new Date(String(item.published_at)).toISOString().slice(0, 16) : ""} className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Excerpt<textarea name="excerpt" rows={3} defaultValue={String(item.excerpt || "")} className={textareaClass} /></label>
          <div className="sm:col-span-2 text-sm font-bold">
            <span className="mb-1.5 block">Article content</span>
            <RichTextEditor name="content" initialContent={String(item.content || "")} />
          </div>
          <ImageFields
            item={item}
            recommendation="1600 × 900 px (16:9). Minimum 1200 × 675 px. Keep important content near the center because listing cards may crop the outer edges."
          />
          <label className="sm:col-span-2 text-sm font-bold">Image alt text<input name="alt" required defaultValue={String(item.alt || "")} className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">SEO title<input name="seo_title" maxLength={180} defaultValue={String(item.seo_title || "")} placeholder="Defaults to the article title" className={inputClass} /></label>
          <label className="sm:col-span-2 text-sm font-bold">Meta description<textarea name="seo_description" maxLength={320} rows={3} defaultValue={String(item.seo_description || "")} placeholder="Defaults to the excerpt" className={textareaClass} /></label>
        </>
      ) : collection === "testimonials" ? (
        <>
          <label className="text-sm font-bold">Customer name<input name="customer_name" required defaultValue={String(item.customer_name || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Company<input name="company" defaultValue={String(item.company || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Role<input name="role" defaultValue={String(item.role || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Rating<select name="rating" defaultValue={String(item.rating || 5)} className={inputClass}>{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></label>
          <label className="sm:col-span-2 text-sm font-bold">Quote<textarea name="quote" required rows={5} defaultValue={String(item.quote || "")} className={textareaClass} /></label>
          <ImageFields item={{ ...item, image: item.avatar }} optional />
        </>
      ) : (
        <>
          {collection === "catalog_items" ? <label className="sm:col-span-2 text-sm font-bold">Type<select name="kind" defaultValue={String(item.kind || "material")} className={inputClass}><option value="material">Material</option><option value="finish">Finish</option></select></label> : null}
          <label className="text-sm font-bold">Name<input name="name" required defaultValue={String(item.name || "")} className={inputClass} /></label>
          <label className="text-sm font-bold">Slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={String(item.slug || "")} placeholder="mailer-boxes" className={inputClass} /></label>
          {collection === "products" ? <label className="sm:col-span-2 text-sm font-bold">Subtitle<input name="subtitle" defaultValue={String(item.subtitle || "")} className={inputClass} /></label> : null}
          {collection === "products" ? <><label className="text-sm font-bold">Category<input name="category" defaultValue={String(item.category || "")} className={inputClass} /></label><label className="text-sm font-bold">Minimum order quantity<input name="moq" defaultValue={String(item.moq || "")} placeholder="e.g. 100 units" className={inputClass} /></label><label className="text-sm font-bold">Turnaround<input name="turnaround" defaultValue={String(item.turnaround || "")} placeholder="e.g. 10–15 business days" className={inputClass} /></label><label className="text-sm font-bold">Materials <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="materials" defaultValue={Array.isArray(item.materials) ? item.materials.join(", ") : ""} className={inputClass} /></label><label className="text-sm font-bold">Finishes <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="finishes" defaultValue={Array.isArray(item.finishes) ? item.finishes.join(", ") : ""} className={inputClass} /></label><label className="text-sm font-bold">Printing options <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="printing_options" defaultValue={Array.isArray(item.printing_options) ? item.printing_options.join(", ") : ""} className={inputClass} /></label></> : null}
          {collection === "products" ? <label className="sm:col-span-2 text-sm font-bold">Gallery image URLs <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="gallery" defaultValue={Array.isArray(item.gallery) ? item.gallery.join(", ") : ""} className={inputClass} /></label> : null}
          {collection === "products" ? <><label className="sm:col-span-2 text-sm font-bold">SEO title<input name="seo_title" defaultValue={String(item.seo_title || "")} className={inputClass} /></label><label className="sm:col-span-2 text-sm font-bold">Meta description<textarea name="seo_description" rows={3} defaultValue={String(item.seo_description || "")} className={textareaClass} /></label></> : null}
          {collection === "industries" ? <><label className="sm:col-span-2 text-sm font-bold">Full description<textarea name="full_description" rows={6} defaultValue={String(item.full_description || "")} className={textareaClass} /></label><label className="sm:col-span-2 text-sm font-bold">Featured product slugs <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="featured_products" defaultValue={Array.isArray(item.featured_products) ? item.featured_products.join(", ") : ""} className={inputClass} /></label></> : null}
          {collection === "industries" ? <><label className="sm:col-span-2 text-sm font-bold">SEO title<input name="seo_title" defaultValue={String(item.seo_title || "")} className={inputClass} /></label><label className="sm:col-span-2 text-sm font-bold">Meta description<textarea name="seo_description" rows={3} defaultValue={String(item.seo_description || "")} className={textareaClass} /></label></> : null}
          {collection === "projects" ? <label className="sm:col-span-2 text-sm font-bold">Category<input name="category" defaultValue={String(item.category || "")} className={inputClass} /></label> : null}
          {collection === "projects" ? <><label className="text-sm font-bold">Client / brand name<input name="client_name" defaultValue={String(item.client_name || "")} className={inputClass} /></label><label className="text-sm font-bold">Industry<input name="industry" defaultValue={String(item.industry || "")} className={inputClass} /></label><label className="sm:col-span-2 text-sm font-bold">Packaging type<input name="packaging_type" defaultValue={String(item.packaging_type || "")} className={inputClass} /></label><label className="sm:col-span-2 text-sm font-bold">Gallery image URLs <span className="font-normal text-[#98A2B3]">(comma separated)</span><input name="gallery" defaultValue={Array.isArray(item.gallery) ? item.gallery.join(", ") : ""} className={inputClass} /></label></> : null}
          <label className="sm:col-span-2 text-sm font-bold">Description<textarea name="description" rows={4} defaultValue={String(item.description || "")} className={textareaClass} /></label>
          <ImageFields item={item} />
          <label className="sm:col-span-2 text-sm font-bold">Image alt text<input name="alt" required defaultValue={String(item.alt || "")} className={inputClass} /></label>
          {collection === "products" ? <label className="text-sm font-bold">Badge<select name="badge" defaultValue={String(item.badge || "")} className={inputClass}><option value="">No badge</option><option>Popular</option><option>Luxury</option><option>Flexible</option></select></label> : null}
          {collection === "projects" ? <><label className="sm:col-span-2 text-sm font-bold">SEO title<input name="seo_title" defaultValue={String(item.seo_title || "")} className={inputClass} /></label><label className="sm:col-span-2 text-sm font-bold">SEO description<textarea name="seo_description" rows={3} defaultValue={String(item.seo_description || "")} className={textareaClass} /></label></> : null}
        </>
      )}
      <label className="text-sm font-bold">Display order<input name="sort_order" type="number" min="0" defaultValue={Number(item.sort_order || 0)} className={inputClass} /></label>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm font-bold"><input name="active" type="checkbox" defaultChecked={item.active === undefined ? true : Boolean(item.active)} className="size-4 accent-[#D96B2B]" />Published</label>
        {!['faqs','catalog_items','navigation_items','testimonials'].includes(collection) ? <label className="flex items-center gap-2 text-sm font-bold"><input name="featured" type="checkbox" defaultChecked={item.featured === undefined ? true : Boolean(item.featured)} className="size-4 accent-[#D96B2B]" />Featured</label> : null}
      </div>
      <div className="sm:col-span-2"><SubmitButton>{id ? "Save changes" : "Add item"}</SubmitButton></div>
    </form>
  );
}

export default async function CollectionPage({ params, searchParams }: { params: Promise<{ collection: string }>; searchParams: Promise<{ edit?: string; create?: string }> }) {
  await requireAdmin();
  const { collection: rawCollection } = await params;
  const { edit, create } = await searchParams;
  if (!allowed.includes(rawCollection as CollectionName)) notFound();
  const collection = rawCollection as CollectionName;
  const client = createAdminClient() || (await createClient());
  const { data, error } = client
    ? await client.from(collection).select("*").order("sort_order").order(collection === "faqs" ? "question" : collection === "navigation_items" ? "label" : collection === "blog_posts" ? "title" : collection === "testimonials" ? "customer_name" : "name")
    : { data: [], error: null };
  if (
    error &&
    (error.code === "PGRST205" ||
      error.message.includes("Could not find the table") ||
      error.message.includes("schema cache"))
  ) {
    const extensionMigrations = ["blog_posts", "testimonials"].includes(collection)
      ? [
          "supabase/migrations/202609210003_admin_cms_extensions.sql",
          "supabase/migrations/202609210004_content_editor_fields.sql",
        ]
      : undefined;
    return <DatabaseSetupNotice migrations={extensionMigrations} />;
  }
  if (error) throw new Error(error.message);

  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Content collection</p>
      <h1 className="mt-2 font-serif text-4xl">{collectionLabels[collection]}</h1>
      <p className="mt-3 text-sm text-[#667085]">Add, edit, publish, reorder, or remove records. Published changes appear on the website automatically.</p>

      <details className="mt-7 rounded-xl border border-[#D96B2B]/30 bg-[#FFF8F1] p-5" open={create === "1" || !data?.length}>
        <summary className="cursor-pointer font-bold text-[#D96B2B]">+ Add new</summary>
        <div className="mt-5"><CollectionForm collection={collection} /></div>
      </details>

      <div className="mt-6 space-y-3">
        {(data || []).map((row) => {
          const item = row as Row;
          const id = String(item.id);
          const title = String(item.name || item.title || item.customer_name || item.question || item.label || "Untitled");
          return (
            <details key={id} className="rounded-xl border border-[#E7DDD2] bg-white p-5" open={edit === id}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span><b className="block">{title}</b><span className="mt-1 block text-xs text-[#667085]">{item.active ? "Published" : "Draft"} · order {String(item.sort_order || 0)}</span></span>
                <span className="text-sm font-bold text-[#D96B2B]">Edit</span>
              </summary>
              <div className="mt-6 border-t border-[#EEE8E1] pt-6"><CollectionForm collection={collection} item={item} /></div>
              <form action={deleteCollectionItem.bind(null, collection, id)} className="mt-5 border-t border-[#EEE8E1] pt-5">
                <DeleteButton />
              </form>
            </details>
          );
        })}
      </div>
    </>
  );
}
