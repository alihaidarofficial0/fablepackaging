"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit2, Check, X, FolderOpen, Loader2 } from "lucide-react";
import {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/app/admin/blog/actions";
import { toast } from "@/components/Toast";

const packagingPresets = [
  { name: "Box Styles & Structural Design", desc: "Rigid boxes, corrugated mailers, folding cartons, and dielines." },
  { name: "Materials & Substrates", desc: "Virgin kraft, fluted boards, greyboard cores, and paper calipers." },
  { name: "Sustainable Packaging", desc: "Zero-plastic solutions, circular design, and biodegradable soy inks." },
  { name: "Printing & Luxury Finishes", desc: "Hot foil stamping, blind debossing, soft-touch coatings, and spot UV." },
  { name: "E-Commerce & Unboxing", desc: "Direct-to-consumer shipping, branded reveals, and custom inserts." },
  { name: "Industry Solutions", desc: "Packaging systems for beauty, food & beverage, and retail." },
  { name: "Prepress & Design Guides", desc: "Production checklists, bleed tolerances, and artwork preparation." },
];

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.set("name", newName.trim());
    formData.set("description", newDescription.trim());

    const res = await addCategory(formData);
    setSubmitting(false);

    if (res.success) {
      toast.success("Category added.");
      setNewName("");
      setNewDescription("");
      loadData();
    } else {
      toast.error(res.error || "Failed to add category");
    }
  };

  const handleQuickAddPreset = async (preset: { name: string; desc: string }) => {
    setNewName(preset.name);
    setNewDescription(preset.desc);
    const existing = categories.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
    if (existing) {
      toast.info(`"${preset.name}" already exists.`);
      return;
    }
    const formData = new FormData();
    formData.set("name", preset.name);
    formData.set("description", preset.desc);
    const res = await addCategory(formData);
    if (res.success) {
      toast.success(`Category "${preset.name}" added.`);
      loadData();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      toast.success("Category deleted.");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id || cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    const res = await updateCategory(id, editName, editDesc);
    if (res.success) {
      toast.success("Category updated.");
      setEditingId(null);
      loadData();
    } else {
      toast.error(res.error || "Failed to update category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420] transition-colors mb-2"
        >
          <ArrowLeft className="size-4" /> Back to Journal Posts
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#0B1F33]">
          Journal Categories
        </h1>
        <p className="mt-3 text-sm text-[#667085]">
          Organize your articles by topic and themes to help readers discover your stories.
        </p>
      </div>

      {/* Packaging Presets Section */}
      <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-2xl border border-[#E7DDD2] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
          <FolderOpen className="size-4 text-[#D96B2B]" />
          <span>Industry Packaging Presets (Click to Auto-Add):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {packagingPresets.map((preset) => {
            const isAdded = categories.some(
              (c) => c.name.toLowerCase() === preset.name.toLowerCase()
            );
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleQuickAddPreset(preset)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isAdded
                    ? "bg-[#EAE4DC] text-[#667085] border border-[#D9D0C7]"
                    : "bg-white border border-[#E7DDD2] text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] hover:shadow-xs"
                }`}
                title={preset.desc}
              >
                {isAdded ? (
                  <Check className="size-3 text-[#198754]" />
                ) : (
                  <Plus className="size-3 text-[#D96B2B]" />
                )}
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DDD2] shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0B1F33]">
          <Plus className="size-4 text-[#D96B2B]" /> Add Custom Category
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Category Name (e.g. Circular Economy)"
            className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm font-semibold text-[#0B1F33] outline-none focus:border-[#D96B2B]"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Short description for readers"
            className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E7DDD2] rounded-xl text-sm text-[#0B1F33] outline-none focus:border-[#D96B2B]"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting || !newName.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#BC5420] transition-all shadow-md shadow-[#D96B2B]/20 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Create Category"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E7DDD2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#F0EAE2] flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#0B1F33]">
            Active Categories ({categories.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm font-semibold text-[#667085]">
            <Loader2 className="size-5 animate-spin mx-auto mb-2 text-[#D96B2B]" />
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#667085]">
            No categories defined yet. Add your first topic above.
          </div>
        ) : (
          <div className="divide-y divide-[#F0EAE2]">
            {categories.map((cat, idx) => {
              const id = cat.id || cat._id || `cat-${idx}`;
              const isEditing = editingId === id;

              return (
                <div
                  key={`${id}-${cat.slug || cat.name || idx}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FFFDF9] transition-colors"
                >
                  {isEditing ? (
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#E7DDD2] rounded-lg text-sm font-bold text-[#0B1F33]"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="w-full px-3 py-1.5 bg-white border border-[#E7DDD2] rounded-lg text-xs text-[#667085]"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0B1F33]">
                        {cat.name}
                      </h4>
                      {cat.description && (
                        <p className="text-xs text-[#667085] mt-0.5">{cat.description}</p>
                      )}
                      <span className="text-[11px] font-mono text-[#98A2B3] mt-1 inline-block">
                        slug: /blog/category/{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          title="Save changes"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-2 text-[#667085] hover:bg-gray-100 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="p-2 text-[#667085] hover:text-[#D96B2B] hover:bg-[#FFF4E9] rounded-lg transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id, cat.name)}
                          className="p-2 text-[#667085] hover:text-[#DC3545] hover:bg-[#FFF1F0] rounded-lg transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
