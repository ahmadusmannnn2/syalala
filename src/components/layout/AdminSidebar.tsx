"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Megaphone,
  Home,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  logoUrl?: string | null;
  restaurantName?: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/menu", label: "Kelola Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Kategori", icon: Tag },
  { href: "/admin/promos", label: "Promo & Diskon", icon: Megaphone },
  { href: "/admin/home", label: "Halaman Home", icon: Home },
];

export function AdminSidebar({
  isOpen,
  onClose,
  logoUrl,
  restaurantName = "Syalala",
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/admin";
  };

  return (
    <>
      {/* Overlay for mobile with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200/80 z-50 transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto flex flex-col shadow-xl lg:shadow-none select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-[#e6203b]/5 to-transparent">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center text-[#e6203b] flex-shrink-0 overflow-hidden border border-red-100">
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
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-base leading-none truncate">
                {restaurantName}
              </p>
              <p className="text-[10px] text-gray-400 font-semibold leading-none mt-1">
                Admin Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm transition-all duration-200 group active:scale-[0.98]",
                  active
                    ? "bg-[#e6203b] text-white shadow-md shadow-[#e6203b]/25 font-bold"
                    : "text-gray-700 hover:bg-red-50/70 hover:text-[#e6203b] font-semibold"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 flex-shrink-0 transition-transform",
                    active ? "scale-105" : "text-gray-400 group-hover:text-[#e6203b]"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {!active && (
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Shortcut to Customer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-[#e6203b] bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all active:scale-95 shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Lihat Menu Customer</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
