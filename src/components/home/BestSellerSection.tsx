import Link from "next/link";
import { ArrowRight, Star, ChefHat } from "lucide-react";
import { MenuItem } from "@/types";
import { MenuCard } from "@/components/menu/MenuCard";

interface BestSellerSectionProps {
  items: MenuItem[];
}

export function BestSellerSection({ items }: BestSellerSectionProps) {
  const bestSellers = items.filter((i) => i.is_best_seller);
  const chefChoices = items.filter((i) => i.is_chef_choice);

  if (bestSellers.length === 0 && chefChoices.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 py-6">
      {/* Best Seller */}
      {bestSellers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 text-[#e6203b] flex items-center justify-center">
                <Star className="h-4 w-4 fill-[#e6203b]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Best Seller</h2>
            </div>
            <Link
              href="/menu"
              className="flex items-center gap-1 text-xs font-semibold text-[#e6203b] hover:underline"
            >
              Lihat Menu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bestSellers.slice(0, 4).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Chef Choice */}
      {chefChoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <ChefHat className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Chef&apos;s Choice</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {chefChoices.slice(0, 2).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
