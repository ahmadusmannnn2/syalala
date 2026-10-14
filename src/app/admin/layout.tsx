"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/menu": "Kelola Menu",
  "/admin/categories": "Kelola Kategori",
  "/admin/promos": "Kelola Promo",
  "/admin/home": "Kelola Home",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title =
    Object.entries(titleMap).find(([key]) =>
      key === "/admin" ? pathname === "/admin" : pathname.startsWith(key)
    )?.[1] ?? "Admin";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
