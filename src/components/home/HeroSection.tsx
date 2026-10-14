import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, MessageCircle, UtensilsCrossed, Flame, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { RestaurantSettings } from "@/types";

interface HeroSectionProps {
  settings: RestaurantSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const name = settings?.name ?? "Syalala";
  const tagline = settings?.tagline ?? "Mie Sosis Bakar Extra Pedas";
  const heroText = settings?.hero_text ?? "Nikmati cita rasa pedas yang bikin nagih!";
  const waLink = settings?.whatsapp_link ?? "https://wa.me/";
  const mapsLink = settings?.google_maps_link ?? "#";
  const igLink = settings?.instagram_link ?? "https://instagram.com";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white">
      {/* Decorative ambient circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Hero Banner Background if present */}
      {settings?.banner_image_url && (
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src={settings.banner_image_url} alt="Banner" fill className="object-cover" />
        </div>
      )}

      <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-9 flex flex-col items-center text-center">
        {/* Badge with Flame Icon (Tanpa Emoji) */}
        <div className="mb-5 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm">
          <Flame className="h-3.5 w-3.5 text-white" />
          <span>Extra Pedas, Extra Nikmat</span>
        </div>

        {/* LOGO RESTORAN (Bukan Teks "Syalala") */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          {settings?.logo_url ? (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2.5 shadow-2xl shadow-black/35 overflow-hidden flex items-center justify-center border-2 border-white/80">
              <img
                src={settings.logo_url}
                alt={name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white shadow-2xl shadow-black/35 flex items-center justify-center border-2 border-white/80 p-2">
              <div className="w-full h-full rounded-2xl bg-[#e6203b] flex items-center justify-center shadow-inner">
                <UtensilsCrossed className="h-10 w-10 text-white stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>

        {/* Tagline & Deskripsi */}
        <p className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {tagline}
        </p>
        <p className="text-white/80 text-xs sm:text-sm max-w-sm leading-relaxed mb-7">
          {heroText}
        </p>

        {/* CTA Buttons (Clean Icons, Tanpa Emoji) */}
        <div className="flex gap-3 w-full max-w-xs">
          <Link
            href="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#e6203b] font-bold px-5 py-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg shadow-black/25 text-sm"
          >
            <UtensilsCrossed className="h-4 w-4" />
            <span>Lihat Menu</span>
          </Link>
          <Link
            href="/promo"
            className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold px-5 py-3 rounded-2xl hover:bg-white/30 active:scale-95 transition-all border border-white/30 text-sm shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Promo</span>
          </Link>
        </div>

        {/* Quick Social & Location Links (Clean Icons) */}
        <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
          {waLink && waLink !== "https://wa.me/" && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3.5 py-1.5 rounded-full transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
          {mapsLink && mapsLink !== "#" && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3.5 py-1.5 rounded-full transition-all"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Lokasi</span>
            </a>
          )}
          {igLink && igLink !== "https://instagram.com" && (
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3.5 py-1.5 rounded-full transition-all"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>
          )}
          {/* Fallback jika belum diisi di admin */}
          {(!waLink || waLink === "https://wa.me/") && (!mapsLink || mapsLink === "#") && (!igLink || igLink === "https://instagram.com") && (
            <>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-3.5 py-1.5 rounded-full">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-3.5 py-1.5 rounded-full cursor-default">
                <MapPin className="h-3.5 w-3.5" /> Lokasi
              </span>
              <a href={igLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-3.5 py-1.5 rounded-full">
                <InstagramIcon className="h-3.5 w-3.5" /> Instagram
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
