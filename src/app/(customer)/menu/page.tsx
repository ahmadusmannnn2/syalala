import { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu",
  description: "Daftar lengkap menu Syalala — mie sosis, sosis bakar, cemilan, dan minuman.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const supabase = await createClient();

  const [menuRes, catRes] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*, category:categories(id, name, slug, description, order_number, is_active, created_at, updated_at)")
      .order("order_number", { ascending: true }),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("order_number", { ascending: true }),
  ]);

  const items = menuRes.data ?? [];
  const categories = catRes.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3.5 max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">🍜 Menu Kami</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {items.length} menu lezat siap dipesan
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#e6203b] bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors active:scale-95"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
      </div>

      <MenuClient items={items} categories={categories} />
    </div>
  );
}
