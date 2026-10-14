"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UtensilsCrossed, Home, UtensilsCrossed as MenuIcon, Gift, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNav = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/menu", label: "Menu", icon: MenuIcon },
  { href: "/promo", label: "Promo", icon: Gift },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isHome && (
              <button
                type="button"
                onClick={() => router.back()}
                className="p-1.5 -ml-1 text-gray-600 hover:text-[#e6203b] hover:bg-gray-100 rounded-lg transition-colors active:scale-95 sm:hidden"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#e6203b] flex items-center justify-center shadow-sm shadow-[#e6203b]/30 group-active:scale-95 transition-transform">
                <UtensilsCrossed className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-[#e6203b] text-lg tracking-tight">Syalala</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={cn(
                "hidden sm:inline-flex px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                isActive("/", true)
                  ? "text-[#e6203b] bg-red-50"
                  : "text-gray-600 hover:text-[#e6203b] hover:bg-gray-50"
              )}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                isActive("/menu")
                  ? "text-[#e6203b] bg-red-50"
                  : "text-gray-600 hover:text-[#e6203b] hover:bg-gray-50"
              )}
            >
              Menu
            </Link>
            <Link
              href="/promo"
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                isActive("/promo")
                  ? "text-[#e6203b] bg-red-50"
                  : "text-gray-600 hover:text-[#e6203b] hover:bg-gray-50"
              )}
            >
              Promo
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-4">
          {bottomNav.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-all duration-150 active:scale-95",
                  active ? "text-[#e6203b]" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform", active ? "scale-110 stroke-[2.5]" : "stroke-[1.75]")} />
                <span className={cn("text-[11px]", active ? "font-bold text-[#e6203b]" : "font-medium")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
