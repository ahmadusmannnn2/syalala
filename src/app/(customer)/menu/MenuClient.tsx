"use client";

import { useState, useMemo, useEffect } from "react";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { MenuItem, Category } from "@/types";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuClientProps {
  items: MenuItem[];
  categories: Category[];
}

export default function MenuClient({ items, categories }: MenuClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory ? item.category_id === selectedCategory : true;
      const matchSearch = search.trim()
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
        : true;
      return matchCat && matchSearch;
    });
  }, [items, search, selectedCategory]);

  return (
    <>
      {/* Sticky Category Tabs */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div
          className="flex gap-2 px-4 py-3 overflow-x-auto max-w-2xl mx-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 active:scale-95",
              selectedCategory === null
                ? "bg-[#e6203b] text-white border-[#e6203b] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#e6203b]/50"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 whitespace-nowrap active:scale-95",
                selectedCategory === cat.id
                  ? "bg-[#e6203b] text-white border-[#e6203b] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#e6203b]/50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Search */}
        <MenuSearch value={search} onChange={setSearch} />

        {/* Count info */}
        <p className="text-xs text-gray-400 mt-2 mb-3">
          Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> menu
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 text-[#e6203b] font-semibold underline"
            >
              Hapus filter
            </button>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Menu tidak ditemukan"
              description={
                search
                  ? `Tidak ada menu dengan kata kunci "${search}"`
                  : "Belum ada menu di kategori ini"
              }
              icon={<Search className="h-10 w-10 text-gray-300" />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
