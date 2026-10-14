export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className ?? ""}`}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-[#e6203b]/20 border-t-[#e6203b] animate-spin" />
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}
