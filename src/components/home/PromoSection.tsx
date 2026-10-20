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
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              {/* Gambar Promo Besar (Klik Mengarah ke /promo) */}
              <Link href="/promo" className="block relative w-full overflow-hidden bg-gray-100">
                {promo.image_url ? (
                  <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                    <img
                      src={promo.image_url}
                      alt={promo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#e6203b] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Promo Spesial
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-28 bg-gradient-to-r from-[#e6203b] via-[#c41833] to-[#8b0f22] p-4 text-white flex items-center justify-between">
                    <div>
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                        Promo Spesial
                      </span>
                      <h3 className="font-bold text-base line-clamp-1">{promo.name}</h3>
                    </div>
                    <Gift className="h-10 w-10 text-white/30 flex-shrink-0" />
                  </div>
                )}
              </Link>

              {/* Konten Card: Hanya Nama Promo, Periode & Tombol Detail */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link href="/promo">
                    <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-[#e6203b] transition-colors line-clamp-1">
                      {promo.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-[#e6203b] flex-shrink-0" />
                    <span>{periodText}</span>
                  </div>
                </div>

                <Link
                  href="/promo"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#e6203b] hover:bg-[#c41833] active:scale-95 transition-all shadow-sm shadow-[#e6203b]/20 flex-shrink-0"
                >
                  <span>Lihat Detail Promo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
