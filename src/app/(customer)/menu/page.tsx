import { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-[#e6203b] flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Daftar Menu</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {items.length} menu lezat siap dinikmati
          </p>
        </div>
      </div>

      <MenuClient items={items} categories={categories} />
    </div>
  );
}
