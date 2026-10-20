"use client";

import { useState } from "react";
import { Flame, Info, Check, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface SpicinessLevelSelectorProps {
  basePrice: number;
  supportsJumbo?: boolean;
  jumboFee?: number;
  taxStatus?: string;
}

export function calculateSpicinessFee(level: number): number {
  if (level <= 0) return 0;
  if (level === 1 || level === 2) return 2000;
  return 2000 + (level - 2) * 1000;
}

const PRESET_LEVELS = [
  { level: 0, label: "Level 0", subtitle: "Original", desc: "Tidak pedas sama sekali", flames: 0 },
  { level: 1, label: "Level 1", subtitle: "Sedang", desc: "Pedas pemula nikmat", flames: 1 },
  { level: 2, label: "Level 2", subtitle: "Mantap", desc: "Pedas standar Syalala", flames: 2 },
  { level: 3, label: "Level 3", subtitle: "Extra", desc: "Mulai bikin keringat", flames: 3 },
  { level: 4, label: "Level 4", subtitle: "Super", desc: "Bibir mulai bergetar", flames: 4 },
  { level: 5, label: "Level 5", subtitle: "Gila", desc: "Tantangan extra pedas!", flames: 5 },
];

export function SpicinessLevelSelector({
  basePrice,
  supportsJumbo = false,
  jumboFee = 4000,
  taxStatus = "Belum termasuk PPN 10%",
}: SpicinessLevelSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isJumbo, setIsJumbo] = useState<boolean>(false);

  const spicinessFee = calculateSpicinessFee(selectedLevel);
  const currentJumboFee = isJumbo && supportsJumbo ? jumboFee : 0;
  const totalPrice = basePrice + spicinessFee + currentJumboFee;

  const handleIncrement = () => {
    setSelectedLevel((prev) => Math.min(prev + 1, 20));
  };

  const handleDecrement = () => {
    setSelectedLevel((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Price Display */}
      <div className="bg-gradient-to-br from-red-50/80 to-white border-2 border-[#e6203b]/20 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Estimasi Total Harga
            </span>
            <p className="text-3xl font-black text-[#e6203b] tracking-tight mt-0.5">
              {formatRupiah(totalPrice)}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-red-100 text-[#e6203b] text-xs font-bold px-2.5 py-1 rounded-full">
              <Flame className="h-3.5 w-3.5 fill-[#e6203b]" />
              Level {selectedLevel}
            </span>
            {isJumbo && (
              <span className="block text-[11px] text-[#e6203b] font-semibold mt-1">
                + Porsi Jumbo
              </span>
            )}
          </div>
        </div>

        {/* Breakdown detail */}
        <div className="mt-3 pt-3 border-t border-red-100/80 flex items-center justify-between text-xs text-gray-600">
          <span>Harga Menu: {formatRupiah(basePrice)}</span>
          {spicinessFee > 0 && (
            <span className="text-[#e6203b] font-semibold">
              + Level {selectedLevel} ({formatRupiah(spicinessFee)})
            </span>
          )}
          {currentJumboFee > 0 && (
            <span className="text-[#e6203b] font-semibold">
              + Jumbo ({formatRupiah(currentJumboFee)})
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mt-1">*{taxStatus}</p>
      </div>

      {/* Level Selector Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-[#e6203b] flex items-center justify-center">
              <Flame className="h-4 w-4 fill-[#e6203b]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Pilih Level Pedas
              </h3>
              <p className="text-xs text-gray-500">Khusus menu kategori mie</p>
            </div>
          </div>

          {/* Ketentuan Biaya Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#e6203b] bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-full">
            <Info className="h-3 w-3" />
            <span>Lvl 1-2: +2k • Lvl 3+: +1k/lvl</span>
          </div>
        </div>

        {/* Mobile Info Note */}
        <div className="sm:hidden bg-red-50/80 border border-red-100 rounded-xl px-3 py-2 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-[#e6203b] mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gray-700 leading-tight">
            <span className="font-bold text-[#e6203b]">Aturan Tambahan:</span> Level 1-2 (+Rp 2.000), penambahan level setelah level 2 (+Rp 1.000 berkelipatan per level).
          </p>
        </div>

        {/* Preset Level Grid (0 to 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_LEVELS.map((item) => {
            const isSelected = selectedLevel === item.level;
            const fee = calculateSpicinessFee(item.level);

            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setSelectedLevel(item.level)}
                className={`relative p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#e6203b] text-white border-[#e6203b] shadow-md shadow-[#e6203b]/25"
                    : "bg-gray-50 hover:bg-gray-100/80 text-gray-800 border-gray-200/70"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {item.label}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-white text-[#e6203b] flex items-center justify-center">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Subtitle & Flames */}
                <div className="flex items-center gap-1 mb-1">
                  {item.flames > 0 ? (
                    <div className="flex items-center">
                      {Array.from({ length: Math.min(item.flames, 5) }).map((_, i) => (
                        <Flame
                          key={i}
                          className={`h-3 w-3 ${
                            isSelected ? "fill-white text-white" : "fill-red-500 text-red-500"
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                      Normal
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold truncate ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                    • {item.subtitle}
                  </span>
                </div>

                {/* Fee display */}
                <div className="mt-1 pt-1 border-t border-black/5 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-[#e6203b]"}`}>
                    {fee === 0 ? "Gratis" : `+${formatRupiah(fee)}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Level Stepper (Untuk Level 6 ke atas atau Custom Level) */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-800">Tentukan Level Sendiri</span>
            <p className="text-[11px] text-gray-500">
              Bisa request level di atas Level 5
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={selectedLevel <= 0}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-40 transition-colors active:scale-95"
              aria-label="Kurangi level"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 text-center font-black text-[#e6203b] text-base">
              Lvl {selectedLevel}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={selectedLevel >= 20}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-40 transition-colors active:scale-95"
              aria-label="Tambah level"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Jumbo Upgrade Toggle (Jika menu mendukung jumbo) */}
        {supportsJumbo && (
          <div
            onClick={() => setIsJumbo(!isJumbo)}
            className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
              isJumbo
                ? "bg-red-50/70 border-red-300 shadow-sm"
                : "bg-gray-50 border-gray-200/70 hover:bg-gray-100/70"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${isJumbo ? "bg-red-100 text-[#e6203b]" : "bg-gray-200 text-gray-600"}`}>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Upgrade Porsi Jumbo</p>
                <p className="text-[11px] text-gray-500">Porsi lebih banyak dan mantap</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e6203b]">
                +{formatRupiah(jumboFee)}
              </span>
              {/* Checkbox indicator */}
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  isJumbo
                    ? "bg-[#e6203b] border-[#e6203b] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isJumbo && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
