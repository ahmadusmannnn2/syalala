import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UtensilsCrossed, Tag, Megaphone, AlertCircle, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [menuRes, catRes, promoRes, outOfStockRes] = await Promise.all([
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("promotions").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("is_available", false),
  ]);

  const stats = [
    {
      label: "Total Menu",
      value: menuRes.count ?? 0,
      icon: UtensilsCrossed,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/menu",
    },
    {
      label: "Kategori Aktif",
      value: catRes.count ?? 0,
      icon: Tag,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/categories",
    },
    {
      label: "Promo Aktif",
      value: promoRes.count ?? 0,
      icon: Megaphone,
      color: "bg-green-50 text-green-600",
      href: "/admin/promos",
    },
    {
      label: "Menu Habis",
      value: outOfStockRes.count ?? 0,
      icon: AlertCircle,
      color: "bg-red-50 text-[#e6203b]",
      href: "/admin/menu",
    },
  ];

  const shortcuts = [
    { href: "/admin/menu", label: "Tambah Menu Baru", icon: UtensilsCrossed, desc: "Kelola daftar menu" },
    { href: "/admin/categories", label: "Kelola Kategori", icon: Tag, desc: "Atur kategori menu" },
    { href: "/admin/promos", label: "Buat Promo", icon: Megaphone, desc: "Atur promo aktif" },
    { href: "/admin/home", label: "Edit Halaman Home", icon: ArrowRight, desc: "Perbarui konten home" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          Ringkasan
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className={`inline-flex p-2 rounded-xl mb-3 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#e6203b]/30 group flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e6203b]/10 flex items-center justify-center group-hover:bg-[#e6203b] transition-colors">
                <s.icon className="h-5 w-5 text-[#e6203b] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#e6203b] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div className="bg-gradient-to-r from-[#e6203b] via-[#c41833] to-[#8b0f22] rounded-2xl p-5 text-white shadow-sm">
        <h3 className="font-bold text-sm mb-1">💡 Tips Admin</h3>
        <p className="text-xs text-white/80 leading-relaxed">
          Update status menu (tersedia/habis) secara rutin agar customer selalu mendapat info akurat.
          Gunakan fitur Best Seller dan Chef Choice untuk menonjolkan menu unggulan di halaman Home.
        </p>
      </div>
    </div>
  );
}
