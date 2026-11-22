"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface FooterConfig {
  tagline: string;
  copyright: string;
  address: string;
  show_wa: boolean;
  show_ig: boolean;
  show_tiktok: boolean;
  show_maps: boolean;
  custom_wa_link?: string;
  custom_ig_link?: string;
  custom_tiktok_link?: string;
  custom_maps_link?: string;
}

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  tagline: "Mie Sosis Bakar Extra Pedas",
  copyright: `© ${new Date().getFullYear()} Syalala. Harga belum termasuk PPN 10%.`,
  address: "Syalala Mie Sosis",
  show_wa: true,
  show_ig: true,
  show_tiktok: true,
  show_maps: true,
  custom_wa_link: "",
  custom_ig_link: "",
  custom_tiktok_link: "",
  custom_maps_link: "",
};

export async function getFooterConfig(): Promise<FooterConfig> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("home_buttons")
      .select("url")
      .eq("label", "footer_config")
      .maybeSingle();

    if (!error && data?.url) {
      try {
        const parsed = JSON.parse(data.url);
        return {
          ...DEFAULT_FOOTER_CONFIG,
          ...parsed,
        };
      } catch {
        // Fallback jika json rusak
      }
    }
  } catch (err) {
    console.error("Gagal memuat footer config:", err);
  }

  return DEFAULT_FOOTER_CONFIG;
}

export async function updateFooterConfig(config: FooterConfig): Promise<void> {
  const supabase = await createAdminClient();

  const payload = {
    label: "footer_config",
    variant: "footer_config",
    url: JSON.stringify(config),
    is_active: true,
    order_number: 999,
  };

  const { data: existing } = await supabase
    .from("home_buttons")
    .select("id")
    .eq("label", "footer_config")
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("home_buttons")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("home_buttons").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  revalidatePath("/admin/home");
}
