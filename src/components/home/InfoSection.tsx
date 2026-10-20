import { Package, Layers, Info, AlertCircle, Flame } from "lucide-react";
import { RestaurantSettings } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface InfoSectionProps {
  settings: RestaurantSettings | null;
}

export function InfoSection({ settings }: InfoSectionProps) {
  const takeAway = settings?.take_away_additional_fee ?? 1000;
  const jumbo = settings?.jumbo_size_upgrade_fee ?? 4000;
  const taxStatus = settings?.tax_status ?? "Belum termasuk PPN 10%";

  return (
    <section className="max-w-2xl mx-auto px-4 pb-8">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-orange-500" />
          <h3 className="font-bold text-gray-800 text-sm">Info Biaya Tambahan</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-3.5 w-3.5 text-orange-400" />
              <span>Take Away</span>
            </div>
            <span className="font-semibold text-gray-800">+{formatRupiah(takeAway)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Layers className="h-3.5 w-3.5 text-orange-400" />
              <span>Upgrade Jumbo</span>
            </div>
            <span className="font-semibold text-gray-800">+{formatRupiah(jumbo)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Flame className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              <span>Level Pedas (Mie)</span>
            </div>
            <span className="font-semibold text-gray-800 text-xs">Lvl 1-2 (+2k) • Lvl 3+ (+1k/lvl)</span>
          </div>
          <div className="h-px bg-orange-200 my-1" />
          <p className="text-xs text-orange-700 font-medium text-center flex items-center justify-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
            <span>{taxStatus}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
