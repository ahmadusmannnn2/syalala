import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { SplashScreen } from "@/components/layout/SplashScreen";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#e6203b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
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
    // Fallback jika database belum ready
  }

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://syalala.vercel.app"
    ),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`,
    },
    description: `Menu digital restoran ${name}. ${tagline}`,
    keywords: [name.toLowerCase(), "mie sosis", "sosis bakar", "menu digital", "kuliner", "extra pedas"],
    authors: [{ name }],
    icons: {
      icon: [
        { url: logoUrl, sizes: "any" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: logoUrl, sizes: "180x180", type: "image/png" },
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: [logoUrl],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: name,
    },
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} — ${tagline}`,
      description: `Menu digital restoran ${name}. ${tagline}`,
      images: [
        {
          url: logoUrl,
          alt: `${name} Logo`,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let logoUrl = "/apple-touch-icon.png";
  let restaurantName = "Syalala";

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("restaurant_settings")
      .select("logo_url, name")
      .single();

    if (data?.logo_url) logoUrl = data.logo_url;
    if (data?.name) restaurantName = data.name;
  } catch {
    // Fallback
  }

  return (
    <html lang="id" className={poppins.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={restaurantName} />
        <link rel="apple-touch-icon" href={logoUrl} />
        <link rel="apple-touch-startup-image" href={logoUrl} />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <SplashScreen logoUrl={logoUrl} restaurantName={restaurantName} />
        {children}
      </body>
    </html>
  );
}
