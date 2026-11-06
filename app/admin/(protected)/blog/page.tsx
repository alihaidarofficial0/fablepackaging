"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  FolderOpen,
  FileText,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getBlogs,
  deleteBlog,
  toggleBlogStatus,
  toggleBlogFeatured,
} from "@/app/admin/blog/actions";
import { resolveBlogThumbnail } from "@/lib/blogImage";
import { toast } from "@/components/Toast";

const PAGE_SIZE = 20;

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load journal articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleToggleStatus = async (slug: string) => {
    const res = await toggleBlogStatus(slug);
    if (res.success) {
      setBlogs((prev) =>
        prev.map((b) => (b.slug === slug ? { ...b, status: res.status } : b))
      );
      toast.success(`Status updated to ${res.status}`);
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const handleToggleFeatured = async (slug: string) => {
    const res = await toggleBlogFeatured(slug);
    if (res.success) {
      setBlogs((prev) =>
        prev.map((b) => (b.slug === slug ? { ...b, isFeatured: res.isFeatured, featured: res.isFeatured } : b))
      );
      toast.success(res.isFeatured ? "Article marked as Featured" : "Article removed from Featured");
    } else {
      toast.error(res.error || "Failed to update featured flag");
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteBlog(slug);
    if (res.success) {
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
      toast.success("Article deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete article");
    }
  };

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">
            Editorial CMS
          </p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#0B1F33]">
            Journal Articles
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            {total} {total === 1 ? "article" : "articles"} · {PAGE_SIZE} per page
            {totalPages > 1 ? ` · Page ${safePage} of ${totalPages}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/blog/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7DDD2] bg-white text-xs font-bold uppercase tracking-wider text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors"
          >
            <FolderOpen className="size-4" /> Categories
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-all shadow-md shadow-[#D96B2B]/20 cursor-pointer"
          >
            <Plus className="size-4" /> New Article
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#E7DDD2] bg-white">
        <Search className="size-4 text-[#98A2B3] shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter articles by title, author, or category…"
          className="w-full text-sm font-medium text-[#0B1F33] outline-none placeholder-[#98A2B3]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs font-bold text-[#667085] hover:text-[#0B1F33]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E7DDD2] shadow-sm overflow-hidden">
        {!loading && filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="size-14 bg-[#FFF4E9] rounded-2xl flex items-center justify-center text-[#D96B2B] mx-auto mb-4">
              <FileText className="size-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0B1F33]">No articles found</h3>
            <p className="text-sm text-[#667085] mt-1">
              {search ? "No posts match your search query." : "Write your first story to get started."}
            </p>
            {!search && (
              <Link
                href="/admin/blog/new"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-colors"
              >
                <Plus className="size-4" /> Create First Article
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9F2] border-b border-[#E7DDD2]">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085] w-20">
                    Image
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Title & Category
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Featured
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Status
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Author
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Date
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#667085] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE2]">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="size-12 rounded-lg bg-[#F0EAE2]" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-48 bg-[#F0EAE2] rounded" />
                        <div className="h-3 w-20 bg-[#F0EAE2] rounded mt-2" />
                      </td>
                      <td className="p-4">
                        <div className="h-6 w-12 bg-[#F0EAE2] rounded-full" />
                      </td>
                      <td className="p-4">
                        <div className="h-6 w-20 bg-[#F0EAE2] rounded-full" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-24 bg-[#F0EAE2] rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-20 bg-[#F0EAE2] rounded" />
                      </td>
                      <td className="p-4 text-right">
                        <div className="h-6 w-16 bg-[#F0EAE2] rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  paginated.map((blog) => {
                    const thumb = resolveBlogThumbnail(blog.image, blog.coverImage || blog.cover_image);
                    const isPublished = blog.status === "Published" || !blog.status;
                    const isFeat = blog.isFeatured || blog.featured;

                    return (
                      <tr
                        key={blog.id || blog.slug}
                        className="hover:bg-[#FFFDF9] transition-colors"
                      >
                        <td className="p-4">
                          <div className="relative size-12 rounded-xl overflow-hidden border border-[#E7DDD2] bg-[#F3E8DA] shrink-0">
                            {thumb ? (
                              <Image
                                src={thumb}
                                alt={blog.title || "thumbnail"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-[10px] text-[#98A2B3]">
                                No img
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4 max-w-xs sm:max-w-md">
                          <Link
                            href={`/admin/blog/edit/${blog.slug}`}
                            className="font-serif font-bold text-sm text-[#0B1F33] hover:text-[#D96B2B] line-clamp-1 transition-colors"
                          >
                            {blog.title}
                          </Link>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D96B2B] mt-0.5">
                            {blog.category || "Journal"}
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(blog.slug)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isFeat
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            {isFeat ? "ON" : "OFF"}
                          </button>
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(blog.slug)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isPublished
                                ? "bg-[#FFF0E2] text-[#D96B2B] border border-[#D96B2B]/30"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {isPublished ? "PUBLISHED" : "DRAFT"}
                          </button>
                        </td>

                        <td className="p-4 text-xs font-semibold text-[#667085]">
                          {blog.author || "Editorial"}
                        </td>

                        <td className="p-4 text-xs text-[#98A2B3]">
                          {blog.date || "Recent"}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isPublished && (
                              <Link
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                className="p-2 text-[#667085] hover:text-[#D96B2B] hover:bg-[#FFF4E9] rounded-lg transition-colors"
                                title="View on website"
                              >
                                <ExternalLink className="size-4" />
                              </Link>
                            )}
                            <Link
                              href={`/admin/blog/edit/${blog.slug}`}
                              className="p-2 text-[#D96B2B] hover:bg-[#FFF4E9] rounded-lg transition-colors"
                              title="Edit article"
                            >
                              <Edit className="size-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(blog.slug, blog.title)}
                              className="p-2 text-[#DC3545] hover:bg-[#FFF1F0] rounded-lg transition-colors cursor-pointer"
                              title="Delete article"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E7DDD2] bg-[#FFFDF9] px-6 py-4">
            <span className="text-xs font-medium text-[#667085]">
              Showing <strong className="font-bold text-[#0B1F33]">{startIndex + 1}</strong> to{" "}
              <strong className="font-bold text-[#0B1F33]">{Math.min(startIndex + PAGE_SIZE, total)}</strong> of{" "}
              <strong className="font-bold text-[#0B1F33]">{total}</strong> articles
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E7DDD2] bg-white px-3 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="size-4" />
                <span>Prev</span>
              </button>

              {getPageNumbers(safePage, totalPages).map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="inline-flex size-9 items-center justify-center text-xs font-bold text-[#98A2B3]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`inline-flex size-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      p === safePage
                        ? "bg-[#D96B2B] text-white shadow-xs"
                        : "border border-[#E7DDD2] bg-white text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] shadow-xs"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E7DDD2] bg-white px-3 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
