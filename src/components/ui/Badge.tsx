import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "best-seller" | "chef-choice" | "habis" | "promo" | "default";
}

const variantStyles = {
  "best-seller": "bg-[#e6203b] text-white",
  "chef-choice": "bg-[#8b0f22] text-white",
  habis: "bg-gray-400 text-white",
  promo: "bg-green-600 text-white",
  default: "bg-gray-100 text-gray-700",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
