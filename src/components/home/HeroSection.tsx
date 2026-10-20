import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  UtensilsCrossed,
  Flame,
  Clock,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { RestaurantSettings } from "@/types";

interface HeroSectionProps {
  settings: RestaurantSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const name = settings?.name ?? "Syalala";
  const tagline = settings?.tagline ?? "Since 2014 #syalalamiesosis";
  const heroText = settings?.hero_text ?? "Open=10.00 Close=20.00";
  const waLink = settings?.whatsapp_link || null;
  const mapsLink = settings?.google_maps_link || null;
  const igLink = settings?.instagram_link || null;
  const tiktokLink = settings?.tiktok_link || null;

  // Normalisasi handle untuk tampilan Linktree
  const handleName = name.toLowerCase().replace(/\s+/g, "");

  return (
    <section className="relative bg-gray-50 pb-4">
      {/* Upper Red Header Card (Aliran menyatu dengan navbar merah) */}
      <div className="bg-gradient-to-b from-[#e6203b] via-[#d61c35] to-[#ba142c] text-white pt-4 pb-12 px-4 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
        {/* Ambient subtle circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-md mx-auto flex flex-col items-center text-center">
          {/* Circular Avatar Logo (Ala Linktree Modern) */}
          <div className="relative mb-3 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-xl shadow-black/20 overflow-hidden flex items-center justify-center border-4 border-white/95">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#e6203b] flex items-center justify-center text-white">
                  <UtensilsCrossed className="h-10 w-10 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Small Verified / Flame Accent Badge */}
            <div className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[#e6203b] border-2 border-[#e6203b]/20">
              <Flame className="h-4 w-4 fill-[#e6203b]" />
            </div>
          </div>

          {/* Title / Handle (@syalalamiesosis) */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
            @{handleName}
          </h1>

          {/* Subtitle / Since / Tagline */}
          <p className="text-xs sm:text-sm text-white/95 font-medium max-w-xs mx-auto mt-1 leading-snug">
            {tagline}
          </p>

          {/* Jam Operasional / Info */}
          {heroText && (
            <div className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold text-white/95 mt-2 border border-white/10 shadow-inner">
              <Clock className="h-3.5 w-3.5 text-white/90" />
              <span>{heroText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Linktree Container (-mt-6 overlap smooth) */}
      <div className="relative max-w-md mx-auto px-4 -mt-7 z-10 space-y-3">
        {/* BIG FEATURED CARD: LIHAT MENU SYALALA DI SINI */}
        <Link
          href="/menu"
          className="group block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white p-4 shadow-lg shadow-[#e6203b]/25 hover:shadow-xl hover:shadow-[#e6203b]/35 transition-all duration-300 active:scale-[0.98] border border-white/20"
        >
          {settings?.banner_image_url && (
            <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-500">
              <Image
                src={settings.banner_image_url}
                alt="Menu Syalala"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white text-[#e6203b] flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full mb-0.5">
                  Menu Utama
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  LIHAT MENU SYALALA DI SINI
                </h2>
                <p className="text-xs text-white/80">
                  Mie Sosis Bakar, Cemilan & Minuman
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#e6203b] transition-all">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </Link>

        {/* STACKED LINKTREE BUTTONS (Sleek, Organized, White Rounded Cards) */}
        <div className="space-y-2.5">
          {/* Instagram */}
          {igLink && (
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 bg-white hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#e6203b] transition-colors leading-tight">
                    Follow Instagram
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Foto menu & update harian kami
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-hover:text-[#e6203b] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>
          )}

          {/* TikTok */}
          {tiktokLink && (
            <a
              href={tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 bg-white hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <TikTokIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#e6203b] transition-colors leading-tight">
                    Follow TikTok
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Video review & keseruan dapur
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-hover:text-[#e6203b] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>
          )}

          {/* WhatsApp */}
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 bg-white hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#e6203b] transition-colors leading-tight">
                    Pesan via WhatsApp
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Chat langsung untuk tanya & order
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-hover:text-[#e6203b] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>
          )}

          {/* Google Maps / Lokasi */}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 bg-white hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#e6203b] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#e6203b] transition-colors leading-tight">
                    Petunjuk Arah & Lokasi
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Buka Google Maps ke outlet kami
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-hover:text-[#e6203b] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
