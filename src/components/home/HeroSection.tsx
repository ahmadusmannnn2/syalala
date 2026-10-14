import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, MessageCircle, Utensils } from "lucide-react";
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
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Banner image overlay */}
      {settings?.banner_image_url && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src={settings.banner_image_url} alt="Banner" fill className="object-cover" />
        </div>
      )}

      <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-8 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold">
          🔥 Extra Pedas, Extra Nikmat!
        </div>

        <h1 className="text-5xl font-black tracking-tight mb-1.5">{name}</h1>
        <p className="text-lg font-semibold text-white/90 mb-2">{tagline}</p>
        <p className="text-white/70 text-sm max-w-xs leading-relaxed mb-7">{heroText}</p>

        {/* CTA Buttons */}
        <div className="flex gap-3 w-full max-w-xs">
          <Link
            href="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#e6203b] font-bold px-5 py-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg shadow-black/20"
          >
            <Utensils className="h-4 w-4" />
            Lihat Menu
          </Link>
          <Link
            href="/promo"
            className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-5 py-3 rounded-2xl hover:bg-white/30 active:scale-95 transition-all border border-white/30"
          >
            🎉 Promo
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
          {waLink && waLink !== "https://wa.me/" && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3 py-1.5 rounded-full transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
          {mapsLink && mapsLink !== "#" && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3 py-1.5 rounded-full transition-all"
            >
              <MapPin className="h-3.5 w-3.5" /> Lokasi
            </a>
          )}
          {igLink && igLink !== "https://instagram.com" && (
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 px-3 py-1.5 rounded-full transition-all"
            >
              <InstagramIcon className="h-3.5 w-3.5" /> Instagram
            </a>
          )}
          {/* Always show fallback if all unset */}
          {(!waLink || waLink === "https://wa.me/") && (!mapsLink || mapsLink === "#") && (!igLink || igLink === "https://instagram.com") && (
            <>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white/85 bg-white/15 px-3 py-1.5 rounded-full">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85 bg-white/15 px-3 py-1.5 rounded-full cursor-default">
                <MapPin className="h-3.5 w-3.5" /> Lokasi
              </span>
              <a href={igLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white/85 bg-white/15 px-3 py-1.5 rounded-full">
                <InstagramIcon className="h-3.5 w-3.5" /> Instagram
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
