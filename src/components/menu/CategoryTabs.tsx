"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { useRef } from "react";

interface CategoryTabsProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide max-w-2xl mx-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* All tab */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200",
            selectedId === null
              ? "bg-[#e6203b] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          Semua
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              selectedId === cat.id
                ? "bg-[#e6203b] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
