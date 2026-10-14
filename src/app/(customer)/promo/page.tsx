import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatRupiah, formatValidDays, isPromotionCurrentlyValid } from "@/lib/utils";
import { Gift, Clock, Calendar, CreditCard, Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Promo",
  description: "Promo dan diskon spesial dari Syalala.",
};

export const revalidate = 60;

export default async function PromoPage() {
  const supabase = await createClient();

  const { data: promos } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Tampilkan seluruh promo yang berstatus aktif
  const items = promos ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e6203b] to-orange-500 text-white px-4 py-8 text-center relative">
        <Link
          href="/"
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-all active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <div className="inline-flex items-center gap-2 mb-1">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-black">Promo Syalala</h1>
        </div>
        <p className="text-sm text-white/80">
          Hemat lebih banyak dengan promo spesial kami!
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {items.length === 0 ? (
          <EmptyState
            title="Belum ada promo aktif"
            description="Nantikan promo-promo menarik dari Syalala!"
            icon={<Gift className="h-10 w-10 text-gray-300" />}
          />
        ) : (
          items.map((promo) => {
            const isLiveNow = isPromotionCurrentlyValid(promo);

            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md"
              >
                {/* Promo Image (jika diupload admin) */}
                {promo.image_url && (
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={promo.image_url}
                      alt={promo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="bg-gradient-to-r from-[#e6203b] to-orange-500 p-4 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-full w-20 opacity-20">
                    <div className="h-24 w-24 rounded-full bg-white absolute -right-6 -top-6" />
                  </div>
                  <div className="relative flex items-start gap-3">
                    <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">{promo.name}</h2>
                      {promo.description && (
                        <p className="text-xs text-white/85 mt-0.5 leading-relaxed">{promo.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detail */}
                <div className="p-4 space-y-3">
                  {promo.reward && (
                    <div className="flex items-start gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
                      <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-green-700">Dapatkan</p>
                        <p className="text-sm font-bold text-green-800">{promo.reward}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {promo.min_transaction !== null && promo.min_transaction > 0 && (
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Min. Transaksi</p>
                          <p className="text-sm font-bold text-gray-800">
                            {formatRupiah(promo.min_transaction)}
                          </p>
                        </div>
                      </div>
                    )}

                    {promo.valid_days && promo.valid_days.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Berlaku</p>
                          <p className="text-sm font-bold text-gray-800">
                            {formatValidDays(promo.valid_days)}
                          </p>
                        </div>
                      </div>
                    )}

                    {promo.valid_time_start && promo.valid_time_end && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Jam</p>
                          <p className="text-sm font-bold text-gray-800">
                            {promo.valid_time_start} - {promo.valid_time_end}
                            {promo.valid_time_start_2 && promo.valid_time_end_2 && (
                              <span className="block text-xs">
                                Sesi 2: {promo.valid_time_start_2} - {promo.valid_time_end_2}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {(promo.start_date || promo.end_date) && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Periode</p>
                          <p className="text-sm font-bold text-gray-800">
                            {promo.start_date && formatDate(promo.start_date)}
                            {promo.end_date && promo.start_date !== promo.end_date && (
                              <> - {formatDate(promo.end_date)}</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    {isLiveNow ? (
                      <Badge variant="promo">✓ Sedang Berlaku Sekarang</Badge>
                    ) : (
                      <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 font-semibold px-2.5 py-0.5 rounded-full">
                        Promo Aktif (Sesuai Jadwal)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
