import { UtensilsCrossed, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e6203b] flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Syalala</span>
          </div>
          <p className="text-gray-400 text-sm">Mie Sosis Bakar Extra Pedas</p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-[#e6203b] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-[#e6203b] transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Syalala. Harga belum termasuk PPN 10%.
          </p>
        </div>
      </div>
    </footer>
  );
}
