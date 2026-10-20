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
    .select("logo_url, name")
    .single();

  return (
    <>
      <Navbar
        logoUrl={settings?.logo_url ?? null}
        restaurantName={settings?.name ?? "Syalala"}
      />
      <main className="min-h-screen pb-32">{children}</main>
      <Footer />
    </>
  );
}
