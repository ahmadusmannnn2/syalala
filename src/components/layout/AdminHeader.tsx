"use client";

import Link from "next/link";
import { Menu, LogOut, UtensilsCrossed, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
  logoUrl?: string | null;
  restaurantName?: string;
}

export function AdminHeader({
  onMenuClick,
  title = "Dashboard",
  logoUrl,
  restaurantName = "Syalala",
}: AdminHeaderProps) {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <header className="h-14 sm:h-16 bg-[#e6203b] text-white shadow-md flex items-center justify-between px-3 sm:px-5 lg:px-6 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center text-[#e6203b] flex-shrink-0 overflow-hidden border border-white/20">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={restaurantName}
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <UtensilsCrossed className="h-4.5 w-4.5 stroke-[2.5]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight truncate">
              {title}
            </h1>
            <span className="text-[10px] text-white/80 font-medium hidden sm:inline">
              Admin Panel {restaurantName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 hover:bg-white hover:text-[#e6203b] transition-all active:scale-95 shadow-sm border border-white/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Lihat Web</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-all active:scale-95"
          title="Keluar dari Admin"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
