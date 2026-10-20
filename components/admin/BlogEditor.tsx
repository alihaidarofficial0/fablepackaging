"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { uploadClientFile } from "@/lib/uploadClientFile";
import { slugify } from "@/lib/brandedDownloads";
import { toast } from "@/components/Toast";
import type { TiptapEditorHandle } from "./TiptapEditor";
import { normalizeBlogFaqs } from "@/lib/blogFaq";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#E7DDD2] bg-[#FFF9F2] text-sm font-semibold text-[#667085]">
      <Loader2 className="mr-2.5 size-5 animate-spin text-[#D96B2B]" />
      Loading editor…
    </div>
  ),
});

interface BlogEditorProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string; slug?: string }>;
  isEdit?: boolean;
  categories?: { id?: string; _id?: string; name: string }[];
}

export default function BlogEditor({
  initialData,
  onSubmit,
  isEdit,
  categories: categoriesProp = [],
}: BlogEditorProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFaqImage, setUploadingFaqImage] = useState(false);

  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image || initialData?.coverImage || "");
  const [imageAlt, setImageAlt] = useState(initialData?.image_alt || initialData?.imageAlt || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.cover_image_alt || initialData?.coverImageAlt || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || initialData?.videoUrl || "");
  const [videoTitle, setVideoTitle] = useState(initialData?.video_title || initialData?.videoTitle || "");
  const [content, setContent] = useState(
    initialData?.content || "<p>Write your thoughtful article here…</p>"
  );
  const [noIndex, setNoIndex] = useState(initialData?.no_index === true || initialData?.noIndex === true);
  const [isFeatured, setIsFeatured] = useState(
    initialData?.featured === true || initialData?.isFeatured === true
  );
  const [isLatest, setIsLatest] = useState(
    initialData?.is_latest === true || initialData?.isLatest === true
  );
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initialData?.slug);
  const [category, setCategory] = useState(initialData?.category || "");
  const [status, setStatus] = useState(initialData?.status || "Published");
  const [author, setAuthor] = useState(initialData?.author || "Editorial Staff");

  const [thumbnailUploadMethod, setThumbnailUploadMethod] = useState<"file" | "url">("file");
  const [coverUploadMethod, setCoverUploadMethod] = useState<"file" | "url">("file");

  // Per-post FAQ section
  const [faqTitle, setFaqTitle] = useState(initialData?.faq_title || initialData?.faqTitle || "");
  const [faqDescription, setFaqDescription] = useState(
    initialData?.faq_description || initialData?.faqDescription || ""
  );
  const [faqImage, setFaqImage] = useState(initialData?.faq_image || initialData?.faqImage || "");
  const [faqImageAlt, setFaqImageAlt] = useState(
    initialData?.faq_image_alt || initialData?.faqImageAlt || ""
  );
  const [faqImageTitle, setFaqImageTitle] = useState(
    initialData?.faq_image_title || initialData?.faqImageTitle || ""
  );
  const [faqImageCaption, setFaqImageCaption] = useState(
    initialData?.faq_image_caption || initialData?.faqImageCaption || ""
  );
  const [faqImageDescription, setFaqImageDescription] = useState(
    initialData?.faq_image_description || initialData?.faqImageDescription || ""
  );
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    normalizeBlogFaqs(initialData?.faqs)
  );

  const tiptapRef = useRef<TiptapEditorHandle>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const faqImageInputRef = useRef<HTMLInputElement>(null);

  // Sync fields on initialData change
  useEffect(() => {
    if (!initialData?.slug) return;
    setImageUrl(initialData.image || "");
    setCoverImageUrl(initialData.cover_image || initialData.coverImage || "");
    setImageAlt(initialData.image_alt || initialData.imageAlt || "");
    setCoverImageAlt(initialData.cover_image_alt || initialData.coverImageAlt || "");
    setVideoUrl(initialData.video_url || initialData.videoUrl || "");
    setVideoTitle(initialData.video_title || initialData.videoTitle || "");
    setContent(initialData.content || "<p>Write your thoughtful article here…</p>");
    setNoIndex(initialData.no_index === true || initialData.noIndex === true);
    setIsFeatured(initialData.featured === true || initialData.isFeatured === true);
    setIsLatest(initialData.is_latest === true || initialData.isLatest === true);
    setSlug(initialData.slug || "");
    setSlugTouched(!!initialData.slug);
    setCategory(initialData.category || "");
    setStatus(initialData.status || "Published");
    setAuthor(initialData.author || "Editorial Staff");
    setFaqTitle(initialData.faq_title || initialData.faqTitle || "");
    setFaqDescription(initialData.faq_description || initialData.faqDescription || "");
    setFaqImage(initialData.faq_image || initialData.faqImage || "");
    setFaqImageAlt(initialData.faq_image_alt || initialData.faqImageAlt || "");
    setFaqImageTitle(initialData.faq_image_title || initialData.faqImageTitle || "");
    setFaqImageCaption(initialData.faq_image_caption || initialData.faqImageCaption || "");
    setFaqImageDescription(initialData.faq_image_description || initialData.faqImageDescription || "");
    setFaqs(normalizeBlogFaqs(initialData.faqs));
  }, [initialData?.slug]);

  const thumbnailPreview = resolveBlogThumbnail(imageUrl, coverImageUrl);
  const coverPreview = resolveBlogCover(imageUrl, coverImageUrl);

  // Persistent PDF / downloadable files library
  const [filesList, setFilesList] = useState<{ name: string; url: string }[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fable_blog_uploaded_files");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setFilesList(parsed);
        } catch (e) {
          console.error("Error parsing fable_blog_uploaded_files:", e);
        }
      }
    }
  }, []);

  const saveFiles = (
    next:
      | { name: string; url: string }[]
      | ((prev: { name: string; url: string }[]) => { name: string; url: string }[])
  ) => {
    setFilesList((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      if (typeof window !== "undefined") {
        localStorage.setItem("fable_blog_uploaded_files", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Button Builder modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btnText, setBtnText] = useState("Explore Guide");
  const [btnLink, setBtnLink] = useState("");
  const [btnStyle, setBtnStyle] = useState("terracotta");
  const [uploadingFile, setUploadingFile] = useState(false);

  // Categories
  const [dbCategories, setDbCategories] = useState<{ id?: string; _id?: string; name: string }[]>(
    categoriesProp
  );
  const [showInlineCat, setShowInlineCat] = useState(false);
  const [inlineCatName, setInlineCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  const handleAddInlineCategory = async () => {
    const trimmed = inlineCatName.trim();
    if (!trimmed) return;
    setAddingCat(true);
    try {
      const { addCategory } = await import("@/app/admin/blog/actions");
      const fd = new FormData();
      fd.set("name", trimmed);
      fd.set("description", `Packaging articles and guides in ${trimmed}.`);
      const res = await addCategory(fd);
      if (res.success && res.category) {
        setDbCategories((prev) => [...prev, res.category]);
        setCategory(res.category.name);
        setInlineCatName("");
        setShowInlineCat(false);
        toast.success(`Category "${trimmed}" added and selected.`);
      } else {
        toast.error(res.error || "Failed to add category");
      }
    } catch {
      toast.error("Failed to add category");
    } finally {
      setAddingCat(false);
    }
  };

  useEffect(() => {
    if (categoriesProp.length > 0) {
      setDbCategories(categoriesProp);
      return;
    }
    async function loadCats() {
      try {
        const { getCategories } = await import("@/app/admin/blog/actions");
        const cats = await getCategories();
        if (cats?.length) setDbCategories(cats);
      } catch (err) {
        console.warn("Could not load categories:", err);
      }
    }
    loadCats();
  }, [categoriesProp]);

  const categoryOptions = useMemo(() => {
    const list = [...dbCategories];
    const current = category || initialData?.category;
    if (current && !list.some((c) => c.name === current)) {
      list.unshift({ id: "saved-category", name: current });
    }
    return list;
  }, [dbCategories, category, initialData?.category]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const result = await uploadClientFile(file);
      if (result.success && result.fileUrl) {
        const fileUrl = result.fileUrl;
        saveFiles((prev) =>
          prev.some((f) => f.url === fileUrl)
            ? prev
            : [...prev, { name: file.name, url: fileUrl }]
        );
        toast.success("File added to publication library.");
      } else {
        toast.error(result.error || "Failed to upload file");
      }
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const insertButtonHtml = (text: string, link: string, style: string) => {
    const variantStyles: Record<string, string> = {
      terracotta:
        "background-color: #D96B2B; color: #ffffff; border: none; box-shadow: 0 4px 12px rgba(217,107,43,0.25);",
      emerald:
        "background-color: #198754; color: #ffffff; border: none; box-shadow: 0 4px 12px rgba(25,135,84,0.25);",
      outline:
        "background-color: transparent; color: #D96B2B; border: 1.5px solid #D96B2B;",
    };

    const inlineStyle = `display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 12px 28px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 10px; text-decoration: none; margin: 12px 0; cursor: pointer; transition: all 0.2s ease; ${
      variantStyles[style] || variantStyles.terracotta
    }`;

    const html = `<div class="blog-cta-row" style="margin: 20px 0;"><a href="${link}" class="blog-cta-button blog-cta-button--${style}" contenteditable="false" style="${inlineStyle}">${text}</a></div>`;

    if (tiptapRef.current) {
      tiptapRef.current.insertHTML(html);
    } else {
      setContent((prev: string) => prev + " " + html);
    }
  };

  const handleInsertFromModal = () => {
    if (!btnText || !btnLink) {
      toast.error("Enter button text and pick a file or URL first.");
      return;
    }
    insertButtonHtml(btnText, btnLink, btnStyle);
    setBtnText("Explore Guide");
    setBtnLink("");
    setBtnStyle("terracotta");
    setIsModalOpen(false);
  };

  const addFaq = () => setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  const updateFaq = (index: number, key: "question" | "answer", val: string) =>
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: val } : f)));
  const removeFaq = (index: number) => setFaqs((prev) => prev.filter((_, i) => i !== index));
  const moveFaq = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    setFaqs((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "cover" | "faq"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "thumbnail") setUploadingImage(true);
    else if (type === "cover") setUploadingCover(true);
    else setUploadingFaqImage(true);

    try {
      const result = await uploadClientImage(file);
      if (result.success && result.imageUrl) {
        if (type === "thumbnail") {
          setImageUrl(result.imageUrl);
          toast.success("Thumbnail uploaded.");
        } else if (type === "cover") {
          setCoverImageUrl(result.imageUrl);
          toast.success("Hero cover image uploaded.");
        } else {
          setFaqImage(result.imageUrl);
          toast.success("FAQ image uploaded.");
        }
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      if (type === "thumbnail") setUploadingImage(false);
      else if (type === "cover") setUploadingCover(false);
      else setUploadingFaqImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("category", category || "Journal");
    formData.set("status", status);
    formData.set("author", author);
    formData.set("image", imageUrl);
    formData.set("coverImage", coverImageUrl);
    formData.set("cover_image", coverImageUrl);
    formData.set("imageAlt", imageAlt);
    formData.set("image_alt", imageAlt);
    formData.set("coverImageAlt", coverImageAlt);
    formData.set("cover_image_alt", coverImageAlt);
    formData.set("videoUrl", videoUrl);
    formData.set("video_url", videoUrl);
    formData.set("videoTitle", videoTitle);
    formData.set("video_title", videoTitle);
    formData.set("noIndex", noIndex ? "true" : "false");
    formData.set("no_index", noIndex ? "true" : "false");
    formData.set("isFeatured", isFeatured ? "true" : "false");
    formData.set("featured", isFeatured ? "true" : "false");
    formData.set("isLatest", isLatest ? "true" : "false");
    formData.set("is_latest", isLatest ? "true" : "false");
    formData.set("slug", slugify(slug || (formData.get("title") as string)));
    formData.set("faqTitle", faqTitle);
    formData.set("faq_title", faqTitle);
    formData.set("faqDescription", faqDescription);
    formData.set("faq_description", faqDescription);
    formData.set("faqImage", faqImage);
    formData.set("faq_image", faqImage);
    formData.set("faqImageAlt", faqImageAlt);
    formData.set("faq_image_alt", faqImageAlt);
    formData.set("faqImageTitle", faqImageTitle);
    formData.set("faq_image_title", faqImageTitle);
    formData.set("faqImageCaption", faqImageCaption);
    formData.set("faq_image_caption", faqImageCaption);
    formData.set("faqImageDescription", faqImageDescription);
    formData.set("faq_image_description", faqImageDescription);
    formData.set("faqs", JSON.stringify(normalizeBlogFaqs(faqs)));

    const res = await onSubmit(formData);
    setIsSubmitting(false);

    if (res.success) {
      if (isEdit) {
        toast.success(
          noIndex ? "Saved. This article is set to noindex." : "Article updated successfully."
        );
        if (res.slug && res.slug !== initialData?.slug) {
          router.push(`/admin/blog/edit/${res.slug}`);
        } else {
          router.refresh();
        }
      } else if (res.slug) {
        toast.success("Post published! Opening editor…");
        router.push(`/admin/blog/edit/${res.slug}`);
        router.refresh();
      } else {
        toast.success("Post saved successfully.");
        router.push("/admin/blog");
        router.refresh();
      }
    } else {
      toast.error(res.error || "Failed to save post");
    }
  };

  const [modalMounted, setModalMounted] = useState(false);
  useEffect(() => setModalMounted(true), []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7DDD2] pb-6">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors mb-2"
          >
            <ArrowLeft className="size-4" /> Back to Journal Posts
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B1F33]">
            {isEdit ? "Edit Journal Article" : "Create New Article"}
          </h1>
        </div>
        {isEdit && initialData?.slug && (
          <Link
            href={`/blog/${initialData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E7DDD2] bg-white text-xs font-bold uppercase tracking-wider text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors"
          >
            View Live <ExternalLink className="size-3.5" />
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* SECTION 1: General Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F0EAE2]">
            <h3 className="font-serif text-xl font-bold text-[#0B1F33]">General Information</h3>
            <div className="flex flex-wrap items-center gap-5">
              {/* Featured checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="size-4 rounded border-[#D9D0C7] text-[#D96B2B] focus:ring-[#D96B2B] accent-[#D96B2B] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Featured Post
                </span>
              </label>

              {/* Latest checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isLatest}
                  onChange={(e) => setIsLatest(e.target.checked)}
                  className="size-4 rounded border-[#D9D0C7] text-[#D96B2B] focus:ring-[#D96B2B] accent-[#D96B2B] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Latest Post
                </span>
              </label>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Status
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#FFF9F2] border border-[#E7DDD2] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0B1F33] outline-none focus:border-[#D96B2B] cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Article Title *
            </label>
            <input
              name="title"
              defaultValue={initialData?.title || ""}
              required
              onChange={(e) => {
                if (!slugTouched) {
                  setSlug(slugify(e.target.value));
                }
              }}
              placeholder="e.g. The Craft of Sustainable Folding Cartons in Modern Retail"
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-lg font-serif font-bold text-[#0B1F33] outline-none focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10"
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowInlineCat(!showInlineCat)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D96B2B] hover:text-[#BC5420] transition-colors cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>{showInlineCat ? "Cancel" : "Add New Category"}</span>
                </button>
              </div>

              {showInlineCat ? (
                <div className="flex items-center gap-2 p-2 bg-[#FFF4E9] border border-[#D96B2B]/30 rounded-xl">
                  <input
                    type="text"
                    value={inlineCatName}
                    onChange={(e) => setInlineCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInlineCategory();
                      }
                    }}
                    placeholder="New category name (e.g. Rigid Box Craft)..."
                    autoFocus
                    className="flex-1 px-3 py-1.5 bg-white border border-[#E7DDD2] rounded-lg text-xs font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                  />
                  <button
                    type="button"
                    disabled={addingCat || !inlineCatName.trim()}
                    onClick={handleAddInlineCategory}
                    className="px-3.5 py-1.5 bg-[#D96B2B] text-white text-xs font-bold rounded-lg hover:bg-[#BC5420] disabled:opacity-50 transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    {addingCat ? "Adding…" : "Save"}
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B] cursor-pointer"
                >
                  <option value="">Select Category…</option>
                  {categoryOptions.map((cat, i) => (
                    <option key={cat.id || cat._id || i} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Author Name *
              </label>
              <input
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="e.g. Eleanor Vance, Design Director"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
          </div>

          {/* SECTION 2: Images (Thumbnail & Cover) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EAE2]">
            {/* Thumbnail */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Thumbnail Image (Cards & Lists)
                </label>
                <div className="flex rounded-lg border border-[#E7DDD2] overflow-hidden text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setThumbnailUploadMethod("file")}
                    className={`px-2.5 py-1 ${
                      thumbnailUploadMethod === "file"
                        ? "bg-[#D96B2B] text-white"
                        : "bg-[#FFF9F2] text-[#667085]"
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailUploadMethod("url")}
                    className={`px-2.5 py-1 ${
                      thumbnailUploadMethod === "url"
                        ? "bg-[#D96B2B] text-white"
                        : "bg-[#FFF9F2] text-[#667085]"
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {imageUrl ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E7DDD2] group bg-[#F3E8DA]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider transition-opacity cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              ) : thumbnailUploadMethod === "file" ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !uploadingImage && thumbnailInputRef.current?.click()}
                  className="aspect-[16/10] border-2 border-dashed border-[#D9D0C7] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF9F2] transition-colors text-center"
                >
                  <ImageIcon className="size-8 text-[#D96B2B] mb-2" />
                  <span className="text-xs font-bold text-[#0B1F33]">
                    {uploadingImage ? "Uploading…" : "Click to Upload Thumbnail"}
                  </span>
                  <span className="text-[10px] text-[#667085] mt-1">Recommended: 800×500 px</span>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "thumbnail")}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs font-mono text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                />
              )}

              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Thumbnail image alt text (SEO)"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Cover Image (Article Detail Hero)
                </label>
                <div className="flex rounded-lg border border-[#E7DDD2] overflow-hidden text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCoverUploadMethod("file")}
                    className={`px-2.5 py-1 ${
                      coverUploadMethod === "file"
                        ? "bg-[#D96B2B] text-white"
                        : "bg-[#FFF9F2] text-[#667085]"
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverUploadMethod("url")}
                    className={`px-2.5 py-1 ${
                      coverUploadMethod === "url"
                        ? "bg-[#D96B2B] text-white"
                        : "bg-[#FFF9F2] text-[#667085]"
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {coverImageUrl ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E7DDD2] group bg-[#F3E8DA]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl("")}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider transition-opacity cursor-pointer"
                  >
                    Remove Cover
                  </button>
                </div>
              ) : coverUploadMethod === "file" ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !uploadingCover && coverInputRef.current?.click()}
                  className="aspect-[16/10] border-2 border-dashed border-[#D9D0C7] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF9F2] transition-colors text-center"
                >
                  <ImageIcon className="size-8 text-[#D96B2B] mb-2" />
                  <span className="text-xs font-bold text-[#0B1F33]">
                    {uploadingCover ? "Uploading…" : "Click to Upload Hero Cover"}
                  </span>
                  <span className="text-[10px] text-[#667085] mt-1">Recommended: 1600×900 px</span>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "cover")}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs font-mono text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                />
              )}

              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Hero cover image alt text (SEO)"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Content Body & Button Creator */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE2]">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0B1F33]">Article Content</h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Format your story, insert high-res photography, tables, blockquotes, and custom CTA action buttons.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="size-4" /> Insert CTA Button
            </button>
          </div>

          <TiptapEditor
            ref={tiptapRef}
            value={content}
            onChange={(newHtml) => setContent(newHtml)}
            onCreateButton={() => setIsModalOpen(true)}
          />
        </div>

        {/* SECTION 4: PDF & Downloadable File Library */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE2]">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0B1F33]">PDF & Downloadable Files Library</h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Upload PDFs, checklists, and guides here. You can then attach them to CTA buttons inside your articles.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D96B2B] bg-[#FFF9F2] text-[#D96B2B] hover:bg-[#D96B2B] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              <FileText className="size-4" />
              <span>{uploadingFile ? "Uploading…" : "+ Upload File"}</span>
              <input
                type="file"
                className="hidden"
                disabled={uploadingFile}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {filesList.length > 0 ? (
            <div className="divide-y divide-[#F0EAE2] max-h-56 overflow-y-auto pr-1">
              {filesList.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="size-4 text-[#D96B2B] shrink-0" />
                    <span className="font-semibold text-[#0B1F33] truncate">{file.name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D96B2B] hover:underline shrink-0"
                    >
                      (Preview)
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-1 text-[#98A2B3] hover:text-[#DC3545] transition-colors cursor-pointer"
                    title="Remove from library"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-xs font-medium text-[#667085]">
              No documents uploaded yet. Upload a PDF or guide above.
            </p>
          )}
        </div>

        {/* SECTION 5: Video Embed (Optional) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-4">
          <div className="border-b border-[#F0EAE2] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#0B1F33]">Featured Video (Optional)</h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Embed a YouTube or Vimeo clip that automatically appears below the article body.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Video Section Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Watch: Unboxing the Sustainable Rigid Box"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Per-Post FAQ Section (Optional) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-6">
          <div className="border-b border-[#F0EAE2] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#0B1F33]">Article FAQ Section (Optional)</h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Add frequently asked questions specific to this post. Appears at the bottom of the article.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                FAQ Section Title
              </label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                placeholder="e.g. Frequently Asked Questions"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                FAQ Section Description
              </label>
              <input
                type="text"
                value={faqDescription}
                onChange={(e) => setFaqDescription(e.target.value)}
                placeholder="Optional short introductory line"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            </div>
          </div>

          {/* FAQ Image */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              FAQ Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              {faqImage ? (
                <div className="relative size-20 rounded-xl overflow-hidden border border-[#E7DDD2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faqImage} alt="FAQ preview" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFaqImage("")}
                    className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploadingFaqImage}
                  onClick={() => faqImageInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl border border-dashed border-[#D9D0C7] bg-[#FFF9F2] text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:bg-[#FFF0E2] transition-colors"
                >
                  {uploadingFaqImage ? "Uploading…" : "+ Upload FAQ Image"}
                </button>
              )}
              <input
                ref={faqImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "faq")}
              />
              {faqImage && (
                <input
                  type="text"
                  value={faqImageAlt}
                  onChange={(e) => setFaqImageAlt(e.target.value)}
                  placeholder="FAQ Image alt text"
                  className="flex-1 px-4 py-2.5 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs"
                />
              )}
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Questions & Answers ({faqs.length})
              </span>
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D96B2B]/10 hover:bg-[#D96B2B] text-[#D96B2B] hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Question
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-center py-4 border border-dashed border-[#E7DDD2] rounded-xl text-xs text-[#667085]">
                No questions yet. Click &ldquo;Add Question&rdquo; to insert an FAQ pair.
              </p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D96B2B]">
                        Question #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveFaq(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-[#667085] hover:text-[#0B1F33] disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFaq(index, "down")}
                          disabled={index === faqs.length - 1}
                          className="p-1 text-[#667085] hover:text-[#0B1F33] disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="p-1 text-[#DC3545] hover:bg-[#FFF1F0] rounded cursor-pointer"
                          title="Remove question"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="e.g. Can this packaging withstand international freight?"
                      className="w-full px-4 py-2.5 bg-white border border-[#E7DDD2] rounded-lg text-sm font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Answer details…"
                      className="w-full px-4 py-2.5 bg-white border border-[#E7DDD2] rounded-lg text-sm text-[#0B1F33] outline-none focus:border-[#D96B2B] resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 7: SEO Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-6">
          <div className="border-b border-[#F0EAE2] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#0B1F33]">SEO & Search Settings (Optional)</h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Customize title tags, descriptions, custom slugs, and robots indexing behavior.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              SEO Title
            </label>
            <input
              name="seoTitle"
              defaultValue={initialData?.seo_title || initialData?.seoTitle || ""}
              placeholder="e.g. Sustainable Packaging Ideas & Structural Advice | Fable Journal"
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              SEO Meta Description
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={initialData?.seo_description || initialData?.seoDescription || ""}
              placeholder="A concise summary of this post for search engine result snippets…"
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              SEO Keywords (Comma Separated)
            </label>
            <input
              name="seoKeywords"
              defaultValue={initialData?.seo_keywords || initialData?.seoKeywords || ""}
              placeholder="sustainable packaging, custom boxes, materials guide"
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Custom URL Slug
            </label>
            <div className="flex rounded-xl border border-[#E7DDD2] overflow-hidden bg-[#FFFDF9]">
              <span className="px-4 py-3 text-xs font-mono font-bold text-[#667085] bg-[#FFF9F2] border-r border-[#E7DDD2] select-none">
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="post-url-slug"
                className="flex-1 px-4 py-3 text-xs font-mono text-[#0B1F33] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Canonical URL
            </label>
            <input
              name="canonicalLink"
              type="text"
              defaultValue={initialData?.canonical_link || initialData?.canonicalLink || ""}
              placeholder="https://fablepack.co/blog/your-post-slug"
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
            />
          </div>

          {/* Search Indexing */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085] block">
              Search Engine Indexing
            </label>
            <p className="text-xs text-[#667085]">
              Choose &ldquo;No&rdquo; to add a noindex tag — the article remains readable on your site but Google will not index it.
            </p>
            <div className="flex rounded-xl border border-[#E7DDD2] overflow-hidden w-fit mt-2">
              <button
                type="button"
                onClick={() => setNoIndex(false)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  !noIndex
                    ? "bg-[#D96B2B] text-white"
                    : "bg-[#FFF9F2] text-[#667085] hover:bg-[#FFF0E2]"
                }`}
              >
                Yes (Indexable)
              </button>
              <button
                type="button"
                onClick={() => setNoIndex(true)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  noIndex
                    ? "bg-[#D96B2B] text-white"
                    : "bg-[#FFF9F2] text-[#667085] hover:bg-[#FFF0E2]"
                }`}
              >
                No (noindex)
              </button>
            </div>
          </div>

          {/* Custom Schema Script */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Custom Schema Script (JSON-LD)
            </label>
            <textarea
              name="schemaScript"
              rows={3}
              defaultValue={initialData?.schema_script || initialData?.schemaScript || ""}
              placeholder='<script type="application/ld+json"> { "@context": "https://schema.org", ... } </script>'
              className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-xs font-mono text-[#0B1F33] outline-none focus:border-[#D96B2B] resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/blog"
            className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#667085] hover:bg-[#FFF9F2] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || uploadingImage || uploadingCover}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-all shadow-md shadow-[#D96B2B]/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Publish Article"
            )}
          </button>
        </div>
      </form>

      {/* Button Creator Modal */}
      {isModalOpen && modalMounted && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#E7DDD2] shadow-2xl rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#667085] hover:text-[#0B1F33] transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#D96B2B]">
                Interactive Element
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#0B1F33] mt-1">
                Insert Action Button
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                Attach an uploaded document, PDF guide, or custom URL and insert a styled CTA button at your cursor.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  1. Button Label
                </label>
                <input
                  type="text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="e.g. Download Material Specification Guide"
                  className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#E7DDD2] rounded-xl text-sm font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  2. Select File or Link
                </label>
                <select
                  value={filesList.some((f) => f.url === btnLink) ? btnLink : ""}
                  onChange={(e) => setBtnLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B] cursor-pointer"
                >
                  <option value="">Select from uploaded files…</option>
                  {filesList.map((f, i) => (
                    <option key={i} value={f.url}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  placeholder="Or paste external link (https://…)"
                  className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#E7DDD2] rounded-xl text-xs font-mono text-[#0B1F33] outline-none focus:border-[#D96B2B] mt-1.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  3. Button Visual Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBtnStyle("terracotta")}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      btnStyle === "terracotta"
                        ? "border-[#D96B2B] bg-[#FFF0E2] text-[#D96B2B]"
                        : "border-[#E7DDD2] text-[#667085] hover:bg-[#FFF9F2]"
                    }`}
                  >
                    Terracotta
                  </button>
                  <button
                    type="button"
                    onClick={() => setBtnStyle("outline")}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      btnStyle === "outline"
                        ? "border-[#D96B2B] bg-[#FFF0E2] text-[#D96B2B]"
                        : "border-[#E7DDD2] text-[#667085] hover:bg-[#FFF9F2]"
                    }`}
                  >
                    Outline
                  </button>
                  <button
                    type="button"
                    onClick={() => setBtnStyle("emerald")}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      btnStyle === "emerald"
                        ? "border-[#198754] bg-[#EDF9F1] text-[#198754]"
                        : "border-[#E7DDD2] text-[#667085] hover:bg-[#FFF9F2]"
                    }`}
                  >
                    Forest Green
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] flex items-center justify-center min-h-[60px]">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 24px",
                    backgroundColor:
                      btnStyle === "terracotta"
                        ? "#D96B2B"
                        : btnStyle === "emerald"
                        ? "#198754"
                        : "transparent",
                    color: btnStyle === "outline" ? "#D96B2B" : "#ffffff",
                    border: btnStyle === "outline" ? "1.5px solid #D96B2B" : "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {btnText || "Button Label"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#F0EAE2]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#667085] hover:bg-[#FFF9F2] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertFromModal}
                className="px-6 py-2.5 bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#BC5420] transition-colors cursor-pointer shadow-sm"
              >
                Insert Button
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
