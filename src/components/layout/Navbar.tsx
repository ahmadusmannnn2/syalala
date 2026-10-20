"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UtensilsCrossed, Home, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  logoUrl?: string | null;
  restaurantName?: string;
}

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/promo", label: "Promo", icon: Sparkles },
];

export function Navbar({
  logoUrl = null,
  restaurantName = "Syalala",
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold saat logo hero mulai lewat dari viewport
      setScrolled(window.scrollY > 55);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-[#e6203b] text-white shadow-md transition-all">
        <div className="relative max-w-2xl mx-auto px-4 h-14 flex items-center">
          {/* Back button (hanya tampil di halaman non-home) */}
          {!isHome && (
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-2 p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Interactive Logo & Brand Text Container */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 transition-all duration-300 ease-out select-none",
              isHome
                ? scrolled
                  ? "translate-x-0"
                  : "absolute left-1/2 -translate-x-1/2"
                : "translate-x-0"
            )}
          >
            {/* Logo di Navbar:
                - Di halaman Home saat di paling atas: Tersembunyi (karena logo besar ada di hero)
                - Saat di-scroll atau di halaman lain: Logo muncul halus di sebelah kiri tulisan "Syalala" */}
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden flex-shrink-0 rounded-xl flex items-center justify-center bg-white p-0.5",
                isHome && !scrolled
                  ? "w-0 h-0 opacity-0 scale-50 pointer-events-none"
                  : "w-8 h-8 opacity-100 scale-100 shadow-sm border border-white/20"
              )}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-[#e6203b]">
                  <UtensilsCrossed className="h-4 w-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Tulisan Brand "Syalala" */}
            <span
              className={cn(
                "font-black tracking-tight text-white transition-all duration-300",
                isHome && !scrolled
                  ? "text-xl drop-shadow-sm"
                  : "text-lg hover:text-white/90"
              )}
            >
              {restaurantName}
            </span>
          </Link>
        </div>
      </header>

      {/* Floating Bottom Pill Navigation (iOS 27 Style — Ergonomis, Lebih Rendah & Nyaman di iPhone) */}
      <nav
        aria-label="Navigasi Utama"
        className="fixed bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none mb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.18)] rounded-full p-1.5 sm:p-2 transition-all duration-300">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm transition-all duration-200 active:scale-95",
                  active
                    ? "bg-[#e6203b] text-white shadow-lg shadow-[#e6203b]/35 font-bold"
                    : "text-gray-700 hover:text-gray-950 hover:bg-black/5 font-semibold"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform",
                    active ? "scale-110 stroke-[2.5]" : "stroke-[2]"
                  )}
                />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
