"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, Crop, Trash2, RefreshCw, Eye } from "lucide-react";
import { ImageCropperModal } from "./ImageCropperModal";
import { compressImage } from "@/lib/compressImage";

export interface ImageUploadFieldProps {
  label: string;
  helperText?: string;
  previewUrl: string | null;
  aspect?: number; // e.g. 4/3 for menu, 16/9 for promo/banner, 1/1 for logo
  aspectOptions?: { label: string; value: number }[];
  cropShape?: "rect" | "round";
  heightClass?: string; // e.g. "h-40"
  onImageChange: (file: File, previewUrl: string) => void;
  onImageRemove: () => void;
}

export function ImageUploadField({
  label,
  helperText = "Format: JPG, PNG, WEBP (Otomatis dikompres)",
  previewUrl,
  aspect = 4 / 3,
  aspectOptions,
  cropShape = "rect",
  heightClass = "h-44",
  onImageChange,
  onImageRemove,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState("image.jpg");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFileName(file.name);

    // Baca file sebagai data URL untuk cropper
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (src) {
        setRawImageSrc(src);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);

    // Reset input agar bisa memilih file yang sama lagi jika perlu
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (result: { file: File; previewUrl: string }) => {
    onImageChange(result.file, result.previewUrl);
  };

  const openCropperFromExisting = () => {
    if (!previewUrl) return;
    setRawImageSrc(previewUrl);
    setCropperOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {previewUrl && (
          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Foto terpasang
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="rounded-2xl border border-gray-200/90 bg-gray-50 overflow-hidden shadow-sm p-3 space-y-3">
          {/* Preview Container */}
          <div
            className={`relative w-full ${heightClass} rounded-xl overflow-hidden bg-black/5 border border-gray-200 group`}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                cropShape === "round" ? "rounded-full aspect-square mx-auto" : ""
              }`}
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={openCropperFromExisting}
                className="px-3 py-1.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Crop className="h-3.5 w-3.5 text-[#e6203b]" />
                Sesuaikan Posisi
              </button>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 flex-wrap">
            <button
              type="button"
              onClick={openCropperFromExisting}
              className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Atur posisi atau perbesar/perkecil foto"
            >
              <Crop className="h-3.5 w-3.5" />
              <span>Sesuaikan Posisi (Crop)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                title="Ganti dengan foto lain"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Ganti Foto</span>
              </button>
              <button
                type="button"
                onClick={onImageRemove}
                className="py-1.5 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                title="Hapus foto ini"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Upload Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#e6203b]/60 hover:bg-[#e6203b]/5 transition-all overflow-hidden bg-gray-50 flex flex-col items-center justify-center gap-2 p-4 ${heightClass} text-center`}
        >
          <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 text-[#e6203b]">
            <Upload className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">Klik untuk upload foto</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>
          </div>
          <span className="text-[10px] text-[#e6203b] font-semibold bg-[#e6203b]/10 px-2.5 py-0.5 rounded-full">
            Fitur Crop & Atur Posisi Otomatis
          </span>
        </div>
      )}

      {/* Interactive Mobile-like Cropper Modal */}
      {rawImageSrc && (
        <ImageCropperModal
          isOpen={cropperOpen}
          imageSrc={rawImageSrc}
          fileName={currentFileName}
          aspect={aspect}
          aspectOptions={aspectOptions}
          cropShape={cropShape}
          title={`Sesuaikan Posisi & Crop - ${label}`}
          onClose={() => setCropperOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
