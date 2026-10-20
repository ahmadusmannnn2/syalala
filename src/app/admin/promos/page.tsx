"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPromotion, updatePromotion, deletePromotion } from "@/app/actions/promos";
import { uploadPromoImage, deleteStorageFile } from "@/app/actions/upload";
import { formatRupiah, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Promotion } from "@/types";
import { Plus, Edit2, Trash2, X, Gift, Image as ImageIcon, Clock, CheckCircle2 } from "lucide-react";

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
  const [timeMode, setTimeMode] = useState<"all_day" | "single_session" | "two_sessions">("all_day");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

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
    setTimeMode("all_day");
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

    // Otomatis tentukan mode jam berlaku
    if (promo.valid_time_start_2 && promo.valid_time_end_2) {
      setTimeMode("two_sessions");
    } else if (promo.valid_time_start && promo.valid_time_end) {
      setTimeMode("single_session");
    } else {
      setTimeMode("all_day");
    }

    setImageFile(null);
    setImagePreview(promo.image_url);
    setShowForm(true);
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
      } else if (form.image_url === null && editItem?.image_url) {
        await deleteStorageFile(editItem.image_url);
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        // Kirim jam sesuai mode yang dipilih
        valid_time_start:
          timeMode !== "all_day" && form.valid_time_start ? form.valid_time_start : null,
        valid_time_end:
          timeMode !== "all_day" && form.valid_time_end ? form.valid_time_end : null,
        valid_time_start_2:
          timeMode === "two_sessions" && form.valid_time_start_2
            ? form.valid_time_start_2
            : null,
        valid_time_end_2:
          timeMode === "two_sessions" && form.valid_time_end_2
            ? form.valid_time_end_2
            : null,
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
                  <div
                    onClick={() => openEdit(promo)}
                    className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    title="Klik untuk mengedit promo"
                  >
                    <img src={promo.image_url} alt={promo.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    onClick={() => openEdit(promo)}
                    className={`mt-0.5 p-2.5 rounded-xl flex-shrink-0 cursor-pointer ${promo.is_active ? "bg-green-50" : "bg-gray-100"}`}
                    title="Klik untuk mengedit promo"
                  >
                    <Gift className={`h-5 w-5 ${promo.is_active ? "text-green-500" : "text-gray-400"}`} />
                  </div>
                )}
                <div>
                  <div
                    onClick={() => openEdit(promo)}
                    className="cursor-pointer group/title"
                    title="Klik nama promo untuk mengedit"
                  >
                    <p className="font-bold text-gray-900 group-hover/title:text-[#e6203b] transition-colors">
                      {promo.name}
                    </p>
                    {promo.reward && <p className="text-sm text-gray-500">{promo.reward}</p>}
                  </div>
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
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(promo)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                  title="Edit Promo"
                  aria-label="Edit promo"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(promo)}
                  disabled={deleting === promo.id}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
                  title="Hapus Promo"
                  aria-label="Hapus promo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl border border-gray-100 my-auto flex flex-col">
            <div className="sticky top-0 bg-[#e6203b] text-white px-5 py-4 flex items-center justify-between rounded-t-3xl z-10 shadow-sm">
              <h3 className="font-bold text-white text-base">
                {editItem ? "Edit Promo" : "Tambah Promo"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Image upload & Interactive Mobile-like Gallery Cropper */}
              <ImageUploadField
                label="Foto / Banner Promo"
                helperText="Format: JPG, PNG, WEBP (Otomatis dikompres & dipotong rasio 16:9)"
                previewUrl={imagePreview}
                aspect={16 / 9}
                aspectOptions={[
                  { label: "16:9 (Lebar Banner)", value: 16 / 9 },
                  { label: "4:3 (Standar)", value: 4 / 3 },
                  { label: "1:1 (Persegi)", value: 1 },
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

              {/* PENGATURAN JAM BERLAKU PROMO */}
              <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-800">
                    Jam Berlaku Promo
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">Pilih jadwal jam promo</span>
                </div>

                {/* 3 Opsi: Sepanjang Hari, 1 Sesi, 2 Sesi */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white border border-gray-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeMode("all_day");
                      setForm((f) => ({
                        ...f,
                        valid_time_start: "",
                        valid_time_end: "",
                        valid_time_start_2: "",
                        valid_time_end_2: "",
                      }));
                    }}
                    className={cn(
                      "py-2 px-1 rounded-lg text-xs font-semibold transition-all text-center",
                      timeMode === "all_day"
                        ? "bg-[#e6203b] text-white shadow-sm font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    Sepanjang Hari
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimeMode("single_session");
                      setForm((f) => ({
                        ...f,
                        valid_time_start_2: "",
                        valid_time_end_2: "",
                      }));
                    }}
                    className={cn(
                      "py-2 px-1 rounded-lg text-xs font-semibold transition-all text-center",
                      timeMode === "single_session"
                        ? "bg-[#e6203b] text-white shadow-sm font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    1 Sesi Jam
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeMode("two_sessions")}
                    className={cn(
                      "py-2 px-1 rounded-lg text-xs font-semibold transition-all text-center",
                      timeMode === "two_sessions"
                        ? "bg-[#e6203b] text-white shadow-sm font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    2 Sesi Jam
                  </button>
                </div>

                {/* Keterangan Sepanjang Hari */}
                {timeMode === "all_day" && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-xs font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Promo berlaku sepanjang hari (tidak dibatasi jam tertentu).</span>
                  </div>
                )}

                {/* Input Sesi 1 */}
                {timeMode !== "all_day" && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#e6203b]" />
                        Sesi 1 {timeMode === "two_sessions" ? "(Siang)" : ""}
                      </span>
                      {timeMode === "single_session" && (
                        <button
                          type="button"
                          onClick={() => setTimeMode("two_sessions")}
                          className="text-[11px] text-[#e6203b] hover:underline font-semibold"
                        >
                          + Tambah Sesi 2
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">Jam Mulai</label>
                        <input
                          type="time"
                          value={form.valid_time_start}
                          onChange={(e) => setForm((f) => ({ ...f, valid_time_start: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">Jam Selesai</label>
                        <input
                          type="time"
                          value={form.valid_time_end}
                          onChange={(e) => setForm((f) => ({ ...f, valid_time_end: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Input Sesi 2 */}
                {timeMode === "two_sessions" && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#e6203b]" />
                        Sesi 2 (Malam)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTimeMode("single_session");
                          setForm((f) => ({ ...f, valid_time_start_2: "", valid_time_end_2: "" }));
                        }}
                        className="text-[11px] text-red-500 hover:underline font-medium"
                      >
                        Nonaktifkan Sesi 2
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">Jam Mulai</label>
                        <input
                          type="time"
                          value={form.valid_time_start_2}
                          onChange={(e) => setForm((f) => ({ ...f, valid_time_start_2: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">Jam Selesai</label>
                        <input
                          type="time"
                          value={form.valid_time_end_2}
                          onChange={(e) => setForm((f) => ({ ...f, valid_time_end_2: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
