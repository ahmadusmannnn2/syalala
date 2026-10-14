import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { PromoSection } from "@/components/home/PromoSection";
import { BestSellerSection } from "@/components/home/BestSellerSection";
import { InfoSection } from "@/components/home/InfoSection";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [settingsRes, promosRes, menuRes] = await Promise.all([
    supabase.from("restaurant_settings").select("*").single(),
    supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("menu_items")
      .select("*, category:categories(id, name, slug, description, order_number, is_active, created_at, updated_at)")
      .eq("is_available", true)
      .or("is_best_seller.eq.true,is_chef_choice.eq.true")
      .order("order_number", { ascending: true }),
  ]);

  const settings = settingsRes.data;
  const promos = promosRes.data ?? [];
  const featuredItems = menuRes.data ?? [];

  return (
    <div className="pb-4">
      <HeroSection settings={settings} />
      <PromoSection promos={promos} />
      <BestSellerSection items={featuredItems} />
      <InfoSection settings={settings} />
    </div>
  );
}
