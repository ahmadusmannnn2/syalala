"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import { generateSlug } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Category } from "@/types";
import { Plus, Edit2, Trash2, X, CheckCircle, XCircle, Search, Filter, RotateCcw } from "lucide-react";

const emptyForm = { name: "", slug: "", description: "", order_number: 0, is_active: true };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState<"all" | "name" | "slug" | "description">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"order" | "name_asc" | "name_desc">("order");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("order_number");
    setItems(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditItem(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", order_number: cat.order_number, is_active: cat.is_active });
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: editItem ? f.slug : generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateCategory(editItem.id, form);
      } else {
        await createCategory(form);
      }
      setShowForm(false);
      await fetchData();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Hapus kategori "${cat.name}"? Pastikan tidak ada menu di kategori ini.`)) return;
    setDeleting(cat.id);
    try {
      await deleteCategory(cat.id);
      await fetchData();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setDeleting(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchColumn("all");
    setFilterStatus("all");
    setSortBy("order");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    searchColumn !== "all" ||
    filterStatus !== "all" ||
    sortBy !== "order";

  const filtered = items
    .filter((cat) => {
      // 1. Filter Pencarian Kolom
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const catName = cat.name.toLowerCase();
        const catSlug = cat.slug.toLowerCase();
        const catDesc = (cat.description || "").toLowerCase();

        if (searchColumn === "name" && !catName.includes(q)) return false;
        if (searchColumn === "slug" && !catSlug.includes(q)) return false;
        if (searchColumn === "description" && !catDesc.includes(q)) return false;
        if (searchColumn === "all") {
          const matchAny = catName.includes(q) || catSlug.includes(q) || catDesc.includes(q);
          if (!matchAny) return false;
        }
      }

      // 2. Filter Status
      if (filterStatus === "active" && !cat.is_active) return false;
      if (filterStatus === "inactive" && cat.is_active) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return a.order_number - b.order_number;
    });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toolbar & Filter Multi-Kolom */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 space-y-3">
        {/* Baris 1: Pencarian Berdasarkan Kolom Tertentu + Tambah Kategori */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Kolom yang dipilih untuk dicari */}
          <div className="relative min-w-[140px] sm:w-44 flex-shrink-0">
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] cursor-pointer"
            >
              <option value="all">🔍 Semua Kolom</option>
              <option value="name">Nama Kategori</option>
              <option value="slug">Slug</option>
              <option value="description">Deskripsi</option>
            </select>
          </div>

          {/* Input Pencarian */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchColumn === "all"
                  ? "Cari nama, slug, deskripsi kategori..."
                  : searchColumn === "name"
                  ? "Cari nama kategori..."
                  : searchColumn === "slug"
                  ? "Cari slug kategori..."
                  : "Cari kata kunci deskripsi..."
              }
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button onClick={openCreate} size="sm" className="flex-shrink-0 h-[42px] px-4">
            <Plus className="h-4 w-4" /> Tambah Kategori
          </Button>
        </div>

        {/* Baris 2: Dropdown Filter Spesifik */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="all">Semua Status</option>
            <option value="active">🟢 Aktif</option>
            <option value="inactive">🔴 Nonaktif</option>
          </select>

          {/* Urutan */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="order">Urutan Tampilan (Default)</option>
            <option value="name_asc">Nama (A - Z)</option>
            <option value="name_desc">Nama (Z - A)</option>
          </select>

          {/* Tombol Reset Filter */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#e6203b] border border-red-200 rounded-xl text-xs font-semibold transition-colors ml-auto"
            >
              <RotateCcw className="h-3 w-3" /> Reset Filter
            </button>
          )}
        </div>

        {/* Informasi Ringkasan */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <p>
            Menampilkan <span className="font-bold text-gray-900">{filtered.length}</span> dari{" "}
            <span className="font-bold text-gray-900">{items.length}</span> kategori
          </p>
          {hasActiveFilters && (
            <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium border border-amber-200">
              Filter / Pencarian Aktif
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        hasActiveFilters ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-3">
            <p className="text-gray-600 font-medium">
              Tidak ada kategori yang cocok dengan kriteria filter atau pencarian Anda.
            </p>
            <Button variant="secondary" size="sm" onClick={resetFilters} className="mx-auto">
              <RotateCcw className="h-3.5 w-3.5" /> Reset Semua Filter
            </Button>
          </div>
        ) : (
          <EmptyState title="Belum ada kategori" description="Tambah kategori menu terlebih dahulu." />
        )
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">Nama</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Urutan</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div
                      onClick={() => openEdit(cat)}
                      className="cursor-pointer group/title inline-block"
                      title="Klik nama kategori untuk mengedit"
                    >
                      <span className="font-semibold text-gray-900 group-hover/title:text-[#e6203b] transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-400 text-xs font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{cat.order_number}</td>
                  <td className="px-4 py-3">
                    {cat.is_active ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full w-fit">
                        <CheckCircle className="h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        <XCircle className="h-3 w-3" /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                        title="Edit Kategori"
                        aria-label="Edit kategori"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
                        title="Hapus Kategori"
                        aria-label="Hapus kategori"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden my-auto flex flex-col">
            <div className="bg-[#e6203b] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{editItem ? "Edit Kategori" : "Tambah Kategori"}</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama *</label>
                <input type="text" required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urutan</label>
                  <input type="number" min={0} value={form.order_number} onChange={(e) => setForm((f) => ({ ...f, order_number: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={form.is_active ? "1" : "0"} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "1" }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]">
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>
                  {editItem ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
