import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ChefHat,
  ShoppingBag,
  MessageCircle,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { ImageZoom } from "@/components/menu/ImageZoom";
import { SpicinessLevelSelector } from "@/components/menu/SpicinessLevelSelector";
import { formatRupiah } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_items")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Menu tidak ditemukan" };

  return {
    title: data.name,
    description: data.description ?? `Detail menu ${data.name} di Syalala`,
  };
}

export const revalidate = 60;

export default async function MenuDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [itemRes, settingsRes] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*, category:categories(id, name, slug, description, order_number, is_active, created_at, updated_at)")
      .eq("slug", slug)
      .single(),
    supabase
      .from("restaurant_settings")
      .select("whatsapp_link, jumbo_size_upgrade_fee, tax_status")
      .single(),
  ]);

  if (!itemRes.data) notFound();

  const item = itemRes.data;
  const settings = settingsRes.data;
  const waLink = settings?.whatsapp_link ?? "https://wa.me/";
  const jumboFee = settings?.jumbo_size_upgrade_fee ?? 4000;
  const taxStatus = settings?.tax_status ?? "Belum termasuk PPN 10%";

  const categoryName = (item.category as { name: string } | null)?.name?.toLowerCase() ?? "";
  const isMieCategory =
    categoryName.includes("mie") ||
    item.slug.toLowerCase().includes("mie") ||
    item.name.toLowerCase().includes("mie");

  const waMessage = encodeURIComponent(
    `Halo Syalala! Saya tertarik dengan menu *${item.name}* (${formatRupiah(item.price)}). Apakah masih tersedia?`
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Image / Lightbox */}
        <div className="relative w-full">
          {item.image_url ? (
            <ImageZoom src={item.image_url} alt={item.name} />
          ) : (
            <div className="relative w-full h-72 bg-gradient-to-br from-[#e6203b]/10 to-red-50/40 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#e6203b]/15 flex items-center justify-center">
                <UtensilsCrossed className="h-7 w-7 text-[#e6203b]/60" />
              </div>
              <p className="text-xs text-[#e6203b]/70 font-medium">Foto menu belum tersedia</p>
            </div>
          )}

          {/* Status habis overlay */}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-red-600 text-white font-bold text-base px-6 py-2 rounded-full shadow-lg">
                Sedang Habis
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-5">
          {/* Category & Name */}
          <div>
            {item.category && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                <Tag className="h-3.5 w-3.5" />
                <span>{(item.category as { name: string }).name}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {item.name}
            </h1>

            <div className="flex flex-wrap gap-2 mt-2.5">
              {item.is_best_seller && (
                <Badge variant="best-seller">
                  <Star className="h-3 w-3 fill-white" /> Best Seller
                </Badge>
              )}
              {item.is_chef_choice && (
                <Badge variant="chef-choice">
                  <ChefHat className="h-3 w-3" /> Chef&apos;s Choice
                </Badge>
              )}
              {!item.is_available && <Badge variant="habis">Habis</Badge>}
            </div>
          </div>

          {/* Spiciness Level Selector (Khusus Kategori Mie) */}
          {isMieCategory ? (
            <SpicinessLevelSelector
              basePrice={item.price}
              supportsJumbo={item.supports_jumbo}
              jumboFee={jumboFee}
              taxStatus={taxStatus}
            />
          ) : (
            <>
              {/* Price Box */}
              <div className="bg-gradient-to-br from-red-50/60 to-orange-50/40 border border-red-100 rounded-2xl p-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Harga</span>
                <p className="text-3xl font-black text-[#e6203b] tracking-tight mt-0.5">
                  {formatRupiah(item.price)}
                </p>
                <p className="text-xs text-gray-400 mt-1">*{taxStatus}</p>
              </div>

              {/* Jumbo info */}
              {item.supports_jumbo && (
                <div className="flex items-start gap-3 bg-orange-50 border border-orange-200/80 rounded-2xl p-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-900">Tersedia Ukuran Jumbo</p>
                    <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                      Bisa upgrade porsi jumbo ekstra kenyang hanya +{formatRupiah(jumboFee)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Fitur Order Online (Disembunyikan sementara untuk pengembangan berikutnya) */}
          {/*
          <div className="pt-2">
            <a
              href={`${waLink}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 shadow-md ${
                item.is_available
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {item.is_available ? "Order via WhatsApp" : "Sedang Tidak Tersedia"}
            </a>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
