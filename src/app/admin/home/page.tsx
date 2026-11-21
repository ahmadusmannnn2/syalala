"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateRestaurantSettings } from "@/app/actions/home";
import { uploadBannerImage, uploadLogoImage } from "@/app/actions/upload";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { parseWhatsAppLink, buildWhatsAppUrl } from "@/lib/whatsapp";
import { RestaurantSettings } from "@/types";
import { Save, UtensilsCrossed, ExternalLink, MessageSquare } from "lucide-react";

export default function AdminHomePage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("restaurant_settings").select("*").single().then(({ data }) => {
      setSettings(data);
      setBannerPreview(data?.banner_image_url ?? null);
      setLogoPreview(data?.logo_url ?? null);
      if (data?.whatsapp_link) {
        const parsed = parseWhatsAppLink(data.whatsapp_link);
        setWaPhone(parsed.phone);
        setWaMessage(parsed.message || "Halo Syalala! Saya ingin memesan menu / tanya info.");
      } else {
        setWaPhone("6281325350008");
        setWaMessage("Halo Syalala! Saya ingin memesan menu / tanya info.");
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      } else if (bannerPreview === null) {
        bannerUrl = null;
      }

      let logoUrl = settings.logo_url;
      if (logoFile) {
        const fd = new FormData();
        fd.append("file", logoFile);
        logoUrl = await uploadLogoImage(fd);
      } else if (logoPreview === null) {
        logoUrl = null;
      }

      const finalWaLink = buildWhatsAppUrl(waPhone, waMessage);

      await updateRestaurantSettings(settings.id, {
        name: settings.name,
        tagline: settings.tagline,
        hero_text: settings.hero_text,
        take_away_additional_fee: settings.take_away_additional_fee,
        jumbo_size_upgrade_fee: settings.jumbo_size_upgrade_fee,
        tax_percentage: settings.tax_percentage,
        tax_status: settings.tax_status,
        whatsapp_link: finalWaLink || null,
        google_maps_link: settings.google_maps_link,
        instagram_link: settings.instagram_link,
        tiktok_link: settings.tiktok_link,
        banner_image_url: bannerUrl,
        logo_url: logoUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Gagal menyimpan perubahan"}`);
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
    <div className="max-w-2xl mx-auto pb-10">
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-medium">
          Perubahan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Restoran */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900">Logo Restoran</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Logo akan tampil di navbar atas, sidebar admin, dan header hero.
            </p>
          </div>

          <ImageUploadField
            label="Logo Restoran"
            helperText="Format: PNG, JPG, WEBP (Bisa dipotong persegi atau bulat 1:1)"
            previewUrl={logoPreview}
            aspect={1}
            aspectOptions={[{ label: "1:1 (Persegi)", value: 1 }]}
            cropShape="round"
            heightClass="h-40"
            onImageChange={(file, previewUrl) => {
              setLogoFile(file);
              setLogoPreview(previewUrl);
            }}
            onImageRemove={() => {
              setLogoFile(null);
              setLogoPreview(null);
              setSettings((s) => (s ? { ...s, logo_url: null } : s));
            }}
          />
        </div>

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
              onChange={(e) => setSettings((s) => (s ? { ...s, hero_text: e.target.value } : s))}
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

        {/* WhatsApp & Pesan Otomatis */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
              <WhatsAppIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">WhatsApp & Pesan Otomatis</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Atur nomor kontak restoran dan format pesan yang otomatis muncul saat pelanggan klik tombol WhatsApp.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nomor WhatsApp Restoran
            </label>
            <input
              type="text"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              placeholder="Contoh: 081325350008 atau 6281325350008"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Bisa diawali 08... atau 628... (akan otomatis disesuaikan ke format internasional WhatsApp).
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>Isi Pesan Otomatis</span>
              <span className="text-xs font-normal text-gray-400">
                {waMessage.length} karakter
              </span>
            </label>
            <textarea
              rows={3}
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              placeholder="Contoh: Halo Syalala! Saya ingin memesan menu / tanya info promo hari ini."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-green-600" /> Preview Tampilan Chat Pelanggan:
              </span>
              {buildWhatsAppUrl(waPhone, waMessage) && (
                <a
                  href={buildWhatsAppUrl(waPhone, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> Uji Coba Chat
                </a>
              )}
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 font-sans italic break-words">
              &ldquo;{waMessage.trim() || "Belum ada pesan otomatis (hanya membuka chat kosong)"}&rdquo;
            </div>
          </div>
        </div>

        {/* Links Medsos Lainnya */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Link Sosial Media & Lokasi</h3>
          {field("Link Google Maps (Lokasi)", "google_maps_link", "url", "https://maps.google.com/...")}
          {field("Link Instagram", "instagram_link", "url", "https://instagram.com/syalala")}
          {field("Link TikTok", "tiktok_link", "url", "https://www.tiktok.com/@syalala")}
        </div>

        {/* Banner Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900">Banner Hero</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Banner utama yang tampil di bagian atas halaman beranda pelanggan.
            </p>
          </div>

          <ImageUploadField
            label="Banner Hero Beranda"
            helperText="Format: JPG, PNG, WEBP (Otomatis dikompres & dipotong rasio lebar)"
            previewUrl={bannerPreview}
            aspect={16 / 9}
            aspectOptions={[
              { label: "16:9 (Standar)", value: 16 / 9 },
              { label: "2:1 (Lebar)", value: 2 / 1 },
              { label: "4:3 (Tinggi)", value: 4 / 3 },
            ]}
            heightClass="h-48"
            onImageChange={(file, previewUrl) => {
              setBannerFile(file);
              setBannerPreview(previewUrl);
            }}
            onImageRemove={() => {
              setBannerFile(null);
              setBannerPreview(null);
              setSettings((s) => (s ? { ...s, banner_image_url: null } : s));
            }}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={saving}>
          <Save className="h-4 w-4" />
          Simpan Semua Perubahan
        </Button>
      </form>
    </div>
  );
}
