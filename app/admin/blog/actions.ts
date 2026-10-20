"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseBlogFaqsFromForm } from "@/lib/blogFaq";
import { slugify } from "@/lib/brandedDownloads";

const BLOGS_FILE = path.join(process.cwd(), "data", "blogs.json");
const CATEGORIES_FILE = path.join(process.cwd(), "data", "categories.json");

async function readLocalJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalJson<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local JSON:", filePath, err);
  }
}

async function getSupabase() {
  try {
    return createAdminClient() || (await createClient());
  } catch {
    return null;
  }
}

export type BlogPost = {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  readTime?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalLink?: string;
  noIndex?: boolean;
  status?: string;
  isFeatured?: boolean;
  featured?: boolean;
  isLatest?: boolean;
  published_at?: string | null;
  created_at?: string;
  date?: string;
  faqs?: any[];
  [key: string]: any;
};

export type BlogCategory = {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  [key: string]: any;
};

let cachedBlogs: { data: BlogPost[]; expiresAt: number } | null = null;
let cachedCategories: { data: BlogCategory[]; expiresAt: number } | null = null;

export async function invalidateBlogCache() {
  cachedBlogs = null;
  cachedCategories = null;
}

export async function getBlogs(): Promise<BlogPost[]> {
  if (cachedBlogs && cachedBlogs.expiresAt > Date.now()) {
    return cachedBlogs.data;
  }

  const supabase = await getSupabase();
  if (supabase) {
    try {
      const fetchPromise = supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
        timer = setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 1200);
      });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]).finally(() => clearTimeout(timer));

      if (!error && data && data.length > 0) {
        const mapped = data.map((b: any) => ({
          ...b,
          coverImage: b.cover_image || b.coverImage || "",
          coverImageAlt: b.cover_image_alt || b.coverImageAlt || "",
          imageAlt: b.image_alt || b.imageAlt || "",
          videoUrl: b.video_url || b.videoUrl || "",
          videoTitle: b.video_title || b.videoTitle || "",
          readTime: b.read_time || b.readTime || "",
          seoTitle: b.seo_title || b.seoTitle || "",
          seoDescription: b.seo_description || b.seoDescription || "",
          seoKeywords: b.seo_keywords || b.seoKeywords || "",
          canonicalLink: b.canonical_link || b.canonicalLink || "",
          noIndex: b.no_index === true || b.noIndex === true,
          isFeatured: b.featured === true || b.isFeatured === true,
          isLatest: b.is_latest === true || b.isLatest === true,
          faqTitle: b.faq_title || b.faqTitle || "",
          faqDescription: b.faq_description || b.faqDescription || "",
          faqImage: b.faq_image || b.faqImage || "",
          faqImageAlt: b.faq_image_alt || b.faqImageAlt || "",
          faqImageTitle: b.faq_image_title || b.faqImageTitle || "",
          faqImageCaption: b.faq_image_caption || b.faqImageCaption || "",
          faqImageDescription: b.faq_image_description || b.faqImageDescription || "",
          date: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently",
        }));
        cachedBlogs = { data: mapped, expiresAt: Date.now() + 30000 };
        return mapped;
      }
    } catch (e) {
      console.warn("Supabase getBlogs fallback to local file:", e);
    }
  }

  const local = await readLocalJson<any[]>(BLOGS_FILE, []);
  if (local && local.length > 0) {
    cachedBlogs = { data: local, expiresAt: Date.now() + 30000 };
  }
  return local;
}

export async function getBlogBySlug(slug: string) {
  const clean = decodeURIComponent((slug || "").trim());
  const blogs = await getBlogs();
  const found = blogs.find((b) => b.slug === clean);
  return found || null;
}

export async function getPublishedBlogBySlug(slug: string) {
  const post = await getBlogBySlug(slug);
  if (!post || (post.status !== "Published" && post.status !== undefined)) {
    return null;
  }
  return post;
}

export async function getPublishedBlogs() {
  const blogs = await getBlogs();
  return blogs.filter((b) => b.status === "Published" || !b.status);
}

export async function getFeaturedAndLatestBlogs() {
  const published = await getPublishedBlogs();
  const featured = published.filter((b) => b.isFeatured || b.featured);
  const latest = published.slice(0, 8);
  return { featured, latest };
}

export async function getPublishedBlogsByCategory(categoryName: string) {
  const published = await getPublishedBlogs();
  const clean = decodeURIComponent(categoryName || "").trim().toLowerCase();
  return published.filter(
    (b) =>
      b.category?.toLowerCase() === clean ||
      slugify(b.category || "") === clean
  );
}

export async function addBlog(formData: FormData) {
  try {
    const title = (formData.get("title") as string || "").trim();
    if (!title) return { success: false, error: "Title is required" };

    const rawSlug = (formData.get("slug") as string || "").trim();
    let slug = slugify(rawSlug || title);
    if (!slug) slug = `article-${Date.now()}`;

    const author = (formData.get("author") as string || "Editorial Staff").trim();
    const category = (formData.get("category") as string || "Journal").trim();
    const content = (formData.get("content") as string || "").trim();
    const seoDescription = (formData.get("seoDescription") as string || "").trim();
    const excerpt = seoDescription || content.replace(/<[^>]+>/g, "").slice(0, 220).trim();

    const image = (formData.get("image") as string || "").trim();
    const imageAlt = (formData.get("imageAlt") as string || "").trim();
    const coverImage = (formData.get("coverImage") as string || "").trim();
    const coverImageAlt = (formData.get("coverImageAlt") as string || "").trim();
    const videoUrl = (formData.get("videoUrl") as string || "").trim();
    const videoTitle = (formData.get("videoTitle") as string || "").trim();

    const seoTitle = (formData.get("seoTitle") as string || "").trim();
    const seoKeywords = (formData.get("seoKeywords") as string || "").trim();
    const canonicalLink = (formData.get("canonicalLink") as string || "").trim();
    const schemaScript = (formData.get("schemaScript") as string || "").trim();
    const noIndex = formData.get("noIndex") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const isLatest = formData.get("isLatest") === "true";
    const status = (formData.get("status") as string || "Published");

    const faqTitle = (formData.get("faqTitle") as string || "").trim();
    const faqDescription = (formData.get("faqDescription") as string || "").trim();
    const faqImage = (formData.get("faqImage") as string || "").trim();
    const faqImageAlt = (formData.get("faqImageAlt") as string || "").trim();
    const faqImageTitle = (formData.get("faqImageTitle") as string || "").trim();
    const faqImageCaption = (formData.get("faqImageCaption") as string || "").trim();
    const faqImageDescription = (formData.get("faqImageDescription") as string || "").trim();
    const faqs = parseBlogFaqsFromForm(formData);

    const wordCount = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newPost: any = {
      id: `post-${Date.now()}`,
      title,
      slug,
      excerpt,
      content,
      image,
      imageAlt,
      image_alt: imageAlt,
      coverImage,
      cover_image: coverImage,
      coverImageAlt,
      cover_image_alt: coverImageAlt,
      author,
      category,
      readTime,
      read_time: readTime,
      seoTitle,
      seo_title: seoTitle,
      seoDescription,
      seo_description: seoDescription,
      seoKeywords,
      seo_keywords: seoKeywords,
      canonicalLink,
      canonical_link: canonicalLink,
      noIndex,
      no_index: noIndex,
      isFeatured,
      featured: isFeatured,
      isLatest,
      is_latest: isLatest,
      status,
      active: true,
      videoUrl,
      video_url: videoUrl,
      videoTitle,
      video_title: videoTitle,
      schemaScript,
      schema_script: schemaScript,
      faqTitle,
      faq_title: faqTitle,
      faqDescription,
      faq_description: faqDescription,
      faqImage,
      faq_image: faqImage,
      faqImageAlt,
      faq_image_alt: faqImageAlt,
      faqImageTitle,
      faq_image_title: faqImageTitle,
      faqImageCaption,
      faq_image_caption: faqImageCaption,
      faqImageDescription,
      faq_image_description: faqImageDescription,
      faqs,
      published_at: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };

    // Attempt Supabase insert with fallback
    const supabase = await getSupabase();
    if (supabase) {
      try {
        const { error: insertErr } = await supabase.from("blog_posts").insert({
          title: newPost.title,
          slug: newPost.slug,
          excerpt: newPost.excerpt,
          content: newPost.content,
          image: newPost.image,
          image_alt: newPost.image_alt,
          cover_image: newPost.cover_image,
          cover_image_alt: newPost.cover_image_alt,
          author: newPost.author,
          category: newPost.category,
          read_time: newPost.read_time,
          seo_title: newPost.seo_title,
          seo_description: newPost.seo_description,
          seo_keywords: newPost.seo_keywords,
          canonical_link: newPost.canonical_link,
          no_index: newPost.no_index,
          featured: newPost.featured,
          is_latest: newPost.is_latest,
          status: newPost.status,
          active: newPost.status === "Published",
          video_url: newPost.video_url,
          video_title: newPost.video_title,
          schema_script: newPost.schema_script,
          faq_title: newPost.faq_title,
          faq_description: newPost.faq_description,
          faq_image: newPost.faq_image,
          faq_image_alt: newPost.faq_image_alt,
          faq_image_title: newPost.faq_image_title,
          faq_image_caption: newPost.faq_image_caption,
          faq_image_description: newPost.faq_image_description,
          faqs: newPost.faqs,
        });

        if (insertErr) {
          console.warn("Retrying insert with core Supabase schema:", insertErr.message);
          await supabase.from("blog_posts").insert({
            title: newPost.title,
            slug: newPost.slug,
            excerpt: newPost.excerpt,
            content: newPost.content,
            image: newPost.image || newPost.cover_image,
            alt: newPost.image_alt || newPost.cover_image_alt || newPost.title,
            author: newPost.author,
            category: newPost.category,
            published_at: newPost.published_at,
            active: newPost.status === "Published",
            featured: newPost.featured,
            seo_title: newPost.seo_title,
            seo_description: newPost.seo_description,
            sort_order: 0,
          });
        }
      } catch (err) {
        console.warn("Supabase insert error:", err);
      }
    }

    // Always update local cache
    const currentBlogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const updated = [newPost, ...currentBlogs.filter((b) => b.slug !== slug)];
    await writeLocalJson(BLOGS_FILE, updated);

    invalidateBlogCache();
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true, slug };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create article" };
  }
}

export async function updateBlog(originalSlug: string, formData: FormData) {
  try {
    const lookup = decodeURIComponent((originalSlug || "").trim());
    const title = (formData.get("title") as string || "").trim();
    if (!title) return { success: false, error: "Title is required" };

    const rawSlug = (formData.get("slug") as string || "").trim();
    const slug = slugify(rawSlug || title) || lookup;

    const author = (formData.get("author") as string || "Editorial Staff").trim();
    const category = (formData.get("category") as string || "Journal").trim();
    const content = (formData.get("content") as string || "").trim();
    const seoDescription = (formData.get("seoDescription") as string || "").trim();
    const excerpt = seoDescription || content.replace(/<[^>]+>/g, "").slice(0, 220).trim();

    const image = (formData.get("image") as string || "").trim();
    const imageAlt = (formData.get("imageAlt") as string || "").trim();
    const coverImage = (formData.get("coverImage") as string || "").trim();
    const coverImageAlt = (formData.get("coverImageAlt") as string || "").trim();
    const videoUrl = (formData.get("videoUrl") as string || "").trim();
    const videoTitle = (formData.get("videoTitle") as string || "").trim();

    const seoTitle = (formData.get("seoTitle") as string || "").trim();
    const seoKeywords = (formData.get("seoKeywords") as string || "").trim();
    const canonicalLink = (formData.get("canonicalLink") as string || "").trim();
    const schemaScript = (formData.get("schemaScript") as string || "").trim();
    const noIndex = formData.get("noIndex") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const isLatest = formData.get("isLatest") === "true";
    const status = (formData.get("status") as string || "Published");

    const faqTitle = (formData.get("faqTitle") as string || "").trim();
    const faqDescription = (formData.get("faqDescription") as string || "").trim();
    const faqImage = (formData.get("faqImage") as string || "").trim();
    const faqImageAlt = (formData.get("faqImageAlt") as string || "").trim();
    const faqImageTitle = (formData.get("faqImageTitle") as string || "").trim();
    const faqImageCaption = (formData.get("faqImageCaption") as string || "").trim();
    const faqImageDescription = (formData.get("faqImageDescription") as string || "").trim();
    const faqs = parseBlogFaqsFromForm(formData);

    const wordCount = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const updatedFields: any = {
      title,
      slug,
      excerpt,
      content,
      image,
      imageAlt,
      image_alt: imageAlt,
      coverImage,
      cover_image: coverImage,
      coverImageAlt,
      cover_image_alt: coverImageAlt,
      author,
      category,
      readTime,
      read_time: readTime,
      seoTitle,
      seo_title: seoTitle,
      seoDescription,
      seo_description: seoDescription,
      seoKeywords,
      seo_keywords: seoKeywords,
      canonicalLink,
      canonical_link: canonicalLink,
      noIndex,
      no_index: noIndex,
      isFeatured,
      featured: isFeatured,
      isLatest,
      is_latest: isLatest,
      status,
      videoUrl,
      video_url: videoUrl,
      videoTitle,
      video_title: videoTitle,
      schemaScript,
      schema_script: schemaScript,
      faqTitle,
      faq_title: faqTitle,
      faqDescription,
      faq_description: faqDescription,
      faqImage,
      faq_image: faqImage,
      faqImageAlt,
      faq_image_alt: faqImageAlt,
      faqImageTitle,
      faq_image_title: faqImageTitle,
      faqImageCaption,
      faq_image_caption: faqImageCaption,
      faqImageDescription,
      faq_image_description: faqImageDescription,
      faqs,
    };

    // Update in Supabase if available with fallback
    const supabase = await getSupabase();
    if (supabase) {
      try {
        const { error: updateErr } = await supabase
          .from("blog_posts")
          .update(updatedFields)
          .eq("slug", lookup);

        if (updateErr) {
          console.warn("Retrying update with core Supabase schema:", updateErr.message);
          await supabase
            .from("blog_posts")
            .update({
              title: updatedFields.title,
              slug: updatedFields.slug,
              excerpt: updatedFields.excerpt,
              content: updatedFields.content,
              image: updatedFields.image || updatedFields.cover_image,
              alt: updatedFields.image_alt || updatedFields.cover_image_alt || updatedFields.title,
              author: updatedFields.author,
              category: updatedFields.category,
              active: updatedFields.status === "Published",
              featured: updatedFields.featured,
              seo_title: updatedFields.seo_title,
              seo_description: updatedFields.seo_description,
            })
            .eq("slug", lookup);
        }
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }

    // Always update in local JSON
    const currentBlogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const idx = currentBlogs.findIndex((b) => b.slug === lookup);
    if (idx >= 0) {
      currentBlogs[idx] = { ...currentBlogs[idx], ...updatedFields };
      await writeLocalJson(BLOGS_FILE, currentBlogs);
    }

    invalidateBlogCache();
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${lookup}`);
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/admin/blog/edit/${lookup}`);
    revalidatePath(`/admin/blog/edit/${slug}`);

    return { success: true, slug, noIndex };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Failed to update article" };
  }
}

export async function deleteBlog(slugOrId: string) {
  try {
    const clean = decodeURIComponent((slugOrId || "").trim());
    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase.from("blog_posts").delete().or(`slug.eq.${clean},id.eq.${clean}`);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }

    const currentBlogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const filtered = currentBlogs.filter((b) => b.slug !== clean && b.id !== clean);
    await writeLocalJson(BLOGS_FILE, filtered);

    invalidateBlogCache();
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, slug: clean };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete article" };
  }
}

export async function toggleBlogStatus(slug: string) {
  try {
    const clean = decodeURIComponent((slug || "").trim());
    const blogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const post = blogs.find((b) => b.slug === clean);
    if (!post) return { success: false, error: "Article not found" };

    const newStatus = post.status === "Draft" ? "Published" : "Draft";
    post.status = newStatus;
    await writeLocalJson(BLOGS_FILE, blogs);

    const supabase = await getSupabase();
    if (supabase) {
      try {
        const isActive = newStatus === "Published";
        const { error: toggleErr } = await supabase.from("blog_posts").update({ status: newStatus, active: isActive }).eq("slug", clean);
        if (toggleErr) {
          await supabase.from("blog_posts").update({ active: isActive }).eq("slug", clean);
        }
      } catch (e) {
        console.warn("Supabase toggle status error:", e);
      }
    }

    invalidateBlogCache();
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${clean}`);

    return { success: true, status: newStatus };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function toggleBlogFeatured(slug: string) {
  try {
    const clean = decodeURIComponent((slug || "").trim());
    const blogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const post = blogs.find((b) => b.slug === clean);
    if (!post) return { success: false, error: "Article not found" };

    const nextVal = !post.isFeatured;
    post.isFeatured = nextVal;
    post.featured = nextVal;
    await writeLocalJson(BLOGS_FILE, blogs);

    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase.from("blog_posts").update({ featured: nextVal }).eq("slug", clean);
      } catch (e) {
        console.warn("Supabase toggle featured error:", e);
      }
    }

    invalidateBlogCache();
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, isFeatured: nextVal };
  } catch (error) {
    return { success: false, error: "Failed to toggle featured" };
  }
}

export async function toggleBlogNoIndex(slug: string, noIndex: boolean) {
  try {
    const clean = decodeURIComponent((slug || "").trim());
    const blogs = await readLocalJson<any[]>(BLOGS_FILE, []);
    const post = blogs.find((b) => b.slug === clean);
    if (post) {
      post.noIndex = noIndex;
      post.no_index = noIndex;
      await writeLocalJson(BLOGS_FILE, blogs);
    }

    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase.from("blog_posts").update({ no_index: noIndex }).eq("slug", clean);
      } catch (e) {
        console.warn("Supabase toggle noIndex error:", e);
      }
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${clean}`);

    return { success: true, noIndex };
  } catch (error) {
    return { success: false, error: "Failed to toggle indexing" };
  }
}

function deduplicateCategories(list: any[]) {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const result: any[] = [];

  for (const item of list || []) {
    if (!item) continue;
    const name = (item.name || "").trim();
    if (!name) continue;

    const normName = name.toLowerCase();
    if (seenNames.has(normName)) continue;
    seenNames.add(normName);

    const baseSlug = item.slug || slugify(name);
    let id = String(item.id || item._id || `cat-${baseSlug}`);
    if (seenIds.has(id)) {
      let counter = 2;
      let newId = `${id}-${counter}`;
      while (seenIds.has(newId)) {
        counter++;
        newId = `${id}-${counter}`;
      }
      id = newId;
    }
    seenIds.add(id);

    result.push({
      ...item,
      id,
      name,
      slug: baseSlug,
    });
  }

  return result;
}

export async function getCategories(): Promise<BlogCategory[]> {
  if (cachedCategories && cachedCategories.expiresAt > Date.now()) {
    return cachedCategories.data;
  }

  const supabase = await getSupabase();
  if (supabase) {
    try {
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
        timer = setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 1200);
      });
      const fetchPromise = supabase.from("blog_categories").select("*").order("name");
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]).finally(() => clearTimeout(timer));

      if (!error && data && data.length > 0) {
        const res = deduplicateCategories(data);
        cachedCategories = { data: res, expiresAt: Date.now() + 30000 };
        return res;
      }
    } catch (e) {
      console.warn("Supabase getCategories error:", e);
    }

    // Dynamic extraction from live blog posts in Supabase
    try {
      const { data: posts } = await supabase.from("blog_posts").select("category");
      if (posts && posts.length > 0) {
        const liveNames = Array.from(new Set(posts.map((p) => (p.category || "").trim()).filter(Boolean)));
        const fallback = await readLocalJson<any[]>(CATEGORIES_FILE, []);
        const merged = [...fallback];
        for (const name of liveNames) {
          const s = slugify(name);
          const genId = `cat-${s}`;
          if (
            !merged.some(
              (c) =>
                c.id === genId ||
                c.slug === s ||
                (c.name && c.name.toLowerCase() === name.toLowerCase())
            )
          ) {
            merged.push({
              id: genId,
              name,
              slug: s,
              description: `Essays and material studies in ${name}.`,
            });
          }
        }
        const res = deduplicateCategories(merged);
        cachedCategories = { data: res, expiresAt: Date.now() + 30000 };
        return res;
      }
    } catch {
      // ignore
    }
  }

  const fallback = await readLocalJson<any[]>(CATEGORIES_FILE, []);
  const res = deduplicateCategories(fallback);
  cachedCategories = { data: res, expiresAt: Date.now() + 30000 };
  return res;
}

export async function addCategory(formData: FormData) {
  try {
    const name = (formData.get("name") as string || "").trim();
    if (!name) return { success: false, error: "Category name is required" };

    const slug = slugify(name);
    const description = (formData.get("description") as string || "").trim();

    const newCat = { id: `cat-${Date.now()}`, name, slug, description };

    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase.from("blog_categories").insert({ name, slug, description });
      } catch (e) {
        console.warn("Supabase addCategory error:", e);
      }
    }

    const current = await readLocalJson<any[]>(CATEGORIES_FILE, []);
    if (!current.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      current.push(newCat);
      await writeLocalJson(CATEGORIES_FILE, current);
    }

    invalidateBlogCache();
    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");
    return { success: true, category: newCat };
  } catch (error) {
    return { success: false, error: "Failed to add category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase.from("blog_categories").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase deleteCategory error:", e);
      }
    }

    const current = await readLocalJson<any[]>(CATEGORIES_FILE, []);
    const filtered = current.filter((c) => c.id !== id && c._id !== id);
    await writeLocalJson(CATEGORIES_FILE, filtered);

    invalidateBlogCache();
    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category" };
  }
}

export async function updateCategory(id: string, newName: string, newDescription?: string) {
  try {
    const cleanName = newName.trim();
    if (!cleanName) return { success: false, error: "Name cannot be empty" };

    const supabase = await getSupabase();
    if (supabase) {
      try {
        await supabase
          .from("blog_categories")
          .update({ name: cleanName, description: newDescription || "" })
          .eq("id", id);
      } catch (e) {
        console.warn("Supabase updateCategory error:", e);
      }
    }

    const current = await readLocalJson<any[]>(CATEGORIES_FILE, []);
    const item = current.find((c) => c.id === id || c._id === id);
    if (item) {
      item.name = cleanName;
      if (newDescription !== undefined) item.description = newDescription;
      await writeLocalJson(CATEGORIES_FILE, current);
    }

    invalidateBlogCache();
    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}
