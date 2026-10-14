"use client";

import { Menu, LogOut, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function AdminHeader({ onMenuClick, title = "Dashboard" }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-[#e6203b] transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
