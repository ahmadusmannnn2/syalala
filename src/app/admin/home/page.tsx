"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { updateRestaurantSettings } from "@/app/actions/home";
import { uploadBannerImage } from "@/app/actions/upload";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { RestaurantSettings } from "@/types";
import { Upload, Save } from "lucide-react";

export default function AdminHomePage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("restaurant_settings").select("*").single().then(({ data }) => {
      setSettings(data);
      setBannerPreview(data?.banner_image_url ?? null);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    try {
      let bannerUrl = settings.banner_image_url;
      if (bannerFile) {
        const fd = new FormData();
        fd.append("file", bannerFile);
        bannerUrl = await uploadBannerImage(fd);
      }
      await updateRestaurantSettings(settings.id, {
        name: settings.name,
        tagline: settings.tagline,
        hero_text: settings.hero_text,
        take_away_additional_fee: settings.take_away_additional_fee,
        jumbo_size_upgrade_fee: settings.jumbo_size_upgrade_fee,
        tax_percentage: settings.tax_percentage,
        tax_status: settings.tax_status,
        whatsapp_link: settings.whatsapp_link,
        google_maps_link: settings.google_maps_link,
        instagram_link: settings.instagram_link,
        banner_image_url: bannerUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof RestaurantSettings, type: string = "text", placeholder?: string) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={(settings?.[key] as string | number) ?? ""}
        onChange={(e) =>
          setSettings((s) =>
            s ? { ...s, [key]: type === "number" ? Number(e.target.value) : e.target.value } : s
          )
        }
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
      />
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (!settings) return <p className="text-center text-gray-500">Pengaturan tidak ditemukan.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-medium">
          ✅ Perubahan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Identitas Restoran</h3>
          {field("Nama Restoran", "name")}
          {field("Tagline", "tagline", "text", "Mie Sosis Bakar Extra Pedas")}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teks Hero</label>
            <textarea
              rows={2}
              value={settings.hero_text ?? ""}
              onChange={(e) => setSettings((s) => s ? { ...s, hero_text: e.target.value } : s)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] resize-none"
            />
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Biaya Tambahan</h3>
          <div className="grid grid-cols-2 gap-3">
            {field("Take Away (+Rp)", "take_away_additional_fee", "number")}
            {field("Upgrade Jumbo (+Rp)", "jumbo_size_upgrade_fee", "number")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("PPN (%)", "tax_percentage", "number")}
            {field("Keterangan Pajak", "tax_status")}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Link Sosial & Kontak</h3>
          {field("Link WhatsApp", "whatsapp_link", "url", "https://wa.me/628xxx")}
          {field("Link Google Maps", "google_maps_link", "url", "https://maps.google.com/...")}
          {field("Link Instagram", "instagram_link", "url", "https://instagram.com/syalala")}
        </div>

        {/* Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Banner Hero</h3>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#e6203b]/50 transition-colors overflow-hidden"
            style={{ height: 180 }}
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Klik untuk upload banner</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={saving}>
          <Save className="h-4 w-4" />
          Simpan Semua Perubahan
        </Button>
      </form>
    </div>
  );
}
