import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
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
          <span className="text-xl">🎉</span>
          <h2 className="text-lg font-bold text-gray-900">Promo Aktif</h2>
        </div>
        <Link
          href="/promo"
          className="flex items-center gap-1 text-sm font-semibold text-[#e6203b] hover:underline"
        >
          Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {promos.slice(0, 2).map((promo) => (
          <div
            key={promo.id}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e6203b] to-orange-500 p-4 text-white"
          >
            {/* Decorative */}
            <div className="absolute right-0 top-0 h-full w-24 opacity-20">
              <div className="h-32 w-32 rounded-full bg-white absolute -right-8 -top-8" />
              <div className="h-20 w-20 rounded-full bg-white absolute right-4 bottom-0" />
            </div>

            <div className="relative flex items-start gap-3">
              {promo.image_url ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/20 bg-white/10 shadow-sm">
                  <img src={promo.image_url} alt={promo.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex-shrink-0 mt-0.5 bg-white/20 rounded-xl p-2.5">
                  <Gift className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{promo.name}</p>
                {promo.reward && (
                  <p className="text-xs text-white/90 mt-0.5">{promo.reward}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {promo.valid_days && promo.valid_days.length > 0 && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-medium">
                      {formatValidDays(promo.valid_days)}
                    </span>
                  )}
                  {promo.valid_time_start && promo.valid_time_end && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-medium">
                      {promo.valid_time_start} - {promo.valid_time_end}
                    </span>
                  )}
                  {promo.start_date && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-medium">
                      s/d {formatDate(promo.end_date)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
