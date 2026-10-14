import { UtensilsCrossed } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada item yang ditampilkan.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-5">
        {icon ?? <UtensilsCrossed className="h-10 w-10 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
    </div>
  );
}
