"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/menu": "Kelola Menu",
  "/admin/categories": "Kelola Kategori",
  "/admin/promos": "Kelola Promo",
  "/admin/home": "Kelola Home",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("Syalala");
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("restaurant_settings")
      .select("logo_url, name")
      .single()
      .then(({ data }) => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
        if (data?.name) setRestaurantName(data.name);
      });
  }, []);

  // Halaman login tidak menampilkan sidebar atau header admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const title =
    Object.entries(titleMap).find(([key]) =>
      key === "/admin" ? pathname === "/admin" : pathname.startsWith(key)
    )?.[1] ?? "Admin";

  return (
    <div className="min-h-screen bg-gray-50 flex w-full max-w-full overflow-x-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        logoUrl={logoUrl}
        restaurantName={restaurantName}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          logoUrl={logoUrl}
          restaurantName={restaurantName}
        />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
