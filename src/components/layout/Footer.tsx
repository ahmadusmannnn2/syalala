import { UtensilsCrossed, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { parseWhatsAppLink, buildWhatsAppUrl } from "@/lib/whatsapp";
import { FooterConfig } from "@/app/actions/footer";

interface FooterProps {
  logoUrl?: string | null;
  restaurantName?: string;
  tagline?: string;
  waLink?: string | null;
  igLink?: string | null;
  tiktokLink?: string | null;
  mapsLink?: string | null;
  footerConfig?: FooterConfig | null;
}

export function Footer({
  logoUrl = null,
  restaurantName = "Syalala",
  tagline = "Mie Sosis Bakar Extra Pedas",
  waLink,
  igLink,
  tiktokLink,
  mapsLink,
  footerConfig,
}: FooterProps) {
  // Gunakan data dari footerConfig jika ada, fallback ke settings
  const finalTagline = footerConfig?.tagline?.trim() || tagline;
  const finalCopyright =
    footerConfig?.copyright?.trim() ||
    `© ${new Date().getFullYear()} ${restaurantName}. Harga belum termasuk PPN 10%.`;
  const finalAddress = footerConfig?.address?.trim() || null;

  // Social Links
  const rawWaLink = footerConfig?.custom_wa_link?.trim() || waLink || "6281325350008";
  const parsedWa = parseWhatsAppLink(rawWaLink);
  const wa = buildWhatsAppUrl(
    parsedWa.phone || "6281325350008",
    parsedWa.message || "Halo Syalala! Saya ingin memesan menu / tanya info."
  );

  const ig = footerConfig?.custom_ig_link?.trim() || igLink || "https://instagram.com/syalalamiesosis";
  const tiktok = footerConfig?.custom_tiktok_link?.trim() || tiktokLink || "https://www.tiktok.com/@syalalamiesosis";
  const maps = footerConfig?.custom_maps_link?.trim() || mapsLink || "https://maps.google.com";

  // Visibility flags (default: true)
  const showWa = footerConfig?.show_wa ?? true;
  const showIg = footerConfig?.show_ig ?? true;
  const showTiktok = footerConfig?.show_tiktok ?? true;
  const showMaps = footerConfig?.show_maps ?? true;

  const hasAnySocial = showWa || showIg || showTiktok || showMaps;

  return (
    <footer className="bg-gradient-to-b from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white mt-0 pb-28 shadow-inner">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-3.5">
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

          {/* Footer Tagline / Deskripsi */}
          {finalTagline && (
            <p className="text-white/85 text-xs sm:text-sm max-w-sm leading-relaxed">
              {finalTagline}
            </p>
          )}

          {/* Alamat Restoran (Jika diisi oleh admin) */}
          {finalAddress && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs text-white/90 border border-white/15">
              <MapPin className="h-3.5 w-3.5 text-white/80" />
              <span>{finalAddress}</span>
            </div>
          )}

          {/* Social & Contact Icons */}
          {hasAnySocial && (
            <div className="flex items-center gap-2.5 pt-1">
              {showIg && (
                <a
                  href={ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#e6203b] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4.5 w-4.5" />
                </a>
              )}

              {showTiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4.5 w-4.5" />
                </a>
              )}

              {showWa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#25D366] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </a>
              )}

              {showMaps && (
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#e6203b] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-white/20"
                  aria-label="Google Maps"
                >
                  <MapPin className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          )}

          {/* Copyright & Catatan Kaki */}
          <p className="text-white/70 text-xs mt-1">
            {finalCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
