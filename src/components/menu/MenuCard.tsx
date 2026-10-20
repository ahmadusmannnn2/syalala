import Image from "next/image";
import Link from "next/link";
import { Star, ChefHat, ShoppingBag, UtensilsCrossed, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const isMie =
    item.name.toLowerCase().includes("mie") ||
    item.slug.toLowerCase().includes("mie") ||
    (item.category as { name?: string } | null)?.name?.toLowerCase().includes("mie");

  return (
    <Link
      href={`/menu/${item.slug}`}
      prefetch={true}
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-red-200/50 transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white"
    >
      {/* Gambar Menu */}
      <div className="relative h-36 sm:h-44 bg-white/10 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#e6203b]/20 to-[#8b0f22]/40 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <p className="text-[11px] text-white/80 font-medium">Syalala Menu</p>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {item.is_best_seller && (
            <Badge variant="best-seller" className="shadow-sm">
              <Star className="h-2.5 w-2.5 fill-white" /> Best Seller
            </Badge>
          )}
          {item.is_chef_choice && (
            <Badge variant="chef-choice" className="shadow-sm">
              <ChefHat className="h-2.5 w-2.5" /> Chef Choice
            </Badge>
          )}
        </div>

        {/* Status Habis Overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-20">
            <Badge variant="habis" className="text-sm px-3 py-1 font-bold shadow-md">
              Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Bagian Bawah Gambar: Background Merah Senada dengan Card Promo */}
      <div className="p-3 bg-gradient-to-br from-[#e6203b] via-[#c41833] to-[#8b0f22] text-white relative">
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 drop-shadow-sm group-hover:underline">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-0.5 text-xs text-white/80 line-clamp-1">{item.description}</p>
        )}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-black text-white text-base tracking-tight drop-shadow-sm">
            {formatRupiah(item.price)}
          </span>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {isMie && (
              <span className="flex items-center gap-0.5 text-[10px] text-white font-semibold bg-white/20 border border-white/25 px-1.5 py-0.5 rounded-full shadow-inner">
                <Flame className="h-2.5 w-2.5 fill-white text-white" /> Lvl
              </span>
            )}
            {item.supports_jumbo && (
              <span className="flex items-center gap-1 text-[10px] text-white font-medium bg-white/20 border border-white/25 px-1.5 py-0.5 rounded-full shadow-inner">
                <ShoppingBag className="h-2.5 w-2.5" /> Jumbo
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
