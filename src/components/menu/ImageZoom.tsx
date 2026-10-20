"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageZoom({
  src,
  alt,
  className = "w-full h-72",
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

  return (
    <>
      {/* Thumbnail with visible zoom hint */}
      <div
        className={`relative ${className} bg-gradient-to-br from-[#e6203b]/10 to-red-50/40 cursor-zoom-in group overflow-hidden select-none`}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Lihat foto ${alt} ukuran penuh`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Zoom Badge */}
        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md rounded-full px-3 py-1.5 text-white flex items-center gap-1.5 text-xs font-semibold shadow-lg">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Lihat Foto</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-[110] bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tutup preview foto"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Full Image Container */}
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
