import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Syalala — Mie Sosis Bakar Extra Pedas",
    template: "%s | Syalala",
  },
  description: "Menu digital restoran Syalala. Mie sosis bakar extra pedas, sosis bakar, minuman boba dan cemilan.",
  keywords: ["syalala", "mie sosis", "sosis bakar", "menu digital", "extra pedas"],
  authors: [{ name: "Syalala" }],
  openGraph: {
    type: "website",
    siteName: "Syalala",
    title: "Syalala — Mie Sosis Bakar Extra Pedas",
    description: "Menu digital restoran Syalala.",
  },
};

export const viewport = {
  themeColor: "#e6203b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
