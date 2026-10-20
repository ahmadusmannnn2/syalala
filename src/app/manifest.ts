import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let name = "Syalala";
  let tagline = "Mie Sosis Bakar Extra Pedas";
  let logoUrl = "/apple-touch-icon.png";

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("restaurant_settings")
      .select("logo_url, name, tagline")
      .single();

    if (data?.name) name = data.name;
    if (data?.tagline) tagline = data.tagline;
    if (data?.logo_url) logoUrl = data.logo_url;
  } catch {
    // Gunakan fallback lokal jika database tidak terjangkau
  }

  return {
    name: `${name} — ${tagline}`,
    short_name: name,
    description: `Menu digital restoran ${name}. ${tagline}`,
    start_url: "/",
    display: "standalone",
    background_color: "#e6203b",
    theme_color: "#e6203b",
    icons: [
      {
        src: logoUrl,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: logoUrl,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
