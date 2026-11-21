"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFooterConfig, updateFooterConfig, FooterConfig } from "@/app/actions/footer";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { Footer } from "@/components/layout/Footer";
import {
  Save,
  PanelBottom,
  MapPin,
  Eye,
  CheckCircle2,
  RefreshCw,
  Globe,
  Sliders,
} from "lucide-react";

export default function AdminFooterPage() {
  const [config, setConfig] = useState<FooterConfig>({
    tagline: "Mie Sosis Bakar Extra Pedas",
    copyright: `© ${new Date().getFullYear()} Syalala. Harga belum termasuk PPN 10%.`,
    address: "",
    show_wa: true,
    show_ig: true,
    show_tiktok: true,
    show_maps: true,
    custom_wa_link: "",
    custom_ig_link: "",
    custom_tiktok_link: "",
    custom_maps_link: "",
  });

  const [generalSettings, setGeneralSettings] = useState<{
    name: string;
    logo_url: string | null;
    tagline: string;
    whatsapp_link: string | null;
    instagram_link: string | null;
    tiktok_link: string | null;
    google_maps_link: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [footerData, { data: settings }] = await Promise.all([
          getFooterConfig(),
          supabase
            .from("restaurant_settings")
            .select("name, logo_url, tagline, whatsapp_link, instagram_link, tiktok_link, google_maps_link")
            .single(),
        ]);

        if (footerData) {
          setConfig(footerData);
        }
        if (settings) {
          setGeneralSettings(settings);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan footer:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateFooterConfig(config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : "Gagal menyimpan footer"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (!confirm("Kembalikan pengaturan footer ke default restoran?")) return;
    setConfig({
      tagline: generalSettings?.tagline || "Mie Sosis Bakar Extra Pedas",
      copyright: `© ${new Date().getFullYear()} ${generalSettings?.name || "Syalala"}. Harga belum termasuk PPN 10%.`,
      address: "",
      show_wa: true,
      show_ig: true,
      show_tiktok: true,
      show_maps: true,
      custom_wa_link: "",
      custom_ig_link: "",
      custom_tiktok_link: "",
      custom_maps_link: "",
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PanelBottom className="h-6 w-6 text-[#e6203b]" />
            <span>Kelola Tampilan Footer</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Atur teks, alamat, hak cipta, dan visibilitas tombol kontak yang tampil di bagian bawah seluruh halaman.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefault}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>Perubahan footer berhasil disimpan dan telah diterapkan di semua halaman website!</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-[#e6203b]" /> Live Preview Footer (Tampilan Pelanggan):
          </span>
          <span className="text-[11px] font-normal text-gray-400">Otomatis update saat Anda mengetik</span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
          <Footer
            logoUrl={generalSettings?.logo_url ?? null}
            restaurantName={generalSettings?.name ?? "Syalala"}
            tagline={generalSettings?.tagline ?? "Mie Sosis Bakar Extra Pedas"}
            waLink={generalSettings?.whatsapp_link ?? null}
            igLink={generalSettings?.instagram_link ?? null}
            tiktokLink={generalSettings?.tiktok_link ?? null}
            mapsLink={generalSettings?.google_maps_link ?? null}
            footerConfig={config}
          />
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teks & Konten */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#e6203b]" />
            <span>Teks & Konten Footer</span>
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tagline / Deskripsi Singkat Footer
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              placeholder="Contoh: Mie Sosis Bakar Extra Pedas - Sejak 2014"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Tampil tepat di bawah nama dan logo restoran pada footer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Alamat / Keterangan Lokasi (Opsional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="Contoh: Jl. Ahmad Yani No. 45, Kota, Indonesia"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Kosongkan jika tidak ingin menampilkan teks alamat di footer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Teks Hak Cipta & Catatan Kaki (Copyright)
            </label>
            <input
              type="text"
              value={config.copyright}
              onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
              placeholder="Contoh: © 2026 Syalala. Harga belum termasuk PPN 10%."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Tampil di bagian paling bawah footer di seluruh halaman.
            </p>
          </div>
        </div>

        {/* Visibilitas Ikon Media Sosial & Kontak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#e6203b]" />
              <span>Ikon Media Sosial & Kontak di Footer</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Pilih ikon mana saja yang ingin ditampilkan di footer. Anda juga bisa mengatur link khusus jika ingin berbeda dari pengaturan umum.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {/* WhatsApp */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">WhatsApp</p>
                  <p className="text-xs text-gray-400">Tampilkan tombol WhatsApp di footer</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.show_wa}
                    onChange={(e) => setConfig({ ...config, show_wa: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>

            {/* Instagram */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center flex-shrink-0">
                  <InstagramIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Instagram</p>
                  <p className="text-xs text-gray-400">Tampilkan tombol profil Instagram</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.show_ig}
                    onChange={(e) => setConfig({ ...config, show_ig: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>

            {/* TikTok */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900/10 text-gray-900 flex items-center justify-center flex-shrink-0">
                  <TikTokIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">TikTok</p>
                  <p className="text-xs text-gray-400">Tampilkan tombol akun TikTok</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.show_tiktok}
                    onChange={(e) => setConfig({ ...config, show_tiktok: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>

            {/* Google Maps */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Google Maps</p>
                  <p className="text-xs text-gray-400">Tampilkan tombol navigasi peta / lokasi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.show_maps}
                    onChange={(e) => setConfig({ ...config, show_maps: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={saving}>
          <Save className="h-4 w-4" />
          Simpan Semua Pengaturan Footer
        </Button>
      </form>
    </div>
  );
}
