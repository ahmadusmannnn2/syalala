"use client";

import { useState, useEffect } from "react";

interface SplashScreenProps {
  logoUrl?: string | null;
  restaurantName?: string;
}

export function SplashScreen({
  logoUrl = "/apple-touch-icon.png",
  restaurantName = "Syalala",
}: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Periksa apakah splash sudah pernah tampil di sesi browser ini
    const hasShown = sessionStorage.getItem("syalala_splash_shown");
    if (!hasShown) {
      sessionStorage.setItem("syalala_splash_shown", "true");
      setVisible(true);
      setMounted(true);

      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 500);

      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 950);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      id="syalala-startup-splash"
      className={`fixed inset-0 z-[99999] bg-gradient-to-b from-[#e6203b] via-[#c41833] to-[#8b0f22] flex flex-col items-center justify-center select-none transition-opacity duration-500 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo Container with glowing aura */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-white p-2 shadow-2xl flex items-center justify-center border-2 border-white/40">
            <img
              src={logoUrl || "/apple-touch-icon.png"}
              alt={restaurantName}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center text-white space-y-1">
          <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
            {restaurantName}
          </h1>
          <p className="text-xs text-white/80 font-medium tracking-wide">
            Digital Menu
          </p>
        </div>

        {/* Subtle Loading Indicator */}
        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
