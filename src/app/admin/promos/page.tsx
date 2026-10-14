"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPromotion, updatePromotion, deletePromotion } from "@/app/actions/promos";
import { uploadPromoImage, deleteStorageFile } from "@/app/actions/upload";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Promotion } from "@/types";
import { Plus, Edit2, Trash2, X, Gift, Upload, Image as ImageIcon } from "lucide-react";

const DAYS = [
  { value: "monday", label: "Senin" },
  { value: "tuesday", label: "Selasa" },
  { value: "wednesday", label: "Rabu" },
  { value: "thursday", label: "Kamis" },
  { value: "friday", label: "Jumat" },
  { value: "saturday", label: "Sabtu" },
  { value: "sunday", label: "Minggu" },
];

const emptyForm = {
  name: "",
  description: "",
  min_transaction: 0 as number | null,
  reward: "",
  start_date: "",
  end_date: "",
  valid_days: [] as string[],
  valid_time_start: "",
  valid_time_end: "",
  valid_time_start_2: "",
  valid_time_end_2: "",
  is_active: true,
  image_url: null as string | null,
};

export default function AdminPromosPage() {
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Promotion | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditItem(promo);
    setForm({
      name: promo.name,
      description: promo.description ?? "",
      min_transaction: promo.min_transaction,
      reward: promo.reward ?? "",
      start_date: promo.start_date ?? "",
      end_date: promo.end_date ?? "",
      valid_days: promo.valid_days ?? [],
      valid_time_start: promo.valid_time_start ?? "",
      valid_time_end: promo.valid_time_end ?? "",
      valid_time_start_2: promo.valid_time_start_2 ?? "",
      valid_time_end_2: promo.valid_time_end_2 ?? "",
      is_active: promo.is_active,
      image_url: promo.image_url,
    });
    setImageFile(null);
    setImagePreview(promo.image_url);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      valid_days: f.valid_days.includes(day)
        ? f.valid_days.filter((d) => d !== day)
        : [...f.valid_days, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        imageUrl = await uploadPromoImage(fd);
        if (editItem?.image_url && editItem.image_url !== imageUrl) {
          await deleteStorageFile(editItem.image_url);
        }
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        valid_time_start: form.valid_time_start || null,
        valid_time_end: form.valid_time_end || null,
        valid_time_start_2: form.valid_time_start_2 || null,
        valid_time_end_2: form.valid_time_end_2 || null,
        min_transaction: form.min_transaction ? Number(form.min_transaction) : null,
      };

      if (editItem) {
        await updatePromotion(editItem.id, payload);
      } else {
        await createPromotion(payload);
      }
      setShowForm(false);
      await fetchData();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Gagal menyimpan promo"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (promo: Promotion) => {
    if (!confirm(`Hapus promo "${promo.name}"?`)) return;
    setDeleting(promo.id);
    try {
      await deletePromotion(promo.id);
      if (promo.image_url) {
        await deleteStorageFile(promo.image_url);
      }
      await fetchData();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Gagal menghapus promo"}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end mb-5">
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" /> Tambah Promo
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState title="Belum ada promo" icon={<Gift className="h-10 w-10 text-gray-300" />} />
      ) : (
        <div className="space-y-3">
          {items.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                {promo.image_url ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img src={promo.image_url} alt={promo.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`mt-0.5 p-2.5 rounded-xl flex-shrink-0 ${promo.is_active ? "bg-green-50" : "bg-gray-100"}`}>
                    <Gift className={`h-5 w-5 ${promo.is_active ? "text-green-500" : "text-gray-400"}`} />
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{promo.name}</p>
                  {promo.reward && <p className="text-sm text-gray-500">{promo.reward}</p>}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {promo.min_transaction && (
                      <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600 font-medium">
                        Min. {formatRupiah(promo.min_transaction)}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        promo.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {promo.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(promo)}
                  className="p-2 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"
                  aria-label="Edit promo"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(promo)}
                  disabled={deleting === promo.id}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                  aria-label="Hapus promo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl z-10">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit Promo" : "Tambah Promo"}</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Foto / Banner Promo (Opsional)
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#e6203b]/50 transition-colors overflow-hidden bg-gray-50 flex items-center justify-center"
                  style={{ height: 160 }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Upload className="h-7 w-7 text-gray-400" />
                      <p className="text-xs font-medium">Klik untuk upload foto / banner promo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                      setForm((f) => ({ ...f, image_url: null }));
                    }}
                    className="mt-1.5 text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
                  >
                    <X className="h-3 w-3" /> Hapus gambar
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Promo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  placeholder="Contoh: Promo Merdeka"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi Promo</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi singkat promo..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reward / Hadiah</label>
                <input
                  type="text"
                  value={form.reward}
                  onChange={(e) => setForm((f) => ({ ...f, reward: e.target.value }))}
                  placeholder="Contoh: Gratis 1 porsi Cireng / Kentang Goreng"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Minimal Transaksi (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={form.min_transaction ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      min_transaction: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  placeholder="Contoh: 81000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                </div>
              </div>

              {/* Valid days */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hari Berlaku</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        form.valid_days.includes(d.value)
                          ? "bg-[#e6203b] text-white border-[#e6203b]"
                          : "border-gray-200 text-gray-600 hover:border-[#e6203b]/50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valid time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jam Berlaku (Sesi 1)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={form.valid_time_start}
                    onChange={(e) => setForm((f) => ({ ...f, valid_time_start: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                  <input
                    type="time"
                    value={form.valid_time_end}
                    onChange={(e) => setForm((f) => ({ ...f, valid_time_end: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jam Berlaku (Sesi 2, opsional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={form.valid_time_start_2}
                    onChange={(e) => setForm((f) => ({ ...f, valid_time_start_2: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                  <input
                    type="time"
                    value={form.valid_time_end_2}
                    onChange={(e) => setForm((f) => ({ ...f, valid_time_end_2: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#e6203b]"
                  />
                  <span className="text-sm font-semibold text-gray-700">Promo Aktif</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" className="flex-1" isLoading={saving}>
                  {editItem ? "Simpan Perubahan" : "Tambah Promo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
