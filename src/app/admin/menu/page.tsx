"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuAvailability } from "@/app/actions/menu";
import { uploadMenuImage, deleteStorageFile } from "@/app/actions/upload";
import { generateSlug, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MenuItem, Category } from "@/types";
import {
  Plus, Edit2, Trash2, X, Star, ChefHat,
  ShoppingBag, CheckCircle, XCircle, Search, Eye,
  Filter, RotateCcw, ArrowUpDown, ImageIcon,
} from "lucide-react";

const emptyForm = {
  name: "", slug: "", category_id: "", price: 0, description: "",
  image_url: null as string | null, is_available: true, is_best_seller: false,
  is_chef_choice: false, supports_jumbo: false, order_number: 0,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState<"all" | "name" | "category" | "description" | "price">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "unavailable">("all");
  const [filterBadge, setFilterBadge] = useState<"all" | "best_seller" | "chef_choice" | "supports_jumbo" | "has_image" | "no_image">("all");
  const [sortBy, setSortBy] = useState<"order" | "name_asc" | "name_desc" | "price_asc" | "price_desc">("order");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<{ url: string; name: string } | null>(null);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const [mRes, cRes] = await Promise.all([
      supabase
        .from("menu_items")
        .select("*, category:categories(id, name, slug, description, order_number, is_active, created_at, updated_at)")
        .order("order_number"),
      supabase.from("categories").select("*").eq("is_active", true).order("order_number"),
    ]);
    setItems(mRes.data ?? []);
    setCategories(cRes.data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name, slug: item.slug, category_id: item.category_id,
      price: item.price, description: item.description ?? "",
      image_url: item.image_url, is_available: item.is_available,
      is_best_seller: item.is_best_seller, is_chef_choice: item.is_chef_choice,
      supports_jumbo: item.supports_jumbo, order_number: item.order_number,
    });
    setImageFile(null);
    setImagePreview(item.image_url);
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: editItem ? f.slug : generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        imageUrl = await uploadMenuImage(fd);
        // Remove old image if replacing
        if (editItem?.image_url && editItem.image_url !== imageUrl) {
          await deleteStorageFile(editItem.image_url);
        }
      }

      const payload = { ...form, image_url: imageUrl, price: Number(form.price) };

      if (editItem) {
        await updateMenuItem(editItem.id, payload);
      } else {
        await createMenuItem(payload);
      }

      setShowForm(false);
      await fetchData();
    } catch (err: unknown) {
      alert(`Gagal menyimpan: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Hapus menu "${item.name}"?`)) return;
    setDeleting(item.id);
    try {
      await deleteMenuItem(item.id);
      if (item.image_url) await deleteStorageFile(item.image_url);
      await fetchData();
    } catch (err: unknown) {
      alert(`Gagal menghapus: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAvail = async (item: MenuItem) => {
    const nextState = !item.is_available;
    // Optimistic UI update (instantly flips the switch)
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: nextState } : i))
    );
    try {
      await toggleMenuAvailability(item.id, nextState);
    } catch (err: unknown) {
      // Revert if error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: !nextState } : i))
      );
      alert(`Gagal mengubah status: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchColumn("all");
    setFilterCategory("all");
    setFilterAvailability("all");
    setFilterBadge("all");
    setSortBy("order");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    searchColumn !== "all" ||
    filterCategory !== "all" ||
    filterAvailability !== "all" ||
    filterBadge !== "all" ||
    sortBy !== "order";

  const filtered = items
    .filter((item) => {
      // 1. Filter Pencarian Kolom
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const categoryName = (item.category as { name?: string } | null)?.name?.toLowerCase() || "";
        const itemName = item.name.toLowerCase();
        const itemDesc = (item.description || "").toLowerCase();
        const itemPrice = item.price.toString();

        if (searchColumn === "name" && !itemName.includes(q)) return false;
        if (searchColumn === "category" && !categoryName.includes(q)) return false;
        if (searchColumn === "description" && !itemDesc.includes(q)) return false;
        if (searchColumn === "price" && !itemPrice.includes(q)) return false;
        if (searchColumn === "all") {
          const matchAny =
            itemName.includes(q) ||
            categoryName.includes(q) ||
            itemDesc.includes(q) ||
            itemPrice.includes(q);
          if (!matchAny) return false;
        }
      }

      // 2. Filter Kategori
      if (filterCategory !== "all" && item.category_id !== filterCategory) {
        return false;
      }

      // 3. Filter Status Ketersediaan
      if (filterAvailability === "available" && !item.is_available) return false;
      if (filterAvailability === "unavailable" && item.is_available) return false;

      // 4. Filter Badge & Media
      if (filterBadge === "best_seller" && !item.is_best_seller) return false;
      if (filterBadge === "chef_choice" && !item.is_chef_choice) return false;
      if (filterBadge === "supports_jumbo" && !item.supports_jumbo) return false;
      if (filterBadge === "has_image" && !item.image_url) return false;
      if (filterBadge === "no_image" && !!item.image_url) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return a.order_number - b.order_number;
    });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar & Filter Multi-Kolom */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 space-y-3">
        {/* Baris 1: Pencarian Berdasarkan Kolom Tertentu + Tambah Menu */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Kolom yang dipilih untuk dicari */}
          <div className="relative min-w-[140px] sm:w-44 flex-shrink-0">
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] cursor-pointer"
            >
              <option value="all">🔍 Semua Kolom</option>
              <option value="name">Nama Menu</option>
              <option value="category">Kategori</option>
              <option value="description">Deskripsi</option>
              <option value="price">Harga (Angka)</option>
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
                  ? "Cari menu, kategori, deskripsi, harga..."
                  : searchColumn === "name"
                  ? "Cari nama menu..."
                  : searchColumn === "category"
                  ? "Cari nama kategori..."
                  : searchColumn === "description"
                  ? "Cari kata kunci deskripsi..."
                  : "Cari nominal harga..."
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
            <Plus className="h-4 w-4" /> Tambah Menu
          </Button>
        </div>

        {/* Baris 2: Dropdown Filter Spesifik */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          {/* Filter Kategori */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Filter Status Ketersediaan */}
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="all">Semua Ketersediaan</option>
            <option value="available">🟢 Tersedia</option>
            <option value="unavailable">🔴 Tidak Tersedia (Habis)</option>
          </select>

          {/* Filter Badge & Media */}
          <select
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="all">Semua Badge & Foto</option>
            <option value="best_seller">⭐ Best Seller</option>
            <option value="chef_choice">👨‍🍳 Chef&apos;s Choice</option>
            <option value="supports_jumbo">🍜 Bisa Jumbo</option>
            <option value="has_image">🖼️ Memiliki Foto</option>
            <option value="no_image">⚠️ Belum Ada Foto</option>
          </select>

          {/* Urutan */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e6203b]"
          >
            <option value="order">Urutan Menu (Default)</option>
            <option value="name_asc">Nama (A - Z)</option>
            <option value="name_desc">Nama (Z - A)</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
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
            <span className="font-bold text-gray-900">{items.length}</span> menu
          </p>
          {hasActiveFilters && (
            <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium border border-amber-200">
              Filter / Pencarian Aktif
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        hasActiveFilters ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-3">
            <p className="text-gray-600 font-medium">
              Tidak ada menu yang cocok dengan kriteria filter atau pencarian Anda.
            </p>
            <Button variant="secondary" size="sm" onClick={resetFilters} className="mx-auto">
              <RotateCcw className="h-3.5 w-3.5" /> Reset Semua Filter
            </Button>
          </div>
        ) : (
          <EmptyState title="Belum ada menu" description="Tambah menu pertama kamu!" />
        )
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Menu</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Kategori</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Harga</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Badge</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => {
                            if (item.image_url) setPreviewModalUrl({ url: item.image_url, name: item.name });
                          }}
                          className={`w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 ${
                            item.image_url ? "cursor-pointer hover:ring-2 hover:ring-[#e6203b]" : ""
                          }`}
                          title={item.image_url ? "Klik untuk preview foto" : "Belum ada foto"}
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#e6203b]/20 to-red-100" />
                          )}
                        </div>
                        <div
                          onClick={() => openEdit(item)}
                          className="cursor-pointer group/title"
                          title="Klik nama menu untuk mengedit"
                        >
                          <p className="font-bold text-gray-900 group-hover/title:text-[#e6203b] transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">
                      {(item.category as { name: string } | null)?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#e6203b]">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {item.is_best_seller && <Badge variant="best-seller"><Star className="h-2.5 w-2.5 fill-white" /> BS</Badge>}
                        {item.is_chef_choice && <Badge variant="chef-choice"><ChefHat className="h-2.5 w-2.5" /> CC</Badge>}
                        {item.supports_jumbo && <Badge variant="default"><ShoppingBag className="h-2.5 w-2.5" /> Jumbo</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleAvail(item)}
                        className="inline-flex items-center gap-2.5 group cursor-pointer select-none focus:outline-none"
                        title={item.is_available ? "Klik untuk ubah jadi Habis" : "Klik untuk ubah jadi Tersedia"}
                      >
                        {/* iOS Toggle Switch Slider */}
                        <div
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            item.is_available ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              item.is_available ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                        {/* Label */}
                        <span
                          className={`text-xs font-bold transition-colors ${
                            item.is_available ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {item.is_available ? "Tersedia" : "Habis"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Tombol Edit & Hapus dengan Jarak Aman & Desain Jelas */}
                      <div className="flex items-center justify-end gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                          title="Edit Menu"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deleting === item.id}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
                          title="Hapus Menu"
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
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl border border-gray-100 my-auto flex flex-col">
            <div className="sticky top-0 bg-[#e6203b] text-white px-5 py-4 flex items-center justify-between rounded-t-3xl z-10 shadow-sm">
              <h3 className="font-bold text-white text-base">{editItem ? "Edit Menu" : "Tambah Menu"}</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload & Interactive Mobile-like Gallery Cropper */}
              <div className="space-y-3">
                <ImageUploadField
                  label="Foto Menu"
                  helperText="Format: JPG, PNG, WEBP (Otomatis dikompres & dipotong rasio 4:3)"
                  previewUrl={imagePreview}
                  aspect={4 / 3}
                  aspectOptions={[
                    { label: "4:3 (Standar Menu)", value: 4 / 3 },
                    { label: "1:1 (Persegi)", value: 1 },
                    { label: "16:9 (Lebar)", value: 16 / 9 },
                  ]}
                  heightClass="h-44"
                  onImageChange={(file, previewUrl) => {
                    setImageFile(file);
                    setImagePreview(previewUrl);
                    setForm((f) => ({ ...f, image_url: previewUrl }));
                  }}
                  onImageRemove={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setForm((f) => ({ ...f, image_url: null }));
                  }}
                />

                {/* Simulasi Tampilan Real di Menu Pelanggan */}
                {imagePreview && (
                  <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-2xl">
                    <p className="text-[11px] text-gray-500 mb-2 flex items-center gap-1 font-semibold">
                      <Eye className="h-3.5 w-3.5 text-[#e6203b]" />
                      Simulasi Tampilan di Menu Pelanggan (Rasio 4:3):
                    </p>
                    <div className="w-48 mx-auto rounded-2xl overflow-hidden shadow-md border border-red-200/60 bg-gradient-to-br from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white">
                      <div className="relative h-28 w-full overflow-hidden bg-black/10">
                        <img
                          src={imagePreview}
                          alt="Simulasi"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="font-bold text-xs truncate leading-tight">{form.name || "Nama Menu"}</p>
                        <p className="font-black text-xs mt-1 text-white">{formatRupiah(form.price || 15000)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Menu *</label>
                <input type="text" required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori *</label>
                  <select required value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]">
                    <option value="">Pilih...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga (Rp) *</label>
                  <input type="number" required min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] resize-none" />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "is_available", label: "Tersedia" },
                  { key: "is_best_seller", label: "Best Seller" },
                  { key: "is_chef_choice", label: "Chef Choice" },
                  { key: "supports_jumbo", label: "Support Jumbo" },
                ] as { key: keyof typeof form; label: string }[]).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition-colors">
                    <input type="checkbox" checked={form[key] as boolean} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded accent-[#e6203b]" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urutan Tampil</label>
                <input type="number" min={0} value={form.order_number} onChange={(e) => setForm((f) => ({ ...f, order_number: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>
                  {editItem ? "Simpan Perubahan" : "Tambah Menu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal (Table thumbnail click) */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h4 className="font-bold text-gray-900 text-sm truncate">{previewModalUrl.name}</h4>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={previewModalUrl.url}
                alt={previewModalUrl.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">Klik tombol silang atau di luar untuk menutup</p>
          </div>
        </div>
      )}
    </div>
  );
}
