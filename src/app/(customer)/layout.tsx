import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("restaurant_settings")
    .select("logo_url, name, tagline, whatsapp_link, instagram_link, tiktok_link, google_maps_link")
    .single();

  return (
    <>
      <Navbar
        logoUrl={settings?.logo_url ?? null}
        restaurantName={settings?.name ?? "Syalala"}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        logoUrl={settings?.logo_url ?? null}
        restaurantName={settings?.name ?? "Syalala"}
        tagline={settings?.tagline ?? "Mie Sosis Bakar Extra Pedas"}
        waLink={settings?.whatsapp_link ?? null}
        igLink={settings?.instagram_link ?? null}
        tiktokLink={settings?.tiktok_link ?? null}
        mapsLink={settings?.google_maps_link ?? null}
      />
    </>
  );
}
