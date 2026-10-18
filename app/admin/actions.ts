"use server";

import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { homepageSectionDefinitions, type HomepageSection } from "@/lib/admin-homepage";
import { sanitizeBlogContent } from "@/lib/blog-content";

export type AuthState = { error?: string; success?: string };
export type CollectionName = "products" | "industries" | "projects" | "faqs" | "catalog_items" | "navigation_items" | "blog_posts" | "testimonials";

const emailSchema = z.string().trim().email().max(254);
const slugSchema = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);
const SLUG_COLLECTIONS = new Set<CollectionName>([
  "products",
  "industries",
  "projects",
  "catalog_items",
  "blog_posts",
]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function flag(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function commaList(formData: FormData, key: string) {
  return text(formData, key).split(",").map((value) => value.trim()).filter(Boolean).slice(0, 30);
}

async function mutationClient() {
  await requireAdmin();
  const client = createAdminClient() || (await createClient());
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

function slugWithSuffix(base: string, suffix: number) {
  const ending = suffix === 1 ? "" : `-${suffix}`;
  const availableLength = 100 - ending.length;
  return `${base.slice(0, availableLength).replace(/-+$/g, "")}${ending}`;
}

async function getAvailableSlug(
  client: SupabaseClient,
  collection: CollectionName,
  requestedSlug: string,
  currentId?: string,
) {
  for (let suffix = 1; suffix <= 1000; suffix += 1) {
    const candidate = slugWithSuffix(requestedSlug, suffix);
    const { data, error } = await client
      .from(collection)
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data || (currentId && String(data.id) === currentId)) return candidate;
  }

  throw new Error("A unique URL slug could not be generated. Please enter a different slug.");
}

function validateImageFile(file: File) {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("The image must be smaller than 10 MB.");
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload a JPG, PNG, WebP, AVIF, or GIF image.");
  }
}

async function uploadAdminImage(client: SupabaseClient, file: File, folder: string) {
  validateImageFile(file);
  const normalizedName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const safeName = normalizedName.replace(/^-+|-+$/g, "").slice(-120) || "image";
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await client.storage
    .from("site-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = client.storage.from("site-media").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function audit(action: string, entity: string, entityId?: string) {
  const admin = await requireAdmin();
  const client = createAdminClient() || (await createClient());
  if (!client) return;
  await client.from("audit_logs").insert({
    admin_user_id: admin.id,
    action,
    entity,
    entity_id: entityId || null,
  });
}

export async function loginAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z
    .object({ email: emailSchema, password: z.string().min(8).max(128) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email address and password." };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase environment variables are not configured." };
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const serviceUnavailable =
      error.status === 0 ||
      /fetch failed|failed to fetch|network/i.test(error.message);

    if (serviceUnavailable) {
      return { error: "The authentication service is unavailable. Check the Supabase project configuration and try again." };
    }

    return { error: "The email address or password is incorrect." };
  }
  if (!data.user) return { error: "The email address or password is incorrect." };

  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase());
  const allowedByEnv = allowlist.includes(parsed.data.email.toLowerCase());
  const { data: admin } = await supabase
    .from("admin_users")
    .select("active")
    .eq("user_id", data.user.id)
    .eq("active", true)
    .maybeSingle();

  if (!allowedByEnv && !admin) {
    await supabase.auth.signOut();
    return { error: "This account does not have administrator access." };
  }
  redirect("/admin");
}

export async function signupAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z.object({
    email: emailSchema,
    password: z.string().min(12).max(128),
    confirmPassword: z.string(),
  }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return { error: "Enter a valid email and a password of at least 12 characters." };
  if (parsed.data.password !== parsed.data.confirmPassword) return { error: "Passwords do not match." };

  const email = parsed.data.email.toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .some((value) => value.trim().toLowerCase() === email);
  if (!allowed) return { error: "This email is not approved for an admin account. Ask the site owner for access." };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase environment variables are not configured." };

  const { data, error } = await supabase.auth.signUp({ email, password: parsed.data.password });
  if (error) return { error: "Registration could not be completed. Please try signing in or contact the site owner." };
  if (data.session) redirect("/admin");

  return { success: "Check your email to confirm your account, then sign in." };
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveCollectionItem(
  collection: CollectionName,
  id: string,
  formData: FormData,
) {
  const client = await mutationClient();
  let payload: Record<string, unknown>;

  if (collection === "products") {
    payload = {
      name: z.string().min(2).max(120).parse(text(formData, "name")),
      slug: slugSchema.parse(text(formData, "slug")),
      subtitle: z.string().max(180).parse(text(formData, "subtitle")),
      description: z.string().max(4000).parse(text(formData, "description")),
      category: z.string().max(120).parse(text(formData, "category")),
      moq: z.string().max(120).parse(text(formData, "moq")),
      turnaround: z.string().max(120).parse(text(formData, "turnaround")),
      materials: commaList(formData, "materials"),
      finishes: commaList(formData, "finishes"),
      printing_options: commaList(formData, "printing_options"),
      gallery: commaList(formData, "gallery"),
      image: text(formData, "image"),
      alt: z.string().min(2).max(250).parse(text(formData, "alt")),
      badge: text(formData, "badge") || null,
      seo_title: z.string().max(180).parse(text(formData, "seo_title")) || null,
      seo_description: z.string().max(320).parse(text(formData, "seo_description")) || null,
      active: flag(formData, "active"),
      featured: flag(formData, "featured"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "industries") {
    payload = {
      name: z.string().min(2).max(120).parse(text(formData, "name")),
      slug: slugSchema.parse(text(formData, "slug")),
      description: z.string().max(4000).parse(text(formData, "description")),
      full_description: z.string().max(10000).parse(text(formData, "full_description")),
      featured_products: commaList(formData, "featured_products"),
      seo_title: z.string().max(180).parse(text(formData, "seo_title")) || null,
      seo_description: z.string().max(320).parse(text(formData, "seo_description")) || null,
      image: text(formData, "image"),
      alt: z.string().min(2).max(250).parse(text(formData, "alt")),
      active: flag(formData, "active"),
      featured: flag(formData, "featured"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "projects") {
    payload = {
      name: z.string().min(2).max(120).parse(text(formData, "name")),
      slug: slugSchema.parse(text(formData, "slug")),
      category: z.string().max(120).parse(text(formData, "category")),
      description: z.string().max(4000).parse(text(formData, "description")),
      client_name: z.string().max(160).parse(text(formData, "client_name")),
      industry: z.string().max(120).parse(text(formData, "industry")),
      packaging_type: z.string().max(160).parse(text(formData, "packaging_type")),
      gallery: commaList(formData, "gallery"),
      seo_title: z.string().max(180).parse(text(formData, "seo_title")) || null,
      seo_description: z.string().max(320).parse(text(formData, "seo_description")) || null,
      image: text(formData, "image"),
      alt: z.string().min(2).max(250).parse(text(formData, "alt")),
      active: flag(formData, "active"),
      featured: flag(formData, "featured"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "catalog_items") {
    payload = {
      kind: z.enum(["material", "finish"]).parse(text(formData, "kind")),
      name: z.string().min(2).max(120).parse(text(formData, "name")),
      slug: slugSchema.parse(text(formData, "slug")),
      description: z.string().max(4000).parse(text(formData, "description")),
      image: text(formData, "image"),
      alt: z.string().min(2).max(250).parse(text(formData, "alt")),
      active: flag(formData, "active"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "navigation_items") {
    payload = {
      location: z.enum(["header_direct", "design_support", "footer_company", "footer_support"]).parse(text(formData, "location")),
      label: z.string().min(2).max(120).parse(text(formData, "label")),
      href: z.string().min(1).max(1000).refine((value) => value.startsWith("/") || value.startsWith("https://")).parse(text(formData, "href")),
      description: z.string().max(500).parse(text(formData, "description")),
      image: text(formData, "image"),
      parent_id: text(formData, "parent_id") ? z.string().uuid().parse(text(formData, "parent_id")) : null,
      open_in_new_tab: flag(formData, "open_in_new_tab"),
      active: flag(formData, "active"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "blog_posts") {
    payload = {
      title: z.string().min(2).max(180).parse(text(formData, "title")),
      slug: slugSchema.parse(text(formData, "slug")),
      excerpt: z.string().max(600).parse(text(formData, "excerpt")),
      content: sanitizeBlogContent(z.string().max(100000).parse(text(formData, "content"))),
      category: z.string().max(100).parse(text(formData, "category")),
      author: z.string().max(120).parse(text(formData, "author")),
      image: text(formData, "image"),
      alt: z.string().min(2).max(250).parse(text(formData, "alt")),
      active: flag(formData, "active"),
      featured: flag(formData, "featured"),
      published_at: text(formData, "published_at") || null,
      seo_title: z.string().max(180).parse(text(formData, "seo_title")) || null,
      seo_description: z.string().max(320).parse(text(formData, "seo_description")) || null,
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else if (collection === "testimonials") {
    payload = {
      customer_name: z.string().min(2).max(120).parse(text(formData, "customer_name")),
      company: z.string().max(160).parse(text(formData, "company")),
      role: z.string().max(160).parse(text(formData, "role")),
      quote: z.string().min(5).max(5000).parse(text(formData, "quote")),
      rating: z.coerce.number().int().min(1).max(5).parse(formData.get("rating") || 5),
      avatar: text(formData, "image"),
      active: flag(formData, "active"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  } else {
    payload = {
      question: z.string().min(5).max(500).parse(text(formData, "question")),
      answer: z.string().min(5).max(5000).parse(text(formData, "answer")),
      group_name: z.enum(["home", "quote", "general"]).parse(text(formData, "group_name")),
      category: z.string().max(120).parse(text(formData, "category")),
      page_assignment: z.string().max(120).parse(text(formData, "page_assignment")) || "home",
      active: flag(formData, "active"),
      sort_order: z.coerce.number().int().min(0).max(10000).parse(formData.get("sort_order") || 0),
    };
  }

  if (SLUG_COLLECTIONS.has(collection) && typeof payload.slug === "string") {
    payload.slug = await getAvailableSlug(client, collection, payload.slug, id || undefined);
  }

  let uploadedImage: { path: string; url: string } | null = null;
  if (collection !== "faqs") {
    const imageFile = formData.get("image_file");
    if (imageFile instanceof File && imageFile.size > 0) {
      uploadedImage = await uploadAdminImage(client, imageFile, `collections/${collection}`);
      if (collection === "testimonials") payload.avatar = uploadedImage.url;
      else payload.image = uploadedImage.url;
    }

    if (collection === "testimonials") {
      payload.avatar = z.string().max(1000).parse(payload.avatar);
    } else payload.image = collection === "navigation_items"
      ? z.string().max(1000).parse(payload.image)
      : z.string().min(1, "Enter an image URL or upload an image.").max(1000).parse(payload.image);
  }

  const save = () => {
    const query = id
      ? client.from(collection).update(payload).eq("id", id)
      : client.from(collection).insert(payload);
    return query.select("id").single();
  };

  let { data, error } = await save();
  if (
    error?.code === "23505" &&
    SLUG_COLLECTIONS.has(collection) &&
    typeof payload.slug === "string" &&
    error.message.includes("slug")
  ) {
    payload.slug = await getAvailableSlug(client, collection, payload.slug, id || undefined);
    ({ data, error } = await save());
  }
  if (error) {
    if (uploadedImage) {
      await client.storage.from("site-media").remove([uploadedImage.path]);
    }
    throw new Error(error.message);
  }
  if (uploadedImage) await audit("upload", "site-media", uploadedImage.path);
  await audit(id ? "update" : "create", collection, String(data?.id));
  revalidatePath("/", "layout");
  revalidatePath(`/admin/collections/${collection}`);
  if (collection === "blog_posts") revalidatePath("/admin/blog");
}

export async function deleteCollectionItem(collection: CollectionName, id: string) {
  const validId = z.string().uuid().parse(id);
  const client = await mutationClient();
  const { error } = await client.from(collection).delete().eq("id", validId);
  if (error) throw new Error(error.message);
  await audit("delete", collection, validId);
  revalidatePath("/", "layout");
  revalidatePath(`/admin/collections/${collection}`);
}

export async function duplicateCollectionItem(collection: CollectionName, id: string) {
  if (!(["products", "industries", "projects", "catalog_items", "navigation_items", "blog_posts", "testimonials"] as CollectionName[]).includes(collection)) {
    throw new Error("This collection cannot be duplicated.");
  }
  const client = await mutationClient();
  const validId = z.string().uuid().parse(id);
  const { data: existing, error: readError } = await client.from(collection).select("*").eq("id", validId).single();
  if (readError || !existing) throw new Error(readError?.message || "Record not found.");
  const copy = { ...existing } as Record<string, unknown>;
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  copy.active = false;
  copy.sort_order = Number(copy.sort_order || 0) + 1;
  if (typeof copy.name === "string") copy.name = `${copy.name} (copy)`;
  if (typeof copy.title === "string") copy.title = `${copy.title} (copy)`;
  if (typeof copy.label === "string") copy.label = `${copy.label} (copy)`;
  if (typeof copy.slug === "string") copy.slug = `${copy.slug}-copy-${crypto.randomUUID().slice(0, 6)}`;
  const { data, error } = await client.from(collection).insert(copy).select("id").single();
  if (error) throw new Error(error.message);
  await audit("duplicate", collection, String(data.id));
  revalidatePath(`/admin/collections/${collection}`);
  revalidatePath(`/admin/${collection === "blog_posts" ? "blog" : collection}`);
}

export async function savePageContent(id: string, formData: FormData) {
  const client = await mutationClient();
  const value = z.string().max(10000).parse(formData.get("value"));
  const { error } = await client.from("page_content").update({ value }).eq("id", z.string().uuid().parse(id));
  if (error) throw new Error(error.message);
  await audit("update", "page_content", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}

export async function saveSiteSettings(formData: FormData) {
  const client = await mutationClient();
  const { data: current } = await client.from("site_settings").select("value").eq("key", "general").maybeSingle();
  const value = {
    company_name: z.string().min(2).max(120).parse(text(formData, "company_name")),
    email: emailSchema.parse(text(formData, "email")),
    phone: z.string().max(50).parse(text(formData, "phone")),
    phone_href: z.string().max(30).parse(text(formData, "phone_href")),
    address: z.string().max(500).parse(text(formData, "address")),
    facebook: z.string().max(1000).parse(text(formData, "facebook")),
    instagram: z.string().max(1000).parse(text(formData, "instagram")),
    linkedin: z.string().max(1000).parse(text(formData, "linkedin")),
    youtube: z.string().max(1000).parse(text(formData, "youtube")),
    tagline: z.string().max(500).parse(text(formData, "tagline")),
    newsletter_title: z.string().max(200).parse(text(formData, "newsletter_title")),
    newsletter_body: z.string().max(500).parse(text(formData, "newsletter_body")),
    copyright_text: z.string().max(200).parse(text(formData, "copyright_text")),
  };
  const { error } = await client.from("site_settings").upsert({ key: "general", value: { ...((current?.value || {}) as Record<string, unknown>), ...value } });
  if (error) throw new Error(error.message);
  await audit("update", "site_settings", "general");
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}

export async function saveHomepageSection(section: HomepageSection, formData: FormData) {
  const client = await mutationClient();
  const definition = homepageSectionDefinitions[section];
  const fields = definition.fields;
  const rows = fields.map(([content_key, label, input_type], index) => ({
    page_slug: "home",
    content_key,
    label,
    input_type,
    sort_order: 1000 + index,
    value: z.string().max(10000).parse(text(formData, content_key)),
  }));
  const { error } = await client.from("page_content").upsert(rows, { onConflict: "page_slug,content_key" });
  if (error) throw new Error(error.message);

  const { data: visibilityRow } = await client.from("site_settings").select("value").eq("key", "home_section_visibility").maybeSingle();
  const visibility = { ...((visibilityRow?.value || {}) as Record<string, boolean>), [section]: flag(formData, "enabled") };
  const { error: visibilityError } = await client.from("site_settings").upsert({ key: "home_section_visibility", value: visibility });
  if (visibilityError) throw new Error(visibilityError.message);
  await audit("update", "homepage_section", section);
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages/home");
}

export async function saveHeaderSettings(formData: FormData) {
  const client = await mutationClient();
  const { data: current } = await client.from("site_settings").select("value").eq("key", "general").maybeSingle();
  const header = {
    announcement_enabled: flag(formData, "announcement_enabled"),
    announcement_item_1: z.string().max(100).parse(text(formData, "announcement_item_1")),
    announcement_item_2: z.string().max(100).parse(text(formData, "announcement_item_2")),
    announcement_item_3: z.string().max(100).parse(text(formData, "announcement_item_3")),
    currency: z.string().min(3).max(8).parse(text(formData, "currency")),
    brand_descriptor: z.string().max(80).parse(text(formData, "brand_descriptor")),
    header_cta_label: z.string().min(2).max(80).parse(text(formData, "header_cta_label")),
    header_cta_href: z.string().min(1).max(1000).parse(text(formData, "header_cta_href")),
    logo_url: z.string().max(1000).parse(text(formData, "logo_url")),
  };
  const { error } = await client.from("site_settings").upsert({ key: "general", value: { ...((current?.value || {}) as Record<string, unknown>), ...header } });
  if (error) throw new Error(error.message);
  await audit("update", "header", "general");
  revalidatePath("/", "layout");
  revalidatePath("/admin/header");
}

export async function saveSeoSettings(formData: FormData) {
  const client = await mutationClient();
  const value = {
    default_title: z.string().min(2).max(180).parse(text(formData, "default_title")),
    default_description: z.string().min(10).max(320).parse(text(formData, "default_description")),
    og_image: z.string().max(1000).parse(text(formData, "og_image")),
    site_url: z.string().url().max(1000).parse(text(formData, "site_url")),
    allow_indexing: flag(formData, "allow_indexing"),
  };
  const { error } = await client.from("site_settings").upsert({ key: "seo", value });
  if (error) throw new Error(error.message);
  await audit("update", "seo_settings", "seo");
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");
}

export async function updateLeadStatus(table: "quote_requests" | "contact_requests", id: string, formData: FormData) {
  const client = await mutationClient();
  const allowed = table === "quote_requests"
    ? ["new", "contacted", "quoted", "won", "lost", "spam"]
    : ["new", "contacted", "closed", "spam"];
  const status = z.string().refine((value) => allowed.includes(value)).parse(formData.get("status"));
  const internal_notes = z.string().max(5000).parse(formData.get("internal_notes") || "");
  const validId = z.string().uuid().parse(id);
  const { error } = await client.from(table).update({ status, internal_notes }).eq("id", validId);
  if (error) throw new Error(error.message);
  await audit("status", table, validId);
  revalidatePath("/admin/leads");
}

export async function uploadSiteMedia(formData: FormData) {
  const client = await mutationClient();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Select a file to upload.");
  const uploadedImage = await uploadAdminImage(client, file, "library");
  await audit("upload", "site-media", uploadedImage.path);
  revalidatePath("/admin/media");
}

export async function deleteSiteMedia(formData: FormData) {
  const client = await mutationClient();
  const path = z.string().min(1).max(1000).refine((value) => !value.includes("..") && !value.startsWith("/")).parse(formData.get("path"));
  const { error } = await client.storage.from("site-media").remove([path]);
  if (error) throw new Error(error.message);
  await audit("delete", "site-media", path);
  revalidatePath("/admin/media");
}
