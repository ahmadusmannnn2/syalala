import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, Gift } from "lucide-react";
import { Promotion } from "@/types";
import { formatDate, formatValidDays } from "@/lib/utils";

interface PromoSectionProps {
  promos: Promotion[];
}

export function PromoSection({ promos }: PromoSectionProps) {
  if (promos.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-[#e6203b] flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Promo Menarik</h2>
        </div>
        <Link
          href="/promo"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#e6203b] hover:underline"
        >
          Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {promos.slice(0, 3).map((promo) => {
          const periodText =
            promo.start_date || promo.end_date
              ? `Periode: ${promo.start_date ? formatDate(promo.start_date) : ""} ${
                  promo.end_date && promo.start_date !== promo.end_date
                    ? `- ${formatDate(promo.end_date)}`
                    : ""
                }`
              : promo.valid_days && promo.valid_days.length > 0
              ? `Berlaku: ${formatValidDays(promo.valid_days)}`
              : "Berlaku setiap hari";

          return (
            <div
              key={promo.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-red-100/70 hover:shadow-lg transition-all group duration-300"
            >
              {/* Gambar Promo (Klik Mengarah ke /promo) */}
              {promo.image_url ? (
                <Link
                  href="/promo"
                  className="block relative w-full h-44 sm:h-52 overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={promo.image_url}
                    alt={promo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#e6203b] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Promo Spesial
                  </div>
                </Link>
              ) : null}

              {/* Bagian Bawah Gambar: Background Merah Elegan (Seragam dengan halaman promo) */}
              <div className="bg-gradient-to-r from-[#e6203b] via-[#c41833] to-[#8b0f22] p-4 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 opacity-15 pointer-events-none">
                  <div className="h-28 w-28 rounded-full bg-white absolute -right-6 -top-6" />
                </div>

                <div className="relative flex items-start gap-3">
                  <div className="bg-white/20 rounded-xl p-2.5 flex-shrink-0 mt-0.5">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href="/promo">
                      <h3 className="font-bold text-base sm:text-lg leading-tight hover:underline line-clamp-1">
                        {promo.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-white/80 flex-shrink-0" />
                      <span className="truncate">{periodText}</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Lihat Detail Promo yang Jelas & Kontras */}
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[11px] text-white/80 font-medium">
                    Klik untuk syarat & ketentuan
                  </span>
                  <Link
                    href="/promo"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#e6203b] hover:bg-gray-100 active:scale-95 transition-all shadow-md flex-shrink-0"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
