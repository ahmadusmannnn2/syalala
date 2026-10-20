import { UtensilsCrossed, MessageCircle, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";

interface FooterProps {
  logoUrl?: string | null;
  restaurantName?: string;
  tagline?: string;
  waLink?: string | null;
  igLink?: string | null;
  tiktokLink?: string | null;
  mapsLink?: string | null;
}

export function Footer({
  logoUrl = null,
  restaurantName = "Syalala",
  tagline = "Mie Sosis Bakar Extra Pedas",
  waLink,
  igLink,
  tiktokLink,
  mapsLink,
}: FooterProps) {
  // Fallback links agar ikon di footer selalu tampil
  const wa = waLink || "https://wa.me/628123456789";
  const ig = igLink || "https://instagram.com/syalalamiesosis";
  const tiktok = tiktokLink || "https://www.tiktok.com/@syalalamiesosis";
  const maps = mapsLink || "https://maps.google.com";

  return (
    <footer className="bg-gradient-to-b from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white mt-0 pb-28 shadow-inner">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Brand Header with Logo like Navbar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-[#e6203b]">
                  <UtensilsCrossed className="h-4 w-4 stroke-[2.5]" />
                </div>
              )}
            </div>
            <span className="font-black text-xl text-white tracking-tight drop-shadow-sm">
              {restaurantName}
            </span>
          </div>

          <p className="text-white/80 text-xs sm:text-sm max-w-xs">{tagline}</p>

          {/* Social & Contact Icons (Selalu Tampil) */}
          <div className="flex items-center gap-2.5">
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#e6203b] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4.5 w-4.5" />
            </a>

            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4.5 w-4.5" />
            </a>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#25D366] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4.5 w-4.5" />
            </a>

            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#e6203b] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
              aria-label="Google Maps"
            >
              <MapPin className="h-4.5 w-4.5" />
            </a>
          </div>

          <p className="text-white/70 text-xs mt-1">
            © {new Date().getFullYear()} {restaurantName}. Harga belum termasuk PPN 10%.
          </p>
        </div>
      </div>
    </footer>
  );
}
