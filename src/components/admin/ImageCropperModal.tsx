"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  X,
  Sliders,
  Crop,
} from "lucide-react";

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  fileName?: string;
  aspect?: number; // Default misal 4/3
  aspectOptions?: { label: string; value: number }[];
  cropShape?: "rect" | "round";
  title?: string;
  onClose: () => void;
  onCropComplete: (result: { file: File; previewUrl: string }) => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = "image.jpg",
  aspect = 4 / 3,
  aspectOptions,
  cropShape = "rect",
  title = "Sesuaikan Posisi & Crop Foto",
  onClose,
  onCropComplete: onSaveCrop,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentAspect, setCurrentAspect] = useState(aspect);
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  // Deteksi rasio aspek asli gambar
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          const ratio = img.naturalWidth / img.naturalHeight;
          setNaturalAspect(ratio);
          // Jika aspek awal adalah 0, set ke rasio asli foto
          if (aspect === 0) {
            setCurrentAspect(ratio);
          }
        }
      };
      img.src = imageSrc;
    }
  }, [imageSrc, aspect]);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleCropComplete = useCallback((_croppedArea: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    try {
      setProcessing(true);
      const result = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        fileName
      );
      onSaveCrop(result);
      onClose();
    } catch (err) {
      console.error("Gagal melakukan crop gambar:", err);
      alert("Gagal memproses crop gambar. Silakan coba kembali.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
      {/* Top Header */}
      <div className="bg-black/40 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#e6203b] text-white">
            <Crop className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{title}</h3>
            <p className="text-[11px] text-white/70 hidden sm:block">
              Geser untuk atur posisi, cubit / pakai slider untuk zoom
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Cropper Canvas Area */}
      <div className="relative flex-1 w-full h-full min-h-[300px] bg-neutral-950">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={currentAspect}
          cropShape={cropShape}
          showGrid={true}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={handleCropComplete}
          classes={{
            containerClassName: "w-full h-full",
            cropAreaClassName:
              "border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]",
          }}
        />
      </div>

      {/* Bottom Controls */}
      <div className="bg-neutral-900/95 text-white border-t border-white/10 p-3 sm:p-4 z-10 space-y-3">
        {/* Aspect Ratio Switcher (if options provided) */}
        {aspectOptions && aspectOptions.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-white/60 mr-1 flex items-center gap-1">
              <Sliders className="h-3 w-3" /> Rasio:
            </span>
            {naturalAspect && (
              <button
                type="button"
                onClick={() => setCurrentAspect(naturalAspect)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  Math.abs(currentAspect - naturalAspect) < 0.01
                    ? "bg-[#e6203b] text-white font-bold shadow-sm"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Foto Asli (Full)
              </button>
            )}
            {aspectOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setCurrentAspect(opt.value === 0 && naturalAspect ? naturalAspect : opt.value)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  Math.abs(currentAspect - (opt.value === 0 && naturalAspect ? naturalAspect : opt.value)) < 0.01
                    ? "bg-[#e6203b] text-white font-bold shadow-sm"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Zoom Slider and Rotate Controls */}
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 active:scale-95 transition-all"
              title="Perkecil"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#e6203b] cursor-pointer h-1.5 bg-white/20 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 active:scale-95 transition-all"
              title="Perbesar"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/20 pl-3">
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 active:scale-95 transition-all flex items-center gap-1 text-xs"
              title="Putar 90°"
            >
              <RotateCw className="h-4 w-4" />
              <span className="hidden sm:inline">Putar</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 active:scale-95 transition-all"
              title="Reset Posisi & Zoom"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={processing}
            className="flex-1 py-2 px-4 rounded-xl bg-[#e6203b] hover:bg-[#c41833] text-white font-bold text-xs shadow-lg shadow-[#e6203b]/40 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {processing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            )}
            <span>{processing ? "Memproses..." : "Terapkan Crop"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
