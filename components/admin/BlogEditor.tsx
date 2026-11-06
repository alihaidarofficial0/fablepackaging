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
  Save,
} from "lucide-react";
import Link from "next/link";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { uploadClientFile } from "@/lib/uploadClientFile";
import { slugify } from "@/lib/brandedDownloads";
import { toast } from "@/components/Toast";
import type { TiptapEditorHandle } from "./TiptapEditor";
import { normalizeBlogFaqs } from "@/lib/blogFaq";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#E7DDD2] bg-[#FFF9F2] text-sm font-semibold text-[#667085]">
      <Loader2 className="mr-2.5 size-5 animate-spin text-[#D96B2B]" />
      Loading editor…
    </div>
  ),
});

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-sm font-medium text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10";
const textareaClass =
  "mt-1.5 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 py-3 text-sm font-medium text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10 resize-y";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#0B1F33]";
const sectionTitleClass = "font-serif text-2xl text-[#0B1F33]";
const sectionDescClass = "mt-1 text-sm text-[#667085]";

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
  const formRef = useRef<HTMLFormElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const faqImageInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+S / Cmd+S to save immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!isSubmitting) {
          formRef.current?.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting]);

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
    <div className="w-full max-w-none space-y-6 pb-20">
      {/* Top Header matching settings layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E7DDD2]">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#D96B2B] hover:text-[#BC5420] transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" /> Back to Articles
          </Link>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">
            Journal / {isEdit ? "Edit" : "New"}
          </p>
          <h1 className="mt-1 font-serif text-2xl text-[#0B1F33] sm:text-3xl">
            {isEdit ? "Edit Article" : "Create Article"}
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-[#667085] truncate">
            {isEdit
              ? initialData?.title
                ? initialData.title
                : "Edit and update journal publication."
              : "Draft and publish a new editorial journal article."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              status === "Published"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                status === "Published" ? "bg-emerald-600" : "bg-amber-600"
              }`}
            />
            {status}
          </span>
          {isEdit && initialData?.slug && (
            <Link
              href={`/blog/${initialData.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E7DDD2] bg-white text-xs font-bold text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors shadow-xs"
            >
              View Live <ExternalLink className="size-3.5" />
            </Link>
          )}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* SECTION 1: General Info */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F0EAE2]">
            <div>
              <h2 className={sectionTitleClass}>General Information</h2>
              <p className={sectionDescClass}>Basic metadata, publication status, category, and author details.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {/* Featured checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="size-4 rounded border-[#D9D0C7] text-[#D96B2B] focus:ring-[#D96B2B] accent-[#D96B2B] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
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
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                  Latest Post
                </span>
              </label>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                  Status
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-white border border-[#E7DDD2] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0B1F33] outline-none focus:border-[#D96B2B] cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>
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
              className={inputClass}
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>
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
                <div className="mt-1.5 flex items-center gap-2 p-2 bg-[#FFF4E9] border border-[#D96B2B]/30 rounded-xl">
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
                  className={inputClass}
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
            <div>
              <label className={labelClass}>
                Author Name *
              </label>
              <input
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="e.g. Eleanor Vance, Design Director"
                className={inputClass}
              />
            </div>
          </div>

          {/* SECTION 2: Images (Thumbnail & Cover) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EAE2]">
            {/* Thumbnail */}
            <div className="space-y-2">
              <ImageUploadField
                label="Thumbnail Image (Blog Listing Card)"
                value={imageUrl}
                onChange={setImageUrl}
                defaultSlug={slug ? `${slug}-thumb` : "blog-thumb"}
                folder="collections/blog_posts"
                recommended="800 × 500 px"
              />
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Thumbnail image alt text (SEO)"
                className="mt-1 h-10 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-xs font-medium text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B]"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <ImageUploadField
                label="Cover Image (Article Detail Hero)"
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                defaultSlug={slug ? `${slug}-cover` : "blog-cover"}
                folder="collections/blog_posts"
                recommended="1600 × 900 px"
              />
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Hero cover image alt text (SEO)"
                className="mt-1 h-10 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-xs font-medium text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B]"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Content Body & Button Creator */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EAE2]">
            <div>
              <h2 className={sectionTitleClass}>Article Content</h2>
              <p className={sectionDescClass}>
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
        </section>

        {/* SECTION 4: PDF & Downloadable File Library */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EAE2]">
            <div>
              <h2 className={sectionTitleClass}>PDF &amp; Files Library</h2>
              <p className={sectionDescClass}>
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
        </section>

        {/* SECTION 5: Video Embed (Optional) */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-[#F0EAE2] pb-4">
            <h2 className={sectionTitleClass}>Featured Video <span className="text-base font-normal text-[#98A2B3]">(Optional)</span></h2>
            <p className={sectionDescClass}>
              Embed a YouTube or Vimeo clip that automatically appears below the article body.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Video Section Title</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Watch: Unboxing the Sustainable Rigid Box"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* SECTION 6: Per-Post FAQ Section (Optional) */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-[#F0EAE2] pb-4">
            <h2 className={sectionTitleClass}>Article FAQs <span className="text-base font-normal text-[#98A2B3]">(Optional)</span></h2>
            <p className={sectionDescClass}>
              Add frequently asked questions specific to this post. Appears at the bottom of the article.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>FAQ Section Title</label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                placeholder="e.g. Frequently Asked Questions"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>FAQ Section Description</label>
              <input
                type="text"
                value={faqDescription}
                onChange={(e) => setFaqDescription(e.target.value)}
                placeholder="Optional short introductory line"
                className={inputClass}
              />
            </div>
          </div>

          {/* FAQ Image */}
          <div className="space-y-2">
            <ImageUploadField
              label="FAQ Side Image (Optional)"
              value={faqImage}
              onChange={setFaqImage}
              defaultSlug={slug ? `${slug}-faq` : "blog-faq"}
              folder="collections/blog_posts"
              recommended="600 x 600 px"
            />
            {faqImage && (
              <input
                type="text"
                value={faqImageAlt}
                onChange={(e) => setFaqImageAlt(e.target.value)}
                placeholder="FAQ Image alt text"
                className="mt-1 h-10 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 text-xs font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
            )}
          </div>

          {/* Questions list */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className={labelClass}>
                Questions &amp; Answers ({faqs.length})
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
                        <button type="button" onClick={() => moveFaq(index, "up")} disabled={index === 0} className="p-1 text-[#667085] hover:text-[#0B1F33] disabled:opacity-30 cursor-pointer" title="Move up">
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => moveFaq(index, "down")} disabled={index === faqs.length - 1} className="p-1 text-[#667085] hover:text-[#0B1F33] disabled:opacity-30 cursor-pointer" title="Move down">
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => removeFaq(index)} className="p-1 text-[#DC3545] hover:bg-[#FFF1F0] rounded cursor-pointer" title="Remove question">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="e.g. Can this packaging withstand international freight?"
                      className="h-10 w-full rounded-lg border border-[#E7DDD2] bg-white px-3.5 text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Answer details..."
                      className="w-full rounded-lg border border-[#E7DDD2] bg-white px-3.5 py-2.5 text-sm text-[#0B1F33] outline-none focus:border-[#D96B2B] resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: SEO Settings */}
        <section className="rounded-2xl border border-[#E7DDD2] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-[#F0EAE2] pb-4">
            <h2 className={sectionTitleClass}>SEO Settings <span className="text-base font-normal text-[#98A2B3]">(Optional)</span></h2>
            <p className={sectionDescClass}>
              Customize title tags, descriptions, custom slugs, and robots indexing behavior.
            </p>
          </div>


          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={initialData?.seo_title || initialData?.seoTitle || ""}
              placeholder="e.g. Sustainable Packaging Ideas & Structural Advice | Fable Journal"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>SEO Meta Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={initialData?.seo_description || initialData?.seoDescription || ""}
              placeholder="A concise summary of this post for search engine result snippets..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>SEO Keywords <span className="font-normal normal-case tracking-normal text-[#98A2B3]">(comma separated)</span></label>
            <input
              name="seoKeywords"
              defaultValue={initialData?.seo_keywords || initialData?.seoKeywords || ""}
              placeholder="sustainable packaging, custom boxes, materials guide"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Custom URL Slug</label>
            <div className="mt-1.5 flex rounded-xl border border-[#E7DDD2] overflow-hidden bg-white">
              <span className="px-4 py-3 text-xs font-mono font-bold text-[#667085] bg-[#F9F5F0] border-r border-[#E7DDD2] select-none">
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
                className="flex-1 px-4 py-3 text-xs font-mono text-[#0B1F33] outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Canonical URL</label>
            <input
              name="canonicalLink"
              type="text"
              defaultValue={initialData?.canonical_link || initialData?.canonicalLink || ""}
              placeholder="https://fablepack.co/blog/your-post-slug"
              className={inputClass}
            />
          </div>

          {/* Search Indexing */}
          <div>
            <label className={`${labelClass} mb-1`}>Search Engine Indexing</label>
            <p className="mt-1 mb-3 text-xs text-[#667085]">
              Choose &ldquo;No&rdquo; to add a noindex tag &mdash; the article stays readable but won&apos;t be indexed by Google.
            </p>
            <div className="flex rounded-xl border border-[#E7DDD2] overflow-hidden w-fit">
              <button
                type="button"
                onClick={() => setNoIndex(false)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  !noIndex
                    ? "bg-[#D96B2B] text-white"
                    : "bg-white text-[#667085] hover:bg-[#FFF0E2]"
                }`}
              >
                Yes (Indexable)
              </button>
              <button
                type="button"
                onClick={() => setNoIndex(true)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border-l border-[#E7DDD2] ${
                  noIndex
                    ? "bg-[#D96B2B] text-white"
                    : "bg-white text-[#667085] hover:bg-[#FFF0E2]"
                }`}
              >
                No (noindex)
              </button>
            </div>
          </div>

          {/* Custom Schema Script */}
          <div>
            <label className={labelClass}>Custom Schema Script <span className="font-normal normal-case tracking-normal text-[#98A2B3]">(JSON-LD)</span></label>
            <textarea
              name="schemaScript"
              rows={3}
              defaultValue={initialData?.schema_script || initialData?.schemaScript || ""}
              placeholder={`<script type="application/ld+json"> { "@context": "https://schema.org", ... } </script>`}
              className="mt-1.5 w-full rounded-xl border border-[#E7DDD2] bg-white px-3.5 py-3 text-xs font-mono text-[#0B1F33] outline-none transition-colors focus:border-[#D96B2B] resize-y"
            />
          </div>
        </section>

        {/* Sticky Save Changes Bar — Matching Settings page */}
        <div className="sticky bottom-6 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9]/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs leading-5 text-[#667085]">
              Make edits above, then click Save Changes so the public journal updates.
            </span>
            <span className="hidden md:inline text-xs text-[#98A2B3]">
              · Press <kbd className="rounded border border-[#E7DDD2] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#0B1F33]">Ctrl+S</kbd> to save
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="inline-flex h-11 items-center px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#667085] hover:bg-white hover:text-[#0B1F33] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage || uploadingCover || uploadingFaqImage}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D96B2B] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D96B2B]/20 transition-all hover:bg-[#BC5420] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>{isEdit ? "Save Changes" : "Publish Article"}</span>
                </>
              )}
            </button>
          </div>
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
