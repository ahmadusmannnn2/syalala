import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-red-50 p-5">
        <AlertCircle className="h-10 w-10 text-[#e6203b]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
