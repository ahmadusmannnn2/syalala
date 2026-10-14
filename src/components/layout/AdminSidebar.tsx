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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Kategori", icon: Tag },
  { href: "/admin/promos", label: "Promo", icon: Megaphone },
  { href: "/admin/home", label: "Halaman Home", icon: Home },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/admin";
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e6203b] flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">Syalala</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-[#e6203b] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {!active && (
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Lihat Halaman Customer
          </Link>
        </div>
      </aside>
    </>
  );
}
