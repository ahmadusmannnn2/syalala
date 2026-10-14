import Image from "next/image";
import Link from "next/link";
import { Star, ChefHat, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <Link
      href={`/menu/${item.slug}`}
      className="group block rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#e6203b]/10 to-orange-50 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-[#e6203b]/15 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-[#e6203b]/70" />
            </div>
            <p className="text-[11px] text-[#e6203b]/60 font-medium">Syalala Menu</p>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_best_seller && (
            <Badge variant="best-seller">
              <Star className="h-2.5 w-2.5 fill-white" /> Best Seller
            </Badge>
          )}
          {item.is_chef_choice && (
            <Badge variant="chef-choice">
              <ChefHat className="h-2.5 w-2.5" /> Chef Choice
            </Badge>
          )}
        </div>

        {/* Status habis overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="habis" className="text-sm px-3 py-1">Habis</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-[#e6203b] text-base">{formatRupiah(item.price)}</span>
          {item.supports_jumbo && (
            <span className="flex items-center gap-1 text-[10px] text-orange-500 font-medium bg-orange-50 px-1.5 py-0.5 rounded-full">
              <ShoppingBag className="h-2.5 w-2.5" /> Jumbo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
