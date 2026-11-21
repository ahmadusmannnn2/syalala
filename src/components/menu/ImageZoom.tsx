"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  fitMode?: "cover" | "contain" | "natural" | "detail";
}

export function ImageZoom({
  src,
  alt,
  className,
  fitMode = "detail",
}: ImageZoomProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (fitMode === "detail") {
    return (
      <>
        {/* Large & Intuitive Showcase Container */}
        <div
          className={`relative w-full h-80 sm:h-96 md:h-[440px] rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-100/80 border border-gray-100 shadow-sm flex items-center justify-center cursor-zoom-in group select-none ${
            className || ""
          }`}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`Lihat foto ${alt} ukuran penuh`}
        >
          {/* Ambient blurred backdrop for luxurious depth */}
          <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none opacity-20">
            <img
              src={src}
              alt=""
              aria-hidden
              className="w-full h-full object-cover blur-3xl scale-125"
            />
          </div>

          {/* Main uncropped food photo */}
          <img
            src={src}
            alt={alt}
            className="relative z-10 max-h-[90%] max-w-[90%] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          />

          {/* Interactive Floating Zoom Badge */}
          <div className="absolute bottom-4 right-4 z-20 bg-black/65 hover:bg-black/80 backdrop-blur-md rounded-full px-3.5 py-1.5 text-white flex items-center gap-1.5 text-xs font-semibold shadow-lg transition-all group-hover:scale-105">
            <ZoomIn className="h-3.5 w-3.5 text-red-400" />
            <span>Ketuk untuk Perbesar</span>
          </div>
        </div>

        {/* Lightbox Modal */}
        {open && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-[110] bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Tutup preview foto"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <p className="mt-3 text-white/90 text-xs sm:text-sm text-center font-medium">
                {alt} • <span className="text-white/60">Ketuk tombol silang atau di luar gambar untuk menutup</span>
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  const defaultWrapperClass =
    fitMode === "natural"
      ? "w-full"
      : fitMode === "contain"
      ? "w-full h-80"
      : "w-full h-72";

  const imgClass =
    fitMode === "natural"
      ? "w-full h-auto block group-hover:scale-[1.02] transition-transform duration-300"
      : fitMode === "contain"
      ? "w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
      : "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300";

  return (
    <>
      <div
        className={`relative ${className || defaultWrapperClass} bg-neutral-900/5 cursor-zoom-in group overflow-hidden select-none`}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Lihat foto ${alt} ukuran penuh`}
      >
        <img src={src} alt={alt} className={imgClass} />

        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md rounded-full px-3 py-1.5 text-white flex items-center gap-1.5 text-xs font-semibold shadow-lg">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Lihat Foto</span>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-[110] bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tutup preview foto"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-2xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-white/80 text-xs text-center font-medium">
              {alt} • <span className="text-white/50">Ketuk di luar gambar untuk menutup</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
